<?php

namespace WGB\RmaGraphQL\Model\Resolver;

use Amasty\Rma\Api\CustomerRequestRepositoryInterface;
use Amasty\Rma\Utils\FileUpload;
use Magento\Framework\Controller\Result\Json;
use Magento\Framework\Controller\ResultFactory;
use Magento\Framework\GraphQl\Config\Element\Field;
use Magento\Framework\GraphQl\Schema\Type\ResolveInfo;
use Magento\Framework\GraphQl\Query\ResolverInterface;
use Amasty\Rma\Model\ConfigProvider;
use Amasty\Rma\Model\Chat;
use Amasty\Rma\Controller;

class GetChatForRequest implements ResolverInterface
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
    /**
     * @var ResultFactory
     */
    protected $resultFactory;
    /**
     * @var FileUpload
     */
    protected $fileUpload;

    public function __construct(
        ConfigProvider $configProvider,
        Chat\Repository $chatRepository,
        Controller\FrontendRma $frontendRmaController,
        CustomerRequestRepositoryInterface $requestRepository,
        ResultFactory $resultFactory,
        FileUpload $fileUpload
    )
    {
        $this->configProvider = $configProvider;
        $this->chatRepository = $chatRepository;
        $this->requestRepository = $requestRepository;
        $this->frontendRmaController = $frontendRmaController;
        $this->resultFactory = $resultFactory;
        $this->fileUpload = $fileUpload;
    }

    public function execute($requestId, $customerId)
    {
        /** @var Json $response */
        $response = $this->resultFactory->create(ResultFactory::TYPE_JSON);

        try {
            $returnRequest = $this->requestRepository->getById($requestId, $customerId);
        } catch (\Exception $e) {
            return $response->setData([]);
        }

        $result = [];
        foreach ($this->chatRepository->getMessagesByRequestId(
            $returnRequest->getRequestId()
        ) as $message) {
            $result[] = [
                'is_manager' => $message->isManager(),
                'is_system' => $message->isSystem(),
                'message' => $message->getMessage(),
                'username' => $message->getName(),
                'created_at' => $message->getCreatedAt(),
                'message_id' => $message->getMessageId(),
                'files' => $this->fileUpload
                    ->prepareMessageFiles(
                        $message->getMessageFiles(),
                        $returnRequest->getRequestId()
                    )
            ];
        }

        return $result;
    }

    public function resolve(
        Field $field,
        $context,
        ResolveInfo $info,
        array $value = null,
        array $args = null
    )
    {
        return [ 'messages' => $this->execute($args['request_id'], $context->getUserId()) ];
    }
}