import { configureStore } from "@reduxjs/toolkit";
import chartsSlice from "./charts-slice";
import directoriesSlice from "./directories-slice";
import filesSlice from "./files-slice";
import modalSlice from "./modal-slice";
import statusSlice from "./status-slice";

const store = configureStore({
    reducer: {
        files: filesSlice.reducer,
        directories: directoriesSlice.reducer,
        charts: chartsSlice.reducer,
        status: statusSlice.reducer,
        modal: modalSlice.reducer
    }
})

export default store