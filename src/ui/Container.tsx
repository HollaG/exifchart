import React from "react";

const Container:React.FC<{width?: string}> = ({children, width}) => {
    return (
        <div className={`container-wrapper ${width && width}`}>
            {children}
        </div>
    );
};

export default Container;
