<?php
/**
 * @category  Netnutri
 * @package   Netnutri\SocialLogin
 * @author    Tornike Bakuradze <info@scandiweb.com>
 * @copyright Copyright (c) 2020 Scandiweb, Inc (https://scandiweb.com)
 * @license   http://opensource.org/licenses/OSL-3.0 The Open Software License 3.0 (OSL-3.0)
 */

namespace Netnutri\SocialLogin\Controller\Login;

use Exception;
use Magento\Framework\Exception\LocalizedException;
use Throwable;
use Hybrid_User_Profile;
use Magento\Framework\Exception\AlreadyExistsException;
use Magento\Framework\Exception\InputException;
use Magento\Customer\Api\AccountManagementInterface;
use Magento\Customer\Api\CustomerRepositoryInterface as MagentoCustomerRepositoryInterface;
use Magento\Customer\Api\Data\CustomerInterface;
use Magento\Framework\App\Action\Context;
use Magento\Customer\Model\Session as CustomerSession;
use Magento\Framework\Math\Random;
use Scandiweb\SocialLogin\Api\CustomerProviderRepositoryInterface;
use Magento\Framework\Exception\NoSuchEntityException;
use Scandiweb\SocialLogin\Api\CustomerRepositoryInterface;
use Scandiweb\SocialLogin\Api\Data\CustomerProviderInterface;
use Scandiweb\SocialLogin\HybridAuth\HybridAuth;
use Scandiweb\SocialLogin\Logger\Logger;
use Magento\Integration\Model\Oauth\TokenFactory as TokenModelFactory;
use Scandiweb\SocialLogin\Controller\Login\Index as SourceIndex;

/**
 * Class Index
 * Log user in using social media
 */
class Index extends SourceIndex
{
    /**
     * @var string
     */
    protected $provider;

    /**
     * @var HybridAuth
     */
    protected $hybridAuth;

    /**
     * @var CustomerRepositoryInterface
     */
    protected $customerRepository;

    /**
     * @var CustomerProviderRepositoryInterface
     */
    protected $customerProviderRepository;

    /**
     * @var MagentoCustomerRepositoryInterface
     */
    protected $magentoCustomerRepository;

    /**
     * @var CustomerSession
     */
    protected $customerSession;

    /**
     * @var AccountManagementInterface
     */
    protected $accountManagement;

    /**
     * @var CustomerInterface
     */
    protected $storeCustomer;

    /**
     * @var CustomerProviderInterface
     */
    protected $customerProvider;

    /**
     * @var Random
     */
    protected $mathRandom;

    /**
     * @var Logger
     */
    protected $logger;

    /**
     * @var TokenModelFactory
     */
    public $tokenModelFactory;

    /**
     *
     * @param Context                             $context
     * @param HybridAuth                          $hybridAuth
     * @param CustomerRepositoryInterface         $customerRepository
     * @param CustomerProviderRepositoryInterface $customerProviderRepository
     * @param MagentoCustomerRepositoryInterface  $magentoCustomerRepository
     * @param CustomerSession                     $customerSession
     * @param AccountManagementInterface          $accountManagement
     * @param CustomerInterface                   $customer
     * @param CustomerProviderInterface           $customerProvider
     * @param Random                              $mathRandom
     * @param Logger                              $logger
     * @param TokenModelFactory                   $tokenModelFactory
     */
    public function __construct(
        Context $context,
        HybridAuth $hybridAuth,
        CustomerRepositoryInterface $customerRepository,
        CustomerProviderRepositoryInterface $customerProviderRepository,
        MagentoCustomerRepositoryInterface $magentoCustomerRepository,
        CustomerSession $customerSession,
        AccountManagementInterface $accountManagement,
        CustomerInterface $customer,
        CustomerProviderInterface $customerProvider,
        Random $mathRandom,
        Logger $logger,
        TokenModelFactory $tokenModelFactory
    ) {
        $this->tokenModelFactory = $tokenModelFactory;

        parent::__construct(
            $context,
            $hybridAuth,
            $customerRepository,
            $customerProviderRepository,
            $magentoCustomerRepository,
            $customerSession,
            $accountManagement,
            $customer,
            $customerProvider,
            $mathRandom,
            $logger
        );
    }

    /**
     * Dispatch request
     */
    public function execute()
    {
        $this->provider = $this->getRequest()->getParam('provider');
        $redirect = '/';

        try {
            $id = $this->handleAuthentication()->getId();
            $token = $this->tokenModelFactory->create()->createCustomerToken($id)->getToken();
            $redirect = sprintf('my-account/dashboard?token=%s', $token);
        } catch (AlreadyExistsException $e) {
            $this->logger->addError($e->getMessage());
        } catch (InputException $e) {
            $this->logger->addError($e->getMessage());
        } catch (Throwable $e) {
            $this->logger->addError($e->getMessage());
        } catch (Exception $e) {
            $this->logger->addError($e->getMessage());
        }

        $this->_redirect($redirect);
    }

    private function handleAuthentication()
    {
        // Do not proceed if customer is already logged in
        if ($this->customerSession->isLoggedIn()) {
            return $this->customerSession;
        }

        $adapter = $this->hybridAuth->authenticate($this->provider);
        /** @var $user Hybrid_User_Profile */
        $user = $adapter->getUserProfile();
        $socialLoginCustomer = $this->customerRepository->getByProvider(
            $user->identifier,
            $this->provider
        );

        if ($socialLoginCustomer !== null) {
            $this->login($socialLoginCustomer->getId());

            return $socialLoginCustomer;
        } else {
            $allDataReceived = true;

            try {
                $this->storeCustomer = $this->magentoCustomerRepository->get($user->email);
            } catch (NoSuchEntityException $e) {
                $this->storeCustomer = $this->create($user);

                if (!$user->email || !$user->firstName || !$user->lastName) {
                    $allDataReceived = false;
                }
            }

            $this->customerProvider->setEntityId($this->storeCustomer->getId());
            $this->customerProvider->setUserId($user->identifier);
            $this->customerProvider->setProvider($this->provider);
            $this->customerProvider->setDataReceived($allDataReceived);

            $this->customerProviderRepository->save($this->customerProvider);
            $this->login($this->storeCustomer->getId());

            return $this->storeCustomer;
        }
    }

    /**
     * Authorization customer by id
     *
     * @param int $customerId
     */
    protected function login($customerId)
    {
        $this->customerSession->loginById($customerId);
        $this->customerSession->regenerateId();
    }

    /**
     * Create store customer by using data from provider
     *
     * @param Hybrid_User_Profile $user
     * @return CustomerInterface
     * @throws LocalizedException
     */
    protected function create(Hybrid_User_Profile $user)
    {
        if ($user->email) {
            $this->storeCustomer->setEmail($user->email);
        } else {
            $fakeEmail = $user->identifier . '@' . $this->provider . '.com';
            $this->storeCustomer->setEmail($fakeEmail);
        }

        if ($user->firstName) {
            $this->storeCustomer->setFirstname($user->firstName);
        } else {
            $this->storeCustomer->setFirstname('Firstname');
        }

        if ($user->lastName) {
            $this->storeCustomer->setLastname($user->lastName);
        } else {
            $this->storeCustomer->setLastname('Lastname');
        }

        return $this->accountManagement->createAccount($this->storeCustomer);
    }
}
