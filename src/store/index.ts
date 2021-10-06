import { configureStore } from "@reduxjs/toolkit";
import directoriesSlice from "./directories-slice";
import filesSlice from "./files-slice";

const store = configureStore({
    reducer: {
        files: filesSlice.reducer,
        directories: directoriesSlice.reducer
    }
})

export default store