import { GroupEntity } from '../../entities/group/group.entity';
import { GroupModel } from '../../models/group';

export interface GroupDAO {
    getById(id: number): Promise<GroupEntity | null>;
    getAll(): Promise<GroupEntity[]>;
    save(group: GroupModel): Promise<number>;
}