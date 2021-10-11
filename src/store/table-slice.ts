import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Column } from "react-table";
interface DataObject {
    id: number;
    filePath: string;
    image: string;
    cameraModel: string;
    lensModel: string;
    focalLength: number;
    shutterSpeed: number;
    aperture: number;
    iso: number;
    exposureMode: string;
    exposureComp: number;
    whiteBalance: string;
}
const columns: Column<DataObject>[] = [
    {
        Header: "#",
        accessor: "id" as keyof DataObject,
    },
    {
        Header: "File Path",
        accessor: "filePath" as keyof DataObject,
    },
    {
        Header: "Preview",
        accessor: "image" as keyof DataObject,
    },
    {
        Header: "Camera Model",
        accessor: "cameraModel" as keyof DataObject,
    },
    {
        Header: "Lens Model",
        accessor: "lensModel" as keyof DataObject,
    },
    {
        Header: "Focal Length (35mm equiv)",
        accessor: "focalLength" as keyof DataObject,
    },
    {
        Header: "Shutter Speed",
        accessor: "shutterSpeed" as keyof DataObject,
    },
    {
        Header: "Aperture",
        accessor: "aperture" as keyof DataObject,
    },

    {
        Header: "ISO",
        accessor: "iso" as keyof DataObject,
    },
    {
        Header: "Exposure Mode",
        accessor: "exposureMode" as keyof DataObject,
    },
    {
        Header: "Exposure Compensation" as keyof DataObject,
        accessor: "exposureComp",
    },
    {
        Header: "White Balance",
        accessor: "whiteBalance" as keyof DataObject,
    },
];

const initialState: {columns: Column<DataObject>[], data: DataObject[]} = {
    columns,
    data: []
};

const tableSlice = createSlice({
    name: "table",
    initialState,
    reducers: {},
});

export const tableActions = tableSlice.actions;
export default tableSlice;
