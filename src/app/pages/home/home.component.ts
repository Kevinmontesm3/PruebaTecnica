import { Component, HostListener, OnInit } from '@angular/core';
import { ComponentsModule } from '../../components/components.module';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../models/product.model';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ComponentsModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  products$?: Observable<Product[]>;
  isMobile: boolean = false;
  showCartModal: boolean = false;
  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
   this.getAllProducts()
   this.checkScreenSize();
  }

  @HostListener('window:resize', [])
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth <= 848;
  }

  toggleCartModal() {
    this.showCartModal = !this.showCartModal;
  }

  onCategorySelected(category: string) {
    if (category === 'all') {
     this.getAllProducts();
    } else {
      this.products$ = this.productsService.getProductsByCategory(category);
    }
  }

  getAllProducts():void {
    this.products$ = this.productsService.getAllProducts();
  }
}
