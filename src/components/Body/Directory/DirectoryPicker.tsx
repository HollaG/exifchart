import * as CONSTANTS from "../../../config/CONSTANTS.json";
import { useDispatch } from "react-redux";
import { filesActions } from "../../../store/files-slice";
import exifr from "exifr";
import { directoriesActions } from "../../../store/directories-slice";
import DirectoryButton from "../../../ui/DirectoryButton";
import { setMany } from "idb-keyval";
import { statusActions } from "../../../store/status-slice";
import ImageDetails from "../../models/ImageDetails";



const calculate35mmFocalLength = (tags: {
    FocalLengthIn35mmFormat: number;
    FocalLength: number;
    ExifImageHeight: number;
    ExifImageWidth: number;
    FocalPlaneXResolution: number;
    FocalPlaneYResolution: number;
    ResolutionUnit: string;
    FocalPlaneResolutionUnit: string;
    [key: string]: string | number;
}): number => {
    /* Conditions for this function to run:
    1) Exif tag 'FocalLengthIn35mmFormat' must not exist
    2) Exif tags 'ExifImageHeight, ExifImageWidth' must exist
    3) Exif tags 'FocalPlaneXResolution' and 'FocalPlaneYResolution' must exist
    4) If tags in 3) are not equal, calculate the average of the two values.
    5) Exif tag 'ResolutionUnit' must be in 'inches'.

     */

    const {
        FocalLengthIn35mmFormat,
        FocalLength,
        ExifImageHeight,
        ExifImageWidth,
        FocalPlaneXResolution,
        FocalPlaneYResolution,
        ResolutionUnit,
        FocalPlaneResolutionUnit,
    } = tags;

    if (FocalLength || FocalLengthIn35mmFormat) {
        if (FocalLengthIn35mmFormat) return Number(FocalLengthIn35mmFormat);

        if (!ExifImageHeight || !ExifImageWidth) return Number(FocalLength);

        let ppi = Number(FocalPlaneXResolution);
        if (FocalPlaneXResolution !== FocalPlaneYResolution) {
            ppi =
                (Number(FocalPlaneXResolution) +
                    Number(FocalPlaneYResolution)) /
                2;
        }

        if (
            ResolutionUnit.toString().toLowerCase().trim() !== "inches" &&
            FocalPlaneResolutionUnit.toString().toLowerCase().trim() !== "inch"
        ) {
            // Convert ppi to cm
            ppi = ppi / 2.54;
        }

        const sensorWidthInches = Number(ExifImageWidth) / ppi;
        const sensorHeightInches = Number(ExifImageHeight) / ppi;
        const sensorDiagonalInches = Math.sqrt(
            Math.pow(sensorWidthInches, 2) + Math.pow(sensorHeightInches, 2)
        );
        const fullFrameSensorDiagonalInches = CONSTANTS.FF_DIAGONAL_INCHES;

        const cropFactor = fullFrameSensorDiagonalInches / sensorDiagonalInches;
        const roundedCropFactor = Math.round(cropFactor * 10) / 10;

        const equivFocalLength = FocalLength * roundedCropFactor;
        const roundedEquivFocalLength = Math.round(equivFocalLength);

        return roundedEquivFocalLength;
    } else {
        return 0;
    }
};

