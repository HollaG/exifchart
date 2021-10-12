import { useEffect } from "react";
import { useSelector } from "react-redux";
import Body from "./components/Body/Body";
import Header from "./components/Header/Header";
import ModalWrapper from "./components/Modal/ModalWrapper";
import RootState from "./components/models/RootState";
import Navbar from "./components/Navbar/Navbar";
import firstLoad from "./config/first_load";

function App() {
    useEffect(firstLoad, [firstLoad]);
    const modal = useSelector((state: RootState) => state.modal);

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
                    <><h1 className="text-3xl text-center">
                        Sorry, your browser / operating system does not support
                        this web app.
                    </h1>
                    <p className="text-center mt-3"> Supported browsers include: Edge (v86+), Chrome (v86+) and Opera (v72+).</p>
                    <p className="text-center mt-2"> Updated 12 October 2021 </p>
                    </>
                )}
            </main>
            {modal.src && (
                <ModalWrapper
                    src={modal.src}
                    title={modal.title}
                    desc={modal.desc}
                    path={modal.path}
                />
            )}
        </>
    );
}

export default App;
