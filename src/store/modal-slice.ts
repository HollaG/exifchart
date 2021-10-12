import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ModalStructure {
    src: string;
    details: DetailObject;
    title: string,
    desc: string

}

interface DetailObject {
    cameraModel: string | undefined;
    lensModel: string | undefined;
    aperture: number | undefined;
    focalLength: number | undefined;
    iso: number | undefined;
    shutterSpeed: number | undefined;
}
const initialState: ModalStructure = {
    src: "",
    details: {
        cameraModel: "",
        lensModel: "",
        aperture: 0,
        focalLength: 0,
        iso: 0,
        shutterSpeed: 0,
    },
    title: '',
    desc: ''
};

const modalSlice = createSlice({
    name: "modal",
    initialState,
    reducers: {
        setModal(
            state,
            action: PayloadAction<{
                src: string;
                title?: string;
                detailObject: DetailObject;
            }>
        ) {
            state.src = action.payload.src;
            // state.title? = action.payload.title

            // Construct header
            const header = ["Shot on"]
            if (action.payload.detailObject.cameraModel) header.push(action.payload.detailObject.cameraModel)
            else header.push("Unknown camera")
            if (action.payload.detailObject.lensModel) { 
                header.push("w/")
                header.push(action.payload.detailObject.lensModel)
            }
            state.title = header.join(" ")
            // Construct desc
            const desc = []
            if (action.payload.detailObject.focalLength) desc.push(`${action.payload.detailObject.focalLength}mm`) 
            else desc.push("Unknown focal length")

            if (action.payload.detailObject.shutterSpeed) { 
                if (action.payload.detailObject.shutterSpeed === 1) {
                    desc.push("SS 1\"")
                } else if (action.payload.detailObject.shutterSpeed < 1) {
                    desc.push(`SS ${Math.round(10/action.payload.detailObject.shutterSpeed)/10}"`)
                } else {
                    desc.push(`SS 1/${Math.round(action.payload.detailObject.shutterSpeed)}`)
                }
            } else desc.push("Unknown SS")
            
            if (action.payload.detailObject.aperture) desc.push(`f/${action.payload.detailObject.aperture}`) 
            else desc.push("Unknown aperture")

            if (action.payload.detailObject.iso) desc.push(`ISO ${action.payload.detailObject.iso}`) 
            else desc.push("Unknown ISO")

            state.desc = desc.join(" | ")

        },
        clearModal(state) {
            console.log("Clearmodal")
            state.src = ""
        },
    },
});

export const modalActions = modalSlice.actions;
export default modalSlice;
