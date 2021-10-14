import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Status from "../components/models/Status";

const initialState: Status = {
    scanning: false,
    text: "",
    nextAction: "",
};

const statusSlice = createSlice({
    name: "status",
    initialState,
    reducers: {
        setStatus(state, action: PayloadAction<string>) {
            if (action.payload) {
                // if there's a string being set here, it means we are scanning something
                state.scanning = true;
                state.text = action.payload;
            } else {
                state.scanning = false;
                state.text = "";
            }
        },
        setNextAction(state, action: PayloadAction<string>) {
            state.nextAction = action.payload;
        },
    },
});

export const statusActions = statusSlice.actions;
export default statusSlice;
