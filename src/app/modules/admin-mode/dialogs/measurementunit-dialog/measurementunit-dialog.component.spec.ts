import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeasurementunitDialogComponent } from './measurementunit-dialog.component';

describe('MeasurementunitDialogComponent', () => {
  let component: MeasurementunitDialogComponent;
  let fixture: ComponentFixture<MeasurementunitDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeasurementunitDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeasurementunitDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
