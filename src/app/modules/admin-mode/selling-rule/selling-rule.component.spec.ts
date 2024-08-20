import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellingRuleComponent } from './selling-rule.component';

describe('SellingRuleComponent', () => {
  let component: SellingRuleComponent;
  let fixture: ComponentFixture<SellingRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellingRuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellingRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
