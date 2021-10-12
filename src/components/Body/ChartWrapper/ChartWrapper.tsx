import React, {  useState } from "react";

import ChartPicker from "./ChartPicker";
import ChartViewer from "./ChartViewer";

import { saveAs } from "file-saver";
import { ChartItem } from "chart.js";
import Container from "../../../ui/Container";
import ContainerHeader from "../../../ui/ContainerHeader";
import ContainerContents from "../../../ui/ContainerContents";

const ChartWrapper = () => {
    const [shownGraph, setShownGraph] = useState("");

    const chartRef = React.createRef<ChartItem>();

    const saveChartAsImage = () => {
        // console.log("Downloading...");
        if (chartRef && chartRef.current) {
            const canvas = chartRef.current.canvas;
            canvas.toBlob(function(blob: Blob) {
                saveAs(blob, "exifchart.jpg")
            })
        }
    };


    return (
        <Container>
            <ContainerHeader>
                <h1 className="flex-grow text-xl px-3"> Charts </h1>   
                <ChartPicker saveChartAsImage={saveChartAsImage}
                setShownGraph={setShownGraph}
                shownGraph={shownGraph}/>
            </ContainerHeader>
            <ContainerContents>
                <ChartViewer ref={chartRef} shownGraph={shownGraph} />

            </ContainerContents>
        </Container>
    )

};

export default ChartWrapper;
