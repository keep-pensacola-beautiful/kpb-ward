import { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

export function BarChart({
    chartTitle, dataLabel, data
}: { chartTitle: string, dataLabel: string, data: { label: string, value: number }[] }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const chartRef = useRef<Chart>(null);

    useEffect(() => {
        Chart.defaults.font.size = 18;
        if (canvasRef.current) {
            chartRef.current = new Chart(canvasRef.current, {
                type: 'bar',
                data: {
                    labels: data.map((d: { label: string, value: number}) => { return d.label; }),
                    datasets: [{ label: dataLabel, data: data.map((d: { label: string, value: number}) => { return d.value; })}]
                },
                options: {
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        x: {
                            ticks: {
                                font: {
                                    size: 18
                                }
                            }
                        }
                    }
                }
            });
        }
        return () => {
            if (chartRef.current) {
                chartRef.current.destroy()
            }
        }
    }, [dataLabel, data]);

    return (<canvas ref={canvasRef} className="max-h-[500px]" aria-label={chartTitle} role="img"></canvas>);
}