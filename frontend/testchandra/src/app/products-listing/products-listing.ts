import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../services/product-service';
import { CartCountService } from '../services/cart-count-service';
import {ButtonModule} from 'primeng/button';
import { Carousel } from 'primeng/carousel';
import { Router } from "@angular/router";


@Component({
  selector: 'app-products-listing',
  imports: [ButtonModule, Carousel],
  templateUrl: './products-listing.html',
  styleUrl: './products-listing.css',
})
export class ProductsListing implements OnInit {

  products: any[] = [];
  responsiveOptions: any[] | undefined;

  private productlist = inject(ProductService);
  private cartService = inject(CartCountService);
  private router = inject(Router);

  ngOnInit() {
    this.productlist.getProducts().subscribe((res: any) => {
      this.products = res.products;
    });

     this.responsiveOptions = [
            {
                breakpoint: '1400px',
                numVisible: 3,
                numScroll: 1,
            },
            {
                breakpoint: '1199px',
                numVisible: 3,
                numScroll: 1,
            },
            {
                breakpoint: '767px',
                numVisible: 2,
                numScroll: 1,
            },
            {
                breakpoint: '575px',
                numVisible: 1,
                numScroll: 1,
            },
        ];

  }

  //  getSeverity(status: string) {
  //       switch (status) {
  //           case 'INSTOCK':
  //               return 'success';
  //           case 'LOWSTOCK':
  //               return 'warn';
  //           case 'OUTOFSTOCK':
  //               return 'danger';
  //       }
  //   }

  single_product(product: any) {
this.router.navigate([`/product/${product._id}`]);
  }

  addtocart(product: any) {
    this.cartService.addtocart(product);
  }
}