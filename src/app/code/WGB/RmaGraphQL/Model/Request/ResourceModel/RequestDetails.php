<?php


/**
 * A Magento 2 module named Wgb/RmaGraphQL
 * Copyright (C) 2020
 *
 * This file included in Wgb/RmaGraphQL is licensed under OSL 3.0
 *
 * http://opensource.org/licenses/osl-3.0.php  Open Software License (OSL 3.0)
 * Please see LICENSE.txt for the full text of the OSL 3.0 license
 */

namespace WGB\RmaGraphQL\Model\Request\ResourceModel;

use Amasty\Rma\Api\Data\RequestInterface;
use Amasty\Rma\Api\Data\RequestItemInterface;
use GraphQL\Language\AST\FieldNode;
use Magento\Framework\Api\SearchCriteriaBuilder;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Framework\GraphQl\Schema\Type\ResolveInfo;
use Magento\Sales\Api\Data\OrderItemInterface;
use Magento\Sales\Api\OrderRepositoryInterface;
use Magento\Sales\Api\Data\OrderInterface;
use Amasty\Rma\Model\Reason;
use Amasty\Rma\Model\Condition;
use Amasty\Rma\Model\Request;
use Amasty\Rma\Model\Resolution;
use Magento\Sales\Model\Order\Item;
use ScandiPWA\CatalogGraphQl\Model\Resolver\Products\DataProvider\Product;
use ScandiPWA\Performance\Model\Resolver\ResolveInfoFieldsTrait;
use ScandiPWA\Performance\Model\Resolver\Products\DataPostProcessor;

/**
 * Class RequestDetails
 *
 * @package Wgb\RmaGraphQL\Model\Resolver
 */
class RequestDetails
{
    use ResolveInfoFieldsTrait;
    /**
     * @var Request\Repository
     */
    private $requestRepository;
    /**
     * @var OrderRepositoryInterface
     */
    private $orderRepository;
    /**
     * @var Reason\Repository
     */
    private $reasonRepository;
    /**
     * @var Resolution\Repository
     */
    private $resolutionRepository;
    /**
     * @var Condition\Repository
     */
    private $conditionRepository;
    /**
     * @var SearchCriteriaBuilder
     */
    private $searchCriteriaBuilder;
    /**
     * @var Product
     */
    private $productDataProvider;

    public function __construct(
        Product $productDataProvider,
        Request\Repository $requestRepository,
        Reason\Repository $reasonRepository,
        Condition\Repository $conditionRepository,
        Resolution\Repository $resolutionRepository,
        OrderRepositoryInterface $orderRepository,
        SearchCriteriaBuilder $searchCriteriaBuilder,
        DataPostProcessor $postProcessor
    )
    {
        $this->productDataProvider = $productDataProvider;
        $this->requestRepository = $requestRepository;
        $this->orderRepository = $orderRepository;
        $this->reasonRepository = $reasonRepository;
        $this->conditionRepository = $conditionRepository;
        $this->resolutionRepository = $resolutionRepository;
        $this->searchCriteriaBuilder = $searchCriteriaBuilder;
        $this->postProcessor = $postProcessor;
    }

    /**
     * @param OrderItemInterface[] $orderItems
     * @param RequestItemInterface $requestItem
     * @return OrderItemInterface
     */
    private function getItemFromOrder($orderItems, $requestItem)
    {
        /** @var OrderItemInterface $orderItem */
        foreach ($orderItems as $orderItem) {
            if ($orderItem->getItemId() + 1 == $requestItem->getOrderItemId()) {
                return $orderItem;
            }
        }

        // TODO throw
        return null;
    }

    public function getProductsData($productIds, $info)
    {
        $attributeCodes = $this->getFieldsFromProductInfo($info, 'items/product');

        $searchCriteria = $this->searchCriteriaBuilder
            ->addFilter('entity_id', $productIds, 'in')
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
            'items/product',
            $info
        );

        return $productsData;
    }

    /**
     * @param int $id
     * @return array
     * @throws NoSuchEntityException
     */
    public function getById($id)
    {
        /** @var RequestInterface $request */
        $request = $this->requestRepository->getById($id);

        /** @var OrderInterface $order */
        $order = $this->orderRepository->get($request->getOrderId());

        /** @var OrderItemInterface $orderItems */
        $orderItems = $order->getItems();

        $productIds = array_map(
            function($item) {
                return $item->getProductId();
            },
            $orderItems
        );

        $requestItems = array_map(function ($requestItem) use ($orderItems) {
            /** @var RequestItemInterface $requestItem */
            $orderItem = $this->getItemFromOrder($orderItems, $requestItem);
            $reason = $this->reasonRepository->getById($requestItem->getReasonId());
            $condition = $this->conditionRepository->getById($requestItem->getConditionId());
            $resolution = $this->resolutionRepository->getById($requestItem->getResolutionId());

            return [
                'discount_amount' => $orderItem->getDiscountAmount(),
                'discount_percent' => $orderItem->getDiscountPercent(),
                'item_id' => $orderItem->getItemId(),
                'price' => $orderItem->getPrice(),
                'product_id' => $orderItem->getProductId(),
                'qty' => $requestItem->getQty(),
                'row_total' => $orderItem->getRowTotal(),
                'sku' => $orderItem->getSku(),
                'tax_amount' => $orderItem->getTaxAmount(),
                'tax_percent' => $orderItem->getTaxPercent(),
                'reason' => $reason,
                'condition' => $condition,
                'resolution' => $resolution,
                'status' => $requestItem->getItemStatus()
            ];

        }, $request->getRequestItems());

        return [
            'id' => $request->getRequestId(),
            'order_id' => $request->getOrderId(),
            'created_at' => $request->getCreatedAt(),
            'status' => $request->getStatus(),
            'items' => $requestItems,
            'productIds' => $productIds
        ];
    }
}
