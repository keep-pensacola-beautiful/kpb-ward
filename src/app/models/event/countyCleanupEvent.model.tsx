import { BulkyItemModel } from '../bulkyItem.model';
import { EventModel } from './event.model';

export interface CountyCleanupEventModel extends EventModel {
    tireCount: number;
    tirePounds?: number;
    paintCanAndHouseholdChemicalCount: number;
    paintCanAndHouseholdChemicalPounds?: number;
    otherBulkyItems: BulkyItemModel[];
    otherBulkyItemPounds: number;
    bulkyItemCount?: number;
}