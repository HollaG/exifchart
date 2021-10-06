// This file is in .jsx and not .tsx because Typescript does not support window.showDirectoryPicker().

import Button from "../../ui/Button";

import * as CONSTANTS from "../../config/CONSTANTS.json";
import { useDispatch } from "react-redux";
import { filesActions } from "../../store/files-slice";

import exifr from "exifr";
import { useCallback, useState } from "react";
import { directoriesActions } from "../../store/directories-slice";

const DirectoryPicker = () => {
    const [currentScannedFile, setCurrentScannedFile] = useState();

    const dispatch = useDispatch();

    // v1
    // const showDirectoriesHandler = async (props) => {
    //     const dirHandle = await window.showDirectoryPicker();

    //     const getFiles = async (directory, currentDirectoryPathArray) => {
    //         let directoryContainsAnotherDirectory = false // Does this folder contain a nested folder?

    //         let currentDirectoryHasFiles = false

    //         for await (const entry of directory.values()) {
    //             // Recursively iterate through all files
    //             try {

    //                 if (entry.kind === "directory") {
    //                     directoryContainsAnotherDirectory = true

    //                     console.log(`-- Found directory: ${entry.name} --`);

    //                     await getFiles(entry, [
    //                         ...currentDirectoryPathArray,
    //                         entry.name,
    //                     ]);

    //                 } else {
    //                     currentDirectoryHasFiles = true
    //                 }
    //             } catch (e) {
    //                 console.log(e);
    //             }
    //         }
    //         if (!directoryContainsAnotherDirectory) {
    //             // No more nested directories
    //             dispatch(
    //                 directoriesActions.addDirectory({

    //                     path: currentDirectoryPathArray.join("/"),
    //                     hasFiles: currentDirectoryHasFiles
    //                 })
    //             );
    //         }
    //         setCurrentScannedFile();
    //     };
    //     await getFiles(dirHandle, [""]);
    // };

    // v2
    const showDirectoriesHandler = async (props) => {
        const dirHandle = await window.showDirectoryPicker();

        const getFiles = async (directory, currentDirectoryPathArray) => {
            let directoryContainsAnotherDirectory = false; // Does this folder contain a nested folder?

            let currentDirectoryHasFiles = false;

            for await (const entry of directory.values()) {
                // Recursively iterate through all files
                try {
                    if (entry.kind === "directory") {
                        directoryContainsAnotherDirectory = true;

                        console.log(`-- Found directory: ${entry.name} --`);

                        dispatch(
                            directoriesActions.addDirectory(
                                [...currentDirectoryPathArray, entry.name].join(
                                    "/"
                                )
                            )
                        );
                        await getFiles(entry, [
                            ...currentDirectoryPathArray,
                            entry.name,
                        ]);
                    } else {
                        currentDirectoryHasFiles = true;
                    }
                } catch (e) {
                    console.log(e);
                }
            }

            setCurrentScannedFile();
        };
        await getFiles(dirHandle, []);
    };

    const scanDirectoriesHandler = async (props) => {
        const dirHandle = await window.showDirectoryPicker();

        const getFiles = async (directory, currentDirectoryPathArray) => {
            for await (const entry of directory.values()) {
                // Recursively iterate through all files
                try {
                    if (entry.kind !== "directory") {
                        // Ignore any filetypes that are not supported, as listed in CONSTANTS.json
                        let fileType = entry.name.split(".").pop();
                        if (
                            CONSTANTS.SUPPORTED_FILETYPES.includes(
                                fileType.toLowerCase()
                            )
                        ) {
                            // console.log({ currentDirectoryPathArray });

                            let file = await entry.getFile();

                            const fileData = await exifr.parse(
                                file,
                                CONSTANTS.EXIF_TAGS
                            );

                            // console.log({ fileData });
                            // Push the item into the Redux store
                            dispatch(
                                filesActions.addFile({
                                    name: entry.name,
                                    path: currentDirectoryPathArray.join("/"),
                                    aperture: fileData.FNumber,
                                    focalLength: fileData.FocalLength,
                                    iso: fileData.ISO,
                                    shutterSpeed: 1 / fileData.ExposureTime,
                                    exposureCompensation:
                                        fileData.ExposureCompensation,
                                    exposureMode: fileData.ExposureProgram,
                                    lensModel: fileData.LensModel,
                                    cameraModel: fileData.Model,
                                    whiteBalance: fileData.WhiteBalance,
                                })
                            );
                            setCurrentScannedFile(entry.name);
                        }
                    } else {
                        console.log(`-- Found directory: ${entry.name} --`);

                        await getFiles(entry, [
                            ...currentDirectoryPathArray,
                            entry.name,
                        ]);
                    }
                } catch (e) {
                    console.log(e);
                }
            }
            setCurrentScannedFile();
        };
        await getFiles(dirHandle, [" "]);
    };

    return (
        <div className="text-center">
            <Button onClick={showDirectoriesHandler}> Pick a directory </Button>
            {/* <Button onClick={scanDirectoriesHandler}>
                Scan selected directories
            </Button> */}
            {currentScannedFile && <p> Scanning file {currentScannedFile}</p>}
        </div>
    );
};

export default DirectoryPicker;
