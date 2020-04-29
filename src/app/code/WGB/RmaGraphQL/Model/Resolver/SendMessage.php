<?php

namespace WGB\RmaGraphQL\Model\Resolver;

use Amasty\Rma\Api\CustomerRequestRepositoryInterface;
use Magento\Framework\App\Filesystem\DirectoryList;
use Magento\Framework\Filesystem;
use Magento\Framework\GraphQl\Config\Element\Field;
use Magento\Framework\GraphQl\Schema\Type\ResolveInfo;
use Magento\Framework\GraphQl\Query\ResolverInterface;
use Amasty\Rma\Model\ConfigProvider;
use Amasty\Rma\Model\Chat;
use Amasty\Rma\Utils\FileUpload;
use Amasty\Rma\Controller;
use Magento\Framework\Math\Random;
use Magento\MediaStorage\Model\File\Uploader;
use Magento\MediaStorage\Model\File\UploaderFactory;
use Psr\Log\LoggerInterface;

class SendMessage implements ResolverInterface
{
    const MEDIA_PATH = 'amasty/rma/';
    const FILEHASH = 'filehash';
    const FILENAME = 'filename';
    const EXTENSION = 'extension';

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
     * @var FileUpload
     */
    protected $fileUpload;
    /**
     * @var Filesystem
     */
    protected $filesystem;
    /**
     * @var Random
     */
    protected $mathRandom;
    /**
     * @var LoggerInterface
     */
    protected $logger;
    /**
     * @var UploaderFactory
     */
    protected $fileUploaderFactory;

    public function __construct(
        ConfigProvider $configProvider,
        Chat\Repository $chatRepository,
        Controller\FrontendRma $frontendRmaController,
        CustomerRequestRepositoryInterface $requestRepository,
        FileUpload $fileUpload,
        Filesystem $filesystem,
        Random $mathRandom,
        LoggerInterface $logger,
        UploaderFactory $fileUploaderFactory
    )
    {
        $this->configProvider = $configProvider;
        $this->chatRepository = $chatRepository;
        $this->requestRepository = $requestRepository;
        $this->frontendRmaController = $frontendRmaController;
        $this->fileUpload = $fileUpload;
        $this->filesystem = $filesystem;
        $this->mathRandom = $mathRandom;
        $this->logger = $logger;
        $this->fileUploaderFactory = $fileUploaderFactory;
    }

    private function getRmaTempPath()
    {
        return $this->filesystem->getDirectoryRead(
            DirectoryList::MEDIA
        )->getAbsolutePath(
            self::MEDIA_PATH . 'temp/'
        );
    }

    public function uploadFiles($files, $maxFileSize)
    {
        $path = $this->getRmaTempPath();
        $writer = $this->filesystem->getDirectoryWrite(DirectoryList::MEDIA);
        $writer->create($path);

        $result = [];

        foreach ($files as $name => $file) {
            if ($maxFileSize > 0 && (strlen($file) > $maxFileSize * 1024)) {
                // File sizes validated on FE, this just to ensure security
                continue;
            }
            $extension = mb_strtolower(
                '.' . pathinfo($name, PATHINFO_EXTENSION)
            );

            $fileHash = $this->mathRandom->getUniqueHash() . $extension;
            $filePath = $path . $fileHash;

            if ($writer->isExist($filePath)) {
                unlink($filePath);
            }

            if (file_put_contents($filePath, $file)) {
                $result[] = [
                    self::FILEHASH => $fileHash,
                    self::FILENAME => (string)$name,
                    self::EXTENSION => $extension
                ];
            } else {
                throw new \Exception('Failed saving file');
            }
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
        $input = $args['input'];
        $maxFileSize = (int)$this->configProvider->getMaxFileSize();

        // Throws on wrong user
        $request = $this->requestRepository->getById(
            $input['request_id'],
            $context->getUserId()
        );

        $message = $this->chatRepository->getEmptyMessageModel()
            ->setMessage($input['message_text'])
            ->setIsManager(0)
            ->setIsRead(0)
            ->setRequestId($request->getRequestId())
            ->setCustomerId($request->getCustomerId())
            ->setName($request->getCustomerName());

        if ($input['encoded_files']) {
            $decodedFiles = [];
            foreach ($input['encoded_files'] as $encodedFile) {
                $fileName = $encodedFile['name'];
                $decodedFile = base64_decode($encodedFile['encoded_file']);
                $decodedFiles[$fileName] = $decodedFile;
            }
            $uploadedFiles = $this->uploadFiles($decodedFiles, $maxFileSize);
            $messageFiles = array_map(
                function($file) {
                    return $this->chatRepository->getEmptyMessageFileModel()
                        ->setFilepath($file[FileUpload::FILEHASH])
                        ->setFilename($file[FileUpload::FILENAME]);
                }, $uploadedFiles
            );

            $message->setMessageFiles($messageFiles);
        }

        $this->chatRepository->save($message);

//        $this->frontendRmaController->saveNewReturnMessage(
//            $request,
//            $input['message_text'],
//            isset($uploadedFiles) ? $uploadedFiles : []
//        );

        return [ 'success' => true ];
    }
}