import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUnitOfMeasurementTypeComponent } from './add-unit-of-measurement-type.component';

describe('AddUnitOfMeasurementTypeComponent', () => {
  let component: AddUnitOfMeasurementTypeComponent;
  let fixture: ComponentFixture<AddUnitOfMeasurementTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUnitOfMeasurementTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUnitOfMeasurementTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
