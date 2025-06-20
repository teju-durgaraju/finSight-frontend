import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideIconComponent } from './components/lucide-icon/lucide-icon.component';
// Import all icons you intend to use with LucideAngularModule.pick() or make available globally
import { LucideAngularModule, Home, Settings, DollarSign, LogIn, LogOut, User, List, Edit, Trash2, BarChart2, PieChart, Target, PlusCircle, Activity } from 'lucide-angular';

@NgModule({
  declarations: [
    LucideIconComponent
  ],
  imports: [
    CommonModule,
    // It's generally recommended to use .pick() only once, ideally in the root (AppModule or app.config.ts for standalone).
    // If icons are provided globally via app.config.ts with provideLucideIcons,
    // then SharedModule only needs to import LucideAngularModule if its components use the <lucide-icon> tag.
    // And export LucideAngularModule if other modules that import SharedModule want to use <lucide-icon>.
    // For this setup, let's assume app.config.ts handles global icon provision.
    // SharedModule will import LucideAngularModule to enable <lucide-icon> in its template (LucideIconComponent's template)
    // and export it for other modules.
    LucideAngularModule
  ],
  exports: [
    LucideIconComponent,
    LucideAngularModule // Exporting this allows other modules importing SharedModule to use <lucide-icon>
  ]
})
export class SharedModule { }
