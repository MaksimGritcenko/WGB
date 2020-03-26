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

namespace Scandiweb\ContactGraphQl\Api;

use \Magento\Framework\Setup\SetupInterface;

interface MigrationInterface
{
    /**
     *
     * @param SetupInterface $setup
     * @return
     */
    public function apply(SetupInterface $setup = null);
}