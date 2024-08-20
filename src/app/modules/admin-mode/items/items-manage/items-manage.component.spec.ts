import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsManageComponent } from './items-manage.component';

describe('ItemsManageComponent', () => {
  let component: ItemsManageComponent;
  let fixture: ComponentFixture<ItemsManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemsManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemsManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
