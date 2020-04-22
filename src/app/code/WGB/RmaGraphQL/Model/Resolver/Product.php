<?php
/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/quote-graphql
 * @link https://github.com/scandipwa/quote-graphql
 */

declare(strict_types=1);

namespace WGB\RmaGraphQL\Model\Resolver;

use Magento\Framework\Api\SearchCriteriaBuilder;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Framework\GraphQl\Schema\Type\ResolveInfo;
use Magento\Framework\GraphQl\Config\Element\Field;
use Magento\Framework\GraphQl\Query\ResolverInterface;
use Magento\Catalog\Model\ProductRepository;
use Magento\Sales\Api\Data\OrderInterface;
use Magento\Sales\Model\Order\Item;

use ScandiPWA\Performance\Model\Resolver\Products\DataPostProcessor;
use ScandiPWA\Performance\Model\Resolver\ResolveInfoFieldsTrait;
use ScandiPWA\CatalogGraphQl\Model\Resolver\Products\DataProvider;

use Amasty\Rma\Model\OptionSource\NoReturnableReasons;
use Amasty\Rma\Api\Data\RequestItemInterface;
use Amasty\Rma\Model;
use Amasty\Rma\Model\ReturnRules\ReturnRulesProcessor;

use WGB\RmaGraphQL\Model\Request\ResourceModel;

/**
 * Retrieves the Product list in orders
 */
class Product implements ResolverInterface
{
    use ResolveInfoFieldsTrait;

    /**
     * @var ProductRepository
     */
    protected $productRepository;

    /**
     * @var DataProvider\Product
     */
    protected $productDataProvider;

    /**
     * @var SearchCriteriaBuilder
     */
    protected $searchCriteriaBuilder;

    /**
     * @var DataPostProcessor
     */
    protected $postProcessor;
    /**
     * @var ResourceModel\Request
     */
    protected $requestResourceModel;
    /**
     * @var Model\Request\Repository
     */
    protected $requestRepository;
    /**
     * @var ReturnRulesProcessor
     */
    protected $returnRulesProcessor;
    /**
     * @var Model\Order\CreateReturnProcessor
     */
    protected $createReturnProcessor;

    /**
     * ProductResolver constructor.
     * @param ProductRepository $productRepository
     * @param DataProvider\Product $productDataProvider
     * @param SearchCriteriaBuilder $searchCriteriaBuilder
     * @param ResourceModel\Request $requestResourceModel
     * @param Model\Request\Repository $requestRepository
     * @param Model\Order\CreateReturnProcessor $createReturnProcessor
     * @param DataPostProcessor $postProcessor
     * @param ReturnRulesProcessor $returnRulesProcessor
     */
    public function __construct(
        ProductRepository $productRepository,
        DataProvider\Product $productDataProvider,
        SearchCriteriaBuilder $searchCriteriaBuilder,
        ResourceModel\Request $requestResourceModel,
        Model\Request\Repository $requestRepository,
        Model\Order\CreateReturnProcessor $createReturnProcessor,
        DataPostProcessor $postProcessor,
        ReturnRulesProcessor $returnRulesProcessor
    ) {
        $this->productRepository = $productRepository;
        $this->productDataProvider = $productDataProvider;
        $this->searchCriteriaBuilder = $searchCriteriaBuilder;
        $this->postProcessor = $postProcessor;
        $this->requestResourceModel = $requestResourceModel;
        $this->requestRepository = $requestRepository;
        $this->returnRulesProcessor = $returnRulesProcessor;
        $this->createReturnProcessor = $createReturnProcessor;
    }

