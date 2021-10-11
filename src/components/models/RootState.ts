import ChartData from "./ChartData";
import DirectoryStructure, { resultInterface } from "./Directory";
import FilesStructure from "./Files";
import ImageDetails from "./ImageDetails";
import Status from "./Status";

export default interface RootState {
    files: FilesStructure
    directories: DirectoryStructure,
    charts: {
        focalLength: ChartData,
        aperture: ChartData,
        shutterSpeed: ChartData,
        iso: ChartData
    },
    status: Status
}
