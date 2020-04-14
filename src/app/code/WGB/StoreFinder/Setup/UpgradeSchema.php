<?php

namespace WGB\StoreFinder\Setup;

use Magento\Framework\DB\Ddl\Table;
use Magento\Framework\Setup\ModuleContextInterface;
use Magento\Framework\Setup\SchemaSetupInterface;
use Magento\Framework\Setup\UpgradeSchemaInterface;

/**
 * Class UpgradeSchema
 *
 * @package WGB\StoreFinder\Setup
 */
class UpgradeSchema implements UpgradeSchemaInterface
{
    /**
     * @var SchemaSetupInterface
     */
    protected $setup;

    /**
     * Upgrades DB schema for a module
     *
     * @param SchemaSetupInterface $setup
     * @param ModuleContextInterface $context
     *
     * @return void
     */
    public function upgrade(SchemaSetupInterface $setup, ModuleContextInterface $context)
    {
        $this->setup = $setup;
        $this->setup->startSetup();

        if (version_compare($context->getVersion(), '0.1.0', '<')) {
            $this->addCustomColumns();
        }

        if (version_compare($context->getVersion(), '0.2.0', '<')) {
            $this->addCode1C();
            $this->fixLatitudeLongitudeType();
        }

        if (version_compare($context->getVersion(), '0.4.0', '<')) {
            $this->addWorkingDays();
        }

        $this->setup->endSetup();
    }

    /**
     * Add city, city_external_id, store_external_id
     *
     * @return void
     */
    protected function addCustomColumns()
    {
        $tableName = $this->setup->getTable('scandiweb_store_finder_stores');
        $connection = $this->setup->getConnection();

        $connection->addColumn(
            $tableName,
            'city',
            [
                'type' => Table::TYPE_TEXT,
                'length' => 50,
                'nullable' => true,
                'comment' => 'City Name',
            ]
        );

        $connection->addColumn(
            $tableName,
            'city_external_id',
            [
                'type' => Table::TYPE_TEXT,
                'length' => 255,
                'nullable' => true,
                'comment' => 'City External Id',
            ]
        );

        $connection->addColumn(
            $tableName,
            'store_external_id',
            [
                'type' => Table::TYPE_TEXT,
                'length' => 255,
                'nullable' => true,
                'comment' => 'Store External Id',
            ]
        );
    }

    /**
     * Add code1c
     */
    protected function addCode1C()
    {
        $tableName = $this->setup->getTable('scandiweb_store_finder_stores');
        $connection = $this->setup->getConnection();

        $connection->addColumn(
            $tableName,
            'code1c',
            [
                'type' => Table::TYPE_TEXT,
                'length' => 255,
                'nullable' => true,
                'comment' => '1C system code',
            ]
        );
    }

    /**
     * Fix datatype of latitude and longitude columns
     */
    protected function fixLatitudeLongitudeType()
    {
        $tableName = $this->setup->getTable('scandiweb_store_finder_stores');
        $connection = $this->setup->getConnection();

        $connection->changeColumn(
            $tableName,
            'latitude',
            'latitude',
            [
                'type' => Table::TYPE_FLOAT,
                'precision' => 12,
                'scale' => 9,
            ]
        );
        $connection->changeColumn(
            $tableName,
            'longitude',
            'longitude',
            [
                'type' => Table::TYPE_FLOAT,
                'precision' => 12,
                'scale' => 9,
            ]
        );
    }

    /**
     * Add working days
     */
    protected function addWorkingDays()
    {
        $tableName = $this->setup->getTable('scandiweb_store_finder_stores');
        $connection = $this->setup->getConnection();

        $connection->addColumn(
            $tableName,
            'working_days',
            [
                'type' => Table::TYPE_TEXT,
                'length' => 13,
                'nullable' => true,
                'comment' => 'Working days'
            ]
        );
    }
}
