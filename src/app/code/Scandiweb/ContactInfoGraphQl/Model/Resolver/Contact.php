<?php
/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

namespace Scandiweb\ContactInfoGraphQl\Model\Resolver;

use Magento\Framework\GraphQl\Config\Element\Field;
use Magento\Framework\GraphQl\Query\ResolverInterface;
use Magento\Framework\GraphQl\Schema\Type\ResolveInfo;
use Magento\Store\Model\Information;
use Magento\Store\Model\StoreManagerInterface;
use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Store\Model\ScopeInterface;


class Contact implements ResolverInterface
{
    protected $_storeInfo;

    protected $_storeInterface;

    protected $_scopeConfig;

    public function __construct(
        Information $storeInfo,
        StoreManagerInterface $storeInterface,
        ScopeConfigInterface $scopeConfig
    ) {
        $this->_storeInfo = $storeInfo;
        $this->_storeInterface = $storeInterface;
        $this->_scopeConfig = $scopeConfig;
    }

    public function getStore()
    {
        return $this->_storeInterface->getStore();
    }

    protected function getPhoneNumber($store)
    {
        return $this->_storeInfo->getStoreInformationObject($store)
            ->getPhone();
    }

    public function getStoreSupportEmail()
    {
        return $this->_scopeConfig
            ->getValue('trans_email/ident_support/email',ScopeInterface::SCOPE_STORE);
    }

    protected function getOpeningHours($store)
    {
        return $this->_storeInfo->getStoreInformationObject($store)
        ->getHours();

    }

    public function resolve(
        Field $field,
        $context,
        ResolveInfo $info,
        array $value = null,
        array $args = null
    ) {
        $data = [
            'store_phone' => $this->getPhoneNumber($this->getStore()),
            'store_email' => $this->getStoreSupportEmail(),
            'store_working_hours' => $this->getOpeningHours($this->getStore())
        ];
        return $data;
    }
}
