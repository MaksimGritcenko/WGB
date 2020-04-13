<?php

namespace WGB\StoreFinderGraphQl\Helper;

use Magento\Framework\App\Helper\Context;
use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\App\Helper\AbstractHelper;
use Magento\Store\Model\ScopeInterface;
use Scandiweb\StoreFinder\Helper\Data;

/**
 * Class ConfigHelper
 *
 * @package WGB\StoreFinderGraphQl\Helper
 */
class ConfigHelper extends AbstractHelper
{
    /**
     * @var ScopeConfigInterface
     */
    protected $scopeConfig;

    /**
     * ConfigHelper constructor.
     *
     * @param Context $context
     * @param ScopeConfigInterface $scopeConfig
     */
    public function __construct(
        Context $context,
        ScopeConfigInterface $scopeConfig
    ) {
        parent::__construct($context);

        $this->scopeConfig = $scopeConfig;
    }

    /**
     * Get array of allowed countries by store scope
     *
     * @param string $storeId
     * @return mixed
     */
    public function getAllowedCountriesByStore($storeId)
    {
        return $this->scopeConfig->getValue(
            Data::CONFIG_PATH_ALLOWED_COUNTRIES,
            ScopeInterface::SCOPE_STORE,
            $storeId
        );
    }
}
