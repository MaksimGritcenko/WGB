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

declare(strict_types=1);

namespace WGB\CheckoutOptionsGraphQl\Model\Cart;

use Magento\Checkout\Helper\Data as CheckoutHelper;
use Magento\Framework\GraphQl\Exception\GraphQlAuthorizationException;
use Magento\Quote\Model\Quote;

/**
 * Checks if guest checkout is allowed.
 */
class CheckCartCheckoutAllowance
{
    /**
     * @var CheckoutHelper
     */
    private $checkoutHelper;

    /**
     * @param CheckoutHelper $checkoutHelper
     */
    public function __construct(
        CheckoutHelper $checkoutHelper
    ) {
        $this->checkoutHelper = $checkoutHelper;
    }

    /**
     * Check if User is allowed to checkout
     *
     * @param Quote $quote
     * @return void
     * @throws GraphQlAuthorizationException
     */
    public function execute(Quote $quote): void
    {
        if (false === $quote->getCustomerIsGuest()) {
            return;
        }

        $isAllowedGuestCheckout = (bool)$this->checkoutHelper->isAllowedGuestCheckout($quote);
        if (false === $isAllowedGuestCheckout) {
            throw new GraphQlAuthorizationException(
                __(
                    '123Guest checkout is not allowed. ' .
                    'Register a customer account or login with existing one.'
                )
            );
        }
    }
}
