import { ReferenceDataDAO } from '.';
import { ReferenceDataEntity } from '../../entities/referenceData/referenceData.entity';
import { ReferenceDataModel } from '../../models/referenceData.model';
import { getBulkyItemsReference } from '../../lib/referenceData.sql';

export class BulkyItemReferenceDataDAO implements ReferenceDataDAO {
    async getByCode(code: number | string): Promise<ReferenceDataEntity | null> {
        return null;
    }

    async getAll(): Promise<ReferenceDataEntity[]> {
        const result: any = await getBulkyItemsReference();
        let bulkyItems: ReferenceDataEntity[] = [];
        if (result && result.length >= 1) {
            result.forEach((item: any) => bulkyItems.push({ code: item.id, description: item.description }));
        }
        return bulkyItems;
    }
}