<?php

namespace WGB\RmaGraphQL\Model\Request\ResourceModel;

use Amasty\Rma\Api\Data\RequestInterface;
use Amasty\Rma\Model\Request\ResourceModel\RequestItem;
use Amasty\Rma\Model\Status\ResourceModel\Status;
use Amasty\Rma\Model\Status\ResourceModel\StatusStore;
use Magento\Framework\DB\Select;

class Request extends \Amasty\Rma\Model\Request\ResourceModel\Request {
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
                'status_label' => 'status_store.label',
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

        return $this->fetchAllFromSelect($select);
    }
}