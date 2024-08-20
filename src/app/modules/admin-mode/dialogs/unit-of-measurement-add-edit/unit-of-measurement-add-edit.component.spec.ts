import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitOfMeasurementAddEditComponent } from './unit-of-measurement-add-edit.component';

describe('UnitOfMeasurementAddEditComponent', () => {
  let component: UnitOfMeasurementAddEditComponent;
  let fixture: ComponentFixture<UnitOfMeasurementAddEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitOfMeasurementAddEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitOfMeasurementAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
