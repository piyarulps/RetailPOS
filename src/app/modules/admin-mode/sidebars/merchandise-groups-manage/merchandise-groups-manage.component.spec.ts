import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchandiseGroupsManageComponent } from './merchandise-groups-manage.component';

describe('MerchandiseGroupsManageComponent', () => {
  let component: MerchandiseGroupsManageComponent;
  let fixture: ComponentFixture<MerchandiseGroupsManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MerchandiseGroupsManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchandiseGroupsManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
