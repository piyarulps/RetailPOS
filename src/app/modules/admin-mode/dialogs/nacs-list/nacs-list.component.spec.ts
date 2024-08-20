import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NacsListComponent } from './nacs-list.component';

describe('NacsListComponent', () => {
  let component: NacsListComponent;
  let fixture: ComponentFixture<NacsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NacsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NacsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
