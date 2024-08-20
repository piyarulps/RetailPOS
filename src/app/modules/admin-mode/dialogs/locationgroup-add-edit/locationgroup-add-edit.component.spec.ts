import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationgroupAddEditComponent } from './locationgroup-add-edit.component';

describe('LocationgroupAddEditComponent', () => {
  let component: LocationgroupAddEditComponent;
  let fixture: ComponentFixture<LocationgroupAddEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationgroupAddEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationgroupAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
