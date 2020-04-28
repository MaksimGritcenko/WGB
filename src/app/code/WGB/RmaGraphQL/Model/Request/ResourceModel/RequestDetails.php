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

use GraphQL\Language\AST\FieldNode;
use Magento\Framework\Api\SearchCriteriaBuilder;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Framework\GraphQl\Schema\Type\ResolveInfo;
use Magento\Sales\Api\Data\OrderItemInterface;
use Magento\Sales\Api\OrderRepositoryInterface;
use Magento\Sales\Api\Data\OrderInterface;
use Magento\Sales\Model\Order\Item;

use Amasty\Rma\Api\Data\RequestInterface;
use Amasty\Rma\Api\Data\RequestItemInterface;
use Amasty\Rma\Api\Data\TrackingInterface;
use Amasty\Rma\Api\Data\TrackingInterfaceFactory;
use Amasty\Rma\Model\OptionSource\State;
use Amasty\Rma\Model\Reason;
use Amasty\Rma\Model\Condition;
use Amasty\Rma\Model\Request;
use Amasty\Rma\Model\Resolution;
use Amasty\Rma\Observer\Rma;
use Amasty\Rma\Model\OptionSource\ItemStatus;
use Amasty\Rma\Api\StatusRepositoryInterface;
use Magento\Store\Model\StoreManagerInterface;
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
    /**
     * @var Rma\History
     */
    protected $rmaHistory;
    /**
     * @var DataPostProcessor
     */
    protected $postProcessor;
    /**
     * @var StatusRepositoryInterface
     */
    protected $statusRepository;
    /**
     * @var State
     */
    protected $stateOptionSource;
    /**
     * @var array
     */
    protected $states;
    /**
     * @var ItemStatus
     */
    protected $itemStatuses;
    /**
     * @var StoreManagerInterface
     */
    protected $storeManager;
    /**
     * @var \WGB\RmaGraphQL\Model\Resolver\Product
     */
    protected $productResolver;

    public function __construct(
        Product $productDataProvider,
        Request\Repository $requestRepository,
        Reason\Repository $reasonRepository,
        Condition\Repository $conditionRepository,
        Resolution\Repository $resolutionRepository,
        Rma\History $rmaHistory,
        OrderRepositoryInterface $orderRepository,
        SearchCriteriaBuilder $searchCriteriaBuilder,
        DataPostProcessor $postProcessor,
        StatusRepositoryInterface $statusRepository,
        State $stateOptionSource,
        ItemStatus $itemStatuses,
        StoreManagerInterface $storeManager,
        \WGB\RmaGraphQL\Model\Resolver\Product $productResolver
    )
    {
        $this->productDataProvider = $productDataProvider;
        $this->requestRepository = $requestRepository;
        $this->orderRepository = $orderRepository;
        $this->reasonRepository = $reasonRepository;
        $this->conditionRepository = $conditionRepository;
        $this->resolutionRepository = $resolutionRepository;
        $this->searchCriteriaBuilder = $searchCriteriaBuilder;
        $this->rmaHistory = $rmaHistory;
        $this->postProcessor = $postProcessor;
        $this->statusRepository = $statusRepository;
        $this->stateOptionSource = $stateOptionSource;
        $this->itemStatuses = $itemStatuses;
        $this->storeManager = $storeManager;

        $this->productResolver = $productResolver;
        $this->states = $this->stateOptionSource->toArray();
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
            if ($orderItem->getItemId() == $requestItem->getOrderItemId()) {
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
        $request = $this->requestRepository->getById($id);
        $order = $this->orderRepository->get($request->getOrderId());
        /** @var OrderItemInterface $orderItems */
        $orderItems = $order->getItems();
        $productIds = array_map(
            function($item) {
                return $item->getProductId();
            },
            $orderItems
        );
        $itemStatuses = $this->itemStatuses->toArray();

        $requestItems = array_map(function ($requestItem) use ($orderItems, $itemStatuses) {
            $orderItem = $this->getItemFromOrder($orderItems, $requestItem);

            $reason = $this->reasonRepository->getById($requestItem->getReasonId());
            $condition = $this->conditionRepository->getById($requestItem->getConditionId());
            $resolution = $this->resolutionRepository->getById($requestItem->getResolutionId());

            $status_id = $requestItem->getItemStatus();
            $status_description = $itemStatuses[$status_id];

            return [
                'name' => $orderItem->getParentItem()->getName(),
                'discount_amount' => $orderItem->getDiscountAmount(),
                'discount_percent' => $orderItem->getDiscountPercent(),
                'chosen_attributes' => $this->productResolver->getChosenAttributes($orderItem),
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
                'status' => [
                    'state' => $status_id,
                    'state_label' => $status_description
                ]
            ];

        }, $request->getRequestItems());

        $trackings = array_map(
            function ($tracking) {
                /** @var TrackingInterface $tracking */
                $tracking['carrier'] = $this->rmaHistory->getCarrier($tracking->getTrackingCode());
                return $tracking;
            }, $request->getTrackingNumbers()
        );

        $status = $this->statusRepository->getById(
            $request->getStatus(),
            $this->storeManager->getStore()->getId()
        );
        $statusDescription = $status->getStoreData()->getDescription();

        $issetfile = $request->getShippingLabel();
        if(isset($issetfile)){
            $file = $request->getShippingLabel();
        }else{
            $file= " ";
        }

        return [
            'id' => $request->getRequestId(),
            'file' => $file,
            'order_id' => $request->getOrderId(),
            'created_at' => $request->getCreatedAt(),
            'status' => $request->getStatus(),
            'status_description' => $statusDescription,
            'state' => $this->states[$status->getState()],
            'items' => $requestItems,
            'productIds' => $productIds,
            'tracking' => $trackings
        ];
    }
}
