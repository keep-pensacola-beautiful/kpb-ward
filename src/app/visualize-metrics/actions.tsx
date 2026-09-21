'use server'

import { AdoptASpotEventDAO, BagSwapEventDAO, CleanTeamEventDAO, CountyCleanupEventDAO, EducationEventDAO, RoadsideLitterEventDAO, TrashRoutesEventDAO, TreePlantingEventDAO } from '../dao/event';
import { GroupCleanupEventDAO } from '../dao/event/groupCleanupEvent.DAO';
import { TotalMetricsRetrieverDAO } from '../dao/metrics/totalMetrics.DAO';
import { MetricSearchModel } from '../models/metrics';
import { MetricVisualizeModel } from '../models/metrics';
import { PROGRAM_CODES } from './visualizeMetricsJson';

export async function getDataToVisualize(filters: MetricSearchModel): Promise<MetricVisualizeModel> {
    if (filters.interval === 'quarter' && filters.startQuarter !== undefined && filters.endQuarter !== undefined) {
        if (filters.startQuarter === 1) {
            filters.startYear -= 1;
        }
        if (filters.endQuarter === 1) {
            filters.endYear -= 1;
        }
    }
    switch (filters.program) {
        case PROGRAM_CODES[0]:
            const totalMetricsRetriever: TotalMetricsRetrieverDAO = new TotalMetricsRetrieverDAO();
            return await totalMetricsRetriever.getMetric(
                {
                    startMonth: filters.startMonth, endMonth: filters.endMonth,
                    startQuarter: filters.startQuarter, endQuarter: filters.endQuarter,
                    startYear: filters.startYear, endYear: filters.endYear
                },
                filters.metric,
                filters.interval
            )
        case PROGRAM_CODES[1]:
            const cleanTeamEventDAO: CleanTeamEventDAO = new CleanTeamEventDAO();
            return await cleanTeamEventDAO.getMetric(
                {
                    startMonth: filters.startMonth, endMonth: filters.endMonth,
                    startQuarter: filters.startQuarter, endQuarter: filters.endQuarter,
                    startYear: filters.startYear, endYear: filters.endYear
                },
                filters.metric,
                filters.interval
            );
        case PROGRAM_CODES[2]:
            const countyCleanupEventDAO: CountyCleanupEventDAO = new CountyCleanupEventDAO();
            return await countyCleanupEventDAO.getMetric(
                {
                    startMonth: filters.startMonth, endMonth: filters.endMonth,
                    startQuarter: filters.startQuarter, endQuarter: filters.endQuarter,
                    startYear: filters.startYear, endYear: filters.endYear
                },
                filters.metric,
                filters.interval
            );
        case PROGRAM_CODES[3]:
            const roadsideLitterEventDAO: RoadsideLitterEventDAO = new RoadsideLitterEventDAO();
            return await roadsideLitterEventDAO.getMetric(
                {
                    startMonth: filters.startMonth, endMonth: filters.endMonth,
                    startQuarter: filters.startQuarter, endQuarter: filters.endQuarter,
                    startYear: filters.startYear, endYear: filters.endYear
                },
                filters.metric,
                filters.interval
            );
        case PROGRAM_CODES[4]:
            const trashRoutesEventDAO: TrashRoutesEventDAO = new TrashRoutesEventDAO();
            return await trashRoutesEventDAO.getMetric(
                {
                    startMonth: filters.startMonth, endMonth: filters.endMonth,
                    startQuarter: filters.startQuarter, endQuarter: filters.endQuarter,
                    startYear: filters.startYear, endYear: filters.endYear
                },
                filters.metric,
                filters.interval
            );
        case PROGRAM_CODES[5]:
            const adoptASpotEventDAO: AdoptASpotEventDAO = new AdoptASpotEventDAO();
            return await adoptASpotEventDAO.getMetric(
                {
                    startMonth: filters.startMonth, endMonth: filters.endMonth,
                    startQuarter: filters.startQuarter, endQuarter: filters.endQuarter,
                    startYear: filters.startYear, endYear: filters.endYear
                },
                filters.metric,
                filters.interval
            );
        case PROGRAM_CODES[6]:
            const groupCleanupEventDAO: GroupCleanupEventDAO = new GroupCleanupEventDAO();
            return await groupCleanupEventDAO.getMetric(
                {
                    startMonth: filters.startMonth, endMonth: filters.endMonth,
                    startQuarter: filters.startQuarter, endQuarter: filters.endQuarter,
                    startYear: filters.startYear, endYear: filters.endYear
                },
                filters.metric,
                filters.interval
            );
        case PROGRAM_CODES[7]:
            const bagSwapEventDAO: BagSwapEventDAO = new BagSwapEventDAO();
            return await bagSwapEventDAO.getMetric(
                {
                    startMonth: filters.startMonth, endMonth: filters.endMonth,
                    startQuarter: filters.startQuarter, endQuarter: filters.endQuarter,
                    startYear: filters.startYear, endYear: filters.endYear
                },
                filters.metric,
                filters.interval
            );
        case PROGRAM_CODES[8]:
            const educationEventDAO: EducationEventDAO = new EducationEventDAO();
            return await educationEventDAO.getMetric(
                {
                    startMonth: filters.startMonth, endMonth: filters.endMonth,
                    startQuarter: filters.startQuarter, endQuarter: filters.endQuarter,
                    startYear: filters.startYear, endYear: filters.endYear
                },
                filters.metric,
                filters.interval
            );
        case PROGRAM_CODES[9]:
            const treePlantingEventDAO: TreePlantingEventDAO = new TreePlantingEventDAO();
            return await treePlantingEventDAO.getMetric(
                {
                    startMonth: filters.startMonth, endMonth: filters.endMonth,
                    startQuarter: filters.startQuarter, endQuarter: filters.endQuarter,
                    startYear: filters.startYear, endYear: filters.endYear
                },
                filters.metric,
                filters.interval
            );
    }
    return { metricTitle: 'Error: Specified Metric Not Found', dataLabel: 'error', chartType: 'bar', data: [] };
}