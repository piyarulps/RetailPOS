import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemSupplierManageComponent } from './item-supplier-manage.component';

describe('ItemSupplierManageComponent', () => {
  let component: ItemSupplierManageComponent;
  let fixture: ComponentFixture<ItemSupplierManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemSupplierManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemSupplierManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
