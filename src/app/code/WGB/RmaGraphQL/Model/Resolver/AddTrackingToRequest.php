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

/**
 * Class AddTrackingToRequest
 *
 * @package Wgb\RmaGraphQL\Model\Resolver
 */
class AddTrackingToRequest implements ResolverInterface
{
    /**
     * @var CustomerRequestRepositoryInterface
     */
    protected $requestRepository;
    /**
     * @var Session
     */
    protected $customerSession;

    public function __construct(
        Session $customerSession,
        CustomerRequestRepositoryInterface $requestRepository
    )
    {
        $this->requestRepository = $requestRepository;
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

        // Throws on wrong user
        $request = $this->requestRepository->getById($input['request_id'], $context->getUserId());

        $tracking = $this->requestRepository->getEmptyTrackingModel()
            ->setTrackingCode($input['tracking_code'])
            ->setTrackingNumber($input['tracking_number'])
            ->setRequestId($input['request_id'])
            ->setIsCustomer(true);

        // TODO try / catch
        $this->requestRepository->saveTracking($request->getUrlHash(), $tracking);

        return [
            'success' => true
        ];
    }
}
