import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'; // Import NgbModule

// Lucide Icons - already configured from previous step
import { LucideAngularModule, Home, Settings, DollarSign, LogIn, LogOut, User, UserPlus, List, Edit, Edit2, Trash2, BarChart2, PieChart, Target, PlusCircle, Save, Activity, Filter, ChevronDown, ChevronUp, Calendar, ArrowUpCircle, ArrowDownCircle, Zap, Settings2, RotateCw, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, X, Flag, CheckCircle2, Check } from 'lucide-angular'; // Added Check icon

// Components
import { LucideIconComponent } from './components/lucide-icon/lucide-icon.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { FilterBarComponent } from './components/filter-bar/filter-bar.component';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component'; // New

// Directives placeholder (no actual directives generated yet)
// import { ExampleDirective } from './directives/example.directive';

// Pipes placeholder (no actual pipes generated yet)
// import { ExamplePipe } from './pipes/example.pipe';

@NgModule({
  declarations: [
    LucideIconComponent,
    LoadingSpinnerComponent,
    PaginationComponent,
    FilterBarComponent,
    ConfirmationModalComponent, // Declare
    // ExampleDirective,
    // ExamplePipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule, // Add NgbModule to imports
    LucideAngularModule.pick({ // Ensure all icons used by shared or exported components are here
        Home, Settings, DollarSign, LogIn, LogOut, User, UserPlus, List, Edit, Edit2, Trash2, BarChart2, PieChart, Target, PlusCircle, Save, Activity, Filter, ChevronDown, ChevronUp, Calendar, ArrowUpCircle, ArrowDownCircle, Zap, Settings2, RotateCw, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, X, Flag, CheckCircle2, Check
    })
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule, // Re-export NgbModule
    LucideIconComponent,
    LoadingSpinnerComponent,
    PaginationComponent,
    FilterBarComponent,
    ConfirmationModalComponent, // Export
    LucideAngularModule, // Also export LucideAngularModule if other modules need to use <lucide-icon> directly
    // ExampleDirective,
    // ExamplePipe
  ]
})
export class SharedModule { }
