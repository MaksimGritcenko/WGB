<?php
/**
 * Technodom_StoreFinderGraphQl
 *
 * @category    Technodom
 * @package     Technodom_StoreFinderGraphQl
 * @author      Ivars Dicpeteris <info@scandiweb.com>
 * @copyright   Copyright (c) 2019 Scandiweb, Ltd (https://scandiweb.com)
 */

declare(strict_types=1);

namespace Technodom\StoreFinderGraphQl\Model\Resolver;

use Magento\Framework\GraphQl\Config\Element\Field;
use Magento\Framework\GraphQl\Query\Resolver\ContextInterface;
use Magento\Framework\GraphQl\Query\Resolver\Value;
use Magento\Framework\GraphQl\Query\ResolverInterface;
use Magento\Framework\GraphQl\Schema\Type\ResolveInfo;
use Scandiweb\StoreFinder\Model\ResourceModel\Store\CollectionFactory as StoreCollectionFactory;
use Technodom\StoreFinderGraphQl\Helper\ConfigHelper;

/**
 * Class GetStores
 *
 * @package Technodom\StoreFinderGraphQl\Model\Resolver
 */
class GetStores implements ResolverInterface
{
    /**
     * @var StoreCollectionFactory
     */
    protected $storeCollectionFactory;

    /**
     * @var ConfigHelper
     */
    protected $configHelper;

    /**
     * GetStores constructor.
     *
     * @param StoreCollectionFactory $storeCollectionFactory
     * @param ConfigHelper $configHelper
     */
    public function __construct(
        StoreCollectionFactory $storeCollectionFactory,
        ConfigHelper $configHelper
    ) {
        $this->storeCollectionFactory = $storeCollectionFactory;
        $this->configHelper = $configHelper;
    }

    /**
     * Get stores
     *
     * @param Field $field
     * @param ContextInterface $context
     * @param ResolveInfo $info
     * @param array|null $value
     * @param array|null $args
     * @return array|Value|mixed
     */
    public function resolve(Field $field, $context, ResolveInfo $info, array $value = null, array $args = null)
    {
        $result = [];
        $collection = $this->storeCollectionFactory->create();

        if (isset($args['cityId']) && $args['cityId']) {
            $collection->addFieldToFilter('city_external_id', $args['cityId']);
        }

        if (isset($args['storeId']) && $args['storeId']) {
            $allowedCountries = $this->configHelper->getAllowedCountriesByStore($args['storeId']);
            $collection->addFieldToFilter('country', ['in' => $allowedCountries]);
        }

        $collection->getItems();

        if (count($collection) < 1) {
            return $result;
        }

        foreach ($collection as $store) {
            $result[] = $store->getData();
        }

        return $result;
    }
}
