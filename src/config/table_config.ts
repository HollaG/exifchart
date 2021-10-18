import { Column } from "react-table";
import TableDataObject from "../models/TableDataObject";

export const columns: Column<TableDataObject>[] = [
    {
        Header: "#",
        accessor: "id" as keyof TableDataObject,
    },
    {
        Header: "File Path",
        accessor: "path" as keyof TableDataObject,
    },
    {
        Header: "Preview",
        accessor: "image" as keyof TableDataObject,
    },
    {
        Header: "Camera Model",
        accessor: "cameraModel" as keyof TableDataObject,
    },
    {
        Header: "Lens Model",
        accessor: "lensModel" as keyof TableDataObject,
    },
    {
        Header: "Focal Length",
        accessor: "focalLength" as keyof TableDataObject,
    },
    {
        Header: "Focal Length (35mm equiv)",
        accessor: "focalLength35" as keyof TableDataObject,
    },
    {
        Header: "Shutter Speed",
        accessor: "shutterSpeed" as keyof TableDataObject,
    },
    {
        Header: "Aperture",
        accessor: "aperture" as keyof TableDataObject,
    },

    {
        Header: "ISO",
        accessor: "iso" as keyof TableDataObject,
    },
    {
        Header: "Exposure Mode",
        accessor: "exposureMode" as keyof TableDataObject,
    },
    {
        Header: "Exposure Compensation" as keyof TableDataObject,
        accessor: "exposureCompensation",
    },
    {
        Header: "White Balance",
        accessor: "whiteBalance" as keyof TableDataObject,
    },
];
