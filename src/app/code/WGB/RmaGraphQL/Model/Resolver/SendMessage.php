<?php

namespace WGB\RmaGraphQL\Model\Resolver;

use Amasty\Rma\Api\CustomerRequestRepositoryInterface;
use Magento\Framework\GraphQl\Config\Element\Field;
use Magento\Framework\GraphQl\Schema\Type\ResolveInfo;
use Magento\Framework\GraphQl\Query\ResolverInterface;
use Amasty\Rma\Model\ConfigProvider;
use Amasty\Rma\Model\Chat;
use Amasty\Rma\Controller;

class SendMessage implements ResolverInterface
{
    /**
     * @var ConfigProvider
     */
    protected $configProvider;
    /**
     * @var Chat\Repository
     */
    protected $chatRepository;
    /**
     * @var CustomerRequestRepositoryInterface
     */
    protected $requestRepository;
    /**
     * @var Controller\FrontendRma
     */
    protected $frontendRmaController;

    public function __construct(
        ConfigProvider $configProvider,
        Chat\Repository $chatRepository,
        Controller\FrontendRma $frontendRmaController,
        CustomerRequestRepositoryInterface $requestRepository
    )
    {
        $this->configProvider = $configProvider;
        $this->chatRepository = $chatRepository;
        $this->requestRepository = $requestRepository;
        $this->frontendRmaController = $frontendRmaController;
    }

    protected function decodeFiles($encodedFiles = []) {
        return array_map(
            function ($encodedFile) {
                return base64_decode($encodedFile);
            }, $encodedFiles
        );
    }

    public function resolve(
        Field $field,
        $context,
        ResolveInfo $info,
        array $value = null,
        array $args = null
    )
    {
        $input = $args['input'];

        // Throws on wrong user
        $request = $this->requestRepository->getById($input['request_id'], $context->getUserId());
        $this->frontendRmaController->saveNewReturnMessage(
            $request,
            $input['message_text'],
            $this->decodeFiles(isset($input['encoded_files']) ? $input['encoded_files'] : [])
        );

        return [ 'success' => true ];
    }
}