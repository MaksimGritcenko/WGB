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

namespace Scandiweb\ContactGraphQl\Model\Resolver;

use Exception;
use Magento\Contact\Model\Mail;
use Magento\Framework\DataObject;
use Magento\Framework\Exception\LocalizedException;
use Magento\Framework\GraphQl\Config\Element\Field;
use Magento\Framework\GraphQl\Exception\GraphQlInputException;
use Magento\Framework\GraphQl\Query\Resolver\ContextInterface;
use Magento\Framework\GraphQl\Query\Resolver\Value;
use Magento\Framework\GraphQl\Query\ResolverInterface;
use Magento\Framework\GraphQl\Schema\Type\ResolveInfo;

/**
 * Class Contact
 *
 * @package Netnutri\ContactGraphQl\Model\Resolver
 */
class Contact implements ResolverInterface
{
    /**
     * @var Mail
     */
    private $mail;

    /**
     * Contact constructor.
     *
     * @param Mail $mail
     */
    public function __construct(Mail $mail)
    {
        $this->mail = $mail;
    }

    /**
     * Fetches the data from persistence models and format it according to the GraphQL schema.
     *
     * @param Field $field
     * @param ContextInterface $context
     * @param ResolveInfo $info
     * @param array|null $value
     * @param array|null $args
     * @return mixed|Value
     * @throws Exception
     */
    public function resolve(Field $field, $context, ResolveInfo $info, array $value = null, array $args = null)
    {
        $data = [];

        $data['name']       = $args['contact']['name']         ?? '';
        $data['telephone']  = $args['contact']['telephone']    ?? '';
        $data['email']      = $args['contact']['email']        ?? '';
        $data['comment']    = $args['contact']['message']      ?? '';

        try {
            $this->sendEmail($this->validatedParams($data));
            $result = ['message' => __('Thanks for contacting us with your comments and questions. We\'ll respond to you very soon.')];
        } catch (Exception $e) {
            throw new GraphQlInputException(__($e->getMessage()));
        }

        return $result;
    }

    /**
     * Send email
     *
     * @param array $post Post data from contact form
     *
     * @return void
     */
    private function sendEmail($post): void
    {
        $this->mail->send(
            $post['email'],
            ['data' => new DataObject($post)]
        );
    }

    /**
     * Validate input data
     *
     * @param $data
     *
     * @return array
     * @throws LocalizedException
     */
    private function validatedParams($data): array
    {
        if (trim($data['name']) === '') {
            throw new LocalizedException(__('Enter the Name and try again.'));
        }
        if (trim($data['comment']) === '') {
            throw new LocalizedException(__('Enter the comment and try again.'));
        }
        if (false === \strpos($data['email'], '@')) {
            throw new LocalizedException(__('The email address is invalid. Verify the email address and try again.'));
        }

        return $data;
    }
}
