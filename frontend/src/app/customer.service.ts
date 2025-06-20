import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Customer {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  contact_number: string;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = 'http://localhost/api/customers';

  constructor(private http: HttpClient) {}

  getCustomers(search: string = ''): Observable<Customer[]> {
    const url = search ? `${this.apiUrl}?search=${encodeURIComponent(search)}` : this.apiUrl;
    return this.http.get<Customer[]>(url);
  }

  getCustomer(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/${id}`);
  }

  createCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(this.apiUrl, customer);
  }

  updateCustomer(id: number, customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${this.apiUrl}/${id}`, customer);
  }

  deleteCustomer(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
} 