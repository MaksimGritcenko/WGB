<?php

namespace WGB\StoreFinder\Logger;

/**
 * Class Handler
 *
 * @package WGB\StoreFinder\Logger
 */
class Handler extends \Magento\Framework\Logger\Handler\Base
{
    /**
     * @var string
     */
    protected $fileName = '/var/log/storeFinderImport.log';
}
