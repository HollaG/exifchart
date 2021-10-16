import * as CONSTANTS from "../../../config/CONSTANTS.json";
import { useDispatch } from "react-redux";
import { filesActions } from "../../../store/files-slice";
import exifr from "exifr";
import { directoriesActions } from "../../../store/directories-slice";
import DirectoryButton from "../../../ui/DirectoryButton";
import { setMany } from "idb-keyval";
import { statusActions } from "../../../store/status-slice";
import ImageDetails from "../../models/ImageDetails";
import { directoryOpen } from "browser-fs-access/dist";
import { useEffect, useState } from "react";

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

    const [currentScannedFile, setCurrentScannedFile] = useState("")
    useEffect(() => {
        dispatch(statusActions.setStatus({text: `Found: ${currentScannedFile}`, percent: 1}));
    }, [currentScannedFile, dispatch])
    const showDirectoriesHandler = async () => {
        try {
            const getFallbackFiles = async (
                files: File[]
            ): Promise<{
                directoriesToAdd: string[];
                filesToAdd: { [key: string]: ImageDetails };
                indexedDBtoAdd: [string, string][];
            }> => {
                let directoriesToAdd: string[] = [];
                let filesToAdd: { [key: string]: ImageDetails } = {};
                let indexedDBtoAdd: [string, string][] = [];

                let alreadyAddedDirectories: { [key: string]: boolean } = {};
                for (const [i, file] of files.entries()) {
                    try {
                        let fileType = file.name.split(".").pop();

                        if (
                            fileType &&
                            CONSTANTS.SUPPORTED_FILETYPES.includes(
                                fileType.toLowerCase()
                            )
                        ) {
                            let pathArr = file.webkitRelativePath.split("/");
                            // pathArr.shift() // Don't categories under 'Import 1', but instead under the selected folder name
                            let fullPathToFile = pathArr.join("/");

                            pathArr.forEach((element, index) => {
                                let path = [
                                    ...pathArr.slice(0, index),
                                    element,
                                ].join("/");
                                if (!alreadyAddedDirectories[path]) {
                                    alreadyAddedDirectories[path] = true;
                                    directoriesToAdd.push(path);
                                }
                            });

                            const fileData = await exifr.parse(
                                file,
                                CONSTANTS.EXIF_TAGS
                            );

                            // Push the item into the Redux store
                            pathArr.pop(); // Remove the file name from the path array
                            let filePath = pathArr.join("/"); // this is the directory path to the file

                            filesToAdd[fullPathToFile] = {
                                name: file.name,
                                path: filePath,
                                aperture: fileData.FNumber,
                                focalLength: calculate35mmFocalLength(fileData),
                                iso: fileData.ISO,
                                shutterSpeed:
                                    Math.round(10 / fileData.ExposureTime) / 10,
                                exposureCompensation:
                                    fileData.ExposureCompensation,
                                exposureMode: fileData.ExposureProgram,
                                lensModel: fileData.LensModel,
                                cameraModel: fileData.Model,
                                whiteBalance: fileData.WhiteBalance,
                                index: directoriesToAdd.length - 1, // Subtract 1 because we want to refer to this element in folderList. However, in directoriesToAdd,
                                // we've already included this element.
                                // ['other elem, 'the elem we want'] --> length: 2, index: 1
                            };

                            indexedDBtoAdd.push([
                                fullPathToFile,
                                URL.createObjectURL(file),
                            ]);
                            let curPercent = 1 + (i / totalFiles) * 95;
                            dispatch(
                                statusActions.setStatus({
                                    text: `Scanned: ${
                                        file.name
                                    } (${i}/${totalFiles})<br/>Directory: ${
                                        filePath ? filePath : "/"
                                    }`,
                                    percent: curPercent,
                                })
                            );
                            
                        }
                    } catch (e) {
                        console.log(e);
                    }
                }
                return {
                    directoriesToAdd,
                    filesToAdd,
                    indexedDBtoAdd,
                };
            };

            dispatch(statusActions.setStatus({text: `Waiting for user selection...`, percent: 0}));
            const blobsInDirectory = await directoryOpen({
                recursive: true,
            }, CONSTANTS.SUPPORTED_FILETYPES, setCurrentScannedFile);
            const totalFiles = blobsInDirectory.length;
            console.log(totalFiles)
            dispatch(statusActions.setStatus({text: `Reading directory...`, percent: 1}));
            let timeStart = performance.now();

            const { directoriesToAdd, filesToAdd, indexedDBtoAdd } =
                await getFallbackFiles(blobsInDirectory);

            dispatch(statusActions.setStatus({text: `Manipulating data...`, percent: 97}));

            // Update the states with the new values (directoriesToAdd, filesToAdd)
            dispatch(directoriesActions.setDirectories(directoriesToAdd));
            dispatch(filesActions.setFiles(filesToAdd));
            dispatch(statusActions.setStatus({text: `Manipulating data...`, percent: 98}));

            await setMany(indexedDBtoAdd);
            dispatch(statusActions.setStatus({text: `Manipulating data...`, percent: 99}));

            dispatch(directoriesActions.constructTree());

            let timeTaken =
                Math.round(((performance.now() - timeStart) / 1000) * 100) /
                100;
            dispatch(
                statusActions.setStatus({text: `Completed! (${timeTaken} seconds)`, percent: 100})
            );

            setTimeout(() => dispatch(statusActions.setStatus({text: "", percent: 0})), 5000);

            
        } catch (e: any) {
            console.trace(e);
            dispatch(statusActions.setStatus({text: e.toString(), percent: 0}))
            setTimeout(() => dispatch(statusActions.setStatus({text: "", percent: 0})), 5000);


        }
    };

    return (
        <div className="button-wrapper">
            <div className="mx-1 inline">
                <DirectoryButton onClick={showDirectoriesHandler}>
                    Select directories
                </DirectoryButton>
                
            </div>
        </div>
    );
};

export default DirectoryPicker;
