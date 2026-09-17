import { Metadata } from 'next';
import { VisualizationHandler } from './visualizationHandler';

export const metadata: Metadata = {
  title: 'Enter Data | WARD',
  description: 'Enter reporting data for various KPB activities',
  icons: ['./favicon.png']
};

export default function VisualizeMetrics() {
  return (
    <div className="px-2 sm:px-4 md:px-8">
        <header>
            <h1 id="main-content-header" className="text-xl md:text-2xl" tabIndex={-1}>
                Visualize Metrics
            </h1>
            <p>
                Use the fields to specify the time period and the metric you want to visualize,
                then select 'Update' to display that metric on the chart or table.
                You may toggle between chart or table using the radio buttons above the data visualization.
            </p>
        </header>
        <VisualizationHandler></VisualizationHandler>
    </div>
  );
}