import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessunitManageComponent } from './businessunit-manage.component';

describe('BusinessunitManageComponent', () => {
  let component: BusinessunitManageComponent;
  let fixture: ComponentFixture<BusinessunitManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessunitManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessunitManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
