import reportsReducer, { TestReportState } from 'src/app/store/reports/reducer';
import { ReceiveReports, ReceiveFilteredReports, FilterReports, ReportActions } from './actions';
import { TestSuiteStatus } from 'src/app/models/test-suite.model';
import { TestReport } from 'src/app/models/test-report.model';

describe('Reports reducer', () => {
  const initialState: TestReportState = {
    testReports: [],
    filteredReports: [],
    filter: TestSuiteStatus.failed
  };

  it('updates the state with reports received', () => {
    const newState = reportsReducer(
      initialState,
      new ReceiveReports({ testReports: [new TestReport().deserialize({ id: '1', name: 'whatever' })] })
    );

    expect(newState.testReports.length).toBe(1);

    expect(newState.filteredReports.length).toBe(initialState.filteredReports.length);
    expect(newState.filter).toBe(initialState.filter);
  });

  it('updates the state with filtered reports', () => {
    const newState = reportsReducer(
      initialState,
      new ReceiveFilteredReports({ testReports: [new TestReport().deserialize({ id: '1', name: 'whatever' })] })
    );

    expect(newState.filteredReports.length).toBe(1);

    expect(newState.testReports.length).toBe(initialState.testReports.length);
    expect(newState.filter).toBe(initialState.filter);
  });

  it('updates the state with filter', () => {
    const newState = reportsReducer(initialState, new FilterReports({ filter: TestSuiteStatus.passed }));

    expect(newState.filter).toBe(TestSuiteStatus.passed);

    expect(newState.testReports.length).toBe(initialState.testReports.length);
    expect(newState.filteredReports.length).toBe(initialState.filteredReports.length);
  });

  it(`doesn't update the state for an unknown action`, () => {
    const newState = reportsReducer(initialState, <ReportActions>(<unknown>{ type: 'Unknown' }));

    expect(newState).toBe(initialState);
  });
});
