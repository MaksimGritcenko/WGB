<?php
/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/quote-graphql
 * @link https://github.com/scandipwa/quote-graphql
 */

declare(strict_types=1);

namespace WGB\RmaGraphQL\Model\Resolver;

use Magento\Store\Model\StoreManagerInterface;
use Magento\Framework\GraphQl\Schema\Type\ResolveInfo;
use Magento\Framework\GraphQl\Config\Element\Field;
use Magento\Framework\GraphQl\Query\ResolverInterface;
use Amasty\Rma\Model\ConfigProvider;

/**
 * Retrieves Return Rules for Cart
 */
class ReturnRulesForCart implements ResolverInterface
{
    /**
     * @var ConfigProvider
     */
    protected $configProvider;
    /**
     * @var StoreManagerInterface
     */
    protected $storeManager;

    public function __construct(
        StoreManagerInterface $storeManager,
        ConfigProvider $configProvider
    ) {
        $this->storeManager = $storeManager;
        $this->configProvider = $configProvider;
    }

    /**
     * Get All Product Items of Order.
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

        return $this->configProvider->isShowRmaInfoCart($currentStoreId);
    }
}
