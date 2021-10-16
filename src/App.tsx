import { Suspense, useEffect } from "react";
import { useSelector } from "react-redux";
import { Route, Switch } from "react-router";

// import Header from "./components/Header/Header";
import ModalWrapper from "./components/Modal/ModalWrapper";
import RootState from "./models/RootState";
import Navbar from "./components/Navbar/Navbar";
import firstLoad from "./config/first_load";
import useImage from "./hooks/use-image";
import MultipleBody from "./components/Body/MultipleBody/Body";
import SingleBody from "./components/Body/SingleBody/Body";
function App() {
    useEffect(firstLoad, [firstLoad]);

    const modal = useSelector((state: RootState) => state.modal);

    const { changeCurrentBigImage } = useImage();

    return (
        <>
            <Navbar />
            <main className="px-2 w-screen md:w-9/12 mx-auto my-8">
                <Switch>
                    <Route path="/" exact>
                        <Suspense fallback={<div> Loading... </div>}>
                            <MultipleBody />
                        </Suspense>
                    </Route>
                    <Route path="/single" exact>
                        <Suspense fallback={<div> Loading... </div>}>
                            <SingleBody />
                        </Suspense>
                    </Route>
                </Switch>
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
