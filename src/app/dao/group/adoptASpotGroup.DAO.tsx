import { AdoptASpotGroupEntity } from '../../entities/group/adoptASpotGroup.entity';
import { AdoptASpotGroupModel, GroupModel } from '../../models/group';
import { GroupDAO } from './group.DAO';
import { getAdoptASpotAssignmentById, getAdoptASpotAssignments, insertAdoptASpotAssignment } from '../../lib/group.sql';

export class AdoptASpotGroupDAO implements GroupDAO {
    async getById(id: number): Promise<AdoptASpotGroupEntity | null> {
        const result: any = await getAdoptASpotAssignmentById(id);
        if (result && result.length >= 1) {
            return { id: result[0].id, name: result[0].group_name, location: result[0].location };
        }
        return null;
    }

    async getAll(): Promise<AdoptASpotGroupEntity[]> {
        const result: any = await getAdoptASpotAssignments();
        let assignments: AdoptASpotGroupEntity[] = [];
        if (result && result.length >= 1) {
            result.forEach((assignment: any) => assignments.push({ id: assignment.id, name: assignment.group_name, location: assignment.location }));
        }
        return assignments;
    }

    async save(assignment: AdoptASpotGroupModel): Promise<number> {
        const groupEntity: AdoptASpotGroupEntity = {
            id: assignment.id ? assignment.id : -1,
            name: assignment.name,
            location: assignment.location
        };
        const result: number = await insertAdoptASpotAssignment(groupEntity);
        return result;
    }
}