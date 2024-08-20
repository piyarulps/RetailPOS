import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObEntryComponent } from './ob-entry.component';

describe('ObEntryComponent', () => {
  let component: ObEntryComponent;
  let fixture: ComponentFixture<ObEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
