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

use Amasty\Rma\Api\Data\ReturnOrderItemInterface;
use Amasty\Rma\Model\OptionSource\NoReturnableReasons;
use Amasty\Rma\Model\Resolution\Repository;
use Magento\Framework\Api\SearchCriteriaBuilder;
use Magento\Framework\GraphQl\Schema\Type\ResolveInfo;
use Magento\Framework\GraphQl\Config\Element\Field;
use Magento\Framework\GraphQl\Query\ResolverInterface;
use Magento\Catalog\Model\ProductRepository;
use Magento\Sales\Api\Data\OrderInterface;
use Magento\Sales\Model\Order\Item;

use ScandiPWA\Performance\Model\Resolver\Products\DataPostProcessor;
use ScandiPWA\Performance\Model\Resolver\ResolveInfoFieldsTrait;
use ScandiPWA\CatalogGraphQl\Model\Resolver\Products\DataProvider;

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
     * @var Repository
     */
    protected $resolutionRepository;

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
     * @param Repository $resolutionRepository
     */
    public function __construct(
        ProductRepository $productRepository,
        DataProvider\Product $productDataProvider,
        SearchCriteriaBuilder $searchCriteriaBuilder,
        ResourceModel\Request $requestResourceModel,
        Model\Request\Repository $requestRepository,
        Model\Order\CreateReturnProcessor $createReturnProcessor,
        DataPostProcessor $postProcessor,
        ReturnRulesProcessor $returnRulesProcessor,
        Repository $resolutionRepository
    ) {
        $this->productRepository = $productRepository;
        $this->productDataProvider = $productDataProvider;
        $this->searchCriteriaBuilder = $searchCriteriaBuilder;
        $this->postProcessor = $postProcessor;
        $this->requestResourceModel = $requestResourceModel;
        $this->requestRepository = $requestRepository;
        $this->returnRulesProcessor = $returnRulesProcessor;
        $this->createReturnProcessor = $createReturnProcessor;
        $this->resolutionRepository = $resolutionRepository;
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

        $productSKUs = array_map(function ($returnItem) {
            /** @var ReturnOrderItemInterface $returnItem */
            return $returnItem->getItem()->getSku();
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

        /** @var ReturnOrderItemInterface $returnItem */
        foreach ($value['products'] as $key => $returnItem) {
            /** @var $item Item */
            if ($returnItem instanceof ReturnOrderItemInterface) {
                $item = $returnItem->getItem();
            } else {
                $item = $returnItem;
            }


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
            $data[$key]['returnability'] = [
                'is_returnable' => $returnItem->isReturnable(),
                'no_returnable_reason_id' => $returnItem->getNoReturnableReason(),
                'no_returnable_reason_label' => $this->getNoReturnReasonDescriptionById(
                    $returnItem->getNoReturnableReason()
                ),
                'resolutions' => $returnItem->getResolutions(),
            ];
        }

        return $data;
    }

    /**
     * @param int $id
     * @return \Magento\Framework\Phrase
     * @throws \Exception
     */
    protected function getNoReturnReasonDescriptionById($id) {
        switch ($id) {
            case NoReturnableReasons::ALREADY_RETURNED:
                return __('Rma request for this product is already created.');
            case NoReturnableReasons::EXPIRED_PERIOD:
                return __('The return period expired.');
            case NoReturnableReasons::REFUNDED:
                return __('This product is already refunded.');
            case NoReturnableReasons::ITEM_WASNT_SHIPPED:
                return __('This product wasn\'t shipped.');
            case NoReturnableReasons::ITEM_WAS_ON_SALE:
                return __('This product was on sale.');
            default:
                throw new \Exception('Unexpected return denial reason id: '.$id);
        }
    }
}
