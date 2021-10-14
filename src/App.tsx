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
import useImage from "./hooks/use-image";

function App() {
    useEffect(firstLoad, [firstLoad]);

    const modal = useSelector((state: RootState) => state.modal);

    const { changeCurrentBigImage } = useImage();

    return (
        <>
            <Navbar />
            <main className="px-2 w-screen md:w-9/12 mx-auto my-8">
                <Header />
                <Body />
            </main>
            {modal.showing && (
                <ModalWrapper
                    src={modal.src}
                    title={modal.title}
                    desc={modal.desc}
                    path={modal.path}
                    changeCurrentBigImage={changeCurrentBigImage}
                />
            )}
        </>
    );
}

export default App;
