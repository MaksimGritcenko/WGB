<?php
/**
 * WGB_Slider
 *
 * @category    WGB
 * @package     WGB_Slider
 * @author      Roberts Briedis <info@scandiweb.com>
 */
namespace WGB\Slider\Setup;

use Magento\Framework\DB\Ddl\Table;
use Magento\Framework\Setup\UpgradeSchemaInterface;
use Magento\Framework\Setup\ModuleContextInterface;
use Magento\Framework\Setup\SchemaSetupInterface;

class UpgradeSchema implements UpgradeSchemaInterface
{
    public function upgrade(SchemaSetupInterface $setup, ModuleContextInterface $context)
    {
        $setup->startSetup();

        if (version_compare($context->getVersion(), '1.0.0', '<')) {
            $this->addAdditionalSlideFields($setup);
        }

        $setup->endSetup();
    }

    protected function addAdditionalSlideFields(SchemaSetupInterface $setup)
    {
        $setup->getConnection()->addColumn(
            $setup->getTable('scandiweb_slider_slide'),
            'slide_content_is_white',
            [
                'type' => Table::TYPE_SMALLINT,
                'nullable' => false,
                'comment' => 'Slide content should be white'
            ]
        );
    }
}

