import { TestReport } from 'src/app/models/test-report.model';
import { TestSuiteStatus } from 'src/app/models/test-suite.model';

export default function filterReports(reports: TestReport[], status: TestSuiteStatus) {
  if (status || status === 0) {
    return reports.map(report => {
      const newReport = Object.assign(new TestReport(), report);
      if (report.testCases) {
        newReport.testCases = report.testCases.filter(x => Number(x.status) === status);
      } else if (report.testSuites) {
        newReport.testSuites = report.testSuites.filter(x => Number(x.status) === status);
      }
      return newReport;
    });
  } else {
    return reports;
  }
}