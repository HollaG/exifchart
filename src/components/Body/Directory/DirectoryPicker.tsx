// This file is in .jsx and not .tsx because Typescript does not support window.showDirectoryPicker().

import Button from "../../../ui/Button";

import * as CONSTANTS from "../../../config/CONSTANTS.json";
import { useDispatch } from "react-redux";
import { filesActions } from "../../../store/files-slice";

import exifr from "exifr";
import { useCallback, useState } from "react";
import { directoriesActions } from "../../../store/directories-slice";
import DirectoryButton from "../../../ui/DirectoryButton";

const DirectoryPicker = () => {
    const [currentScannedFile, setCurrentScannedFile] = useState<string>();

    const dispatch = useDispatch();

    const showDirectoriesHandler = async () => {
        const dirHandle = await window.showDirectoryPicker();
        

        const getFiles = async (
            directory: FileSystemDirectoryHandle,
            currentDirectoryPathArray: String[]
        ) => {
            let directoryContainsAnotherDirectory = false; // Does this folder contain a nested folder?

            let currentDirectoryHasFiles = false;

            for await (const entry of directory.values()) {
                // Recursively iterate through all directories
                try {
                    if (entry.kind === "directory") {
                        directoryContainsAnotherDirectory = true;

                        // console.log(`-- Found directory: ${entry.name} --`);

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

            setCurrentScannedFile("");
        };
        await getFiles(dirHandle, []);
        dispatch(directoriesActions.constructTree());
    };

    const scanDirectoriesHandler = async () => {
        const dirHandle = await window.showDirectoryPicker();

        const getFiles = async (
            directory: FileSystemDirectoryHandle,
            currentDirectoryPathArray: string[]
        ) => {
            for await (const entry of directory.values()) {
                // Recursively iterate through all files
                try {
                    if (entry.kind !== "directory") {
                        // Ignore any filetypes that are not supported, as listed in CONSTANTS.json
                        let fileType = entry.name.split(".").pop();

                        if (
                            fileType &&
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
            setCurrentScannedFile("");
        };
        await getFiles(dirHandle, [" "]);
    };

    return (
        <div className="button-wrapper">
            <div className="mx-1 inline">
                <DirectoryButton
                    onClick={scanDirectoriesHandler}
                    buttonProps={{ disabled: "disabled" }}
                >
                    Scan
                </DirectoryButton>
            </div>
            <div className="mx-1 inline">
                <DirectoryButton onClick={showDirectoriesHandler}>
                    Select
                </DirectoryButton>
            </div>

            {currentScannedFile && <p> Scanning file {currentScannedFile}</p>}
        </div>
    );
};

export default DirectoryPicker;
