import React from "react";
const ContainerHeader: React.FC = ({children}) => {
    return (
        <div
            className="container-header flex p-3 bg-gray-100 border-gray-100 rounded-t items-center"
            style={{ height: "66px" }}
        >            
            {children}
        </div>
    );
};

export default ContainerHeader;
