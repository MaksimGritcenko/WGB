<?php

namespace WGB\RmaGraphQL\Model\Resolver;

use Magento\Cms\Helper\Page;
use Magento\Framework\GraphQl\Config\Element\Field;
use Magento\Framework\GraphQl\Schema\Type\ResolveInfo;
use Magento\Framework\GraphQl\Query\ResolverInterface;
use Amasty\Rma\Model\ConfigProvider;

class Policy implements ResolverInterface
{
    /**
     * @var ConfigProvider
     */
    protected $configProvider;
    /**
     * @var Page
     */
    private $pageHelper;

    public function __construct(
        ConfigProvider $configProvider,
        Page $pageHelper

    )
    {
        $this->configProvider = $configProvider;
        $this->pageHelper = $pageHelper;
    }

    public function resolve(
        Field $field,
        $context,
        ResolveInfo $info,
        array $value = null,
        array $args = null
    )
    {
        $pageId = $this->configProvider->getReturnPolicyPage();
        return [
            'policy_status' => $this->configProvider->isReturnPolicyEnabled(),
            'policy_page_url' => $this->pageHelper->getPageUrl($pageId)
        ];
    }
}