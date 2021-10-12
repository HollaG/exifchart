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
            // console.log("FilesSlice reducer: addFile");

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
        setFiles: (
            state,
            action: PayloadAction<{ [key: string]: ImageDetails }>
        ) => {
            // console.log("FilesSlice reducer: setFiles");

            state.files = { ...state.files, ...action.payload };
            state.tableData = [
                ...state.tableData,
                ...Object.keys(action.payload).map((key, index) => {
                    let pathToFile = action.payload[key].path
                        ? `${action.payload[key].path}/${action.payload[key].name}`
                        : action.payload[key].name;
                    let ss = action.payload[key].shutterSpeed;
                    let formattedShutter = "";

                    if (Number(ss) < 1) {
                        formattedShutter = `${
                            Math.round(10 / Number(ss)) / 10
                        }"`;
                    } else if (Number(ss) === 1) {
                        formattedShutter = "1";
                    } else formattedShutter = `1/${Math.round(Number(ss))}`;
                    return {
                        ...action.payload[key],
                        id: index + 1,
                        path: pathToFile,
                        shutterSpeed: formattedShutter,
                        image: "Load",
                    };
                }),
            ];
        },
        setFilteredTableData(state, action: PayloadAction<TableDataObject[]>) {
            state.tableData = action.payload;
        },
    },
});

export const filesActions = filesSlice.actions;
export default filesSlice;
