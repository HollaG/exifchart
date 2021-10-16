import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import RootState from "../../../../models/RootState";
import DirectoryPicker from "./DirectoryPicker";
import DirectoryViewer from "./DirectoryViewer";
import ImageDetails from "../../../../models/ImageDetails";
import { chartsActions } from "../../../../store/charts-slice";
import ImagePreview from "./ImagePreview";
import { get } from "idb-keyval";
import Container from "../../../../ui/Container";
import ContainerHeader from "../../../../ui/ContainerHeader";
import ContainerContents from "../../../../ui/ContainerContents";
import TableDataObject from "../../../../models/TableDataObject";
import { filesActions } from "../../../../store/files-slice";
import useImage from "../../../../hooks/use-image";

const Directory = () => {
    const [checked, setChecked] = useState<string[]>([]);
    const [expanded, setExpanded] = useState<string[]>([]);
    const [allowChartReRender, setAllowChartReRender] = useState(false);

    const dispatch = useDispatch();

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
            // Try to get the file blob from IndexedDB
            console.log(filePath);
            let idbFile: string | undefined = await get(filePath);

            if (!idbFile)
                return console.log(
                    "No file handle found - error occured somewhere?"
                );
            setImage({
                src: idbFile,
                path: filePath,
                index: folderPathIndex,
            });
        } else {
            // console.log("no index!");
        }
    };

    const { setCurrentBigImage } = useImage();

    const scanningStatus = useSelector(
        (state: RootState) => state.status
    );

    const setItemCheckedHandler = (
        checkedArray: React.SetStateAction<string[]>
    ) => {
        setChecked(checkedArray);
        setAllowChartReRender(true); // Only allow the function in useCallback() to run once the user starts
    };

    const width = `calc(${scanningStatus.percent}% - 8px)`;

    

    return (
        <Container width="xl:w-96">
            <ContainerHeader>
                <h1 className="flex-grow text-xl px-3">Directory picker</h1>
                <div className="">
                    <DirectoryPicker />
                </div>
            </ContainerHeader>
            {scanningStatus.scanning && (
                <div
                    className="prog-bar bg-blue-500 absolute"
                    style={{
                        height: "2px",
                        transform: "translate(0, 4px)",
                        left: "4px",
                        width: width,
                    }}
                />
            )}
            <ContainerContents>
                <div
                    className="min-size-wrapper-directory h-100 break-all"
                    style={{
                        maxHeight: "calc(85vh - 260px)",
                    }}
                >
                    {scanningStatus.scanning && (
                        <div>
                            <p className="whitespace-nowrap text-end overflow-ellipsis overflow-hidden">
                                {scanningStatus.text.split("<br/>")[0]}
                            </p>
                            <p className="whitespace-nowrap text-end overflow-ellipsis overflow-hidden">
                                {scanningStatus.text.split("<br/>")[1]}
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
