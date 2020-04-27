<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

namespace WGB\Sitemap\Model\ItemProvider;

use Magento\Sitemap\Model\ResourceModel\Catalog\ProductFactory;
use Magento\Sitemap\Model\SitemapItemInterfaceFactory;
use Magento\Sitemap\Model\ItemProvider\ConfigReaderInterface;

class Product extends \Magento\Sitemap\Model\ItemProvider\Product implements \Magento\Sitemap\Model\ItemProvider\ItemProviderInterface
{
    /**
     * Product factory
     *
     * @var ProductFactory
     */
    private $productFactory;

    /**
     * Sitemap item factory
     *
     * @var SitemapItemInterfaceFactory
     */
    private $itemFactory;

    /**
     * Config reader
     *
     * @var ConfigReaderInterface
     */
    private $configReader;

    /**
     * ProductSitemapItemResolver constructor.
     *
     * @param ConfigReaderInterface $configReader
     * @param ProductFactory $productFactory
     * @param SitemapItemInterfaceFactory $itemFactory
     */
    public function __construct(
        ConfigReaderInterface $configReader,
        ProductFactory $productFactory,
        SitemapItemInterfaceFactory $itemFactory
    ) {
        $this->productFactory = $productFactory;
        $this->itemFactory = $itemFactory;
        $this->configReader = $configReader;
    }

    /**
     * @param $url
     * @return string
     */
    function getFormattedUrl($url)
    {
        $urlNoHtml = str_replace('.html', '', $url);
        return 'product/' . $urlNoHtml;
    }

    /**
     * {@inheritdoc}
     */
    public function getItems($storeId)
    {
        $collection = $this->productFactory->create()
            ->getCollection($storeId);

        $items = array_map(function ($item) use ($storeId) {
            return $this->itemFactory->create([
                'url' => $this->getFormattedUrl($item->getUrl()),
                'updatedAt' => $item->getUpdatedAt(),
                'images' => $item->getImages(),
                'priority' => $this->configReader->getPriority($storeId),
                'changeFrequency' => $this->configReader->getChangeFrequency($storeId),
            ]);
        }, $collection);

        return $items;
    }
}
