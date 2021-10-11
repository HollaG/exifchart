import ChartData from "./ChartData";
import DirectoryStructure, { resultInterface } from "./DirectoryStructure";
import ImageDetails from "./ImageDetails";
import Status from "./Status";

export default interface RootState {
    files: { files: { [key: string]: ImageDetails }; selectedIDs: string[] };
    directories: DirectoryStructure,
    charts: {
        focalLength: ChartData,
        aperture: ChartData,
        shutterSpeed: ChartData,
        iso: ChartData
    },
    status: Status
}
