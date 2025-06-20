<?php

namespace App\Services;

use App\Models\Customer;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ElasticsearchService
{
    private string $host;
    private int $port;
    private string $index = 'customers';

    public function __construct()
    {
        $this->host = env('ELASTICSEARCH_HOST', 'localhost');
        $this->port = (int) env('ELASTICSEARCH_PORT', 9200);
    }

    /**
     * Get the base URL for Elasticsearch
     */
    private function getBaseUrl(): string
    {
        return "http://{$this->host}:{$this->port}";
    }

    /**
     * Create or update a customer document in Elasticsearch
     */
    public function indexCustomer(Customer $customer): bool
    {
        try {
            $response = Http::put(
                "{$this->getBaseUrl()}/{$this->index}/_doc/{$customer->id}",
                [
                    'id' => $customer->id,
                    'first_name' => $customer->first_name,
                    'last_name' => $customer->last_name,
                    'email' => $customer->email,
                    'contact_number' => $customer->contact_number,
                    'created_at' => $customer->created_at,
                    'updated_at' => $customer->updated_at,
                ]
            );

            return $response->successful();
        } catch (\Exception $e) {
            Log::error('Failed to index customer in Elasticsearch', [
                'customer_id' => $customer->id,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }

    /**
     * Delete a customer document from Elasticsearch
     */
    public function deleteCustomer(int $customerId): bool
    {
        try {
            $response = Http::delete("{$this->getBaseUrl()}/{$this->index}/_doc/{$customerId}");
            return $response->successful();
        } catch (\Exception $e) {
            Log::error('Failed to delete customer from Elasticsearch', [
                'customer_id' => $customerId,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }

    /**
     * Search for customers in Elasticsearch
     */
    public function searchCustomers(string $query): array
    {
        try {
            $response = Http::post("{$this->getBaseUrl()}/{$this->index}/_search", [
                'query' => [
                    'multi_match' => [
                        'query' => $query,
                        'fields' => ['first_name', 'last_name', 'email'],
                        'fuzziness' => 'AUTO'
                    ]
                ],
                'sort' => [
                    ['_score' => ['order' => 'desc']],
                    ['created_at' => ['order' => 'desc']]
                ]
            ]);

            if ($response->successful()) {
                $result = $response->json();
                return array_map(function ($hit) {
                    return $hit['_source'];
                }, $result['hits']['hits']);
            }

            return [];
        } catch (\Exception $e) {
            Log::error('Failed to search customers in Elasticsearch', [
                'query' => $query,
                'error' => $e->getMessage()
            ]);
            return [];
        }
    }

    /**
     * Initialize the Elasticsearch index with proper mappings
     */
    public function createIndex(): bool
    {
        try {
            // Check if index exists
            $indexExists = Http::head("{$this->getBaseUrl()}/{$this->index}")->successful();
            
            if (!$indexExists) {
                $response = Http::put("{$this->getBaseUrl()}/{$this->index}", [
                    'mappings' => [
                        'properties' => [
                            'id' => ['type' => 'integer'],
                            'first_name' => [
                                'type' => 'text',
                                'analyzer' => 'standard',
                                'fields' => [
                                    'keyword' => ['type' => 'keyword']
                                ]
                            ],
                            'last_name' => [
                                'type' => 'text',
                                'analyzer' => 'standard',
                                'fields' => [
                                    'keyword' => ['type' => 'keyword']
                                ]
                            ],
                            'email' => [
                                'type' => 'text',
                                'analyzer' => 'standard',
                                'fields' => [
                                    'keyword' => ['type' => 'keyword']
                                ]
                            ],
                            'contact_number' => ['type' => 'keyword'],
                            'created_at' => ['type' => 'date'],
                            'updated_at' => ['type' => 'date']
                        ]
                    ]
                ]);

                return $response->successful();
            }

            return true;
        } catch (\Exception $e) {
            Log::error('Failed to create Elasticsearch index', [
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }
} 