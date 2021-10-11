import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DirectoryButton from "../../../ui/DirectoryButton";
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

// const loadedDirectories: FileSystemDirectoryHandle[] = [];

const imageCompressionOptions = {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 720,
    useWebWorker: true,
};

const Directory = () => {
    const [checked, setChecked] = useState<string[]>([]);
    const [expanded, setExpanded] = useState<string[]>([]);

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

    const chartDataHandler = useCallback(() => {
        console.log("Running chart data handler")
        if (!checked.length) return;

        let imageDataArray: ImageDetails[] = [];

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
                    }
                }
            }
        }

        dispatch(chartsActions.updateChartData(imageDataArray));
        dispatch(chartsActions.generateChartData());
    }, [checked, dispatch, folderList, imageMap, mapOfFolderOrFileIdToImage]);

    useEffect(chartDataHandler, [checked, chartDataHandler]);

    const [image, setImage] = useState({
        src: "",
        path: "",
    });

    const onImageSelected = async (targetNodeId: string) => {
        // Goal: Get the filePath as it is a key in IndexedDB whose value is the FileHandle

        console.log({ mapOfFolderOrFileIdToImage, targetNodeId });
        let folderPathIndex = mapOfFolderOrFileIdToImage[targetNodeId];
        if (folderPathIndex || folderPathIndex === 0) {
            let filePath = folderList[folderPathIndex];
            if (!filePath) return console.log("Missing filePath!!!")
            // Try to get the file handle from IndexedDB
            let fileHandle: FileSystemFileHandle | undefined | string =
                await get(filePath);

            if (!fileHandle)
                return console.log(
                    "No file handle found - error occured somewhere?"
                );

            if (typeof fileHandle === "string") {
                // Previously loaded into DB
                console.log("File string found");
                setImage({
                    src: fileHandle,
                    path: filePath,
                });
            } else {
                // File handle found. Load as BLOB
                console.log("File handle found");

                try {
                    console.log(fileHandle);
                    let imageBlob = await fileHandle.getFile();
                    let compressedImage = await imageCompression(
                        imageBlob,
                        imageCompressionOptions
                    );
                    let imageSrc = URL.createObjectURL(compressedImage); // this is the 'src' property

                    // Override the FileSystemFileHandle
                    await set(filePath, imageSrc);

                    setImage({
                        src: imageSrc,
                        path: filePath,
                    });
                } catch (e) {
                    console.log(
                        "Expected exception: fileHandle is a directory",
                        e
                    );
                }
            }
        } else {
            console.log("no index!");
        }
    };

    

    const scanningStatus = useSelector((state:RootState) => state.status)

    
    return (
        <Container width="xl:w-96">
            <ContainerHeader>
                <h1 className="flex-grow text-xl px-3">Directory picker</h1>
                <div className="">
                    <DirectoryPicker                       
                        
                    />
                </div>
            </ContainerHeader>
            <ContainerContents>
                <div
                    className="min-size-wrapper-directory h-100 "
                    style={{
                        maxHeight: "calc(85vh - 260px)",
                    }}
                >
                    {scanningStatus?.scanning && (
                        <p className="whitespace-nowrap truncate">
                            {scanningStatus.text}
                        </p>
                    )}
                    <DirectoryViewer
                        checked={checked}
                        setChecked={setChecked}
                        expanded={expanded}
                        setExpanded={setExpanded}
                        onImageSelected={onImageSelected}
                    />
                </div>
            </ContainerContents>
           <ImagePreview {...image} />
            
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
