import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import { HeadingTextComponent } from './heading-text.component';

const innerText = 'expected string';

@Component({
  template: `
    <bitrise-heading-text>${innerText}</bitrise-heading-text>
  `
})
class TestHostComponent {}

describe('HeadingTextComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HeadingTextComponent, TestHostComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain the expected string', () => {
    expect(fixture.debugElement.nativeElement.innerText).toBe(innerText);
  });
});