const DirectoryPicker = () => {
    const dispatch = useDispatch();

    const showDirectoriesHandler = async () => {
        
        try {
            const getFiles = async (
                directory: FileSystemDirectoryHandle,
                currentDirectoryPathArray: String[]
            ): Promise<{
                directoriesToAdd: string[];
                filesToAdd: { [key: string]: ImageDetails };
                indexedDBtoAdd: [
                    string,
                    { entry: FileSystemHandle; thumbnail: string }
                ][];
            }> => {
                let directoriesToAdd: string[] = [];
                let filesToAdd: { [key: string]: ImageDetails } = {};
                let indexedDBtoAdd: [
                    string,
                    { entry: FileSystemHandle; thumbnail: string }
                ][] = [];

                for await (const entry of directory.values()) {
                    // Recursively iterate through all directories
                    try {
                        if (entry.kind === "directory") {
                            // Note: Only for files that have a file extension that is supported OR is a directory
                            // Add the FileHandle or DirectoryHandle to IndexedDB (handle --> 'entry')
                            let pathToFile = currentDirectoryPathArray.join("/")
                                ? `${currentDirectoryPathArray.join("/")}/${
                                      entry.name
                                  }`
                                : entry.name;

                            // todo
                            indexedDBtoAdd.push([
                                pathToFile,
                                { entry, thumbnail: "" },
                            ]);
                            // await set(pathToFile, entry);

                            // console.log(`-- Found directory: ${entry.name} --`);

                            // dispatch(
                            //     directoriesActions.addDirectory(
                            //         [
                            //             ...currentDirectoryPathArray,
                            //             entry.name,
                            //         ].join("/")
                            //     )
                            // );

                            directoriesToAdd.push(
                                [...currentDirectoryPathArray, entry.name].join(
                                    "/"
                                )
                            );

                            let recursiveResult = await getFiles(entry, [
                                ...currentDirectoryPathArray,
                                entry.name,
                            ]);

                            // Add to the overall data object
                            directoriesToAdd.push(
                                ...recursiveResult.directoriesToAdd
                            );
                            filesToAdd = {
                                ...filesToAdd,
                                ...recursiveResult.filesToAdd,
                            };
                            indexedDBtoAdd.push(
                                ...recursiveResult.indexedDBtoAdd
                            );
                        } else {
                            // Ignore any filetypes that are not supported, as listed in CONSTANTS.json
                            let fileType = entry.name.split(".").pop();

                            if (
                                fileType &&
                                CONSTANTS.SUPPORTED_FILETYPES.includes(
                                    fileType.toLowerCase()
                                )
                            ) {
                                // Note: Only for files that have a file extension that is supported OR is a directory
                                // Add the FileHandle or DirectoryHandle to IndexedDB (handle --> 'entry')
                                let pathToFile = currentDirectoryPathArray.join(
                                    "/"
                                )
                                    ? `${currentDirectoryPathArray.join("/")}/${
                                          entry.name
                                      }`
                                    : entry.name;

                                // todo
                                indexedDBtoAdd.push([
                                    pathToFile,
                                    { entry, thumbnail: "" },
                                ]);
                                // await set(pathToFile, entry);

                                let file = await entry.getFile();

                                const fileData = await exifr.parse(
                                    file,
                                    // CONSTANTS.EXIF_TAGS
                                    {
                                        iptc: true,
                                    }
                                );

                                // Push the item into the Redux store
                                let filePath =
                                    currentDirectoryPathArray.join("/");

                                let fullPathToFile = filePath
                                    ? `${filePath}/${file.name}`
                                    : file.name;
                                filesToAdd[fullPathToFile] = {
                                    name: entry.name,
                                    path: filePath,
                                    aperture: fileData.FNumber,
                                    focalLength:
                                        calculate35mmFocalLength(fileData),
                                    iso: fileData.ISO,
                                    shutterSpeed:
                                        Math.round(10 / fileData.ExposureTime) /
                                        10,
                                    exposureCompensation:
                                        fileData.ExposureCompensation,
                                    exposureMode: fileData.ExposureProgram,
                                    lensModel: fileData.LensModel,
                                    cameraModel: fileData.Model,
                                    whiteBalance: fileData.WhiteBalance,
                                };
                                // dispatch(
                                //     filesActions.addFile({
                                //         name: entry.name,
                                //         path: filePath,
                                //         aperture: fileData.FNumber,
                                //         focalLength:
                                //             calculate35mmFocalLength(fileData),
                                //         iso: fileData.ISO,
                                //         shutterSpeed:
                                //             Math.round(
                                //                 10 / fileData.ExposureTime
                                //             ) / 10,
                                //         exposureCompensation:
                                //             fileData.ExposureCompensation,
                                //         exposureMode: fileData.ExposureProgram,
                                //         lensModel: fileData.LensModel,
                                //         cameraModel: fileData.Model,
                                //         whiteBalance: fileData.WhiteBalance,
                                //     })
                                // );

                                directoriesToAdd.push(
                                    [
                                        ...currentDirectoryPathArray,
                                        entry.name,
                                    ].join("/")
                                );
                                // dispatch(
                                //     directoriesActions.addDirectory(
                                //         [
                                //             ...currentDirectoryPathArray,
                                //             entry.name,
                                //         ].join("/")
                                //     )
                                // );

                                dispatch(
                                    statusActions.setStatus(
                                        `Found ${
                                            entry.name
                                        }<br/>in directory: ${
                                            filePath ? filePath : "/"
                                        }`
                                    )
                                );
                            }
                        }
                    } catch (e) {
                        console.log(
                            "There was an error parsing this file: ",
                            entry,
                            e
                        );
                    }
                }

                return { directoriesToAdd, filesToAdd, indexedDBtoAdd };
            };

            // Request permission from user to scan the directories
            const dirHandle = await window.showDirectoryPicker();
            let timeStart = performance.now();

            // Set status
            dispatch(statusActions.setStatus("Starting scan..."));

            // Start recursive function
            const { directoriesToAdd, filesToAdd, indexedDBtoAdd } =
                await getFiles(dirHandle, []);

            // Update the indexedDB
            dispatch(statusActions.setStatus("Updating IndexedDB..."));
            await setMany(indexedDBtoAdd);
            dispatch(statusActions.setStatus("Completed updating IndexedDB"));

            // Update the states with the new values (directoriesToAdd, filesToAdd)
            dispatch(directoriesActions.setDirectories(directoriesToAdd));
            dispatch(filesActions.setFiles(filesToAdd));

            // Set status and construct directory tree
            // dispatch(statusActions.setStatus("Constructing directory tree..."));
            // dispatch(statusActions.setNextAction("dirtree"));
            dispatch(directoriesActions.constructTree());

            let timeTaken =
                Math.round(((performance.now() - timeStart) / 1000) * 100) /
                100;
            dispatch(
                statusActions.setStatus(`Completed! (${timeTaken} seconds)`)
            );
            setTimeout(() => dispatch(statusActions.setStatus("")), 5000);
        } catch (e) {
            console.log(e);
        }
    };

    // const
    // useEffect(() => {

    // })

    return (
        <div className="button-wrapper">
            {/* <div className="mx-1 inline">
                <DirectoryButton
                    onClick={scanDirectoriesHandler}
                    buttonProps={{ disabled: "disabled" }}
                >
                    Scan
                </DirectoryButton>
            </div> */}
            <div className="mx-1 inline">
                <DirectoryButton onClick={showDirectoriesHandler}>
                    Select directories
                </DirectoryButton>
            </div>
        </div>
    );
};

export default DirectoryPicker;
