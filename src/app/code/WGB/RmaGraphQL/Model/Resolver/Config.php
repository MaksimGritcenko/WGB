<?php

namespace WGB\RmaGraphQL\Model\Resolver;

use Magento\Framework\GraphQl\Config\Element\Field;
use Magento\Framework\GraphQl\Schema\Type\ResolveInfo;
use Magento\Store\Model\StoreManagerInterface;
use Magento\Framework\GraphQl\Query\ResolverInterface;
use Amasty\Rma\Model\ConfigProvider;
use Amasty\Rma\Model\Reason;
use Amasty\Rma\Model\Resolution;
use Amasty\Rma\Model\Condition;

class Config implements ResolverInterface
{
    /**
     * @var StoreManagerInterface
     */
    protected $storeManager;
    /**
     * @var ConfigProvider
     */
    protected $configProvider;
    /**
     * @var Reason\Repository
     */
    protected $reasonRepository;
    /**
     * @var Resolution\Repository
     */
    protected $resolutionRepository;
    /**
     * @var Condition\Repository
     */
    protected $conditionRepository;

    public function __construct(
        StoreManagerInterface $storeManager,
        ConfigProvider $configProvider,
        Reason\Repository $reasonRepository,
        Resolution\Repository $resolutionRepository,
        Condition\Repository $conditionRepository
    )
    {
        $this->storeManager = $storeManager;
        $this->configProvider = $configProvider;
        $this->reasonRepository = $reasonRepository;
        $this->resolutionRepository = $resolutionRepository;
        $this->conditionRepository = $conditionRepository;
    }

    public function resolve(
        Field $field,
        $context,
        ResolveInfo $info,
        array $value = null,
        array $args = null
    )
    {
        $currentStoreId = $this->storeManager->getStore()->getId();
        $currentStoreCustomFields = $this->configProvider->getCustomFields($currentStoreId);

        return [
            'carriers' => $this->configProvider->getCarriers($currentStoreId),
            'reasons' => $this->reasonRepository->getReasonsByStoreId($currentStoreId),
            'conditions' => $this->conditionRepository->getConditionsByStoreId($currentStoreId),
            'resolutions' => $this->resolutionRepository->getResolutionsByStoreId($currentStoreId),
            'custom_fields' => [
                'fields' => array_reduce(
                    array_keys($currentStoreCustomFields),
                    function ($carry, $key) use ($currentStoreCustomFields) {
                        $carry[] = [
                            'code' => $key,
                            'label' => $currentStoreCustomFields[$key]
                        ];

                        return $carry;
                    },
                    []
                ),
                'label' => $this->configProvider->getCustomFieldsLabel($currentStoreId)
            ],
            'contact_data' => [
                'email' => $this->configProvider->getAdministratorEmail(),
                'phone_number' => $this->configProvider->getAdministratorPhoneNumber(),
            ],
            'max_file_size' => (int)$this->configProvider->getMaxFileSize(),
            'customer_feedback_enabled' => $this->configProvider->isEnableFeedback(),
            'chat_enabled' => $this->configProvider->isChatEnabled()
        ];
    }
}