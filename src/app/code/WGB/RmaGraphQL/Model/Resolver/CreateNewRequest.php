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

namespace WGB\RmaGraphQL\Model\Resolver;

use Amasty\Rma\Api\CustomerRequestRepositoryInterface;
use Amasty\Rma\Api\Data\RequestInterface;
use Magento\Customer\Model\Session;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Framework\GraphQl\Config\Element\Field;
use Magento\Framework\GraphQl\Exception\GraphQlInputException;
use Magento\Framework\GraphQl\Exception\GraphQlNoSuchEntityException;
use Magento\Framework\GraphQl\Query\ResolverInterface;
use Magento\Framework\GraphQl\Schema\Type\ResolveInfo;
use Magento\Sales\Api\Data\OrderInterface;
use Magento\Sales\Api\OrderRepositoryInterface;
use Magento\Store\Model\StoreManagerInterface;

/**
 * Class CreateNewRequest
 *
 * @package Wgb\RmaGraphQL\Model\Resolver
 */
class CreateNewRequest implements ResolverInterface
{
    /**
     * @var StoreManagerInterface
     */
    protected $storeManager;
    /**
     * @var CustomerRequestRepositoryInterface
     */
    protected $requestRepository;
    /**
     * @var OrderRepositoryInterface
     */
    protected $orderRepository;
    /**
     * @var Session
     */
    protected $customerSession;

    public function __construct(
        StoreManagerInterface $storeManager,
        Session $customerSession,
        CustomerRequestRepositoryInterface $requestRepository,
        OrderRepositoryInterface $orderRepository
    )
    {
        $this->storeManager = $storeManager;
        $this->requestRepository = $requestRepository;
        $this->orderRepository = $orderRepository;
        $this->customerSession = $customerSession;
    }

    /**
     * @param $input
     * @return array
     */
    protected function getRequestItems($input) {
        $returnItems = [];

        foreach ($input['items'] as $item) {
            $returnItems[] = $this->requestRepository->getEmptyRequestItemModel()
                ->setQty((float)$item['qty'])
                ->setResolutionId((int)$item['resolution'])
                ->setReasonId((int)$item['reason'])
                ->setConditionId((int)$item['condition'])
                ->setOrderItemId((int)$item['quote_item_id'] + 1);
        }

        return $returnItems;
    }

    /**
     * @param array $input
     * @return array
     */
    private function getCustomFields($input) {
        if (!isset($input['custom_fields'])) {
            return [];
        }

        $customFieldsData = [];
        foreach ($input['custom_fields'] as $field) {
            $customFieldsData[$field['code']] = $field['value'];
        }

        return $customFieldsData;
    }

    /**
     * @param $input
     * @param OrderInterface $order
     * @param $customerId
     * @return RequestInterface
     * @throws NoSuchEntityException
     */
    protected function createRequest($input, $order, $customerId) {
        $request = $this->requestRepository->getEmptyRequestModel();
        $request
            ->setStoreId($this->storeManager->getStore()->getId())
            ->setOrderId($order->getEntityId())
            ->setCustomerName(
                $order->getBillingAddress()->getFirstname() . ' '
                . $order->getBillingAddress()->getLastname()
            )->setCustomFields($this->getCustomFields($input))
            ->setCustomerId($customerId)
            ->setRequestItems($this->getRequestItems($input));
        return $request;
    }

    /**
     * @inheritdoc
     */
    public function resolve(
        Field $field,
        $context,
        ResolveInfo $info,
        array $value = null,
        array $args = null
    )
    {
        $input = $args['input'];

        /** @var OrderInterface $order */
        $order = $this->orderRepository->get($input['order_id']);

        /** @var RequestInterface $request */
        $request = $this->requestRepository->create(
            $this->createRequest($input, $order, $context->getUserId())
        );

        return [
            'return_id' => $request->getRequestId()
        ];
    }
}
