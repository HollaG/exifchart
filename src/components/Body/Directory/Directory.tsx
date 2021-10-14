import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import RootState from "../../models/RootState";
import DirectoryPicker from "./DirectoryPicker";
import DirectoryViewer from "./DirectoryViewer";
import ImageDetails from "../../models/ImageDetails";
import { chartsActions } from "../../../store/charts-slice";
import ImagePreview from "./ImagePreview";
import { get, set } from "idb-keyval";
import imageCompression from "browser-image-compression";
import Container from "../../../ui/Container";
import ContainerHeader from "../../../ui/ContainerHeader";
import ContainerContents from "../../../ui/ContainerContents";
import TableDataObject from "../../models/TableDataObject";
import { filesActions } from "../../../store/files-slice";
import { modalActions } from "../../../store/modal-slice";
import verifyPermission from "../../../functions/verifyPermissions";
import { supported } from "browser-fs-access";
import useImage from "../../../hooks/useImage";
// const loadedDirectories: FileSystemDirectoryHandle[] = [];

const imageCompressionOptions = {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 720,
    useWebWorker: true,
};

const Directory = () => {
    const [checked, setChecked] = useState<string[]>([]);
    const [expanded, setExpanded] = useState<string[]>([]);
    const [allowChartReRender, setAllowChartReRender] = useState(false);

    const dispatch = useDispatch();

    // const onAddDirHandle = async (dirHandle: FileSystemDirectoryHandle) => {
    //     loadedDirectories.push(dirHandle);
    // };
    const mapOfFolderOrFileIdToImage = useSelector(
        (state: RootState) => state.directories.mapFolderOrFileIdToImage
    );
    const folderList = useSelector(
        (state: RootState) => state.directories.folderList
    );
    const imageMap = useSelector((state: RootState) => state.files.files);
    // allowChartReRenders = false // re-set to zero once component rerenderes due to useSelector changing
    useEffect(() => {
        setAllowChartReRender(false);
    }, [mapOfFolderOrFileIdToImage, folderList, imageMap]);

    const chartDataHandler = useCallback(() => {
        if (!checked.length || !allowChartReRender) return;

        let imageDataArray: ImageDetails[] = [];
        let tableDataArray: TableDataObject[] = [];

        // For each checked item, reach out to "mapFolderOrFileIdToImage" in the Directories slice
        for (const checkedItemId of checked) {
            if (
                mapOfFolderOrFileIdToImage[checkedItemId] ||
                mapOfFolderOrFileIdToImage[checkedItemId] === 0
            ) {
                // The index could be zero. accessing obj[key] = 0 will fail because 0 is falsy

                // This item exists (should always exist, just a safety check)

                // mapOfFolderOrFileIdToImage[checkedItemId] --> returns array index of file or folder in the Directories/folderList slice.
                // Reach out to the folderList to find the path to the image
                let index = mapOfFolderOrFileIdToImage[checkedItemId];
                if (folderList[index]) {
                    // This is the path to the file, which should be a KEY in the Files/files object slice.
                    let filePath = folderList[index];
                    if (imageMap[filePath]) {
                        // Congratulations, we've found the image for this checked ID!
                        // console.log("Found image")
                        let imageData = imageMap[filePath];
                        imageDataArray.push(imageData);

                        let formattedShutter = "";

                        let ss = imageData.shutterSpeed;
                        if (Number(ss) < 1) {
                            formattedShutter = `${
                                Math.round(10 / Number(ss)) / 10
                            }"`;
                        } else if (Number(ss) === 1) {
                            formattedShutter = "1";
                        } else formattedShutter = `1/${Math.round(Number(ss))}`;
                        tableDataArray.push({
                            ...imageData,
                            id: index,
                            path: filePath,
                            image: "Load",
                            shutterSpeed: formattedShutter,
                        });
                    }
                }
            }
        }

        dispatch(chartsActions.updateChartData(imageDataArray));
        dispatch(chartsActions.generateChartData());

        dispatch(filesActions.setFilteredTableData(tableDataArray));
    }, [
        checked,
        dispatch,
        folderList,
        imageMap,
        mapOfFolderOrFileIdToImage,
        allowChartReRender,
    ]);

    useEffect(chartDataHandler, [checked, chartDataHandler]);

    const [image, setImage] = useState({
        src: "",
        path: "",
        index: 0,
    });

    const onImageSelected = async (targetNodeId: string) => {
        // Goal: Get the filePath as it is a key in IndexedDB whose value is the FileHandle
        console.log(targetNodeId);
        let folderPathIndex = mapOfFolderOrFileIdToImage[targetNodeId];
        if (folderPathIndex || folderPathIndex === 0) {
            let filePath = folderList[folderPathIndex];
            if (!filePath) return console.log("Missing file path!");
            // Try to get the file handle from IndexedDB
            console.log(filePath);
            let idbFile:
                | { entry: string; thumbnail: string }
                | undefined = await get(filePath);

            if (!idbFile)
                return console.log(
                    "No file handle found - error occured somewhere?"
                );

            if (idbFile.thumbnail) {
                // Previously loaded into DB
                // console.log("File string found");
                setImage({
                    src: idbFile.thumbnail,
                    path: filePath,
                    index: folderPathIndex,
                });
                return;
            }
            let imageBlob: File = new File([idbFile.entry], "");
            // if ("getFile" in idbFile.entry) {
            //     // Using File System Access API
            //     // File handle found. Load as BLOB
            //     // console.log("File handle found");

            //     try {
            //         let perm = await verifyPermission(idbFile.entry, false);
            //         if (!perm)
            //             return alert(
            //                 "You need to provide permission to view this image!"
            //             );
            //         imageBlob = await idbFile.entry.getFile();
            //     } catch (e) {
            //         console.log(
            //             "Expected exception: fileHandle is a directory",
            //             e,
            //             idbFile.entry
            //         );
            //     }
            // } else {
            //     imageBlob = idbFile.entry;
            // }
            // let compressedImage = await imageCompression(
            //     imageBlob,
            //     imageCompressionOptions
            // );
            // let imageSrc = URL.createObjectURL(compressedImage); // this is the 'src' property
            // Add thumbnail to the db
            await set(filePath, {
                entry: idbFile.entry,
                thumbnail: idbFile.entry,
            });

            setImage({
                src: idbFile.entry,
                path: filePath,
                index: folderPathIndex,
            });
        } else {
            // console.log("no index!");
        }
    };

    const [bigViewProps, setBigViewProps] = useState({
        path: "",
        index: 0,
    });

    // useImage(bigViewProps.path, bigViewProps.index, bigViewProps.refresh)

    const {setCurrentBigImage } = useImage();

    const onBigViewHandler = async (path: string, index: number) => {
        // console.log(path) // Definitely exists in IDB
        // get the file reference

        try {
            // const returned = useImage(path, index);
            return;
            // let idbFile:
            //     | { entry: FileSystemFileHandle | File; thumbnail: string }
            //     | undefined = await get(path);

            // let imageBlob: File;
            // if (!idbFile) return;
            // if ("getFile" in idbFile.entry) {
            //     let perm = await verifyPermission(idbFile.entry, false);
            //     if (!perm)
            //         return alert(
            //             "You need to provide permission to view this image!"
            //         );
            //     imageBlob = await idbFile.entry.getFile();
            // } else {
            //     imageBlob = idbFile.entry;
            // }

            // let imageSrc = URL.createObjectURL(imageBlob);

            // let image = imageMap[path];
            // // let text = "";
            // // if (image) {
            // //     text = `Shot on ${image.cameraModel || "unknown"} w/ ${
            // //         image.lensModel || "unknown"
            // //     }. ${image.focalLength || "unknown"}mm | ${
            // //         image.aperture && `f/${image.aperture}`
            // //     } | ${image.shutterSpeed && image.shutterSpeed} | ISO ${
            // //         image.iso && image.iso
            // //     }`;
            // // }
            // dispatch(
            //     modalActions.setModal({
            //         src: imageSrc,
            //         detailObject: {
            //             cameraModel: image.cameraModel,
            //             lensModel: image.lensModel,
            //             aperture: image.aperture,
            //             shutterSpeed: Number(image.shutterSpeed),
            //             focalLength: image.focalLength,
            //             iso: image.iso,
            //         },
            //         path,
            //         index,
            //     })
            // );
        } catch (e) {
            console.log(e);
        }
    };

    const scanningStatusText = useSelector(
        (state: RootState) => state.status.text
    );

    const setItemCheckedHandler = (
        checkedArray: React.SetStateAction<string[]>
    ) => {
        setChecked(checkedArray);
        setAllowChartReRender(true); // Only allow the function in useCallback() to run once the user starts
    };

    return (
        <Container width="xl:w-96">
            <ContainerHeader>
                <h1 className="flex-grow text-xl px-3">Directory picker</h1>
                <div className="">
                    <DirectoryPicker />
                </div>
            </ContainerHeader>
            <ContainerContents>
                <div
                    className="min-size-wrapper-directory h-100 break-all"
                    style={{
                        maxHeight: "calc(85vh - 260px)",
                    }}
                >
                    {scanningStatusText && (
                        <div>
                            <p className="whitespace-nowrap text-end overflow-ellipsis overflow-hidden">
                                {scanningStatusText.split("<br/>")[0]}
                            </p>
                            <p className="whitespace-nowrap text-end overflow-ellipsis overflow-hidden">
                                {scanningStatusText.split("<br/>")[1]}
                            </p>
                        </div>
                    )}
                    <DirectoryViewer
                        checked={checked}
                        setChecked={setItemCheckedHandler}
                        expanded={expanded}
                        setExpanded={setExpanded}
                        onImageSelected={onImageSelected}
                    />
                </div>
            </ContainerContents>
            <ImagePreview {...image} setCurrentBigImage={setCurrentBigImage} />
        </Container>
    );

    // return (
    //     <div className="directory-wrapper xl:w-96">
    //         <div className="directory-picker">
    //             <div
    //                 className="directory-header flex p-3 bg-gray-100 border-gray-100 rounded-t items-center"
    //                 style={{ height: "66px" }}
    //             >
    //                 <h1 className="flex-grow text-xl px-3">Directory picker</h1>
    //                 <div className="">
    //                     <DirectoryPicker
    //                         setscanningStatus={setscanningStatus}
    //                         onAddDirHandle={onAddDirHandle}
    //                     />
    //                 </div>
    //             </div>
    //             <div
    //                 className="directory-contents border-gray-100 border-4 p-4 overflow-auto"
    //                 style={{
    //                     // maxHeight: "55vh",
    //                     maxHeight: "85vh",
    //                 }}
    //             >
    //                 <div
    //                     className="min-size-wrapper-directory   h-100  "
    //                     style={{
    //                         maxHeight: "calc(85vh - 260px)",
    //                     }}
    //                 >
    //                     {scanningStatus?.scanning && (
    //                         <p className="whitespace-nowrap truncate">
    //                             {scanningStatus.text}
    //                         </p>
    //                     )}
    //                     <DirectoryViewer
    //                         checked={checked}
    //                         setChecked={setChecked}
    //                         expanded={expanded}
    //                         setExpanded={setExpanded}
    //                         onImageSelected={onImageSelected}
    //                     />
    //                 </div>
    //             </div>
    //         </div>

    //         <ImagePreview {...image} />
    //     </div>
    // );
};

export default Directory;
