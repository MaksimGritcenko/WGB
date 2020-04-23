<?php
/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/quote-graphql
 * @link https://github.com/scandipwa/quote-graphql
 */

declare(strict_types=1);

namespace WGB\RmaGraphQL\Model\Resolver;

use Amasty\Rma\Model\ReturnRules\ReturnRulesProcessor;
use Magento\Catalog\Api\Data\ProductInterface;
use Magento\Framework\Exception\LocalizedException;
use Magento\Framework\GraphQl\Schema\Type\ResolveInfo;
use Magento\Framework\GraphQl\Config\Element\Field;
use Magento\Framework\GraphQl\Query\ResolverInterface;

/**
 * Retrieves the Product list in orders
 */
class ReturnResolutionsForProduct implements ResolverInterface
{
    /**
     * @var ReturnRulesProcessor
     */
    protected $returnRulesProcessor;

    /**
     * ReturnResolutionsForProduct constructor.
     * @param ReturnRulesProcessor $returnRulesProcessor
     */
    public function __construct(
        ReturnRulesProcessor $returnRulesProcessor
    ) {
        $this->returnRulesProcessor = $returnRulesProcessor;
    }

    /**
     * Get All Product Items of Order.
     * @inheritdoc
     */
    public function resolve(
        Field $field,
        $context,
        ResolveInfo $info,
        array $value = null,
        array $args = null
    ) {

        if (!array_key_exists('model', $value) || !$value['model'] instanceof ProductInterface) {
            throw new LocalizedException(__('"model" value should be specified'));
        }

        return $this->returnRulesProcessor->getResolutionsForProduct($value['model']);
    }
}
