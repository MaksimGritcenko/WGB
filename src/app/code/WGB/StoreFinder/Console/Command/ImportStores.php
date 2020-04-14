<?php

namespace WGB\StoreFinder\Console\Command;

use Magento\Framework\Console\Cli;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use WGB\StoreFinder\Model\Import\StoreFinderImport;

/**
 * Class ImportStores
 *
 * @package WGB\StoreFinder\Console\Command
 */
class ImportStores extends Command
{
    /**
     * CLI parameter key
     */
    const INPUT_KEY_CITY = 'cities';
    const INPUT_KEY_STORE = 'stores';

    /**
     * Point of service import
     *
     * @var StoreFinderImport
     */
    protected $storeFinderImport;

    /**
     * @param Basestore $baseImport
     * @param StoreFinderImport $storeFinderImport
     */
    public function __construct(
        StoreFinderImport $storeFinderImport
    ) {
        parent::__construct();

        $this->storeFinderImport = $storeFinderImport;
    }

    /**
     * @inheritdoc
     */
    protected function configure()
    {
        $this->setName('WGB:import:storefinder')
            ->setDescription('Import Store Finder stores from a CSV file')
            ->setDefinition($this->getInputList());

        parent::configure();
    }

    /**
     * @inheritdoc
     */
    public function getInputList()
    {
        return [
            new InputArgument(
                self::INPUT_KEY_CITY,
                InputArgument::REQUIRED,
                'path to city information (basestore.csv)'
            ),
            new InputArgument(
                self::INPUT_KEY_STORE,
                InputArgument::REQUIRED,
                'path to store information (pointofservice.csv)'
            ),
        ];
    }

    /**
     * @inheritdoc
     */
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $city = $input->getArgument(self::INPUT_KEY_CITY);
        $store = $input->getArgument(self::INPUT_KEY_STORE);

        $this->storeFinderImport->import($city, $store);

        return Cli::RETURN_SUCCESS;
    }
}
