<?php

namespace WGB\RmaGraphQL\Model\Request\ResourceModel;

use Amasty\Rma\Api\Data\RequestInterface;
use Amasty\Rma\Model\OptionSource\State;
use Amasty\Rma\Model\Request\ResourceModel\RequestItem;
use Amasty\Rma\Model\Status\ResourceModel\Status;
use Amasty\Rma\Model\Status\Repository;
use Amasty\Rma\Model\Status\ResourceModel\StatusStore;
use Magento\Framework\DB\Select;
use Magento\Framework\Model\ResourceModel\Db\Context;

class Request extends \Amasty\Rma\Model\Request\ResourceModel\Request {
    /**
     * @var Repository
     */
    protected $statusRepository;
    /**
     * @var array
     */
    protected $states;

    public function __construct(
        Context $context,
        Repository $statusRepository,
        State $state,
        $connectionName = null
    )
    {
        parent::__construct($context, $connectionName);
        $this->statusRepository = $statusRepository;
        $this->states = $state->toArray();
    }

    protected function fetchAllFromSelect($select) {
        $result = [];
        if ($rows = $this->getConnection()->fetchAll($select)) {
            foreach ($rows as $row) {
                $result[] = $row;
            }
        }

        return $result;
    }

    /**
     * @param $orderId
     * @return array
     * @throws \Magento\Framework\Exception\LocalizedException
     */
    public function getRequestIdsForOrder($orderId) {
        $select = $this->getConnection()->select()->from(['request' => $this->getMainTable()])
            ->reset(Select::COLUMNS)
            ->columns([
                'request.request_id'
            ])
            ->where('request.'.RequestInterface::ORDER_ID.' = '.$orderId);

        return $this->fetchAllFromSelect($select);
    }

    /**
     * @param $userId
     * @return array
     * @throws \Magento\Framework\Exception\LocalizedException
     */
    public function getRequestsForUser($userId) {
        // TODO columns
        $select = $this->getConnection()->select()->from(['request' => $this->getMainTable()])
            ->reset(Select::COLUMNS)
            ->columns([
                'request.order_id',
                'request.request_id',
                'request.created_at',
                'status_id' => 'request.status',
                'request_qty' => 'sum(items.request_qty)'
            ])
            ->where('request.'.RequestInterface::CUSTOMER_ID.' = '.$userId)
            ->joinInner(
                ['items' => $this->getTable(RequestItem::TABLE_NAME)],
                'request.request_id = items.request_id'
            )
            ->joinInner(
                ['status_store' => $this->getTable(StatusStore::TABLE_NAME)],
                'request.status = status_store.status_id'
            )
            ->group('request.request_id');

        return array_map(
            // Retrieve state-related information from status and put that into status field
            function($line) {
                $state_id = $this->statusRepository->getById($line['status_id'])->getState();
                $state_label = $this->states[$state_id];
                $line['status'] = [
                    'state' => $state_id,
                    'state_label' => $state_label
                ];

                return $line;
            },
            $this->fetchAllFromSelect($select)
        );
    }
}