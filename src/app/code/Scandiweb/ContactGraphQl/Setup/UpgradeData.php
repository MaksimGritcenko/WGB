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

namespace Scandiweb\ContactGraphQl\Setup;

use Scandiweb\ContactGraphQl\Setup\ContactUsPage;
use Magento\Framework\Setup\UpgradeDataInterface;
use Scandiweb\ContactGraphQl\Setup\AbstractUpgradeData;



/**
 * Class UpgradeData
 *
 */
class UpgradeData extends AbstractUpgradeData implements UpgradeDataInterface
{
    protected $migrations = [
        '1.0.0' => ContactUsPage::class,
    ];
}