import { BulkyItemModel } from '../bulkyItem.model';
import { DistrictModel } from '../district.model'
import { EventModel } from './event.model';

export interface RoadsideLitterEventModel extends EventModel {
    litterPounds: number;
    recyclingPounds: number;
    locations: string;
    districts: DistrictModel[];
    bulkyItems: BulkyItemModel[];
    bulkyItemCount?: number;
    districtsDisplay?: string;
};