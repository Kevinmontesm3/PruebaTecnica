import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { ProductComponent } from './product/product.component';
import { CartComponent } from './cart/cart.component';
import { FilterCategoriesComponent } from './filter-categories/filter-categories.component';
import { CapitalizePipe } from '../pipes/capitalize.pipe';


@NgModule({
  declarations: [
    HeaderComponent,
    ProductComponent,
    CartComponent,
    FilterCategoriesComponent,
    CapitalizePipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    HeaderComponent,
    ProductComponent,
    CartComponent,
    FilterCategoriesComponent,
    CapitalizePipe
  ]
})
export class ComponentsModule { }
