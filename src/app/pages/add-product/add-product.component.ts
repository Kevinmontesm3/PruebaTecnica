import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ComponentsModule } from '../../components/components.module';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [ComponentsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {

  productForm: FormGroup = new FormGroup({});
  categories$?: Observable<string[]>;
  imagePreviewUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductsService
  ) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      title: ['', Validators.required],
      manufactureDate: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
      category: ['', Validators.required],
      image: [null, Validators.required],
    });
    this.categories$ = this.productService.getAllCategories();
  }

  onSubmit() {
    if (this.productForm.valid) {
      const newProduct: Product = {
        id: 21,
        title: this.productForm.value.title,
        price: this.productForm.value.price,
        description: this.productForm.value.description,
        category: this.productForm.value.category,
        image: 'www./img/2',
        rating: { rate: 0, count: 0 },
        quantity: this.productForm.value.quantity,
        date: this.productForm.value.manufactureDate,
      };

      this.productService.addProduct(newProduct).subscribe({
        next: (response) => {
          console.log('Producto creado:', response);
        },
        error: (err) => {
          console.error('Error al crear el producto:', err);
        }
      });
    } else {
      this.productForm.markAllAsTouched();
    }
  }


  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.productForm.patchValue({ image: file });

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
}
