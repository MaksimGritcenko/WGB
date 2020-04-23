<?php

declare(strict_types=1);

namespace WGB\StoreFinderGraphQl\Model\Resolver;

use Magento\Framework\GraphQl\Config\Element\Field;
use Magento\Framework\GraphQl\Query\Resolver\ContextInterface;
use Magento\Framework\GraphQl\Query\Resolver\Value;
use Magento\Framework\GraphQl\Query\ResolverInterface;
use Magento\Framework\GraphQl\Schema\Type\ResolveInfo;
use Scandiweb\StoreFinder\Model\ResourceModel\Store\CollectionFactory as StoreCollectionFactory;
use Magento\Framework\DB\Select;
use WGB\StoreFinderGraphQl\Helper\ConfigHelper;

/**
 * Class GetCityStores
 *
 * @package WGB\StoreFinderGraphQl\Model\Resolver
 */
class GetCityStores implements ResolverInterface
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
     * Get cities and stores
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

        if (isset($args['storeId']) && $args['storeId']) {
            $allowedCountries = $this->configHelper->getAllowedCountriesByStore($args['storeId']);
            $collection->addFieldToFilter('country', ['in' => $allowedCountries]);
        }

        $collection->setOrder('city', Select::SQL_ASC)
            ->getItems();

        if (count($collection) < 1) {
            return $result;
        }

        foreach ($collection as $store) {
            if (!isset($result[$store->getCityExternalId()])) {
                $result[$store->getCityExternalId()]['name'] = $store->getCity();
            }

            $result[$store->getCityExternalId()]['stores'][] = $store->getData();
        }

        return $result;
    }
}
