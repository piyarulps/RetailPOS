import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellingruleManageComponent } from './sellingrule-manage.component';

describe('SellingruleManageComponent', () => {
  let component: SellingruleManageComponent;
  let fixture: ComponentFixture<SellingruleManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellingruleManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellingruleManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
