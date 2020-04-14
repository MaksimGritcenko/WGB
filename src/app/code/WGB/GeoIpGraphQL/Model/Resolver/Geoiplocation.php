<?php
namespace WGB\GeoIpGraphQL\Model\Resolver;

use Magento\Directory\Model\CountryFactory;
use Magento\Framework\HTTP\PhpEnvironment\RemoteAddress;
use Magento\Framework\GraphQl\Config\Element\Field;
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
    private $geolocation;

    /**
     * @var CountryFactory
     */
    private $countryFactory;

    /**
     * @var RemoteAddress
     */
    private $remoteAddress;

    /**
     * @param Geolocation $geolocation
     * @param CountryFactory $countryFactory
     * @param RemoteAddress $remoteAddress
     */
    public function __construct(
        Geolocation $geolocation,
        CountryFactory $countryFactory,
        RemoteAddress $remoteAddress
    ) {
        $this->geolocation = $geolocation;
        $this->countryFactory = $countryFactory;
        $this->remoteAddress = $remoteAddress;
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
        $ip = $this->remoteAddress->getRemoteAddress();
        $result = $this->geolocation->locate($ip)->getData();
        $result['country_name'] = $this->countryFactory->create()->loadByCode($result['country'])->getName();

        return $result;
    }
}

