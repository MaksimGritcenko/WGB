<?php

namespace WGB\StoreFinder\Model\Import;

use Exception;
use Magento\Framework\Exception\FileSystemException;
use Magento\Framework\File\Csv;
use Magento\Framework\Model\AbstractModel;
use Magento\Framework\Model\Context;
use Magento\Framework\Registry;
use Magento\Store\Model\StoreManagerInterface;
use Scandiweb\StoreFinder\Model\ResourceModel\Store as StoreFinderStoreResource;
use Scandiweb\StoreFinder\Model\Store as StoreFinderStore;
use Scandiweb\StoreFinder\Model\StoreFactory as StoreFinderStoreFactory;
use Symfony\Component\Console\Output\ConsoleOutput;
use WGB\StoreFinder\Logger\Logger;
use UnexpectedValueException;

/**
 * Class StoreFinderImport
 *
 * @package WGB\StoreFinder\Model\Import
 */
class StoreFinderImport extends AbstractModel
{
    /**
     * CSV parameters
     */
    const CSV_DELIMITER = ';';
    const CSV_ENCLOSURE = '"';

    /**
     * Offset to get real line in the CSV file. CSV header + 0-index. Mainly for error logs.
     */
    const CSV_REAL_LINE = +2;

    /**
     * Fields that the city CSV file should contain
     */
    const EXPECTED_FIELDS_CITY = [
        'pk',
        'country',
        'name',
        'language',
        'p_code1c',
    ];
    const EXPECTED_FIELDS_STORE = [
        'pk',
        'p_addressline',
        'p_latitude',
        'p_longitude',
        'p_managername',
        'p_description',
        'p_externalid',
        'p_streetname',
        'p_timeopen',
        'p_timeclose',
        'lang',
        'code',
    ];

    /**
     * Field name mapping, file => magento
     */
    const FIELD_MAP_CITY = [
        'pk' => 'city_external_id',
        'name' => 'city',
        'country' => 'country',
        'p_code1c' => 'code1c',
    ];
    const FIELD_MAP_STORE = [
        'p_basestore' => 'city_external_id',
        'pk' => 'store_external_id',
        'p_streetname' => StoreFinderStore::COLUMN_ADDRESS,
        'p_addressline' => [StoreFinderStore::COLUMN_STORE_NAME, StoreFinderStore::COLUMN_ADDRESS],
        'p_name' => StoreFinderStore::COLUMN_STORE_NAME,
        'p_latitude' => StoreFinderStore::COLUMN_LATITUDE,
        'p_longitude' => StoreFinderStore::COLUMN_LONGITUDE,
        'p_managername' => StoreFinderStore::COLUMN_MANAGER_NAME,
        'p_description' => StoreFinderStore::COLUMN_DESCRIPTION,
        'p_timeopen' => 'time_open',
        'p_timeclose' => 'time_close',
        'p_externalid' => 'code1c',
    ];

    /**
     * Line will only be imported if these value patterns match
     */
    const REQUIRED_CONDITIONS_CITY = [
        'language' => '/ru/'
    ];
    const REQUIRED_CONDITIONS_STORE = [
        'lang' => '/ru/',
        'code' => '/STORE/',
        'p_inactive' => '/0/'
    ];

    /**
     * @var Logger
     */
    protected $logger;

    /**
     * CSV parser
     *
     * @var Csv
     */
    protected $csv;

    /**
     * @var StoreManagerInterface
     */
    protected $storeManager;

    /**
     * @var ConsoleOutput
     */
    protected $output;

    /**
     * @var StoreFinderStoreResource
     */
    protected $storeFinderStoreResource;

    /**
     * @var StoreFinderStoreFactory
     */
    protected $storeFinderStoreFactory;

    /**
     * @param Context $context
     * @param Registry $registry
     * @param Logger $logger
     * @param StoreManagerInterface $storeManager
     * @param StoreFinderStoreFactory $storeFinderStoreFactory
     * @param StoreFinderStoreResource $storeFinderStoreResource
     * @param ConsoleOutput $output
     * @param Csv $csv
     */
    public function __construct(
        Context $context,
        Registry $registry,
        Logger $logger,
        StoreManagerInterface $storeManager,
        StoreFinderStoreFactory $storeFinderStoreFactory,
        StoreFinderStoreResource $storeFinderStoreResource,
        ConsoleOutput $output,
        Csv $csv
    ) {
        parent::__construct($context, $registry);

        $this->logger = $logger;
        $this->csv = $csv;
        $this->storeManager = $storeManager;
        $this->output = $output;
        $this->storeFinderStoreFactory = $storeFinderStoreFactory;
        $this->storeFinderStoreResource = $storeFinderStoreResource;
    }

    /**
     * Import data
     *
     * @param string $cityFile
     * @param string $storeFile
     * @return void
     */
    public function import(string $cityFile, string $storeFile)
    {
        $this->log(sprintf('Parsing cities: %s', $cityFile));
        $cities = $this->parseCSV($cityFile, self::EXPECTED_FIELDS_CITY);
        $this->log(sprintf('Parsing stores: %s', $storeFile));
        $stores = $this->parseCSV($storeFile, self::EXPECTED_FIELDS_STORE);

        $this->log('Mapping cities');
        $mappedCities = $this->mapData($cities, self::FIELD_MAP_CITY, self::REQUIRED_CONDITIONS_CITY);
        $this->log('Mapping stores');
        $mappedStores = $this->mapData($stores, self::FIELD_MAP_STORE, self::REQUIRED_CONDITIONS_STORE);

        $this->log('Starting import process');
        $this->makeStores($mappedCities, $mappedStores);
        $this->log('Import complete');
    }

