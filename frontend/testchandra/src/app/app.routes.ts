import { Routes } from '@angular/router';

export const routes: Routes = [{
    path: 'login',
 loadComponent: () => {
    return import('./login/login').then((m) => m.Login );
 }
},
{
    path: 'signup',
    loadComponent: () => {
        return import('./signup/signup').then((m) => m.Signup);
    }
},
{
    path: '',
    pathMatch: 'full',
    loadComponent: () => {
        return import('./home/home').then((m) => m.Home);
    }
},
{
    path: 'products',
    loadComponent: () => {
        return import('./products-listing/products-listing').then((m) => m.ProductsListing);
    }
},
{
    path: 'cart',
    loadComponent: () => {
        return import('./cart/cart').then((m) => m.Cart);
    }
},
{
    path: 'checkout',
    loadComponent: () => {
        return import('./checkout/checkout').then((m) => m.Checkout);
    }
},
{
    path: 'order-success/:id',
    loadComponent: () => {
        return import('./order-success/order-success').then((m) => m.OrderSuccess);
    }
},
{
    path: 'product/:id',
    loadComponent: () => {
        return import('./single-product/single-product').then((m) => m.SingleProduct);
    }
}
];
