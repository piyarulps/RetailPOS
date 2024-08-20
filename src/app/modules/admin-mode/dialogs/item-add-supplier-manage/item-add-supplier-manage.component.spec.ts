import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemAddSupplierManageComponent } from './item-add-supplier-manage.component';

describe('ItemAddSupplierManageComponent', () => {
  let component: ItemAddSupplierManageComponent;
  let fixture: ComponentFixture<ItemAddSupplierManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemAddSupplierManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemAddSupplierManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
