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

use Amasty\Rma\Api\Data\ResolutionInterface;
use Amasty\Rma\Model\Resolution\Repository;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Framework\GraphQl\Config\Element\Field;
use Magento\Framework\GraphQl\Exception\GraphQlInputException;
use Magento\Framework\GraphQl\Exception\GraphQlNoSuchEntityException;
use Magento\Framework\GraphQl\Query\ResolverInterface;
use Magento\Framework\GraphQl\Schema\Type\ResolveInfo;
use Magento\Store\Model\StoreManagerInterface;

/**
 * Class GetReturnResolutions
 *
 * @package Wgb\RmaGraphQL\Model\Resolver
 */
class GetReturnResolutions implements ResolverInterface
{

    public function __construct(
        StoreManagerInterface $storeManager,
        Repository $resolutionRepository
    )
    {
        $this->storeManager = $storeManager;
        $this->resolutionRepostory = $resolutionRepository;
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
    ) {
        $currentStoreId = $this->storeManager->getStore()->getId();
        $resolutions = $this->resolutionRepostory->getResolutionsByStoreId($currentStoreId);

        return array_map(
            function($resolution) {
                /** @var ResolutionInterface $resolution */
                $resolution['id'] = (int)$resolution->getResolutionId();
                return $resolution;
            },
            $resolutions
        );
    }
}

