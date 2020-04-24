<?php

namespace WGB\RmaGraphQL\Model\Resolver;

use Magento\Framework\GraphQl\Config\Element\Field;
use Magento\Framework\GraphQl\Schema\Type\ResolveInfo;
use Magento\Store\Model\StoreManagerInterface;
use Magento\Framework\GraphQl\Query\ResolverInterface;
use Amasty\Rma\Model\ConfigProvider;

/**
 * Class StatusCanBeReturned
 * @package WGB\RmaGraphQL\Model\Resolver
 */
class StatusCanBeReturned implements ResolverInterface
{
    /**
     * @var StoreManagerInterface
     */
    protected $storeManager;
    /**
     * @var ConfigProvider
     */
    protected $configProvider;

    public function __construct(
        StoreManagerInterface $storeManager,
        ConfigProvider $configProvider
    )
    {
        $this->storeManager = $storeManager;
        $this->configProvider = $configProvider;
    }

    public function resolve(
        Field $field,
        $context,
        ResolveInfo $info,
        array $value = null,
        array $args = null
    )
    {
        $orderStatus = $value['status'];

        return $this->isReturnable($orderStatus);
    }

    /**
     * @param int $status
     * @return bool
     * @throws \Magento\Framework\Exception\NoSuchEntityException
     */
    public function isReturnable($status) {
        $currentStoreId = $this->storeManager->getStore()->getId();

        if ($statuses = $this->configProvider->getAllowedOrderStatuses($currentStoreId)) {
            if (!in_array($status, $statuses)) {
                return false;
            }
        }

        return true;
    }
}