<?php

namespace App\Observers;

use App\Models\Customer;
use App\Services\ElasticsearchService;

class CustomerObserver
{
    private ElasticsearchService $elasticsearchService;

    public function __construct(ElasticsearchService $elasticsearchService)
    {
        $this->elasticsearchService = $elasticsearchService;
    }

    /**
     * Handle the Customer "created" event.
     */
    public function created(Customer $customer): void
    {
        $this->elasticsearchService->indexCustomer($customer);
    }

    /**
     * Handle the Customer "updated" event.
     */
    public function updated(Customer $customer): void
    {
        $this->elasticsearchService->indexCustomer($customer);
    }

    /**
     * Handle the Customer "deleted" event.
     */
    public function deleted(Customer $customer): void
    {
        $this->elasticsearchService->deleteCustomer($customer->id);
    }
} 