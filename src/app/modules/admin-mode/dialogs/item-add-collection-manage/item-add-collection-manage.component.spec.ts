import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemAddCollectionManageComponent } from './item-add-collection-manage.component';

describe('ItemAddCollectionManageComponent', () => {
  let component: ItemAddCollectionManageComponent;
  let fixture: ComponentFixture<ItemAddCollectionManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemAddCollectionManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemAddCollectionManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
