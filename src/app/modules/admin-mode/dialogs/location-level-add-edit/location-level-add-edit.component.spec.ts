import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationLevelAddEditComponent } from './location-level-add-edit.component';

describe('LocationLevelAddEditComponent', () => {
  let component: LocationLevelAddEditComponent;
  let fixture: ComponentFixture<LocationLevelAddEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationLevelAddEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationLevelAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
