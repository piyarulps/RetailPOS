import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationPartyAddEditComponent } from './operation-party-add-edit.component';

describe('OperationPartyAddEditComponent', () => {
  let component: OperationPartyAddEditComponent;
  let fixture: ComponentFixture<OperationPartyAddEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationPartyAddEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationPartyAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
