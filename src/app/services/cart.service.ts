import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems: Product[] = [];
  private cartSubject = new BehaviorSubject<Product[]>([]);
  cart$ = this.cartSubject.asObservable();

  constructor() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
      this.cartSubject.next(this.cartItems);
    }
  }

  private updateLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  addToCart(product: Product) {
    const existingProduct = this.cartItems.find(item => item.id === product.id);
    if (existingProduct) {
      existingProduct.quantity! += 1;
    } else {
      this.cartItems.push({ ...product, quantity: 1 });
    }
    this.cartSubject.next(this.cartItems);
    this.updateLocalStorage();
  }

  decreaseQuantity(productId: number) {
    const product = this.cartItems.find(item => item.id === productId);
    if (product) {
      product.quantity!--;
      if (product.quantity === 0) {
        this.removeProduct(productId);
      } else {
        this.cartSubject.next(this.cartItems);
        this.updateLocalStorage();
      }
    }
  }

  removeProduct(productId: number) {
    this.cartItems = this.cartItems.filter(item => item.id !== productId);
    this.cartSubject.next(this.cartItems);
    this.updateLocalStorage();
  }

  clearCart() {
    this.cartItems = [];
    this.cartSubject.next(this.cartItems);
    this.updateLocalStorage();
  }

  getCartTotal() {
    return this.cartItems.reduce((total, item) => total + item.price * (item.quantity || 1), 0);
  }
}
