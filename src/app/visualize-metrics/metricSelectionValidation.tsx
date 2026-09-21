import { ErrorModel } from '../models';
import { IntervalCode, MetricSearchModel } from '../models/metrics';
import { isFormDataEntryValueNullOrBlank } from '../utils/commonFormValidation';
import { capitalizeString } from '../utils/capitalizeString';
import { isBlank } from '../utils/isBlank';
import { KPB_FOUNDING_YEAR } from '../constValues';
import {
    DATA_CATEGORY_OPTIONS,
    METRIC_LIST_NAME,
    INTERVAL_VALUES,
    PROGRAM_LIST_NAME
} from './visualizeMetricsJson';

export function validateMetricFilters(
    filters: FormData,
    category: string,
    program: string,
    metric: string,
    interval: IntervalCode
): { data: MetricSearchModel | null, errors: Map<string, ErrorModel> } {
    let newErrors: Map<string, ErrorModel> = new Map<string, ErrorModel>();
    const startYear: FormDataEntryValue | null = filters.get('start-year');
    const endYear: FormDataEntryValue | null = filters.get('end-year');
    let startMonthNum: number | null = null;
    let endMonthNum: number | null = null;
    let startQuarterNum: number | null = null;
    let endQuarterNum: number | null = null;
    let startYearNum: number | null = null;
    let endYearNum: number | null = null;

    if (isBlank(interval) || interval === 'month') {
        const startMonthValidation: { month: number | null, errors: Map<string, ErrorModel> } = 
            validateMonth(newErrors, filters.get('start-month'), 'start-month', 'Start Month', 'start month');
        newErrors = startMonthValidation.errors;
        startMonthNum = startMonthValidation.month;

        const endMonthValidation: { month: number | null, errors: Map<string, ErrorModel> } = 
            validateMonth(newErrors, filters.get('end-month'), 'end-month', 'End Month', 'end month');
        newErrors = endMonthValidation.errors;
        endMonthNum = endMonthValidation.month;
    } else if (!isBlank(interval) && interval === 'quarter') {
        const startQuarterValidation: { quarter: number | null, errors: Map<string, ErrorModel> } =
            validateQuarter(newErrors, filters.get('start-quarter'), 'start-quarter', 'Start Quarter', 'start quarter');
        newErrors = startQuarterValidation.errors;
        startQuarterNum = startQuarterValidation.quarter;

        const endQuarterValidation: { quarter: number | null, errors: Map<string, ErrorModel> } =
            validateQuarter(newErrors, filters.get('end-quarter'), 'end-quarter', 'End Quarter', 'end quarter');
        newErrors = endQuarterValidation.errors;
        endQuarterNum = endQuarterValidation.quarter;
    }
    newErrors = validateYear(newErrors, startYear, 'start-year', 'Start Year', 'start', KPB_FOUNDING_YEAR, new Date().getFullYear());
    newErrors = validateYear(newErrors, endYear, 'end-year', 'End Year', 'end', KPB_FOUNDING_YEAR, new Date().getFullYear());

    if (!newErrors || newErrors.size < 1) {
        if (startYear !== null && endYear !== null) {
            const startYr: number = Number.parseInt(startYear.toString());
            const endYr: number = Number.parseInt(endYear.toString());
            if (startYr > endYr) {
                newErrors.set('end-year', {
                    inputId: 'end-year',
                    fieldName: 'End Year',
                    message: `Enter an end year after the start year.`
                });
            } else if (interval === 'month' &&
                startMonthNum !== null && endMonthNum !== null &&
                startYr === endYr &&
                startMonthNum > endMonthNum
            ) {
                newErrors.set('end-month', {
                    inputId: 'end-month',
                    fieldName: 'End Month',
                    message: `Select an end month after the start month.`
                });
            } else if (interval === 'quarter' &&
                startQuarterNum !== null && endQuarterNum !== null &&
                startYr === endYr &&
                startQuarterNum > endQuarterNum
            ) {
                newErrors.set('end-quarter', {
                    inputId: 'end-quarter',
                    fieldName: 'End Quarter',
                    message: `Select an end quarter after the start quarter.`
                });
            } else {
                startYearNum = startYr;
                endYearNum = endYr;
            }
        }
        if (isBlank(category)) {
            newErrors.set(DATA_CATEGORY_OPTIONS[0].inputId, {
                inputId: DATA_CATEGORY_OPTIONS[0].inputId,
                fieldName: 'Data Category',
                message: `Select a data category.`
            });
        }
        if (category !== DATA_CATEGORY_OPTIONS[0].value && isBlank(program)) {
            newErrors.set(`${PROGRAM_LIST_NAME}-option1`, {
                inputId: `${PROGRAM_LIST_NAME}-option1`,
                fieldName: 'KPB Program',
                message: `Select a program.`
            });
        }
        if (isBlank(metric)) {
            newErrors.set(`${METRIC_LIST_NAME}-option1`, {
                inputId: `${METRIC_LIST_NAME}-option1`,
                fieldName: 'Metric',
                message: `Select a metric.`
            });
        }
        if (!/^top/.test(metric) && isBlank(interval)) {
            newErrors.set(INTERVAL_VALUES.month.code, {
                inputId: INTERVAL_VALUES.month.code,
                fieldName: 'Interval',
                message: `Select an interval.`
            });
        }
    }
    if ((!newErrors || newErrors.size < 1) &&
        endYearNum !== null && startYearNum !== null &&
        !isBlank(category) &&
        (category === DATA_CATEGORY_OPTIONS[0].value || !isBlank(program)) &&
        !isBlank(metric) &&
        (/^top/.test(metric) || !isBlank(interval))
    ) {
        if ((isBlank(interval) || interval === 'month') && startMonthNum !== null && endMonthNum !== null) {
            return { data: {
                startMonth: startMonthNum,
                endMonth: endMonthNum,
                startYear: startYearNum,
                endYear: endYearNum,
                category: category,
                program: program,
                metric: metric,
                interval: interval
            }, errors: newErrors };
        } else if (interval === 'quarter' && startQuarterNum !== null && endQuarterNum !== null) {
            return { data: {
                startQuarter: startQuarterNum,
                endQuarter: endQuarterNum,
                startYear: startYearNum,
                endYear: endYearNum,
                category: category,
                program: program,
                metric: metric,
                interval: interval
            }, errors: newErrors };
        } else if (interval === 'year') {
            return { data: {
                startYear: startYearNum,
                endYear: endYearNum,
                category: category,
                program: program,
                metric: metric,
                interval: interval
            }, errors: newErrors };
        }
    }
    return { data: null, errors: newErrors };
}

