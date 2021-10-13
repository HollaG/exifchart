import { supported } from "browser-fs-access";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import RootState from "../components/models/RootState";
import verifyPermission from "../functions/verifyPermissions";
import { get } from "idb-keyval";
import { modalActions } from "../store/modal-slice";
const useImage = async (path: string, index: number) => {
    const imageMap = useSelector((state: RootState) => state.files.files);
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            let imageBlob: File;

            if (supported) {
                let idbFile: { entry: File; thumbnail: string } | undefined =
                    await get(path);
                console.log(idbFile);
                if (!idbFile) {
                    return;
                } else {
                    imageBlob = idbFile.entry;
                }
            } else {
                let idbFile:
                    | { entry: FileSystemFileHandle; thumbnail: string }
                    | undefined = await get(path);
                if (!idbFile) return alert("Unknown error occured!");

                let perm = await verifyPermission(idbFile.entry, false);
                if (!perm)
                    return alert(
                        "You need to provide permission to view this image!"
                    );
                imageBlob = await idbFile.entry.getFile();
            }

            let imageSrc = URL.createObjectURL(imageBlob);

            let imageDetails = imageMap[path];

            dispatch(
                modalActions.setModal({
                    src: imageSrc,
                    detailObject: {
                        cameraModel: imageDetails.cameraModel,
                        lensModel: imageDetails.lensModel,
                        aperture: imageDetails.aperture,
                        shutterSpeed: Number(imageDetails.shutterSpeed),
                        focalLength: imageDetails.focalLength,
                        iso: imageDetails.iso,
                    },
                    path,
                    index,
                })
            );
        })();
    }, []);

    return true;
};
export default useImage;
