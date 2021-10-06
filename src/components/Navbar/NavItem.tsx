import React, { FC } from "react";

const NavItem: FC<{ isHeader: boolean; to: string }> = (props) => {
    return (
        <li
            className={`text-white ${
                props.isHeader ? "text-2xl" : "text-lg"
            }`}
        >
            <a href={props.to} className="hover:bg-gray-700 p-3 rounded-lg">
                {props.children}
            </a>
        </li>
    );
};

export default NavItem;
