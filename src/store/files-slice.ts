import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import ImageDetails from "../components/models/ImageDetails";
import TableDataObject from "../components/models/TableDataObject";

const initialState: {
    files: { [key: string]: ImageDetails };
    selectedIDs: string[];
    tableData: TableDataObject[];
} = {
    files: {},
    selectedIDs: [],
    tableData: [],
};

const filesSlice = createSlice({
    name: "files",
    initialState,
    reducers: {
        addFile: (state, action: PayloadAction<ImageDetails>) => {
            // If the file is not nested, don't add a slash in front (action.payload.path is empty. This would result in /image1.jpg, which is wrong. It should be image1.jpg only.)
            let file = action.payload;
            let pathToFile = file.path
                ? `${file.path}/${file.name}`
                : file.name;

            state.files[pathToFile] = file;

            // state.tableData.push({
            //     id: state.tableData.length,
            //     filePath: pathToFile,
            //     image: "Load",
            //     cameraModel: file.cameraModel,
            //     lensModel: file.lensModel,
            //     focalLength: file.focalLength,
            //     shutterSpeed: file.shutterSpeed,
            //     aperture: file.aperture,
            //     iso: file.iso,
            //     exposureMode: file.exposureMode,
            //     exposureComp: file.exposureCompensation,
            //     whiteBalance: file.whiteBalance,
            // });
        },
    },
});

export const filesActions = filesSlice.actions;
export default filesSlice;
