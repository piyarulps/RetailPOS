import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemPricingManageComponent } from './item-pricing-manage.component';

describe('ItemPricingManageComponent', () => {
  let component: ItemPricingManageComponent;
  let fixture: ComponentFixture<ItemPricingManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemPricingManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemPricingManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
