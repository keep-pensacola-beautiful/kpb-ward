import { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

export function PieChart({
    chartTitle, dataLabel, data
}: { chartTitle: string, dataLabel: string, data: { label: string, value: number }[] }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const chartRef = useRef<Chart>(null);

    useEffect(() => {
        Chart.defaults.font.size = 18;
        if (canvasRef.current) {
            chartRef.current = new Chart(canvasRef.current, {
                type: 'pie',
                data: {
                    labels: data.map((d: { label: string, value: number}) => { return d.label; }),
                    datasets: [{ label: dataLabel, data: data.map((d: { label: string, value: number}) => { return d.value; })}]
                }
            });
        }
        return () => {
            if (chartRef.current) {
                chartRef.current.destroy()
            }
        }
    }, [dataLabel, data]);

    return (<canvas ref={canvasRef} aria-label={chartTitle} className="max-h-[500px]" role="img"></canvas>);
}