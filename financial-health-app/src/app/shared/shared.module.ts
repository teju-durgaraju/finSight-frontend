import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Added FormsModule, ReactiveFormsModule

// Lucide Icons - already configured from previous step
import { LucideAngularModule, Home, Settings, DollarSign, LogIn, LogOut, User, UserPlus, List, Edit, Trash2, BarChart2, PieChart, Target, PlusCircle, Save, Activity, Filter, ChevronDown, ChevronUp, Calendar } from 'lucide-angular'; // Added UserPlus

// Components
import { LucideIconComponent } from './components/lucide-icon/lucide-icon.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { FilterBarComponent } from './components/filter-bar/filter-bar.component';

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
    // ExampleDirective,
    // ExamplePipe
  ],
  imports: [
    CommonModule,
    FormsModule, // For template-driven forms if used by shared components
    ReactiveFormsModule, // For reactive forms if used by shared components (e.g. FilterBar)
    LucideAngularModule.pick({ // Ensure all icons used by shared or exported components are here
        Home, Settings, DollarSign, LogIn, LogOut, User, UserPlus, List, Edit, Trash2, BarChart2, PieChart, Target, PlusCircle, Save, Activity, Filter, ChevronDown, ChevronUp, Calendar
    })
  ],
  exports: [
    CommonModule, // Export CommonModule for common directives like ngIf, ngFor
    FormsModule,
    ReactiveFormsModule,
    LucideIconComponent,
    LoadingSpinnerComponent,
    PaginationComponent,
    FilterBarComponent,
    LucideAngularModule, // Also export LucideAngularModule if other modules need to use <lucide-icon> directly
    // ExampleDirective,
    // ExamplePipe
  ]
})
export class SharedModule { }