    /**
     * Parse CSV files
     *
     * @var string $filename
     * @var array $expectedFields
     * @throws UnexpectedValueException
     * @throws FileSystemException
     * @return array
     */
    protected function parseCSV(string $filename, array $expectedFields)
    {
        if (!file_exists($filename)) {
            $message = sprintf('File "%s" does not exist', $filename);
            $this->logger->critical($message);
            throw new FileSystemException(__($message));
        };

        // verify header
        $f = fopen($filename, 'r');
        $header = fgetcsv($f, 1000, ';');
        fclose($f);

        if (!$header) {
            $message = sprintf('CSV file "%s" is empty', $filename);
            $this->logger->critical($message);
            throw new UnexpectedValueException($message);
        }

        $missingFields = array_diff($expectedFields, $header);

        if (count($missingFields) > 0) {
            $message = sprintf('CSV header is missing expected fields: %s', implode(', ', $missingFields));
            $this->logger->critical($message);
            throw new UnexpectedValueException($message);
        }

        $this->log('Parsing data');

        $values = $this->csv
            ->setDelimiter(self::CSV_DELIMITER)
            ->setEnclosure(self::CSV_ENCLOSURE)
            ->getData($filename);

        // get field names
        $fields = array_shift($values);

        return $this->mapCombine($fields, $values);
    }

    /**
     * Map CSV fields to Magento format
     *
     * @param array $data
     * @param array $fieldMap
     * @param array $requiredConditions
     * @return array
     */
    protected function mapData(array $data, array $fieldMap, array $requiredConditions)
    {
        $mappedData = [];

        // do field mapping
        foreach ($data as $id => $item) {
            $skip = false;

            if (count($item) == 0) {
                continue;
            }

            try {
                // skip fields that don't match pattern
                foreach ($requiredConditions as $field => $pattern) {
                    if (!preg_match($pattern, $item[$field])) {
                        $mappedData[$id] = [];
                        $skip = true;
                        break;
                    }
                }
                if ($skip) {
                    continue;
                }

                // map fields
                foreach ($fieldMap as $source => $magento) {
                    if (is_array($magento)) {
                        foreach ($magento as $field) {
                            if (empty($mappedData[$id][$field]) || $mappedData[$id][$field] == 'NULL') {
                                $mappedData[$id][$field] = $item[$source];
                            }
                        }
                    } else {
                        if (empty($mappedData[$id][$magento]) || $mappedData[$id][$magento] == 'NULL') {
                            $mappedData[$id][$magento] = $item[$source];
                        }
                    }
                }
            } catch (Exception $e) {
                $this->logCritical(sprintf('Failed on row: %s', $id + self::CSV_REAL_LINE));
                throw $e;
            }

            if ($id % 10000 == 0) {
                $this->log(sprintf('- processed: %s', $id));
            }
        }

        $this->log(sprintf('- processed: %s', $id));

        return $mappedData;
    }

    /**
     * Create stores
     *
     * @param array $cities
     * @param array $stores
     * @return void
     */
    protected function makeStores(array $cities, array $stores)
    {
        $emptyItemFilter = function ($e) {
            return count($e) > 0;
        };
        $cities = array_filter($cities, $emptyItemFilter);
        $stores = array_filter($stores, $emptyItemFilter);

        $cities = array_combine(array_column($cities, 'city_external_id'), $cities);

        foreach ($stores as &$store) {
            // Cleanup empty fields
            foreach ($store as $key => &$item) {
                if ($item == 'NULL') {
                    unset($store[$key]);
                }
            }

            // Link city data
            if (isset($store['city_external_id'])) {
                $store['city'] = $cities[$store['city_external_id']]['city'];
                $store['country'] = $cities[$store['city_external_id']]['country'];
            }

            $store['has_store_page'] = 0;

            // Merge store hours
            if (isset($store['time_open'])) {
                $store['store_hours'] = sprintf('%s - %s', $store['time_open'], $store['time_close']);
                unset($store['time_open']);
                unset($store['time_close']);
            }
        }

        // Import
        try {
            $this->storeFinderStoreResource->beginTransaction();
            foreach ($stores as $store) {
                $this->storeFinderStoreResource->save($this->storeFinderStoreFactory->create()->setData($store));
            }
            $this->storeFinderStoreResource->commit();
        } catch (Exception $e) {
            $this->storeFinderStoreResource->rollBack();
            $this->logger->critical($e);
            throw $e;
        }

        $this->log(sprintf('- processed: %s', count($stores)));
    }

    /**
     * Log message to both file log and console
     *
     * @param mixed $message
     * @return void
     */
    protected function log($message)
    {
        $this->logger->info($message);
        $this->output->writeln($message);
    }

    /**
     * Log critical messages message to both file log and console
     *
     * @param mixed $message
     * @return void
     */
    protected function logCritical($message)
    {
        $this->logger->critical($message);
        $this->output->writeln(sprintf('<error>%s</error>', $message));
    }

    /**
     * Combine an array of arrays with keys
     *
     * @param array $keys
     * @param array $values
     * @return array
     */
    private function mapCombine(array $keys, array $values)
    {
        return array_map(function ($values) use ($keys) {
            return isset($values[1]) ? array_combine($keys, $values) : [];
        }, $values);
    }
}
