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

use Magento\Framework\GraphQl\Config\Element\Field;
use Magento\Framework\GraphQl\Query\ResolverInterface;
use Magento\Framework\GraphQl\Schema\Type\ResolveInfo;
use WGB\RmaGraphQL\Model\Request\ResourceModel\RequestDetails;

/**
 * Class GetRequestsForUser
 *
 * @package Wgb\RmaGraphQL\Model\Resolver
 */
class GetReturnDetails implements ResolverInterface
{
    public function __construct(
        RequestDetails $requestDetails
    )
    {
        $this->requestDetails = $requestDetails;
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
        return $this->requestDetails->getById($args['return_id']);
    }
}
