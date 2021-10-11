// This file is in .jsx and not .tsx because Typescript does not support window.showDirectoryPicker().

import Button from "../../../ui/Button";

import * as CONSTANTS from "../../../config/CONSTANTS.json";
import { useDispatch, useSelector } from "react-redux";
import { filesActions } from "../../../store/files-slice";

import exifr from "exifr";
import { useCallback, useEffect, useState } from "react";
import { directoriesActions } from "../../../store/directories-slice";
import DirectoryButton from "../../../ui/DirectoryButton";

import { get, set } from "idb-keyval";
import { statusActions } from "../../../store/status-slice";
import RootState from "../../models/RootState";

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
                                    [
                                        ...currentDirectoryPathArray,
                                        entry.name,
                                    ].join("/")
                                )
                            );

                            await getFiles(entry, [
                                ...currentDirectoryPathArray,
                                entry.name,
                            ]);
                        } else {
                            currentDirectoryHasFiles = true;
                            // Ignore any filetypes that are not supported, as listed in CONSTANTS.json
                            let fileType = entry.name.split(".").pop();

                            if (
                                fileType &&
                                CONSTANTS.SUPPORTED_FILETYPES.includes(
                                    fileType.toLowerCase()
                                )
                            ) {
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

                                dispatch(
                                    filesActions.addFile({
                                        name: entry.name,
                                        path: filePath,
                                        aperture: fileData.FNumber,
                                        focalLength:
                                            calculate35mmFocalLength(fileData),
                                        iso: fileData.ISO,
                                        shutterSpeed:
                                            Math.round(
                                                10 / fileData.ExposureTime
                                            ) / 10,
                                        exposureCompensation:
                                            fileData.ExposureCompensation,
                                        exposureMode: fileData.ExposureProgram,
                                        lensModel: fileData.LensModel,
                                        cameraModel: fileData.Model,
                                        whiteBalance: fileData.WhiteBalance,
                                    })
                                );
                                dispatch(
                                    directoriesActions.addDirectory(
                                        [
                                            ...currentDirectoryPathArray,
                                            entry.name,
                                        ].join("/")
                                    )
                                );

                                dispatch(
                                    statusActions.setStatus(
                                        `Found ${filePath}/${entry.name}`
                                    )
                                );
                            }
                        }

                        // Add the FileHandle or DirectoryHandle to IndexedDB (handle --> 'entry')
                        let pathToFile = currentDirectoryPathArray.join("/")
                            ? `${currentDirectoryPathArray.join("/")}/${
                                  entry.name
                              }`
                            : entry.name;
                        await set(pathToFile, entry);
                    } catch (e) {
                        console.log(
                            "There was an error parsing this file: ",
                            entry,
                            e
                        );
                    }
                }
            };
            const dirHandle = await window.showDirectoryPicker();
            console.log({dirHandle})
            dispatch(statusActions.setStatus("Starting scan..."));

            await getFiles(dirHandle, []);
            dispatch(statusActions.setStatus(""));

            dispatch(directoriesActions.constructTree());
        } catch (e) {
            console.log(e);
        }
    };

    
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
