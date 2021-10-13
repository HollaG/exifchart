import { get } from "idb-keyval";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Body from "./components/Body/Body";
import Header from "./components/Header/Header";
import ModalWrapper from "./components/Modal/ModalWrapper";
import RootState from "./components/models/RootState";
import Navbar from "./components/Navbar/Navbar";
import firstLoad from "./config/first_load";
import verifyPermission from "./functions/verifyPermissions";
import { modalActions } from "./store/modal-slice";
import { supported } from "browser-fs-access";

function App() {
    useEffect(firstLoad, [firstLoad]);
    const dispatch = useDispatch();
    const modal = useSelector((state: RootState) => state.modal);
    const folderList = useSelector(
        (state: RootState) => state.directories.folderList
    );
    const imageMap = useSelector((state: RootState) => state.files.files);

    const changePreviewHandler = async (
        next: boolean,
        specifiedIndex?: number
    ) => {
        let index = typeof specifiedIndex !== 'undefined' ? specifiedIndex : modal.index;
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
        console.log({newIndex, newFilePath})

        let imageBlob: File;

        if (supported) {
            let idbFile: { entry: File; thumbnail: string } | undefined =
                await get(newFilePath);
            console.log(idbFile )
            if (!idbFile) {
                changePreviewHandler(next, newIndex); // Skip the directory
                return;
            } else {
                imageBlob = idbFile.entry;
            }
        } else {
            let idbFile:
                | { entry: FileSystemFileHandle; thumbnail: string }
                | undefined = await get(newFilePath);
            if (!idbFile) return alert("Unknown error occured!");

            if (idbFile.entry.kind !== "file") {
                changePreviewHandler(next, newIndex); // Skip the directory
                return;
            }

            let perm = await verifyPermission(idbFile.entry, false);
            if (!perm)
                return alert(
                    "You need to provide permission to view this image!"
                );
            imageBlob = await idbFile.entry.getFile();
        }

        let imageSrc = URL.createObjectURL(imageBlob);

        let image = imageMap[newFilePath];

        dispatch(
            modalActions.setModal({
                src: imageSrc,
                detailObject: {
                    cameraModel: image.cameraModel,
                    lensModel: image.lensModel,
                    aperture: image.aperture,
                    shutterSpeed: Number(image.shutterSpeed),
                    focalLength: image.focalLength,
                    iso: image.iso,
                },
                path: newFilePath,
                index: newIndex,
            })
        );
    };

    const supported = Boolean(
        typeof window.showDirectoryPicker !== "undefined"
    );

    return (
        <>
            <Navbar />
            <main className="px-2 w-screen md:w-9/12 mx-auto my-8">
                {supported ? (
                    <>
                        <Header />
                        <Body />
                    </>
                ) : (
                    <>
                        <h1 className="text-3xl text-center">
                            Sorry, your browser / operating system does not
                            support this web app.
                        </h1>
                        <p className="text-center mt-3">
                            {" "}
                            Supported browsers include: Edge (v86+), Chrome
                            (v86+) and Opera (v72+).
                        </p>
                        <p className="text-center mt-2">
                            {" "}
                            Updated 12 October 2021{" "}
                        </p>
                    </>
                )}
            </main>
            {modal.src && (
                <ModalWrapper
                    src={modal.src}
                    title={modal.title}
                    desc={modal.desc}
                    path={modal.path}
                    changePreviewHandler={changePreviewHandler}
                />
            )}
        </>
    );
}

export default App;
