import { Suspense, useEffect } from "react";
import { useSelector } from "react-redux";
import { Route, Switch, useHistory } from "react-router";

// import Header from "./components/Header/Header";
import ModalWrapper from "./components/Modal/ModalWrapper";
import RootState from "./models/RootState";
import Navbar from "./components/Navbar/Navbar";
import firstLoad from "./config/first_load";
import useImage from "./hooks/use-image";
import MultipleBody from "./components/Body/MultipleBody/Body";
import SingleBody from "./components/Body/SingleBody/Body";

import { isBrowser, isMobileSafari } from "react-device-detect";
import { NavLink } from "react-router-dom";
import NavItem from "./components/Navbar/NavItem";
import BodyButton from "./ui/BodyButton";
function App() {
    useEffect(firstLoad, [firstLoad]);

    const modal = useSelector((state: RootState) => state.modal);

    const { changeCurrentBigImage } = useImage();
    const history = useHistory();
    return (
        <>
            <Navbar />
            <main className="px-2 w-screen md:w-9/12 mx-auto my-8">
                <Switch>
                    <Route path="/" exact>
                        <Suspense fallback={<div> Loading... </div>}>
                            {isBrowser && <MultipleBody />}
                            {!isBrowser && !isMobileSafari && (
                                <div className="text-center">
                                    <h1 className="text-xl">
                                        Sorry, your mobile device does not
                                        support folder analysis.
                                    </h1>
                                    <p className="mt-3">
                                        You may open this web app on a desktop,
                                        or use the single image analyzer
                                        instead.
                                    </p>
                                    <div className="mt-3">
                                        <BodyButton
                                            onClick={() =>
                                                history.push("/single")
                                            }
                                        >
                                            Image Analyzer
                                        </BodyButton>
                                    </div>
                                </div>
                            )}
                            {!isBrowser && isMobileSafari && (
                                <h1 className="text-xl">
                                    Sorry, Safari does not support this web app.
                                    Please use Chrome for iOS instead.
                                </h1>
                            )}
                        </Suspense>
                    </Route>
                    <Route path="/single" exact>
                        <Suspense fallback={<div> Loading... </div>}>
                            {!isBrowser && isMobileSafari && (
                                <h1 className="text-xl">
                                    Sorry, Safari does not support this web app.
                                    Please use Chrome for iOS instead.
                                </h1>
                            )}
                            {!isMobileSafari && <SingleBody />}
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
