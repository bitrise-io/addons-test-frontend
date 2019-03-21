export interface MetricSample {
  time: number;
  value: number;
}

export interface MetricSampleGroup {
  name?: string;
  samples: MetricSample[];
}

export interface Metric {
  name: string;
  currentTimeInMilliseconds: number;
  sampleGroups: MetricSampleGroup[];
}

export interface Performance {
  durationInMilliseconds: number;
  metrics: {
    cpu: Metric;
    memory: Metric;
    network: Metric;
  };
}
