import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed, fakeAsync, tick, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';

import { StatusSelectorComponent } from './status-selector.component';
import { TestReportState } from 'src/app/store/reports/reducer';
import { MockStore, provideMockStore } from 'src/app/mock-store/testing';
import { initialState as initialTestReportState } from 'src/app/store/reports/reducer.spec';
import { FilterReports } from 'src/app/store/reports/actions';
import { TestSuiteStatus } from 'src/app/models/test-suite.model';

describe('StatusSelectorComponent', () => {
  let component: StatusSelectorComponent;
  let fixture: ComponentFixture<StatusSelectorComponent>;
  let store: MockStore<{
    testReport: TestReportState;
  }>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [StatusSelectorComponent],
      providers: [provideMockStore({ initialState: { testReport: initialTestReportState } })]
    }).compileComponents();
  }));

  beforeEach(inject([Store], (mockStore: MockStore<{ testReport: TestReportState }>) => {
    store = mockStore;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusSelectorComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('status changes', () => {
    let filterElem: DebugElement;

    beforeEach(fakeAsync(() => {
      filterElem = fixture.debugElement.query(By.css('select'));

      tick();
    }));

    it('calls selectedStatusChanged', () => {
      spyOn(component, 'onChange');

      filterElem.nativeElement.value = filterElem.nativeElement.options[2].value;
      filterElem.nativeElement.dispatchEvent(new Event('change'));

      expect(component.onChange).toHaveBeenCalled();
    });

    it('calls dispatches an action', fakeAsync(() => {
      spyOn(store, 'dispatch');

      filterElem.nativeElement.value = filterElem.nativeElement.options[2].value;
      filterElem.nativeElement.dispatchEvent(new Event('change'));

      tick();

      expect(store.dispatch).toHaveBeenCalledWith(new FilterReports({ filter: TestSuiteStatus.passed }));
    }));
  });
});
