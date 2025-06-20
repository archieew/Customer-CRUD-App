<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $esHost = env('ES_HOST', 'http://searcher:9200');
        $index = 'customers';

        $search = $request->input('search');
        $query = [
            'query' => [
                'multi_match' => [
                    'query' => $search ?: '',
                    'fields' => ['first_name', 'last_name', 'email', 'contact_number'],
                    'fuzziness' => 'AUTO'
                ]
            ]
        ];

        // If no search term, use match_all
        if (!$search) {
            $query = [
                'query' => [
                    'match_all' => (object)[]
                ]
            ];
        }

        try {
            $response = Http::get("$esHost/$index/_search", $query);

            if ($response->failed()) {
                // Fallback to database if Elasticsearch fails
                return response()->json(Customer::all());
            }

            $hits = $response->json('hits.hits') ?? [];
            $customers = array_map(function ($hit) {
                return $hit['_source'];
            }, $hits);

            return response()->json($customers);
        } catch (\Exception $e) {
            // Fallback to database if Elasticsearch is not available
            return response()->json(Customer::all());
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:customers,email',
            'contact_number' => 'required|string|max:255',
        ]);
        $customer = Customer::create($validated);
        $this->syncToElasticsearch($customer);
        return response()->json($customer, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Customer $customer)
    {
        return response()->json($customer);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Customer $customer)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Customer $customer)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:customers,email,' . $customer->id,
            'contact_number' => 'required|string|max:255',
        ]);
        $customer->update($validated);
        $this->syncToElasticsearch($customer);
        return response()->json($customer);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Customer $customer)
    {
        $customer->delete();
        $this->deleteFromElasticsearch($customer->id);
        return response()->json(['message' => 'Customer deleted']);
    }

    private function syncToElasticsearch(Customer $customer)
    {
        $esHost = env('ES_HOST', 'http://searcher:9200');
        $index = 'customers';
        try {
            Http::put("$esHost/$index/_doc/{$customer->id}", $customer->toArray());
        } catch (\Exception $e) {
            // Optionally log error
        }
    }

    private function deleteFromElasticsearch($customerId)
    {
        $esHost = env('ES_HOST', 'http://searcher:9200');
        $index = 'customers';
        try {
            Http::delete("$esHost/$index/_doc/$customerId");
        } catch (\Exception $e) {
            // Optionally log error
        }
    }
}
