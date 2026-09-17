import { IntervalCode } from './intervalCode.model';

export interface MetricSearchModel {
    startMonth?: number;
    endMonth?: number;
    startQuarter?: number;
    endQuarter?: number;
    startYear: number;
    endYear: number;
    category: string;
    program: string;
    metric: string;
    interval: IntervalCode;
}