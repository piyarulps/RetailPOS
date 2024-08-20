import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemMerchandisingManageComponent } from './item-merchandising-manage.component';

describe('ItemMerchandisingManageComponent', () => {
  let component: ItemMerchandisingManageComponent;
  let fixture: ComponentFixture<ItemMerchandisingManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemMerchandisingManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemMerchandisingManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
