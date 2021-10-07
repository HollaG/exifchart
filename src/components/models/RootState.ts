import { resultInterface } from "./DirectoryStructure";
import ImageDetails from "./ImageDetails";

export default interface RootState {
    files: ImageDetails[],
    directories: {
        rootFolder: resultInterface[],
		folderList: string[]
    }
}
