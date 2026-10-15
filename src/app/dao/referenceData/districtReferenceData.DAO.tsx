import { ReferenceDataDAO } from '.';
import { ReferenceDataEntity } from '../../entities/referenceData/referenceData.entity';
import { getDistrictReference } from '../../lib/referenceData.sql';

export class DistrictReferenceDataDAO implements ReferenceDataDAO {
    async getByCode(code: number | string): Promise<ReferenceDataEntity | null> {
        return null;
    }

    async getAll(): Promise<ReferenceDataEntity[]> {
        const result: any = await getDistrictReference();
        let districts: ReferenceDataEntity[] = [];
        if (result && result.length >= 1) {
            result.forEach((district: any) => districts.push({ code: district.code, description: district.description }));
        }
        return districts;
    }
}