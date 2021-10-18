import React from "react";
import Select from "react-select";
import BodyButton from "../../../../ui/BodyButton";
const selectOptions = [
    { value: "focalLength", label: "Focal Length" },
    { value: "focalLength35", label: "Focal Length (35mm equiv)" },
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
        if (option) setShownGraph(option.value)
    };

    return (
        <>
            {shownGraph !== "" && (
                <BodyButton onClick={saveChartAsImage} extraClasses="mx-2">
                    Export
                </BodyButton>
            )}
            <Select onChange={selectChartHandler} options={selectOptions} />
        </>
    );
};
export default ChartPicker;
