<?php

/**
 * A Magento 2 module named Wgb/RmaGraphQL
 * Copyright (C) 2020
 *
 * This file included in Wgb/RmaGraphQL is licensed under OSL 3.0
 *
 * http://opensource.org/licenses/osl-3.0.php  Open Software License (OSL 3.0)
 * Please see LICENSE.txt for the full text of the OSL 3.0 license
 */

namespace WGB\RmaGraphQL\Model\Request\ResourceModel;

use Amasty\Rma\Model\Request;

/**
 * Class ShippingLabelData
 *
 * @package Wgb\RmaGraphQL\Model\Resolver
 */
class ShippingLabelData
{
    /**
     * @var Request\Repository
     */
    private $requestRepository;

    public function __construct(
        Request\Repository $requestRepository
    ) {
        $this->requestRepository = $requestRepository;
    }

    public function getById($id)
    {
        $request = $this->requestRepository->getById($id);

        $issetfile = $request->getShippingLabel();
        if (isset($issetfile)) {
            $file = $request->getShippingLabel();
        } else {
            $file= " ";
        }

        return [
            'file' => $file,
        ];
    }
}
