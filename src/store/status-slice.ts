import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Status from "../models/Status";

const initialState: Status = {
    scanning: false,
    text: "",
    percent: 0
};

const statusSlice = createSlice({
    name: "status",
    initialState,
    reducers: {
        setStatus(state, action: PayloadAction<{text: string, percent: number}>) {
            if (action.payload.text) {
                // if there's a string being set here, it means we are scanning something
                state.scanning = true;
                state.text = action.payload.text;
                state.percent = action.payload.percent
            } else {
                state.scanning = false;
                state.text = "";
                state.percent = 0
            }
        },
        
    },
});

export const statusActions = statusSlice.actions;
export default statusSlice;
