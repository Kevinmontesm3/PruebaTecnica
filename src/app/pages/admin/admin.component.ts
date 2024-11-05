import { Component, OnInit } from '@angular/core';
import { ComponentsModule } from '../../components/components.module';
import { ProductsService } from '../../services/products.service';
import { Observable } from 'rxjs';
import { Product } from '../../models/product.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [ComponentsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  products$?: Observable<Product[]>;
  displayedProducts$?: Observable<Product[]>;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalProducts: number = 0;
  allProducts: Product[] = [];
  searchForm: FormGroup;

  constructor(
    private productsService: ProductsService,
    private router: Router,
    private fb: FormBuilder,
    public authService : AuthService
  ) {
    this.searchForm = this.fb.group({
      searchTerm: ['']
    });
  }

  ngOnInit(): void {
    this.getAllProducts();

    this.searchForm.get('searchTerm')?.valueChanges.subscribe(value => {
      this.filterProducts(value);
    });
  }

  getAllProducts(): void {
    this.products$ = this.productsService.getAllProducts();
    this.products$.subscribe(products => {
      this.allProducts = products;
      this.totalProducts = products.length;
      this.updateDisplayedProducts();
    });
  }

  createProduct(): void {
    this.router.navigate(['/add-product']);
  }

  filterProducts(term: string): void {
    const filteredProducts = this.allProducts.filter(product =>
      product.title.toLowerCase().includes(term.toLowerCase())
    );

    this.totalProducts = filteredProducts.length;
    this.currentPage = 1;
    this.updateDisplayedProducts(filteredProducts);
  }

  updateDisplayedProducts(products: Product[] = this.allProducts): void {
    this.displayedProducts$ = new Observable<Product[]>(observer => {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      const pageProducts = products.slice(startIndex, endIndex);
      observer.next(pageProducts);
      observer.complete();
    });
  }

  deleteProduct(productId: number): void {
    const hasPermission = true; // Cambia esto a la lógica real de permisos

    if (hasPermission) {
      this.productsService.deleteProduct(productId).subscribe({
        next: () => {
          console.log(`Producto con ID ${productId} eliminado.`);
          this.getAllProducts();
        },
        error: (err) => {
          console.error('Error al eliminar el producto:', err);
        }
      });
    } else {
      console.error('No tienes permiso para eliminar productos.');
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedProducts();
    }
  }

  nextPage(): void {
    if (this.currentPage < Math.ceil(this.totalProducts / this.itemsPerPage)) {
      this.currentPage++;
      this.updateDisplayedProducts();
    }
  }

  get totalPages(): number {
    return Math.ceil(this.totalProducts / this.itemsPerPage);
  }
}
