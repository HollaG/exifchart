import React from "react";
import Select from "react-select";
import DirectoryButton from "../../../ui/DirectoryButton";
const selectOptions = [
    { value: "focalLength", label: "Focal Length" },
    { value: "aperture", label: "Aperture" },
    { value: "iso", label: "ISO" },
    { value: "shutterSpeed", label: "Shutter Speed" },
];
const ChartPicker: React.FC<{
    setShownGraph: (value: string) => void;
    shownGraph: string;
    saveChartAsImage: () => void;
}> = ({ setShownGraph, saveChartAsImage, shownGraph }) => {
    const selectChartHandler = (
        option: { value: string; label: string } | null
    ) => {
        switch (option?.value) {
            case "focalLength":
                setShownGraph(option?.value);

                break;
            case "aperture":
                setShownGraph(option?.value);

                break;
            case "iso":
                setShownGraph(option?.value);

                break;
            case "shutterSpeed":
                setShownGraph(option?.value);

                break;
            default:
                console.log("Value wasn't an option");
        }
    };

    return (
        <>
            {shownGraph !== "" && (
                <DirectoryButton onClick={saveChartAsImage} extraClasses="mx-2">
                    
                    Export
                </DirectoryButton>
            )}
            <Select onChange={selectChartHandler} options={selectOptions} />
        </>
    );

    return (
        <div
            className="charts-header flex p-3 bg-gray-100 border-gray-100 rounded-t items-center"
            style={{
                height: "66px", // Just to match with the Directory header
            }}
        >
            <h1 className="flex-grow text-xl px-3"> Charts </h1>
            {shownGraph !== "" && (
                <DirectoryButton onClick={saveChartAsImage} extraClasses="mx-2">
                    {" "}
                    Export{" "}
                </DirectoryButton>
            )}
            <Select onChange={selectChartHandler} options={selectOptions} />
        </div>
    );
};
export default ChartPicker;
