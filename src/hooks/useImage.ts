import { supported } from "browser-fs-access";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import RootState from "../components/models/RootState";
import verifyPermission from "../functions/verifyPermissions";
import { get } from "idb-keyval";
import { modalActions, ModalStructure } from "../store/modal-slice";
const initialState: ModalStructure = {
    src: "",
    title: "",
    desc: "",
    path: "",
    index: 0,
    showing: false,
};
const useImage = () => {
    const imageMap = useSelector((state: RootState) => state.files.files);
    const folderList = useSelector(
        (state: RootState) => state.directories.folderList
    );
    const modalIndex = useSelector((state: RootState) => state.modal.index)

    const dispatch = useDispatch();


    
    const setCurrentBigImage = useCallback(
        async (pathArg: string, indexArg: number) => {
            let imageBlob: File;

            if (supported) {
                let idbFile: { entry: File; thumbnail: string } | undefined =
                    await get(pathArg);
                console.log(idbFile);
                if (!idbFile) {
                    return;
                } else {
                    imageBlob = idbFile.entry;
                }
            } else {
                let idbFile:
                    | { entry: FileSystemFileHandle; thumbnail: string }
                    | undefined = await get(pathArg);
                if (!idbFile) return alert("Unknown error occured!");

                let perm = await verifyPermission(idbFile.entry, false);
                if (!perm)
                    return alert(
                        "You need to provide permission to view this image!"
                    );
                imageBlob = await idbFile.entry.getFile();
            }

            let imageSrc = URL.createObjectURL(imageBlob);

            let imageDetails = imageMap[pathArg];
            let header = ["Shot on"];
            if (imageDetails.cameraModel) header.push(imageDetails.cameraModel);
            else header.push("Unknown camera");

            if (imageDetails.lensModel) {
                header.push("w/");
                header.push(imageDetails.lensModel);
            }

            // state.title = header.join(" ");

            // Construct desc
            const desc = [];
            if (imageDetails.focalLength)
                desc.push(`${imageDetails.focalLength}mm`);
            else desc.push("Unknown focal length");

            if (imageDetails.shutterSpeed) {
                if (imageDetails.shutterSpeed === 1) {
                    desc.push('SS 1"');
                } else if (imageDetails.shutterSpeed < 1) {
                    desc.push(
                        `SS ${
                            Math.round(10 / Number(imageDetails.shutterSpeed)) /
                            10
                        }"`
                    );
                } else {
                    desc.push(
                        `SS 1/${Math.round(Number(imageDetails.shutterSpeed))}`
                    );
                }
            } else desc.push("Unknown SS");

            if (imageDetails.aperture) desc.push(`f/${imageDetails.aperture}`);
            else desc.push("Unknown aperture");

            if (imageDetails.iso) desc.push(`ISO ${imageDetails.iso}`);
            else desc.push("Unknown ISO");

            // state.desc = desc.join(" | ");
            // state.path = action.payload.path;
            // state.index = action.payload.index;

            console.log("Success", {
                path: pathArg,
                index: indexArg,
                src: imageSrc,
                desc: desc.join(" | "),
                showing: true,
                title: header.join(" "),
            });
            // setModalState({
            //     path: pathArg,
            //     index: indexArg,
            //     src: imageSrc,
            //     desc: desc.join(" | "),
            //     showing: true,
            //     title: header.join(" "),
            // });

            dispatch(
                modalActions.setModalProps({
                    path: pathArg,
                    index: indexArg,
                    src: imageSrc,
                    desc: desc.join(" | "),
                    showing: true,
                    title: header.join(" "),
                })
            );
        },
        [imageMap, dispatch]
    );
    const changeCurrentBigImage = useCallback(async (next: boolean, specifiedIndex? :number) => {
        console.log(next, specifiedIndex)
        let index = typeof specifiedIndex !== 'undefined' ? specifiedIndex : modalIndex;
        let newIndex: number;

        if (next) {
            newIndex = index + 1;
            if (newIndex === folderList.length) newIndex = 0;
        } else {
            newIndex = index - 1;
            if (newIndex < 0) newIndex = folderList.length - 1;
        }
        // get the filepath of the new index
        const newFilePath = folderList[newIndex];
        
        if (!imageMap[newFilePath]) { 
            // This item is not in the imageMap, hence it is a directory
            changeCurrentBigImage(next, newIndex)
            return
        } else { 
            // Found an item in imageMap (which is also in idb, hence we can call setCurrentBigImage)
            setCurrentBigImage(newFilePath, newIndex)
        }

    }, [folderList, imageMap, modalIndex, setCurrentBigImage])


    // useEffect(() => {
    //     (async () => {
    //         let imageBlob: File;

    //         if (supported) {
    //             let idbFile: { entry: File; thumbnail: string } | undefined =
    //                 await get(path);
    //             console.log(idbFile);
    //             if (!idbFile) {
    //                 return;
    //             } else {
    //                 imageBlob = idbFile.entry;
    //             }
    //         } else {
    //             let idbFile:
    //                 | { entry: FileSystemFileHandle; thumbnail: string }
    //                 | undefined = await get(path);
    //             if (!idbFile) return alert("Unknown error occured!");

    //             let perm = await verifyPermission(idbFile.entry, false);
    //             if (!perm)
    //                 return alert(
    //                     "You need to provide permission to view this image!"
    //                 );
    //             imageBlob = await idbFile.entry.getFile();
    //         }

    //         let imageSrc = URL.createObjectURL(imageBlob);

    //         let imageDetails = imageMap[path];

    //         dispatch(
    //             modalActions.setModal({
    //                 src: imageSrc,
    //                 detailObject: {
    //                     cameraModel: imageDetails.cameraModel,
    //                     lensModel: imageDetails.lensModel,
    //                     aperture: imageDetails.aperture,
    //                     shutterSpeed: Number(imageDetails.shutterSpeed),
    //                     focalLength: imageDetails.focalLength,
    //                     iso: imageDetails.iso,
    //                 },
    //                 path,
    //                 index,
    //             })
    //         );
    //     })();
    // }, [dispatch, imageMap, index, path, refresh]);

    return { setCurrentBigImage, changeCurrentBigImage };
};
export default useImage;
