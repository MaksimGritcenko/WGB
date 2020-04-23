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
 * Class CancelRequest
 *
 * @package Wgb\RmaGraphQL\Model\Resolver
 */
class CancelRequest implements ResolverInterface
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

        if ($request = $this->requestRepository->getById(
            $input['request_id'],
            $context->getUserId()
        )) {
            // id or id hash ?
            if ($this->requestRepository->closeRequest(
                $request->getUrlHash(),
                $context->getUserId()
            )) {
                return ['success' => true];
            }
        }

        return ['success' => false];
    }
}
