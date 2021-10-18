import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import FilesStructure from "../models/Files";
import ImageDetails from "../models/ImageDetails";
import TableDataObject from "../models/TableDataObject";

const initialState: FilesStructure = {
    files: {},
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

            state.files = { ...state.files, ...action.payload };
        },
        setFilteredTableData(state, action: PayloadAction<TableDataObject[]>) {
            state.tableData = action.payload;
        },
    },
});

export const filesActions = filesSlice.actions;
export default filesSlice;
