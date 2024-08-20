import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessGroupAddEditComponent } from './business-group-add-edit.component';

describe('BusinessGroupAddEditComponent', () => {
  let component: BusinessGroupAddEditComponent;
  let fixture: ComponentFixture<BusinessGroupAddEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessGroupAddEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessGroupAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
