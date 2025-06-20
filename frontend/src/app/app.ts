import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container-fluid">
        <a class="navbar-brand" [routerLink]="['/customers']">Customer CRUD App</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <a class="nav-link" [routerLink]="['/customers']" routerLinkActive="active">Customers</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" [routerLink]="['/customers/new']" routerLinkActive="active">Add Customer</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <main class="container mt-4">
      <router-outlet></router-outlet>
    </main>
  `,
  styleUrl: './app.scss'
})
export class App {
  protected title = 'frontend';
}
