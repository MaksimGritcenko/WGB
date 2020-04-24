<?php

declare(strict_types=1);

namespace WGB\RmaGraphQL\Model\Resolver;

use Magento\Store\Model\StoreManagerInterface;
use Magento\Framework\GraphQl\Schema\Type\ResolveInfo;
use Magento\Framework\GraphQl\Config\Element\Field;
use Magento\Framework\GraphQl\Query\ResolverInterface;
use Amasty\Rma\Model\ConfigProvider;

/**
 * Retrieves RMA info for product page
 */
class ReturnRulesForPDP implements ResolverInterface
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
     * Get rma info for product page
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

        return $this->configProvider->isShowRmaInfoProductPage($currentStoreId);
    }
}
