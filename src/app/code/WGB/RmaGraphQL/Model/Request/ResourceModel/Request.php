<?php

namespace WGB\RmaGraphQL\Model\Request\ResourceModel;

use Amasty\Rma\Api\Data\RequestInterface;
use Amasty\Rma\Model\Request\ResourceModel\RequestItem;
use Magento\Framework\DB\Select;

class Request extends \Amasty\Rma\Model\Request\ResourceModel\Request {
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
                'request.status',
                'request_qty' => 'sum(items.request_qty)'
            ])
            ->where('request.'.RequestInterface::CUSTOMER_ID.' = '.$userId)
            ->joinInner(
                ['items' => $this->getTable(RequestItem::TABLE_NAME)],
                'request.request_id = items.request_id',
                []
            )
            ->group('request.request_id');

        $result = [];
        if ($rows = $this->getConnection()->fetchAll($select)) {
            foreach ($rows as $row) {
                $result[] = $row;
            }
        }

        return $result;
    }
}