import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import ImageDetails from "../components/models/ImageDetails";




const initialState: ImageDetails[] = []

const filesSlice = createSlice({
    name: "files",
    initialState,
    reducers: {
        addFile: (state, action: PayloadAction<ImageDetails>) => {
            state.push(action.payload)
        }
    }
})

export const filesActions = filesSlice.actions
export default filesSlice