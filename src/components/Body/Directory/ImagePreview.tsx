import React from "react";

const ImagePreview: React.FC<{
    src: string;
    path: string;
    index: number;
    onBigViewHandler: (path: string, index: number) => void;
}> = ({ src, path, onBigViewHandler, index }) => {
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
                            {path}
                        </p>
                        <img
                            className="w-full h-full object-cover"
                            src={src}
                            alt={`Preview for ${path}`}
                            onClick={() => onBigViewHandler(path, index)}
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
