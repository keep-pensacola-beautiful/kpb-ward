import { Metadata } from 'next';
import { OtherFormHandler } from './otherFormHandler';
import { REPORTING_DATA_VALUES } from './otherJson';

export const metadata: Metadata = {
  title: 'Enter Data | WARD',
  description: 'Enter reporting data for various KPB activities',
  icons: ['./favicon.png']
};

export default function EnterOtherData() {
  return (
    <div className="px-2 sm:px-4 md:px-8">
      <OtherFormHandler
        isUpdate={false}
        reportingDataType={REPORTING_DATA_VALUES.bagSwap.code}>
      </OtherFormHandler>
    </div>
  );
}