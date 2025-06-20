import { Component, OnInit } from '@angular/core';
import { CustomerService, Customer } from '../customer.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-form.html',
  styleUrl: './customer-form.scss'
})
export class CustomerForm implements OnInit {
  customer: Customer = {
    first_name: '',
    last_name: '',
    email: '',
    contact_number: ''
  };
  isEdit = false;
  loading = false;
  error = '';
  success = '';

  constructor(
    private customerService: CustomerService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.loading = true;
      this.customerService.getCustomer(+id).subscribe({
        next: (data) => {
          this.customer = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = this.extractError(err);
          this.loading = false;
        }
      });
    }
  }

  onSubmit() {
    // Clear previous messages
    this.error = '';
    this.success = '';
    
    // Validate required fields
    if (!this.customer.first_name?.trim()) {
      this.error = 'First name is required';
      return;
    }
    if (!this.customer.last_name?.trim()) {
      this.error = 'Last name is required';
      return;
    }
    if (!this.customer.email?.trim()) {
      this.error = 'Email is required';
      return;
    }
    if (!this.customer.contact_number?.trim()) {
      this.error = 'Contact number is required';
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.customer.email)) {
      this.error = 'Please enter a valid email address';
      return;
    }

    this.loading = true;
    if (this.isEdit && this.customer.id) {
      this.customerService.updateCustomer(this.customer.id, this.customer).subscribe({
        next: () => {
          this.success = 'Customer updated successfully!';
          this.loading = false;
          setTimeout(() => this.router.navigate(['/customers']), 1000);
        },
        error: (err) => {
          this.error = this.extractError(err);
          this.loading = false;
        }
      });
    } else {
      this.customerService.createCustomer(this.customer).subscribe({
        next: () => {
          this.success = 'Customer created successfully!';
          this.loading = false;
          setTimeout(() => this.router.navigate(['/customers']), 1000);
        },
        error: (err) => {
          this.error = this.extractError(err);
          this.loading = false;
        }
      });
    }
  }

  extractError(err: any): string {
    console.error('API Error:', err);
    
    if (err.status === 0 || err.status === 502 || err.status === 504) {
      return 'Unable to connect to the server. Please check your connection or try again later.';
    }
    
    if (err.status === 422 && err.error && err.error.errors) {
      // Handle Laravel validation errors
      const validationErrors = err.error.errors;
      const messages = Object.keys(validationErrors)
        .map(key => validationErrors[key].join(' '))
        .join(' ');
      return messages || 'Validation failed. Please check your input.';
    }
    
    if (err.error && err.error.message) {
      return err.error.message;
    }
    
    return 'An unknown error occurred while processing your request.';
  }

  onCancel() {
    this.router.navigate(['/customers']);
  }
}
