import { GroupEntity } from '../../entities/group/group.entity';
import { GroupModel } from '../../models/group';
import { GroupDAO } from './group.DAO';
import { getEducationRecipientById, getEducationRecipients, insertEducationRecipient } from '../../lib/group.sql';

export class EducationRecipientGroupDAO implements GroupDAO {
    async getById(id: number): Promise<GroupEntity | null> {
        const result: any = await getEducationRecipientById(id);
        if (result && result.length >= 1) {
            return { id: result[0].id, name: result[0].name };
        }
        return null;
    }

    async getAll(): Promise<GroupEntity[]> {
        const result: any = await getEducationRecipients();
        let recipients: GroupEntity[] = [];
        if (result && result.length >= 1) {
            result.forEach((recipient: any) => recipients.push({ id: recipient.id, name: recipient.name }));
        }
        return recipients;
    }

    async save(recipient: GroupModel): Promise<number> {
        const groupEntity: GroupEntity = {
            id: recipient.id ? recipient.id : -1,
            name: recipient.name
        };
        const result: number = await insertEducationRecipient(groupEntity);
        return result;
    }
}