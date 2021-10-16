export default interface DirectoryStructure {
    rootFolder: resultInterface[];
    folderList: string[];
    mapFolderOrFileIdToImage: { [key: string]: number };
    constructing: boolean;
}
export interface resultInterface {
    value: string;
    label: string;
    children?: resultInterface[];
}
