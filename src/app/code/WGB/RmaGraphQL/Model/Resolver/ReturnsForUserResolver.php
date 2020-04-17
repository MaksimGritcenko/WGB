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

use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Framework\GraphQl\Config\Element\Field;
use Magento\Framework\GraphQl\Exception\GraphQlInputException;
use Magento\Framework\GraphQl\Exception\GraphQlNoSuchEntityException;
use Magento\Framework\GraphQl\Query\ResolverInterface;
use Magento\Framework\GraphQl\Schema\Type\ResolveInfo;
use WGB\RmaGraphQL\Model\Request\ResourceModel\Request;
/**
 * Class GetRequestsForUser
 *
 * @package Wgb\RmaGraphQL\Model\Resolver
 */
class ReturnsForUserResolver implements ResolverInterface
{
    /**
     * @var Request
     */
    private $requestResource;

    public function __construct(
        Request $requestResource
    )
    {
        $this->requestResource = $requestResource;
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
        $userId = $context->getUserId();

        return $this->requestResource->getRequestsForUser($userId);
    }
}

