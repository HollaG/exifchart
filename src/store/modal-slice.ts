import { createSlice, PayloadAction } from "@reduxjs/toolkit";



export interface ModalStructure {
    src: string,
    text: string
}

const initialState: ModalStructure = {
    src: "",
    text: ""
};

const modalSlice = createSlice({
    name: "modal",
    initialState,
    reducers: {
        setModal(state, action:PayloadAction<ModalStructure>) {
            state.src = action.payload.src
            state.text = action.payload.text
        },
        clearModal(state) {
            state.src = ""
            state.text = ""
        }
    },
});

export const modalActions = modalSlice.actions;
export default modalSlice;
