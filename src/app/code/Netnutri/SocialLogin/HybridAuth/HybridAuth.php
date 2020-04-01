<?php
/**
 * @category Netnutri
 * @package  Netnutri_SocialLogin
 * @author   Tornike Bakuradze <info@scandiweb.com>
 * @copyright Copyright (c) 2020 Scandiweb, Inc (https://scandiweb.com)
 * @license   http://opensource.org/licenses/OSL-3.0 The Open Software License 3.0 (OSL-3.0)
 */

namespace Netnutri\SocialLogin\HybridAuth;

use Scandiweb\SocialLogin\HybridAuth\HybridAuth as SourceHybridAuth;
use Netnutri\SocialLogin\HybridAuth\AdditionalProviders\Amazon\Amazon;

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
