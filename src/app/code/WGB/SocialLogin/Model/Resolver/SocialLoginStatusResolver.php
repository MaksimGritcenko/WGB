<?php

declare(strict_types=1);

namespace WGB\SocialLogin\Model\Resolver;

use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Framework\GraphQl\Query\Resolver\ContextInterface;
use Magento\Framework\GraphQl\Query\Resolver\Value;
use Magento\Framework\GraphQl\Schema\Type\ResolveInfo;
use Magento\Framework\GraphQl\Config\Element\Field;
use Magento\Framework\GraphQl\Query\ResolverInterface;
use Magento\Framework\UrlInterface;
use Scandiweb\SocialLogin\HybridAuth\HybridAuth;
use Magento\Store\Model\StoreManagerInterface;

/**
 * Class SocialLoginStatusResolver
 * @package WGB\SocialLogin\Model\Resolver
 */
class SocialLoginStatusResolver implements ResolverInterface
{
    /**
     * @var HybridAuth
     */
    protected $hybridAuth;

    /**
     * @var StoreManagerInterface
     */
    protected $storeManager;

    /**
     * @var UrlInterface
     */
    protected $urlInterface;

    /**
     * SocialLoginStatusResolver constructor.
     * @param HybridAuth $hybridAuth
     * @param StoreManagerInterface $storeManager
     * @param UrlInterface $urlInterface
     */
    public function __construct(
        HybridAuth $hybridAuth,
        StoreManagerInterface $storeManager,
        UrlInterface $urlInterface
    ) {
        $this->hybridAuth = $hybridAuth;
        $this->storeManager = $storeManager;
        $this->urlInterface = $urlInterface;
    }

    /**
     * @param Field $field
     * @param ContextInterface $context
     * @param ResolveInfo $info
     * @param array|null $value
     * @param array|null $args
     * @return array|Value|mixed
     * @throws NoSuchEntityException
     */
    public function resolve(Field $field, $context, ResolveInfo $info, array $value = null, array $args = null)
    {
        $providers = [];

        $hybridProviders = $this->hybridAuth->getProviders();

        foreach ($hybridProviders as $key => $provider) {
            $providers[strtolower($key)]['url'] = $this->urlInterface->getUrl('sociallogin/login', [
                'provider' => strtolower($key),
                '_secure' => $this->storeManager->getStore()->isCurrentlySecure()
            ]);
            $providers[strtolower($key)]['order'] = $provider['order'];
            $providers[strtolower($key)]['provider'] = strtolower($key);
        }

        return $providers;
    }
}
