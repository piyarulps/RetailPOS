import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationtypeAddEditComponent } from './locationtype-add-edit.component';

describe('LocationtypeAddEditComponent', () => {
  let component: LocationtypeAddEditComponent;
  let fixture: ComponentFixture<LocationtypeAddEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationtypeAddEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationtypeAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
