import { EventModel } from '../../models/event/event.model';

export interface EventDAO {
    getById(id: number): Promise<EventModel | null>;
    save(event: EventModel, isUpdate: boolean): Promise<number>;
    deleteById(id: number): Promise<number>;
    search(searchCriteria: Map<string, string>): Promise<EventModel[]>;
}