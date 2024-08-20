import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PosdepartmentComponent } from './posdepartment.component';

describe('PosdepartmentComponent', () => {
  let component: PosdepartmentComponent;
  let fixture: ComponentFixture<PosdepartmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PosdepartmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PosdepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
