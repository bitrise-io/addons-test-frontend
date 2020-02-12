import { ReportsReducer, TestReportState } from 'src/app/store/reports/reducer';
import { ReceiveReports, ReceiveFilteredReports, FilterReports, ReportActions } from './actions';
import { TestSuiteStatus } from 'src/app/models/test-suite.model';
import { TestReport } from 'src/app/models/test-report.model';

export const initialState: TestReportState = {
  isLoading: true,
  testReports: [],
  filteredReports: [],
  filter: TestSuiteStatus.failed
};

describe('Reports reducer', () => {
  it('updates the state with reports received', () => {
    const newState = ReportsReducer(
      initialState,
      new ReceiveReports({ testReports: [new TestReport().deserialize({ id: '1', name: 'whatever' })] })
    );

    expect(newState.testReports.length).toBe(1);

    expect(newState.filteredReports.length).toBe(initialState.filteredReports.length);
    expect(newState.filter).toBe(initialState.filter);
  });

  it('updates the state with filtered reports', () => {
    const newState = ReportsReducer(
      initialState,
      new ReceiveFilteredReports({ testReports: [new TestReport().deserialize({ id: '1', name: 'whatever' })] })
    );

    expect(newState.filteredReports.length).toBe(1);

    expect(newState.testReports.length).toBe(initialState.testReports.length);
    expect(newState.filter).toBe(initialState.filter);
  });

  it('updates the state with filter', () => {
    const newState = ReportsReducer(initialState, new FilterReports({ filter: TestSuiteStatus.passed }));

    expect(newState.filter).toBe(TestSuiteStatus.passed);

    expect(newState.testReports.length).toBe(initialState.testReports.length);
    expect(newState.filteredReports.length).toBe(initialState.filteredReports.length);
  });

  it(`doesn't update the state for an unknown action`, () => {
    const newState = ReportsReducer(initialState, <ReportActions>(<unknown>{ type: 'Unknown' }));

    expect(newState).toBe(initialState);
  });
});
