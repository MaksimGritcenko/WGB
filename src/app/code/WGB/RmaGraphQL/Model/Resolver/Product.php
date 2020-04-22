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

use Amasty\Rma\Api\Data\RequestItemInterface;
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
use WGB\RmaGraphQL\Model\Request\ResourceModel;
use \Amasty\Rma\Model;

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
     * ProductResolver constructor.
     * @param ProductRepository $productRepository
     * @param DataProvider\Product $productDataProvider
     * @param SearchCriteriaBuilder $searchCriteriaBuilder
     * @param ResourceModel\Request $requestResourceModel
     * @param Model\Request\Repository $requestRepository
     * @param DataPostProcessor $postProcessor
     */
    public function __construct(
        ProductRepository $productRepository,
        DataProvider\Product $productDataProvider,
        SearchCriteriaBuilder $searchCriteriaBuilder,
        ResourceModel\Request $requestResourceModel,
        Model\Request\Repository $requestRepository,
        DataPostProcessor $postProcessor
    ) {
        $this->productRepository = $productRepository;
        $this->productDataProvider = $productDataProvider;
        $this->searchCriteriaBuilder = $searchCriteriaBuilder;
        $this->postProcessor = $postProcessor;
        $this->requestResourceModel = $requestResourceModel;
        $this->requestRepository = $requestRepository;
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
        }

        return $data;
    }
}
