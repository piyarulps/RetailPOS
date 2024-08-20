import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellingruleModalComponent } from './sellingrule-modal.component';

describe('SellingruleModalComponent', () => {
  let component: SellingruleModalComponent;
  let fixture: ComponentFixture<SellingruleModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellingruleModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellingruleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
