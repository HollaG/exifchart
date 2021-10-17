import React from "react";

import { useSelector } from "react-redux";
import RootState from "../../../../models/RootState";

import { chartOptions } from "../../../../config/chart_config";
import { Bar, Chart } from "react-chartjs-2";

import zoomPlugin from "chartjs-plugin-zoom";
Chart.register(zoomPlugin);

const ChartViewer = React.forwardRef<
    HTMLCanvasElement,
    {
        shownGraph: string;
    }
>(({ shownGraph }, ref) => {
    const focalLengthChartData: any = useSelector(
        (state: RootState) => state.charts.focalLength
    );
    const apertureChartData: any = useSelector(
        (state: RootState) => state.charts.aperture
    );
    const isoChartData: any = useSelector(
        (state: RootState) => state.charts.iso
    );
    const shutterSpeedChartData: any = useSelector(
        (state: RootState) => state.charts.shutterSpeed
    );

    return (
        <>
            {shownGraph === "" ? (
                <>
                    <p>
                        Select a folder to get started, then select the camera
                        metric you wish to analyze in the top right corner.
                    </p>
                    <p>Only .jpg files are analyzed.</p>
                </>
            ) : (
                <div className="chart-container" style={{ height: "85vh" }}>
                    <div className="min-size-wrapper-chart h-full">
                        {shownGraph === "focalLength" && (
                            <Bar
                                data={focalLengthChartData}
                                options={chartOptions}
                                ref={ref}
                            />
                        )}
                        {shownGraph === "aperture" && (
                            <Bar
                                data={apertureChartData}
                                options={chartOptions}
                                ref={ref}
                            />
                        )}
                        {shownGraph === "iso" && (
                            <Bar
                                data={isoChartData}
                                options={chartOptions}
                                ref={ref}
                            />
                        )}
                        {shownGraph === "shutterSpeed" && (
                            <Bar
                                data={shutterSpeedChartData}
                                options={chartOptions}
                                ref={ref}
                            />
                        )}
                    </div>
                </div>
            )}
        </>
    );
});

export default ChartViewer;
