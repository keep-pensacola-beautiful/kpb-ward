import { ReferenceDataEntity } from '../../entities/referenceData/referenceData.entity';
import { ReferenceDataModel } from '../../models/referenceData.model';

export interface ReferenceDataDAO {
    getByCode(code: number | string): Promise<ReferenceDataEntity | null>;
    getAll(): Promise<ReferenceDataEntity[]>;
    save?(refData: ReferenceDataModel): Promise<number>;
}