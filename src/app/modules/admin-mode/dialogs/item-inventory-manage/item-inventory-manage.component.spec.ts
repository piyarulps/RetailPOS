import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemInventoryManageComponent } from './item-inventory-manage.component';

describe('ItemInventoryManageComponent', () => {
  let component: ItemInventoryManageComponent;
  let fixture: ComponentFixture<ItemInventoryManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemInventoryManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemInventoryManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
