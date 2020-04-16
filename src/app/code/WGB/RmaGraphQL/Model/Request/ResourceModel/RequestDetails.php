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
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Sales\Api\Data\OrderItemInterface;
use Magento\Sales\Api\OrderRepositoryInterface;
use Magento\Sales\Api\Data\OrderInterface;
use Amasty\Rma\Model\Reason;
use Amasty\Rma\Model\Condition;
use Amasty\Rma\Model\Request;
use Amasty\Rma\Model\Resolution;
use Magento\Sales\Model\Order\Item;

/**
 * Class RequestDetails
 *
 * @package Wgb\RmaGraphQL\Model\Resolver
 */
class RequestDetails
{
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

    public function __construct(
        Request\Repository $requestRepository,
        Reason\Repository $reasonRepository,
        Condition\Repository $conditionRepository,
        Resolution\Repository $resolutionRepository,
        OrderRepositoryInterface $orderRepository
    )
    {
        $this->requestRepository = $requestRepository;
        $this->orderRepository = $orderRepository;
        $this->reasonRepository = $reasonRepository;
        $this->conditionRepository = $conditionRepository;
        $this->resolutionRepository = $resolutionRepository;
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

        $requestItems = array_map(function ($requestItem) use ($orderItems) {
            $orderItem = $this->getItemFromOrder($orderItems, $requestItem);
            $reason = $this->reasonRepository->getById($requestItem->getReasonId());
            $condition = $this->conditionRepository->getById($requestItem->getConditionId());
            $resolution = $this->resolutionRepository->getById($requestItem->getResolutionId());
            return [
                'discount_amount' => $orderItem->getDiscountAmount(),
                'discount_percent' => $orderItem->getDiscountPercent(),
                'item_id' => $orderItem->getItemId(),
                'price' => $orderItem->getPrice(),
                'product' => $orderItem->getProductId(),
                'qty' => $orderItem->getQtyOrdered(),
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
            'items' => $requestItems
        ];
    }
}
