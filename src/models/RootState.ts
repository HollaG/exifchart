import { ModalStructure } from "../store/modal-slice";
import ChartData from "./ChartData";
import DirectoryStructure from "./Directory";
import FilesStructure from "./Files";
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
    status: Status,
    modal: ModalStructure
}
