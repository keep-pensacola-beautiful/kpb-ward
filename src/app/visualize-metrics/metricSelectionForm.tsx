'use client'

import { useCallback, useState } from 'react';
import { RadioList } from '../components';
import { ErrorModel } from '../models';
import { CategoryCode, IntervalCode, MetricSearchModel, ProgramCode } from '../models/metrics';
import { validateMetricFilters } from './metricSelectionValidation';
import { isBlank } from '../utils/isBlank';
import {
    CATEGORY_CODES,
    DATA_CATEGORY_LIST_NAME,
    DATA_CATEGORY_OPTIONS,
    PROGRAM_CODES,
    PROGRAM_LIST_NAME,
    PROGRAM_OPTIONS,
    PROGRAM_CODES_BY_CATEGORY,
    METRIC_LIST_NAME,
    METRIC_OPTIONS,
    INTERVAL_VALUES,
    INTERVAL_LIST_NAME,
    INTERVAL_OPTIONS,
} from './visualizeMetricsJson';
import { TimePeriodFields } from './timePeriodFields';

export function MetricSelectionForm({ onVisualize }: { onVisualize: (data: any) => void }) {
    // Default category to first option, which is 'total'
    const [category, setCategory] = useState<string>(DATA_CATEGORY_OPTIONS[0].value);
    // Default program to 'total' for flexibility, even though 'total' category does not have programs
    const [program, setProgram] = useState<string>(PROGRAM_CODES[0]);
    const [programOptions, setProgramOptions] = useState<string>('[]');
    // Default metric to first option in the list of metrics for the 'total' data category
    const [metric, setMetric] = useState<string>(METRIC_OPTIONS[PROGRAM_CODES[0]][0].value);
    const [metricOptions, setMetricOptions] = useState<string>(JSON.stringify(METRIC_OPTIONS[PROGRAM_CODES[0]]));
    const [interval, setInterval] = useState<IntervalCode>(INTERVAL_VALUES.month.code);
    const [errors, setErrors] = useState<Map<string, ErrorModel>>(new Map<string, ErrorModel>);

    const handleCategoryChange: any = useCallback((event: any) => {
        const value: any = event.target.value;
        const ctgyCode: CategoryCode = CATEGORY_CODES.includes(value) ? value : CATEGORY_CODES[0];
        setCategory(ctgyCode);
        setProgramOptions(JSON.stringify(PROGRAM_OPTIONS[ctgyCode]));
        setProgram(PROGRAM_OPTIONS[ctgyCode][0].value);
        const prgmCode: ProgramCode = PROGRAM_CODES_BY_CATEGORY[ctgyCode][0];
        setMetricOptions(JSON.stringify(METRIC_OPTIONS[prgmCode]));
        setMetric(METRIC_OPTIONS[prgmCode][0].value);
        setInterval('month');

        setErrors(new Map<string, ErrorModel>());
        // setAlertHeader('');
    }, []);

    function handleProgramChange(event: any) {
        const value: any = event.target.value;
        const prgmCode: ProgramCode = PROGRAM_CODES.includes(value) ? value : PROGRAM_CODES[0];
        setProgram(prgmCode);
        setMetricOptions(JSON.stringify(METRIC_OPTIONS[prgmCode]));
        setMetric(METRIC_OPTIONS[prgmCode][0].value);
        if (isBlank(interval) && !/^top/.test(METRIC_OPTIONS[prgmCode][0].value)) {
            setInterval(INTERVAL_VALUES.month.code);
        }
        
        setErrors(new Map<string, ErrorModel>());
        // setAlertHeader('');
    }

    function handleMetricChange(event: any){
        setMetric(event?.target.value);
        if (/^top/.test(event?.target.value)) {
            setInterval('');
        } else if (isBlank(interval) && !/^top/.test(event?.target.value)) {
            setInterval(INTERVAL_VALUES.month.code);
        }

        setErrors(new Map<string, ErrorModel>());
    }

    function handleIntervalChange(event: any) {
        setInterval(event?.target.value);
        setErrors(new Map<string, ErrorModel>())
    }

    function handleSubmit(e: any) {
        e.preventDefault();
        console.log('handling submit');
        console.log(new FormData(e.target));
        const result: { data: MetricSearchModel | null, errors: Map<string, ErrorModel> } =
            validateMetricFilters(new FormData(e.target), category, program, metric, interval);
        console.log(result);
        setErrors(result.errors);
        if ((!result.errors || result.errors.size < 1) && result.data !== null) {
            onVisualize(result.data);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 bg-[var(--gold)] p-2">
            <RadioList
                label="Data Category"
                listName={DATA_CATEGORY_LIST_NAME}
                options={JSON.stringify(DATA_CATEGORY_OPTIONS)}
                selectedValue={category}
                handleChange={handleCategoryChange}>
            </RadioList>

            { !isBlank(category) && category !== CATEGORY_CODES[0] &&
                <RadioList
                    label="KPB Program"
                    listName={PROGRAM_LIST_NAME}
                    options={programOptions}
                    selectedValue={program}
                    handleChange={handleProgramChange}
                    >
                </RadioList>
            }

            { (category === CATEGORY_CODES[0] || (!isBlank(program) && !isBlank(programOptions))) &&
                <RadioList
                    label="Metric"
                    listName={METRIC_LIST_NAME}
                    options={metricOptions}
                    selectedValue={metric}
                    handleChange={handleMetricChange}>
                </RadioList>
            }

            { !/^top/.test(metric) &&
                <RadioList
                    label="Interval"
                    listName={INTERVAL_LIST_NAME}
                    options={JSON.stringify(INTERVAL_OPTIONS)}
                    selectedValue={interval}
                    handleChange={handleIntervalChange}>
                </RadioList>
            }

            <TimePeriodFields
                interval={interval}
                errors={errors}>
            </TimePeriodFields>

            <button className="border p-1 rounded-md bg-[var(--deepBlue)] text-[var(--tan)] text-[1.06rem]">
                Visualize
            </button>
        </form>
    );
}