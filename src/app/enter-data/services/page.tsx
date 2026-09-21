import { Metadata } from 'next';
import { ServicesFormHandler } from './servicesFormHandler';
import { REPORTING_DATA_VALUES } from './servicesJson';

export const metadata: Metadata = {
  title: 'Enter Data | WARD',
  description: 'Enter reporting data for various KPB activities',
  icons: ['./favicon.png']
};

export default async function EnterServicesData() {
  return (
    <div className="px-2 sm:px-4 md:px-8">
      <ServicesFormHandler
        isUpdate={false}
        reportingDataType={REPORTING_DATA_VALUES.cleanTeam.code}>
      </ServicesFormHandler>
    </div>
  );
}