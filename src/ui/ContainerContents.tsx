import React from "react";

const ContainerContents: React.FC<{padding?: boolean}> = ({ children, padding = true }) => {
    const paddingClass = padding ? "p-4" : ""
    return (
        <div
            className={`container-contents border-gray-100 border-4 overflow-auto ${paddingClass}`}
            // style={{
            //     // maxHeight: "55vh",
            //     maxHeight: "85vh",
            // }}
        >
            {children}
        </div>
    );
};

export default ContainerContents;
