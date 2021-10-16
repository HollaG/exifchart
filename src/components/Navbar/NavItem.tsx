import React, { FC } from "react";
import { NavLink } from 'react-router-dom'
const NavItem: FC<{ isHeader: boolean; to: string }> = (props) => {
    return (
        <li
            className={`text-white ${
                props.isHeader ? "text-2xl" : "text-lg"
            }`}
        >
            <NavLink to={props.to} className="hover:bg-gray-700 p-3 rounded-lg">
                {props.children}
            </NavLink>
        </li>
    );
};

export default NavItem;
