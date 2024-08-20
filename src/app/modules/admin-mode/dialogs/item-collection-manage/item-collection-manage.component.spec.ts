import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemCollectionManageComponent } from './item-collection-manage.component';

describe('ItemCollectionManageComponent', () => {
  let component: ItemCollectionManageComponent;
  let fixture: ComponentFixture<ItemCollectionManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemCollectionManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemCollectionManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
