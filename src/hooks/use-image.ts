import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import RootState from "../components/models/RootState";
import { get } from "idb-keyval";
import { modalActions } from "../store/modal-slice";

const useImage = () => {
    const imageMap = useSelector((state: RootState) => state.files.files);
    const folderList = useSelector(
        (state: RootState) => state.directories.folderList
    );

    const modalIndex = useSelector((state: RootState) => state.modal.index);

    const dispatch = useDispatch();

    const setCurrentBigImage = useCallback(
        async (pathArg: string, indexArg: number) => {
            let imageSrc = await get(pathArg);

            let imageDetails = imageMap[pathArg];
            let header = ["Shot on"];
            if (imageDetails.cameraModel) header.push(imageDetails.cameraModel);
            else header.push("Unknown camera");

            if (imageDetails.lensModel) {
                header.push("w/");
                header.push(imageDetails.lensModel);
            }

            // Construct desc
            const desc = [];
            if (imageDetails.focalLength)
                desc.push(`${imageDetails.focalLength}mm`);
            else desc.push("Unknown focal length");

            if (imageDetails.shutterSpeed) {
                if (imageDetails.shutterSpeed === 1) {
                    desc.push('SS 1"');
                } else if (imageDetails.shutterSpeed === 0) {
                    desc.push(`Unknown SS`);
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

            console.log("Success", {
                path: pathArg,
                index: indexArg,
                src: imageSrc,
                desc: desc.join(" | "),
                showing: true,
                title: header.join(" "),
            });

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
    const changeCurrentBigImage = useCallback(
        async (next: boolean, specifiedIndex?: number) => {
            console.log(next, specifiedIndex);
            let index =
                typeof specifiedIndex !== "undefined"
                    ? specifiedIndex
                    : modalIndex;
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
                changeCurrentBigImage(next, newIndex);
                return;
            } else {
                // Found an item in imageMap (which is also in idb, hence we can call setCurrentBigImage)
                setCurrentBigImage(newFilePath, newIndex);
            }
        },
        [folderList, imageMap, modalIndex, setCurrentBigImage]
    );

    return { setCurrentBigImage, changeCurrentBigImage };
};
export default useImage;
