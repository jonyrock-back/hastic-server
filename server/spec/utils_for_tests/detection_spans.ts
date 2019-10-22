import { TEST_ANALYTIC_UNIT_ID } from './analytic_units';

import * as Detection from '../../src/models/detection_model';

import * as _ from 'lodash';

export type DetectionSpanOptions = { from_timestamp: number, to_timestamp: number, status: Detection.DetectionStatus };

export function buildSpans(options: DetectionSpanOptions[]): Detection.DetectionSpan[] {
  return options.map(option => {
    return new Detection.DetectionSpan(TEST_ANALYTIC_UNIT_ID, option.from_timestamp, option.to_timestamp, option.status);
  });
}

export async function insertSpans(options: DetectionSpanOptions[]): Promise<void> {
  const spansToInsert = buildSpans(options);
  const insertPromises = spansToInsert.map(async span => Detection.insertSpan(span));
  await Promise.all(insertPromises);
}

export function convertSpansToOptions(spans: Detection.DetectionSpan[]): DetectionSpanOptions[] {
  const spansOptions = spans.map(span => ({ from_timestamp: span.from_timestamp, to_timestamp: span.to_timestamp, status: span.status }));
  return _.sortBy(spansOptions, spanOptions => spanOptions.from_timestamp);
}

export async function clearSpansDB(): Promise<void> {
  await Detection.clearSpans(TEST_ANALYTIC_UNIT_ID);
}