    /**
     * Get All Product Items of Order.
     * @inheritdoc
     */
    public function resolve(
        Field $field,
        $context,
        ResolveInfo $info,
        array $value = null,
        array $args = null
    ) {

        if (!isset($value['products'])) {
            return [];
        }

        $orderId = $value['base_order_info']['id'];
        /** @var OrderInterface $order */
        $returnRequestIds = array_map(
            function ($entry) { return $entry['request_id']; },
            $this->requestResourceModel->getRequestIdsForOrder($orderId)
        );

        /** @var RequestItemInterface[][] $returnRequestsItems */
        $returnRequestsItems = array_reduce(
            $returnRequestIds,
            function ($carry, $reqId) {
                $req = $this->requestRepository->getById($reqId);
                $carry[] = $req->getRequestItems();
                return $carry;
            }, []
        );

        $productSKUs = array_map(function ($item) {
            return $item['sku'];
        }, $value['products']);

        $attributeCodes = $this->getFieldsFromProductInfo($info, 'order_products');

        $searchCriteria = $this->searchCriteriaBuilder
            ->addFilter('sku', $productSKUs, 'in')
            ->create();

        $products = $this->productDataProvider
            ->getList(
                $searchCriteria,
                $attributeCodes,
                false,
                true
            )
            ->getItems();

        $productsData = $this->postProcessor->process(
            $products,
            'order_products',
            $info
        );

        $data = [];

        foreach ($value['products'] as $key => $item) {
            /** @var $item Item */
            $data[$key] = $productsData[$item->getProductId()];
            $data[$key]['qty'] = $item->getQtyOrdered();
            $data[$key]['row_total'] = $item->getBaseRowTotalInclTax();
            $data[$key]['original_price'] = $item->getBaseOriginalPrice();
            $data[$key]['quote_item_id'] = $item->getItemId();
            $data[$key]['license_key'] = $item['license_key'];
            $data[$key]['qty_returning'] = array_reduce(
                $returnRequestsItems,
                function($carry, $reqItems) use ($item) {

                    /** @var RequestItemInterface $reqItem */
                    foreach ($reqItems as $reqItem) {
                        if ($reqItem->getOrderItemId() == $item->getItemId() + 1) {
                            $carry += $reqItem->getRequestQty();
                        }
                    }

                    return $carry;
                }, 0
            );
            $data[$key]['returnability'] = $this->process(
                $orderId, $item, $value['base_order_info']['created_at']
            );
        }

        return $data;
    }

    /**
     * @param int $orderId
     * @param Item $item
     * @param string $orderCreatedAt
     * @return array
     */
    protected function process($orderId, $item, $orderCreatedAt) {
        $alreadyRequestedItem = $this
            ->createReturnProcessor
            ->getAlreadyRequestedItems($orderId);

        $qtyShipped = $item->getQtyShipped();
        $qtyCanceled = $item->getQtyCanceled();
        $qtyRefunded = $item->getQtyRefunded();

        if ($qtyShipped < 0.0001) {
            return [
                'is_returnable' => false,
                'reason_id' => 3,
                'reason_text' => 'This product wasn\'t shipped.'
            ];
        }

        $rmaQty = $alreadyRequestedItem[$item->getItemId()]['qty'] ?? 0;
        $orderAvailableQty = $qtyShipped - $qtyCanceled - $qtyRefunded;

        if ($orderAvailableQty - $rmaQty <= 0.0001) {
            if ($rmaQty == 0) {
                return [
                    'is_returnable' => false,
                    'reason_id' => 2,
                    'reason_text' => 'This product is already refunded.'
                ];
            } else {
                return [
                    'is_returnable' => false,
                    'reason_id' => 0,
                    'reason_text' => 'Rma request for this product is already created.'
                ];
            }
        } else {
            if ($availableResolutions = $this->getReturnResolutionsForItem($item, $orderCreatedAt)) {
                return [
                    'is_returnable' => true,
                    'available_qty' => $orderAvailableQty - $rmaQty,
                    'available_resolutions' => $availableResolutions
                ];
            } elseif ($item->getPrice() !== $item->getOriginalPrice()) {
                return [
                    'is_returnable' => false,
                    'reason_id' => 4,
                    'reason_text' => 'This product was on sale.'
                ];
            } else {
                return [
                    'is_returnable' => false,
                    'reason_id' => 1,
                    'reason_text' => 'The return period expired.'
                ];
            }
        }

        return $returnOrder;
    }

    public function getReturnResolutionsForItem($item, $orderCreatedAt) {
//        try {
            $resolutions = $this->returnRulesProcessor->getResolutionsForProduct($item);
//        } catch (NoSuchEntityException $e) {
//            return false;
//        }
        foreach($resolutions as $resolution) {
            var_dump(123);
            var_dump($resolution->debug());
        }

        $currentTime = time();
        $orderCreationTime = strtotime($orderCreatedAt);
        $daysSinceOrder = floor(($currentTime - $orderCreationTime) / 86400);

        foreach ($resolutions as $resolution) {
            if ($resolution['value'] == "0") {
                continue;
            }

            var_dump([
                'ago' => $daysSinceOrder,
                'overall' => $resolution['value']
            ]);

            if ($daysSinceOrder < $resolution['value']) {
                $availableResolutions[] = [
                    'resolution' => $resolution['resolution'],
                    'value' => $resolution['value'] - $daysSinceOrder
                ];
            }
        }

        if (!empty($availableResolutions)) {
            return $availableResolutions;
        }

        return false;
    }
}
