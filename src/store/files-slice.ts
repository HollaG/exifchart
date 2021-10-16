import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import ImageDetails from "../models/ImageDetails";
import TableDataObject from "../models/TableDataObject";
import formatShutter from "../functions/formatShutter";

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
        },
        setFiles: (
            state,
            action: PayloadAction<{ [key: string]: ImageDetails }>
        ) => {
            // console.log("FilesSlice reducer: setFiles");
            let numberOfItemsAlreadyPresent = state.tableData.length

            state.files = { ...state.files, ...action.payload };
            state.tableData = [
                ...state.tableData,
                ...Object.keys(action.payload).map((key, index) => {
                    let pathToFile = action.payload[key].path
                        ? `${action.payload[key].path}/${action.payload[key].name}`
                        : action.payload[key].name;
                    let ss = action.payload[key].shutterSpeed;
                    
                    return {
                        ...action.payload[key],
                        id: numberOfItemsAlreadyPresent + index + 1,
                        path: pathToFile,
                        shutterSpeed: formatShutter(ss),
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
