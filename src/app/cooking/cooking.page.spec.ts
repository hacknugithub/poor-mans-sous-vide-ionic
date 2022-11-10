import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CookingPage } from './cooking.page';

describe('CookingPage', () => {
  let component: CookingPage;
  let fixture: ComponentFixture<CookingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CookingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CookingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
