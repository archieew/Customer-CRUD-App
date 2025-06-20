import { Component, OnInit } from '@angular/core';
import { CustomerService, Customer } from '../customer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-view.html',
  styleUrl: './customer-view.scss'
})
export class CustomerView implements OnInit {
  customer?: Customer;
  loading = false;
  error = '';

  constructor(
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loading = true;
      this.customerService.getCustomer(+id).subscribe({
        next: (data) => {
          this.customer = data;
          this.loading = false;
        },
        error: () => {
          this.error = 'Failed to load customer.';
          this.loading = false;
        }
      });
    }
  }

  onBack() {
    this.router.navigate(['/customers']);
  }

  onEdit() {
    if (this.customer && this.customer.id) {
      this.router.navigate(['/customers', this.customer.id, 'edit']);
    }
  }
} 