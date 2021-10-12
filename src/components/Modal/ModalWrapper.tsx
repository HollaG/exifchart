import { transform } from "@babel/core";
import React from "react";
import { useDispatch } from "react-redux";
import { modalActions } from "../../store/modal-slice";
import DirectoryButton from "../../ui/DirectoryButton";



const ModalWrapper: React.FC<{ src: string, title:string, desc: string, path: string, changePreviewHandler: (next: boolean, path: string) => void }> = ({ src,title, desc, path, changePreviewHandler }) => {
    const dispatch = useDispatch()
    const closeModalHandler = () => {
        dispatch(modalActions.clearModal())
    }
    return (
        <div
            className="flex justify-center items-center"
            style={{
                position: "fixed",
                inset: 0,
                overflow: "auto" /* Enable scroll if needed */,
                backgroundColor: "rgba(0,0,0,0.7)" /* Black w/ opacity */,
                zIndex: 100
            }}
        >
            <div className="relative" style={{ width: "95vw", height: "95vh" }}>
                <div className="bg-gray-100 inline p-2 absolute rounded-lg border-4 border-gray-400 hover:opacity-0 text-center" style={{                  
                    left: "50%",
                    transform: "translate(-50%, 0)",
                    bottom: "1%",
                    maxWidth: '500px',
                    transition: 'opacity 150ms ease-in-out'
                    
                }}> 
                    
                    {title}
                    <br/>
                    {desc}
                    <br/>
                    {path}
                    
                </div>
                <div className="bg-gray-100 inline p-1 absolute rounded-lg border-4 border-gray-400 text-center" style={{             
                    left: "50%",
                    transform: "translate(-50%, 0px)",
                    top: "1%"
                }}> 
                    
                    <DirectoryButton extraClasses="mx-2" onClick={() => changePreviewHandler(false, path)}> Previous </DirectoryButton>
                    <DirectoryButton extraClasses="mx-2" onClick={() => changePreviewHandler(true, path)}> Next </DirectoryButton>
                    
                </div>
                <img
                    className="w-full h-full  cursor-pointer"
                    src={src}
                    style={{
                        objectFit: "contain",
                    }}
                    onClick={closeModalHandler}
                    alt={`Big preview for ${title}`}
                />
            </div>
            {/* <div className="flex" style={{ width: "85vw", height: "85vh" }}>
                <img
                    className="h-full cursor-pointer flex-grow bg-gray-700 p-3"
                    src={src}
                    style={{
                        objectFit: "contain",
                    }}
                    onClick={closeModalHandler}
                />
                <div className="bg-white inline p-2 h-100" style={{
                    width: '25%'
                }}>Shot on ...</div>
            </div> */}
        </div>
    );
};

export default ModalWrapper;
