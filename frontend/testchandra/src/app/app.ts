import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './header/header';
import { PrimeNG } from 'primeng/config';
import { PrimeIcons } from 'primeng/api';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private primeng = inject(PrimeNG);

  ngOnInit() {
    this.primeng.ripple.set(true);
  }


}
