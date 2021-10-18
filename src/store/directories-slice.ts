import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import DirectoryStructure, {
    resultInterface,
} from "../models/Directory";

const initialState: DirectoryStructure = {
    rootFolder: [],
    folderList: [],
    checked: [],
    mapFolderOrFileIdToImage: {},
    constructing: false,
};

const directoriesSlice = createSlice({
    name: "directories",
    initialState,
    reducers: {
        addDirectory: (state, action: PayloadAction<string>) => {
            state.folderList.push(action.payload);
        },
        setDirectories: (state, action: PayloadAction<string[]>) => {
            // console.log("DirectoriesSlice reducer: setDirectories");

            state.folderList.push(...action.payload);
        },
        setBeginConstructing(state) {
            state.constructing = true;
        },
        constructTree(state) {
            // console.log("DirectoriesSlice reducer: constructTree");

            const directories = state.folderList;

            // Taken from: https://stackoverflow.com/questions/57344694/create-a-tree-from-a-list-of-strings-containing-paths-of-files-javascript
            // Thanks!
            let result: resultInterface[] = [];
            let level = { result };
            let toCheckIDs: string[] = []

            // How many items were previously already added in 'folderList'? We skip these items so that we do not double-count stuff
            // A new import should be appended to the end of the structure, and should not include any items which were already in the structure.
            // The # of items already included in the structure is given by the number of elements in the mapOfFolderOrFileIdToImage. 
            // folderList is not considered because the new items were already added to folderList.
            let indexToStartIterating = Object.keys(state.mapFolderOrFileIdToImage).length 
            for (let i = indexToStartIterating; i < directories.length; i++) {
                let path = directories[i];
                path.split("/").reduce((r: any, name) => {
                    if (!r[name]) {
                        r[name] = { result: [] };

                        let id = `id-${i}`

                        r.result.push({
                            value: id,
                            label: name,
                            children: r[name].result,
                        });
                        // Impossible to determine if there are children, hence we will add it for BOTH files and folders
                        state.mapFolderOrFileIdToImage[id] = i

                        toCheckIDs.push(id)
                    }
                    return r[name];
                }, level);
            }
            state.rootFolder.push(...result);
            state.constructing = false;
            state.checked.push(...toCheckIDs)
        },
        setChecked(state, action:PayloadAction<string[]>) {
            state.checked = action.payload
        }
    },
});

export const directoriesActions = directoriesSlice.actions;
export default directoriesSlice;
