<?php

declare(strict_types=1);

namespace WGB\CustomerGraphQl\Model\Resolver;

use Magento\Framework\GraphQl\Schema\Type\ResolveInfo;
use Magento\Framework\GraphQl\Config\Element\Field;
use Magento\Framework\GraphQl\Query\ResolverInterface;
use Magento\Customer\Model\Session as CustomerSession;
use Magento\Framework\GraphQl\Exception\GraphQlAuthorizationException;

/**
 * Class RewardPoints
 *
 * Logs current user out
 */
class Logout implements ResolverInterface
{
    /**
     * @var CustomerSession
     */
    protected $customerSession;

    public function __construct(CustomerSession $customerSession)
    {
        $this->customerSession = $customerSession;
    }

    /**
     * @inheritdoc
     */
    public function resolve(
        Field $field,
        $context,
        ResolveInfo $info,
        array $value = null,
        array $args = null
    ) {
        if (false === $context->getExtensionAttributes()->getIsCustomer()) {
            throw new GraphQlAuthorizationException(__('The current customer isn\'t authorized.'));
        }

        $this->customerSession->logout();

        return [
            'status' => 'true'
        ];
    }
}
