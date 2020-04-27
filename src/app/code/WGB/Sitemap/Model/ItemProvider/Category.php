<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

namespace WGB\Sitemap\Model\ItemProvider;

use Magento\Sitemap\Model\ResourceModel\Catalog\CategoryFactory;
use Magento\Sitemap\Model\SitemapItemInterfaceFactory;
use Magento\Sitemap\Model\ItemProvider\ConfigReaderInterface;

class Category extends \Magento\Sitemap\Model\ItemProvider\Category implements \Magento\Sitemap\Model\ItemProvider\ItemProviderInterface
{
    /**
     * Category factory
     *
     * @var CategoryFactory
     */
    private $categoryFactory;

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
     * CategorySitemapItemResolver constructor.
     *
     * @param ConfigReaderInterface $configReader
     * @param CategoryFactory $categoryFactory
     * @param SitemapItemInterfaceFactory $itemFactory
     */
    public function __construct(
        ConfigReaderInterface $configReader,
        CategoryFactory $categoryFactory,
        SitemapItemInterfaceFactory $itemFactory
    ) {
        $this->categoryFactory = $categoryFactory;
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
        return 'category/' . $urlNoHtml;
    }

    /**
     * {@inheritdoc}
     */
    public function getItems($storeId)
    {
        $collection = $this->categoryFactory->create()
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
