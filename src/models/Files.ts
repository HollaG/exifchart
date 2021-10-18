import ImageDetails from "./ImageDetails";
import TableDataObject from "./TableDataObject";

export default interface FilesStructure {
    files: { [key: string]: ImageDetails };
    tableData: TableDataObject[];
}