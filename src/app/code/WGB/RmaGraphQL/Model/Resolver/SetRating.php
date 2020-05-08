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
use Magento\Customer\Model\Session;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Framework\GraphQl\Config\Element\Field;
use Magento\Framework\GraphQl\Exception\GraphQlInputException;
use Magento\Framework\GraphQl\Exception\GraphQlNoSuchEntityException;
use Magento\Framework\GraphQl\Query\ResolverInterface;
use Magento\Framework\GraphQl\Schema\Type\ResolveInfo;
use Magento\Sales\Api\OrderRepositoryInterface;
use Magento\Store\Model\StoreManagerInterface;

/**
 * Class Rating
 *
 * @package Wgb\RmaGraphQL\Model\Resolver
 */
class SetRating implements ResolverInterface
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
    /**
     * @var \WGB\RmaGraphQL\Model\Resolver\SendMessage
     */
    protected $messageSender;

    public function __construct(
        CustomerRequestRepositoryInterface $requestRepository
    )
    {
        $this->requestRepository = $requestRepository;
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
        $rating = $input['rating'];

        $request = $this->requestRepository->getById(
            $input['request_id'],
            $context->getUserId()
        );

        return [
            'success' => $this->requestRepository->saveRating(
                $request->getUrlHash(),
                $rating['stars'],
                $rating['comment']
            )
        ];
    }
}
