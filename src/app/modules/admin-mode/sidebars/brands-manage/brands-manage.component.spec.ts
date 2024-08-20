import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandsManageComponent } from './brands-manage.component';

describe('BrandsManageComponent', () => {
  let component: BrandsManageComponent;
  let fixture: ComponentFixture<BrandsManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrandsManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandsManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
