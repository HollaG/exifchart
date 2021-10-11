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
    const modal = useSelector((state: RootState) => state.modal)

    return (
        <>
            <Navbar />
            <main className="px-2 w-screen md:w-9/12 mx-auto my-8">
                <Header />
                <Body />
            </main>
            {modal.src && <ModalWrapper src={modal.src} text={modal.text}/>}
        </>
    );
}

export default App;
