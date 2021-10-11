import React from "react";

const ContainerContents: React.FC = ({ children }) => {
    return (
        <div
            className="container-contents border-gray-100 border-4 p-4 overflow-auto"
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
