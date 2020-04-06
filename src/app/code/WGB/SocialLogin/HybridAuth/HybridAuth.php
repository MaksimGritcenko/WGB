<?php

namespace WGB\SocialLogin\HybridAuth;

use Scandiweb\SocialLogin\HybridAuth\HybridAuth as SourceHybridAuth;
use WGB\SocialLogin\HybridAuth\AdditionalProviders\Amazon\Amazon;

/**
 * Class HybridAuth
 *
 * Provides config for HybridAuth
 */
class HybridAuth extends SourceHybridAuth
{
    const AMAZON = 'amazon';

    /**
     * Get hybrid config
     *
     * @return array
     */
    public function getHybridConfig()
    {
        $config = HybridAuth::$hybridConfig;
        $sourceConfig = parent::getHybridConfig();

        $sourceConfig['providers'][ucfirst(self::AMAZON)] =  [
            'enabled' => $config->isProviderEnabled(self::AMAZON),
            'keys'    => [
                'id'     => $config->getProviderApiKey(self::AMAZON),
                'secret'  => $config->getProviderApiSecret(self::AMAZON)
            ],
            'wrapper' => [
                'path'  => __DIR__ . '/AdditionalProviders/Amazon/Amazon.php',
                'class' => Amazon::class
            ]
        ];

        return $sourceConfig;
    }
}
