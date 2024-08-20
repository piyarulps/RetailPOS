import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationManageComponent } from './location-manage.component';

describe('LocationManageComponent', () => {
  let component: LocationManageComponent;
  let fixture: ComponentFixture<LocationManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
