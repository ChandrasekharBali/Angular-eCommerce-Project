import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsListing } from './products-listing';

describe('ProductsListing', () => {
  let component: ProductsListing;
  let fixture: ComponentFixture<ProductsListing>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsListing]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsListing);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
