<?php

namespace WGB\SocialLogin\HybridAuth\AdditionalProviders\Amazon;

use AmazonOAuth2Client;
use OAuth\Common\Exception\Exception as OAuthException;
use Hybrid_Providers_Amazon;
use WGB\SocialLogin\HybridAuth\HybridAuth;

/**
 * Class Amazon
 *
 * Logs user in using amazon account
 */
class Amazon extends Hybrid_Providers_Amazon
{
    const API_BASE_URL = 'https://api.amazon.com';
    const AUTHORIZE_URL = 'https://www.amazon.com/ap/oa';
    const TOKEN_URL = 'https://api.amazon.com/auth/o2/token';

    /**
     * @throws OAuthException
     */
    public function initialize()
    {
        if (!$this->config['keys']['id'] || !$this->config['keys']['secret']) {
            throw new OAuthException(
                "Your application id and secret are required in order to connect to {$this->providerId}."
            );
        }

        // override requested scope
        if (isset($this->config['scope']) && !empty($this->config['scope'])) {
            $this->scope = $this->config['scope'];
        }

        // create a new OAuth2 client instance
        $this->api = new AmazonOAuth2Client(
            $this->config['keys']['id'],
            $this->config['keys']['secret'],
            $this->endpoint,
            $this->compressed
        );

        $this->api->api_base_url = self::API_BASE_URL;
        $this->api->authorize_url = self::AUTHORIZE_URL;
        $this->api->token_url = self::TOKEN_URL;

        $this->api->curl_header = ['Content-Type: application/x-www-form-urlencoded'];

        // If we have an access token, set it
        if ($this->token('access_token')) {
            $this->api->access_token = $this->token('access_token');
            $this->api->refresh_token = $this->token('refresh_token');
            $this->api->access_token_expires_in = $this->token('expires_in');
            $this->api->access_token_expires_at = $this->token('expires_at');
        }

        // Set curl proxy if exists
        if (isset(HybridAuth::$config['proxy'])) {
            $this->api->curl_proxy = HybridAuth::$config['proxy'];
        }
    }
}
