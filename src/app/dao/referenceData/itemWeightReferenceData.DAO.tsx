import { ReferenceDataDAO } from '.';
import { ReferenceDataEntity } from '../../entities/referenceData/referenceData.entity';
import { ItemWeightReferenceDataEntity } from '../../entities/referenceData/itemWeightReferenceData.entity';
import { getItemWeightReference } from '../../lib/referenceData.sql';

export class ItemWeightReferenceDataDAO implements ReferenceDataDAO {
    async getByCode(code: number | string): Promise<ReferenceDataEntity | null> {
        return null;
    }

    async getAll(): Promise<ItemWeightReferenceDataEntity[]> {
        const result: any = await getItemWeightReference();
        let itemWeights: ItemWeightReferenceDataEntity[] = [];
        if (result && result.length >= 1) {
            result.forEach((itemWeight: any) => itemWeights.push({
                code: itemWeight.code,
                description: itemWeight.description,
                weight: itemWeight.weight
            }));
        }
        return itemWeights;
    }
}