function validateMonth(
    errors: Map<string, ErrorModel>,
    month: FormDataEntryValue | null,
    inputId: string,
    fieldName: string,
    msgFieldDescriptor: string
): { month: number | null, errors: Map<string, ErrorModel> } {
    if (isFormDataEntryValueNullOrBlank(month)) {
        errors.set(inputId, {
            inputId: inputId,
            fieldName: fieldName,
            message: `Select a ${msgFieldDescriptor}.`
        });
    } else if (month !== null && 
        (Number.isNaN(Number(month.toString())) ||
        Number(month.toString()) < 1 ||
        Number(month.toString()) > 12 )
    ) {
        errors.set(inputId, {
            inputId: inputId,
            fieldName: fieldName,
            message: `${capitalizeString(msgFieldDescriptor)} must be a number between 1 to 12.`
        });
    } else if (month !== null) {
        return { month: Number.parseInt(month.toString()), errors: errors };
    }
    return { month: null, errors: errors };
}

function validateQuarter(
    errors: Map<string, ErrorModel>,
    quarter: FormDataEntryValue | null,
    inputId: string,
    fieldName: string,
    msgFieldDescriptor: string
): { quarter: number | null, errors: Map<string, ErrorModel> } {
    if (isFormDataEntryValueNullOrBlank(quarter)) {
        errors.set(inputId, {
            inputId: inputId,
            fieldName: fieldName,
            message: `Select a ${msgFieldDescriptor}.`
        });
    } else if (quarter !== null && 
        (Number.isNaN(Number(quarter.toString())) ||
        Number(quarter.toString()) < 1 ||
        Number(quarter.toString()) > 4 )
    ) {
        errors.set(inputId, {
            inputId: inputId,
            fieldName: fieldName,
            message: `${capitalizeString(msgFieldDescriptor)} must be a number between 1 to 4.`
        });
    } else if (quarter !== null) {
        return { quarter: Number.parseInt(quarter.toString()), errors: errors };
    }
    return { quarter: null, errors: errors };
}

export function validateYear(
    yearErrors: Map<string, ErrorModel>,
    year: FormDataEntryValue | null,
    inputId: string,
    fieldName: string,
    yearDesc: 'start' | 'end',
    minYear: number,
    maxYear: number
): Map<string, ErrorModel> {
    if (isFormDataEntryValueNullOrBlank(year)) {
        yearErrors.set(inputId, {
            inputId: inputId,
            fieldName: fieldName,
            message: `Enter a ${yearDesc} year.`
        });
    } else if (year !== null && (year.toString().length < 4 || Number.isNaN(Number(year.toString())))) {
        yearErrors.set(inputId, {
            inputId: inputId,
            fieldName: fieldName,
            message: `Enter a 4-digit ${yearDesc} year.`
        });
    } else if (year !== null && Number(year.toString()) < minYear) {
        yearErrors.set(inputId, {
            inputId: inputId,
            fieldName: fieldName,
            message: `${fieldName} must be ${minYear} or after.`
        });
    } else if (year !== null && Number(year.toString()) > maxYear) {
        yearErrors.set(inputId, {
            inputId: inputId,
            fieldName: fieldName,
            message: `${fieldName} must be ${maxYear} or before.`
        });
    }
    return yearErrors;
}