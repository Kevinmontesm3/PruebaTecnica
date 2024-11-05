import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-filter-categories',
  templateUrl: './filter-categories.component.html',
  styleUrl: './filter-categories.component.scss'
})
export class FilterCategoriesComponent implements OnInit{

  @Input() categories: string[] = [];
  @Output() categorySelected = new EventEmitter<string>();

  selectedCategory: string | null = null;

  categories$?: Observable<string[]>;

  constructor(private productService: ProductsService){}

  ngOnInit(): void {
    this.categories$ = this.productService.getAllCategories().pipe(
      map(categories => ['all', ...categories])
    );
  }

  selectCategory(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedCategory = selectElement.value;;
    this.categorySelected.emit(this.selectedCategory);
  }

}
