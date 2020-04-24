<?php
/**
 * @author Amasty Team
 * @copyright Copyright (c) 2020 Amasty (https://www.amasty.com)
 * @package Amasty_Rma
 */


namespace Amasty\Rma\Plugin\DisplayRmaInfo;

use Amasty\Rma\Model\ConfigProvider;
use Amasty\Rma\Model\ReturnRules\ReturnRulesProcessor;
use Magento\Store\Model\StoreManagerInterface;

class DisplayCart
{
    /**
     * @var ConfigProvider
     */
    private $configProvider;

    /**
     * @var ReturnRulesProcessor
     */
    private $returnRulesProcessor;

    /**
     * @var StoreManagerInterface
     */
    private $storeManager;

    public function __construct(
        ConfigProvider $configProvider,
        ReturnRulesProcessor $returnRulesProcessor,
        StoreManagerInterface $storeManager
    ) {
        $this->configProvider = $configProvider;
        $this->returnRulesProcessor = $returnRulesProcessor;
        $this->storeManager = $storeManager;
    }

    /**
     * @param \Magento\Checkout\Block\Cart\Item\Renderer $subject
     * @param array $result
     *
     * @return array
     * @throws \Magento\Framework\Exception\NoSuchEntityException
     */
    public function afterGetOptionList($subject, $result)
    {
        $product = $subject->getProduct();

        if (!$this->configProvider->isEnabled()
            || !$this->configProvider->isShowRmaInfoCart($this->storeManager->getStore()->getId())
            || $product->isVirtual()
        ) {
            return $result;
        }

        $resolutions = $this->returnRulesProcessor->getResolutionsForProduct($product);

        if ($resolutions) {
            foreach ($resolutions as $resolutionData) {
                $result[] = [
                    'label' => __('%1 period', $resolutionData['resolution']->getLabel()),
                    'value' => __('%1 days', $resolutionData['value'])
                ];
            }
        } else {
            $result[] = [
                'label' => __('Item Returns'),
                'value' => is_array($resolutions)
                    ? __('Sorry, the item can\'t be returned')
                    : __('This item can be returned')
            ];
        }

        return $result;
    }
}
