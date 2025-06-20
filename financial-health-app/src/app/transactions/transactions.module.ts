import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; // For TransactionFormComponent

import { TransactionsRoutingModule } from './transactions-routing.module';
import { SharedModule } from '../../shared/shared.module'; // For shared components, pipes, directives

// Components to be declared
import { TransactionListComponent } from './components/transaction-list/transaction-list.component';
import { TransactionFormComponent } from './components/transaction-form/transaction-form.component';

@NgModule({
  declarations: [
    TransactionListComponent,
    TransactionFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,      // Needed for TransactionFormComponent
    TransactionsRoutingModule,  // The module's own routing
    SharedModule              // For app-lucide-icon, filter-bar, pagination etc.
  ]
  // No exports needed if components are only routed to within this module.
})
export class TransactionsModule { }
