import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SizesManageComponent } from './sizes-manage.component';

describe('SizesManageComponent', () => {
  let component: SizesManageComponent;
  let fixture: ComponentFixture<SizesManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SizesManageComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SizesManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
