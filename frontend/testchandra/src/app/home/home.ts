import { Component, OnInit } from '@angular/core';
import { ProductsListing } from '../products-listing/products-listing';
import { Carousel } from 'primeng/carousel';
import {ButtonModule} from 'primeng/button';

@Component({
  selector: 'app-home',
  imports: [ProductsListing, Carousel, ButtonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit{
   responsiveOptions: any[] | undefined;

 ngOnInit() {
   this.responsiveOptions = [
            {
                breakpoint: '575px',
                numVisible: 1,
                numScroll: 1
            }
        ]

 } 

banners = [
    {
      title: 'Welcome Back',
      subtitle: 'Hello, lorem ipsum dolor sit amet',
      image: 'images/banner.jpg',
      status: 'Online'
    },
    {
      title: 'System Maintenance',
      subtitle: 'Scheduled at 12:00 AM',
      image: 'images/banner.jpg',
      status: 'Info'
    },
    {
      title: 'Limited Offer',
      subtitle: 'Get 50% discount today',
      image: 'images/banner.jpg',
      status: 'Offer'
    }
  ];


}
