import React from "react";
import Select from "react-select";
import DirectoryButton from "../../../../ui/DirectoryButton";
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
};
export default ChartPicker;
