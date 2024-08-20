import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemGroupsManageComponent } from './item-groups-manage.component';

describe('ItemGroupsManageComponent', () => {
  let component: ItemGroupsManageComponent;
  let fixture: ComponentFixture<ItemGroupsManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemGroupsManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemGroupsManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
