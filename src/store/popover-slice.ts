import { createSlice, PayloadAction } from "@reduxjs/toolkit";





const initialState: {
    x: number,
    y: number,
    shown: boolean,
    id: string
} = {
    x: 0,
    y: 0,
    shown: false,
    id: ''
};

const popoverSlice = createSlice({
    name: "popover",
    initialState,
    reducers: {
        setPopover(state, action) {
            // Set x and y coordinates to the click position
        }
    },
});

export const popoverActions = popoverSlice.actions;
export default popoverSlice;
