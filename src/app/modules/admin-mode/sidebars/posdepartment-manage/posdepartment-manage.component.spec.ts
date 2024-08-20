import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PosdepartmentManageComponent } from './posdepartment-manage.component';

describe('PosdepartmentManageComponent', () => {
  let component: PosdepartmentManageComponent;
  let fixture: ComponentFixture<PosdepartmentManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PosdepartmentManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PosdepartmentManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
