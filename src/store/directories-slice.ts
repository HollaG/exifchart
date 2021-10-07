import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "@reduxjs/toolkit/node_modules/immer/dist/internal";

import DirectoryStructure, {
    resultInterface,
} from "../components/models/DirectoryStructure";

const initialState: DirectoryStructure = {
    rootFolder: [],
    folderList: [],
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
        constructTree(state) {
            console.log("Constructing directory tree");

            const directories = state.folderList;

            // Taken from: https://stackoverflow.com/questions/57344694/create-a-tree-from-a-list-of-strings-containing-paths-of-files-javascript
            // Thanks!
            let result: resultInterface[] = [];
            let level = { result };

            directories?.forEach((path) => {
                path.split("/").reduce((r: any, name) => {
                    if (!r[name]) {
                        r[name] = { result: [] };

                        let id = uid();

                        r.result.push({
                            value: id,
                            label: name,
                            children: r[name].result,
                        });
                    }
                    return r[name];
                }, level);
            });
            console.log("Completed directory tree construction");
            state.rootFolder.push({
              value: state.rootFolder.length.toString(),
              label: `Import ${state.rootFolder.length + 1}`,
              children: result
            })
            // state.rootFolder = result
        },
    },
});

export const directoriesActions = directoriesSlice.actions;
export default directoriesSlice;
