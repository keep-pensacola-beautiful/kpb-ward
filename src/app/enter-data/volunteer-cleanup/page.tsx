import { Metadata } from 'next';
import { VolunteerCleanupFormHandler } from './volunteerCleanupFormHandler';
import { REPORTING_DATA_VALUES } from './volunteerCleanupJson';

export const metadata: Metadata = {
  title: 'Enter Data | WARD',
  description: 'Enter reporting data for various KPB activities',
  icons: ['./favicon.png']
};

export default async function EnterVolunteerCleanupData() {
  return (
    <div className="px-2 sm:px-4 md:px-8">
      <VolunteerCleanupFormHandler
        isUpdate={false}
        reportingDataType={REPORTING_DATA_VALUES.adoptASpot.code}>
      </VolunteerCleanupFormHandler>
    </div>
  );
}