export default interface DirectoryStructure {
    rootFolder: resultInterface[];
    folderList: string[];
    constructing: boolean;
    checked: string[]
}
export interface resultInterface {
    value: string;
    label: string;
    children?: resultInterface[];
}
