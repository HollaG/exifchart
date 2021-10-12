import React, { useState } from "react";
import ModalWrapper from "../../Modal/ModalWrapper";

const ImagePreview: React.FC<{ src: string; path: string, onBigViewHandler: (path: string) => void }> = ({
    src,
    path,
    onBigViewHandler
}) => {
    const imageClickHandler = () => {};

    const [previewShowing, setPreviewShowing] = useState(false)
    return (
        <>
            <div
                className="image-preview border-gray-100 border-t-0 rounded-b border-4 flex items-center justify-center relative  cursor-pointer"
                style={{ height: "260px" }}
            >
                {src ? (
                    <>
                        <p
                            className="absolute bg-gray-100 border-gray-500 border-2 rounded py-1 px-2 bottom-2 right-2 text-xs text-right break-all"
                            style={{ maxWidth: "75%" }}
                        >
                            {" "}
                            {path}{" "}
                        </p>
                        <img
                            className="w-full h-full object-cover"
                            src={src}
                            alt="Image preview"
                            onClick={() => onBigViewHandler(path)}
                        />
                    </>
                ) : (
                    <p> Select image to preview</p>
                )}
            </div>
            
        </>
    );
};

export default ImagePreview;
