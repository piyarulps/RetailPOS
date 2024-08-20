import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteTypeAddEditComponent } from './site-type-add-edit.component';

describe('SiteTypeAddEditComponent', () => {
  let component: SiteTypeAddEditComponent;
  let fixture: ComponentFixture<SiteTypeAddEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteTypeAddEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteTypeAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
