<?php
/**
 * A Magento 2 module named Wgb/GeoIpGraphQL
 * Copyright (C) 2020  
 * 
 * This file included in Wgb/GeoIpGraphQL is licensed under OSL 3.0
 * 
 * http://opensource.org/licenses/osl-3.0.php  Open Software License (OSL 3.0)
 * Please see LICENSE.txt for the full text of the OSL 3.0 license
 */

namespace WGB\GeoIpGraphQL\Model\Resolver;

use Magento\Directory\Model\CountryFactory;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Framework\GraphQl\Config\Element\Field;
use Magento\Framework\GraphQl\Exception\GraphQlInputException;
use Magento\Framework\GraphQl\Exception\GraphQlNoSuchEntityException;
use Magento\Framework\GraphQl\Query\ResolverInterface;
use Magento\Framework\GraphQl\Schema\Type\ResolveInfo;
use Amasty\Geoip\Model\Geolocation;

/**
 * Class Geoiplocation
 *
 * @package WGB\GeoIpGraphQL\Model\Resolver
 */
class Geoiplocation implements ResolverInterface
{

    /**
     * @var Geolocation
     */
    private Geolocation $geolocation;

    /**
     * @var CountryFactory
     */
    private CountryFactory $countryFactory;

    /**
     * @param Geolocation $geolocation
     * @param CountryFactory $countryFactory
     */
    public function __construct(
        Geolocation $geolocation,
        CountryFactory $countryFactory
    ) {
        $this->geolocation = $geolocation;
        $this->countryFactory = $countryFactory;
    }

    private function validateArgs(Array $args) {
        if (!isset($args['ip'])) {
            throw new GraphQlInputException(__('IP is required'));
        }
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
        $this->validateArgs($args);
        $result = $this->geolocation->locate($args['ip'])->getData();
        $result['country_name'] = $this->countryFactory->create()->loadByCode($result['country'])->getName();

        return $result;
    }
}

