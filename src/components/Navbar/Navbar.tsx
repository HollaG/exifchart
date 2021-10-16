import NavItem from "./NavItem";
import { Switch, Route } from "react-router-dom";
const Navbar = () => {
    return (
        <nav className="w-100 bg-gray-600 h-20">
            <ul className="px-2 flex w-screen lg:w-9/12 m-auto items-center h-full justify-between">
                <NavItem isHeader={true} to="/">
                    EXIFChart
                </NavItem>
                <Switch>
                    <Route path="/" exact>
                        <NavItem isHeader={false} to="/single">
                            Single Mode
                        </NavItem>
                    </Route>
                    <Route path="/single" exact>
                        <NavItem isHeader={false} to="/">
                            Multiple Mode
                        </NavItem>
                    </Route>
                </Switch>
            </ul>
        </nav>
    );
};

export default Navbar;
