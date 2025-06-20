import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { HeaderComponent } from './core/components/header/header';
import { FooterComponent } from './core/components/footer/footer';



@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    SharedModule,
    CommonModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent
  ]
})
export class CoreModule { }
