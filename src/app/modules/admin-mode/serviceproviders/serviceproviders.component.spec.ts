import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceprovidersComponent } from './serviceproviders.component';

describe('ServiceprovidersComponent', () => {
  let component: ServiceprovidersComponent;
  let fixture: ComponentFixture<ServiceprovidersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceprovidersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceprovidersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
