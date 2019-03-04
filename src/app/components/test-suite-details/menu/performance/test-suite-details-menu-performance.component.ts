import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

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
      name: 'CPU performance',
      isOpen: false,
      sampleGroups: [],
      valueGrid: undefined,
      sampleCurves: undefined
    },
    {
      id: 'memory',
      cssClass: 'memory',
      name: 'Memory usage (KB)',
      isOpen: false,
      sampleGroups: [],
      valueGrid: undefined,
      sampleCurves: undefined
    },
    {
      id: 'network',
      cssClass: 'network',
      name: 'Network (KB/S)',
      isOpen: false,
      sampleGroups: [
        {
          title: 'upload'
        },
        {
          title: 'download'
        }
      ],
      valueGrid: undefined,
      sampleCurves: undefined
    }
  ];
  durationInMilliseconds: number;
  timeGrid: number[];

  constructor(private datePipe: DatePipe) {}

  ngOnInit() {
    this.loadMetrics();
  }

  loadMetrics = function() {
    const data: {
      [id: string]: {
        title?: string;
        samples: {
          time: number;
          value: number;
        }[];
      }[];
    } = {
      cpu: [
        {
          samples: [
            { time: 0, value: 30 },
            { time: 2000, value: 5 },
            { time: 4000, value: 45 },
            { time: 6000, value: 20 },
            { time: 8000, value: 92 },
            { time: 10000, value: 60 },
            { time: 12000, value: 80 },
            { time: 14000, value: 12 }
          ]
        }
      ],
      memory: [
        {
          samples: [
            { time: 0, value: 100 },
            { time: 2000, value: 5 },
            { time: 4000, value: 453 },
            { time: 6000, value: 20 },
            { time: 8000, value: 32 },
            { time: 10000, value: 515 },
            { time: 12000, value: 321 },
            { time: 14000, value: 120 }
          ]
        }
      ],
      network: [
        {
          title: 'upload',
          samples: [
            { time: 0, value: 100 },
            { time: 2000, value: 5 },
            { time: 4000, value: 453 },
            { time: 6000, value: 20 },
            { time: 8000, value: 32 },
            { time: 10000, value: 515 },
            { time: 12000, value: 321 },
            { time: 14000, value: 120 }
          ]
        },
        {
          title: 'download',
          samples: [
            { time: 0, value: 3 },
            { time: 2000, value: 19 },
            { time: 4000, value: 215 },
            { time: 6000, value: 501 },
            { time: 8000, value: 409 },
            { time: 10000, value: 60 },
            { time: 12000, value: 29 },
            { time: 14000, value: 660 }
          ]
        }
      ]
    };
    this.durationInMilliseconds = 14000;

    Object.keys(data).forEach((typeId: string) => {
      const sampleGroupsOfType = data[typeId];
      const metricOfType = this.metrics.find(metric => metric.id === typeId);
      metricOfType.sampleGroups = sampleGroupsOfType;
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
