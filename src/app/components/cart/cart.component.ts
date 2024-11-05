import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems: Product[] = [];
  total = 0;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
      this.total = this.cartService.getCartTotal();
    });
  }

  increaseQuantity(product: Product) {
    this.cartService.addToCart(product);
  }

  decreaseQuantity(product: Product) {
    this.cartService.decreaseQuantity(product.id);
  }

  removeProduct(product: Product) {
    this.cartService.removeProduct(product.id);
  }

  getTotalQuantity(): number {
    return this.cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
  }

  clearCart() {
    this.cartService.clearCart();
  }
}
