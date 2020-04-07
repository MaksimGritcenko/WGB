<?php
/**
 * Technodom_StoreFinder
 *
 * @category    Technodom
 * @package     Technodom_StoreFinder
 * @author      Daniels Kursits <info@scandiweb.com>
 * @copyright   Copyright (c) 2019 Scandiweb, Ltd (https://scandiweb.com)
 */

namespace Technodom\StoreFinder\Logger;

/**
 * Class Handler
 *
 * @package Technodom\StoreFinder\Logger
 */
class Handler extends \Magento\Framework\Logger\Handler\Base
{
    /**
     * @var string
     */
    protected $fileName = '/var/log/storeFinderImport.log';
}
