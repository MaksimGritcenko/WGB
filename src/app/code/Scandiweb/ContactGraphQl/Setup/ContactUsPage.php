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

use Exception;
use Magento\Framework\Setup\SetupInterface;
use Scandiweb\ContactGraphQl\Api\MigrationInterface;
use Scandiweb\ContactGraphQl\Helper\Cms;

class ContactUsPage implements MigrationInterface
{
    /**
     * @var Cms
     */
    private $cmsHelper;

    /**
     * Content
     *
     * @var string
     */
    private $content = <<<HTML
<div data-content-type="row" data-appearance="contained" data-element="main">
    <div data-enable-parallax="0" data-parallax-speed="0.5" data-background-images="{}" data-element="inner"
         style="justify-content: flex-start; display: flex; flex-direction: column; background-position: left top; background-size: cover; background-repeat: no-repeat; background-attachment: scroll; border-style: none; border-width: 1px; border-radius: 0px; margin: 0px 0px 10px; padding: 10px;">
        <div data-content-type="html" data-appearance="default" data-element="main"
             style="border-style: none; border-width: 1px; border-radius: 0px; margin: 0px; padding: 0px;">
             <widget type="ContactForm" />
        </div>
    </div>
</div>
HTML;

    /**
     * ConfigurableAttributeFix constructor.
     * @param Cms $cmsHelper
     */
    public function __construct(
        Cms $cmsHelper
    ) {
        $this->cmsHelper = $cmsHelper;
    }

    /**
     *
     * @param SetupInterface $setup
     *
     * @return void
     * @throws Exception
     */
    public function apply(SetupInterface $setup = null): void
    {
        $this->cmsHelper->createPage('contact-us', $this->content, [
            'title' => 'Contact Us',
            'stores' => [0],
            'is_active' => 1,
            'page_layout' => '1column',
        ]);
    }
}
?>
