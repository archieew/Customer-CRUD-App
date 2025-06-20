import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CustomerService, Customer } from '../customer.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-list.html',
  styleUrl: './customer-list.scss'
})
export class CustomerList implements OnInit {
  customers: Customer[] = [];
  search = '';
  loading = false;
  error = '';
  toastMessage = '';
  showToast = false;
  toastType: 'success' | 'danger' = 'success';
  showDeleteModal = false;
  customerToDelete?: Customer;

  constructor(private customerService: CustomerService, private router: Router) {}

  ngOnInit() {
    this.loadCustomers();
  }

  loadCustomers() {
    this.loading = true;
    this.customerService.getCustomers(this.search).subscribe({
      next: (data) => {
        this.customers = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load customers';
        this.loading = false;
      }
    });
  }

  onSearch() {
    this.loadCustomers();
  }

  onEdit(customer: Customer) {
    this.router.navigate(['/customers', customer.id, 'edit']);
  }

  onView(customer: Customer) {
    this.router.navigate(['/customers', customer.id]);
  }

  onDelete(customer: Customer) {
    this.customerToDelete = customer;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    if (this.customerToDelete) {
      this.customerService.deleteCustomer(this.customerToDelete.id!).subscribe({
        next: () => {
          this.showDeleteModal = false;
          this.showToastMessage('Customer deleted successfully!', 'success');
          this.loadCustomers();
        },
        error: () => {
          this.showDeleteModal = false;
          this.showToastMessage('Failed to delete customer.', 'danger');
        }
      });
    }
  }

  cancelDelete() {
    this.showDeleteModal = false;
    this.customerToDelete = undefined;
  }

  showToastMessage(message: string, type: 'success' | 'danger') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  onCreate() {
    this.router.navigate(['/customers/new']);
  }
}
