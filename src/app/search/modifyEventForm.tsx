import { EventModel } from '../models/event';
import { ProgramCode } from '../models/search';
import { PROGRAM_CODES } from './searchJson';
import { ServicesFormHandler } from '../enter-data/services/servicesFormHandler';
import { VolunteerCleanupFormHandler } from '../enter-data/volunteer-cleanup/volunteerCleanupFormHandler';
import { OtherFormHandler } from '../enter-data/other/otherFormHandler';

export function ModifyEventForm({ pgrmCode, event, onModifySuccess, onModifyCancel }: {
    pgrmCode: ProgramCode,
    event: EventModel | undefined,
    onModifySuccess: (nextPage: 'search' | 'table' | 'modify') => void,
    onModifyCancel: () => void
}) {
    switch (pgrmCode) {
        case PROGRAM_CODES[0]:
        case PROGRAM_CODES[1]:
        case PROGRAM_CODES[2]:
        case PROGRAM_CODES[3]:
            return (
                <div>
                    <ServicesFormHandler
                        isUpdate={true}
                        reportingDataType={pgrmCode}
                        data={event}
                        onSuccessfulUpdate={onModifySuccess}
                        onModifyCancel={onModifyCancel}>
                    </ServicesFormHandler>
                </div>
            );
        case PROGRAM_CODES[4]:
        case PROGRAM_CODES[5]:
            return (
                <div>
                    <VolunteerCleanupFormHandler
                        isUpdate={true}
                        reportingDataType={pgrmCode}
                        data={event}
                        onSuccessfulUpdate={onModifySuccess}
                        onModifyCancel={onModifyCancel}>
                    </VolunteerCleanupFormHandler>
                </div>
            );
        case PROGRAM_CODES[6]:
        case PROGRAM_CODES[7]:
        case PROGRAM_CODES[8]:
            return (
                <div>
                    <OtherFormHandler
                        isUpdate={true}
                        reportingDataType={pgrmCode}
                        data={event}
                        onSuccessfulUpdate={onModifySuccess}
                        onModifyCancel={onModifyCancel}>
                    </OtherFormHandler>
                </div>
            )
    }
}