import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import * as MOCKED_DATA from '../../../../mocked-data.json';

@Component({
  selector: 'bitrise-test-suite-details-menu-performance',
  templateUrl: './test-suite-details-menu-performance.component.html',
  styleUrls: ['./test-suite-details-menu-performance.component.scss']
})
export class TestSuiteDetailsMenuPerformanceComponent implements OnInit {
  metrics = [
    {
      id: 'cpu',
      cssClass: 'cpu',
      isOpen: false,
      sampleGroups: undefined,
      valueGrid: undefined,
      sampleCurves: undefined
    },
    {
      id: 'memory',
      cssClass: 'memory',
      isOpen: false,
      sampleGroups: undefined,
      valueGrid: undefined,
      sampleCurves: undefined
    },
    {
      id: 'network',
      cssClass: 'network',
      isOpen: false,
      sampleGroups: undefined,
      valueGrid: undefined,
      sampleCurves: undefined
    }
  ];
  durationInMilliseconds: number;
  timeGrid: number[];

  constructor(private datePipe: DatePipe) {}

  ngOnInit() {
    this.loadPerformanceData();
  }

  loadPerformanceData = function() {
    const performanceData = MOCKED_DATA['performance']
    this.durationInMilliseconds = performanceData.durationInMilliseconds;

    Object.keys(performanceData.metrics).forEach((typeId: string) => {
      const metricData = performanceData.metrics[typeId];
      const metric = this.metrics.find(metric => metric.id === typeId);
      metric.name = metricData.name;
      metric.sampleGroups = metricData.sampleGroups;
    });

    this.metrics.forEach((metric: any) => {
      let valueGridTop: number;

      metric.sampleGroups.forEach((sampleGroup: { title?: string; samples: [] }) => {
        valueGridTop = this.highestValueFromSamples(sampleGroup.samples);
      });

      if (valueGridTop === 0) {
        valueGridTop = 100;
      }

      metric.valueGrid = Array(5)
        .fill(null)
        .map((_element: any, index: number, array: any[]) => {
          return valueGridTop - (valueGridTop * index) / (array.length - 1);
        });

      metric.sampleCurves = metric.sampleGroups.map((sampleGroup: { title?: string; samples: [] }) => {
        return this.pathCurveFromSamples(sampleGroup.samples);
      });
    });

    this.timeGrid = Array(4)
      .fill(null)
      .map((_element: any, index: number, array: any[]) => {
        return (this.durationInMilliseconds * index) / (array.length - 1);
      });
  };

  highestValueFromSamples = function(
    samples: {
      time: number;
      value: number;
    }[]
  ) {
    return samples.reduce(
      (
        highestValue: number,
        sample: {
          time: number;
          value: number;
        }
      ) => Math.max(sample.value, highestValue),
      0
    );
  };

  pathCurveFromSamples = function(
    samples: {
      time: number;
      value: number;
    }[]
  ) {
    let pathCurve = 'M-100 200';

    samples.forEach(
      (
        sample: {
          time: number;
          value: number;
        },
        index: number,
        array: {
          time: number;
          value: number;
        }[]
      ) => {
        var positionX = (100 * sample.time) / this.durationInMilliseconds;
        var positionY =
          100 -
          (100 * sample.value) /
            (this.highestValueFromSamples(samples) > 0 ? this.highestValueFromSamples(samples) : 1);

        if (index == 0) {
          pathCurve += ' L-100 ' + positionY;
        }

        pathCurve += ' L' + positionX + ' ' + positionY;

        if (index == array.length - 1) {
          pathCurve += ' L' + positionX + ' 100 L200 100 L200 200 Z';
        }
      }
    );

    return pathCurve;
  };

  printableValueForMetric = function(value, metric) {
    switch (metric.id) {
      case 'cpu':
        return Math.round(value) + '%';
      case 'memory':
      case 'network':
        if (value >= 1000) {
          return Math.round(value / 100) / 10 + 'k';
        }

        return Math.round(value);
    }
  };

  printableDuration(durationInMilliseconds) {
    if (durationInMilliseconds === null || durationInMilliseconds === undefined) {
      return durationInMilliseconds;
    }

    var date = new Date();

    date.setMinutes(Math.floor(durationInMilliseconds / 1000 / 60));
    date.setSeconds(Math.floor((durationInMilliseconds / 1000) % 60));

    return this.datePipe.transform(date, 'm:ss');
  }

  sampleCurveLinearGradientID = function(metric) {
    return 'metric-linear-gradient-' + metric.id;
  };

  sampleCurveFillURL = function(metric) {
    return window.location + '#' + this.sampleCurveLinearGradientID(metric);
  };
}
