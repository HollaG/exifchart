import * as CONSTANTS from "../../../../config/CONSTANTS.json";
import { useDispatch } from "react-redux";
import { filesActions } from "../../../../store/files-slice";
import exifr from "exifr";
import { directoriesActions } from "../../../../store/directories-slice";
import BodyButton from "../../../../ui/BodyButton";
import { setMany } from "idb-keyval";
import { statusActions } from "../../../../store/status-slice";
import ImageDetails from "../../../../models/ImageDetails";
import { directoryOpen } from "browser-fs-access/dist";
import { useEffect, useState } from "react";
import calculate35mmFocalLength from "../../../../functions/calculate35mmFocalLength";



const DirectoryPicker = () => {
    const dispatch = useDispatch();

    const [currentScannedFile, setCurrentScannedFile] = useState("");
    useEffect(() => {
        dispatch(
            statusActions.setStatus({
                text: `Found: ${currentScannedFile}`,
                percent: 1,
            })
        );
    }, [currentScannedFile, dispatch]);
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
                            exposureCompensation: fileData.ExposureCompensation,
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

            dispatch(
                statusActions.setStatus({
                    text: `Waiting for user selection...`,
                    percent: 0,
                })
            );
            const blobsInDirectory = await directoryOpen(
                {
                    recursive: true,
                    extensions: CONSTANTS.SUPPORTED_FILETYPES,
                },
                setCurrentScannedFile
            );
            const totalFiles = blobsInDirectory.length;
            dispatch(
                statusActions.setStatus({
                    text: `Reading directory...`,
                    percent: 1,
                })
            );
            let timeStart = performance.now();

            const { directoriesToAdd, filesToAdd, indexedDBtoAdd } =
                await getFallbackFiles(blobsInDirectory);

            dispatch(
                statusActions.setStatus({
                    text: `Manipulating data...`,
                    percent: 97,
                })
            );

            // Update the states with the new values (directoriesToAdd, filesToAdd)
            dispatch(directoriesActions.setDirectories(directoriesToAdd));
            dispatch(filesActions.setFiles(filesToAdd));
            dispatch(
                statusActions.setStatus({
                    text: `Manipulating data...`,
                    percent: 98,
                })
            );

            await setMany(indexedDBtoAdd);
            dispatch(
                statusActions.setStatus({
                    text: `Manipulating data...`,
                    percent: 99,
                })
            );

            dispatch(directoriesActions.constructTree());

            let timeTaken =
                Math.round(((performance.now() - timeStart) / 1000) * 100) /
                100;
            dispatch(
                statusActions.setStatus({
                    text: `Completed! (${timeTaken} seconds)`,
                    percent: 100,
                })
            );

            setTimeout(
                () =>
                    dispatch(statusActions.setStatus({ text: "", percent: 0 })),
                5000
            );
        } catch (e: any) {
            console.trace(e);
            dispatch(
                statusActions.setStatus({ text: e.toString(), percent: 0 })
            );
            setTimeout(
                () =>
                    dispatch(statusActions.setStatus({ text: "", percent: 0 })),
                5000
            );
        }
    };

    return (
        <div className="button-wrapper">
            <div className="mx-1 inline">
                <BodyButton onClick={showDirectoriesHandler}>
                    Select directories
                </BodyButton>
            </div>
        </div>
    );
};

export default DirectoryPicker;
