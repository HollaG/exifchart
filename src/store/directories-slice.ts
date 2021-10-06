import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import DirectoryDetails from "../components/models/DirectoryDetails";
import DirectoryStructure from "../components/models/DirectoryStructure";

const initialState: DirectoryStructure = {
    rootFolder: {},
};

const directoriesSlice = createSlice({
    name: "directories",
    initialState,
    reducers: {
        addDirectory: (state, action: PayloadAction<String>) => {
            // action.payload --> /Photo Outings/01_04_2021/Edited (for example)

            const folderTree = action.payload.split("/");
            console.log(folderTree);

            for (let i = 0; i < folderTree.length; i++) {
                let folder = folderTree[i];

                // Check if the current folder exists in the State.
                let folderPath = folderTree.slice(0, i+1);
                console.log({ folderPath, folder });
                for (let nestedFolder of folderPath) {
                    console.log(nestedFolder)
                    if (!Object.keys(state.rootFolder).includes(nestedFolder)) {
                        // Create the folder structure in the tree
                        state.rootFolder[nestedFolder] = 1;
                        
                    }
                }
            }

            
        },
    },
});

export const directoriesActions = directoriesSlice.actions;
export default directoriesSlice;
