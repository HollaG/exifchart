import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import DirectoryStructure, {
    resultInterface,
} from "../components/models/Directory";

const initialState: DirectoryStructure = {
    rootFolder: [],
    folderList: [],
    mapFolderOrFileIdToImage: {},
    constructing: false,
};

const uid = function () {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
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

            state.folderList.push(...action.payload)
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

            // Because we merely add a new subtree to the whole directory tree, we need to keep track of which items we loop over in state.folderList. We should only loop over new items, not items already looped over
            let indexToStartIterating = 0;
            const getChildren = (children: any) => {
                for (let child of children) {
                    indexToStartIterating++;
                    if (child.children)
                        if (child.children.length) {
                            getChildren(child.children);
                        }
                }
            };
            if (state.rootFolder.length) {
                state.rootFolder.forEach((tree) => {
                    // Get the total number of children of this tree
                    // However, note that the root tree itself should not be added to the iterator              

                    
                    getChildren(tree.children);
                    
                });
            }


            for (let i = indexToStartIterating; i < directories.length; i++) {
                let path = directories[i];
                path.split("/").reduce((r: any, name) => {
                    if (!r[name]) {
                        r[name] = { result: [] };

                        let id = uid();

                        r.result.push({
                            value: id,
                            label: name,
                            children: r[name].result,
                        });
                        state.mapFolderOrFileIdToImage[id] = Object.keys(
                            state.mapFolderOrFileIdToImage
                        ).length;
                    }
                    return r[name];
                }, level);
            }

            // console.log("Completed directory tree construction");
            state.rootFolder.push({
                value: state.rootFolder.length.toString(),
                label: `Import ${state.rootFolder.length + 1}`,
                children: result,
            });
            state.constructing = false;

            // state.rootFolder = result
        },
    },
});

export const directoriesActions = directoriesSlice.actions;
export default directoriesSlice;
