import { fileOpen } from "browser-fs-access/dist";
import { useState } from "react";
import { ImageDetailsDetailed } from "../../../models/ImageDetailsDetailed";
import ImageWrapper from "./ImageWrapper/ImageWrapper";
import exifr from "exifr";
import * as CONSTANTS from "../../../config/CONSTANTS.json";
import calculate35mmFocalLength from "../../../functions/calculate35mmFocalLength";
import DataWrapper from "./DataWrapper/DataWrapper";
const Body = () => {
    const [selectedImageDetails, setSelectedImageDetails] =
        useState<ImageDetailsDetailed>();
    const [image, setImage] = useState("");
    const [error, setError] = useState("");

    const onImageSelected = async () => {
        try {
            const file: File = await fileOpen({
                extensions: CONSTANTS.SUPPORTED_FILETYPES,
                description: "Pick an image",
                mimeTypes: ["image/*"],
            });
            if (!file) {
                throw new Error("Sorry, the chosen file could not be loaded. Please select another file.")
            }
            const fileData: ImageDetailsDetailed = await exifr.parse(file);
            if (!fileData) {
                throw new Error("Sorry, the chosen file does not contain any EXIF data. Please select another file.")
                
            }
            fileData.FileName = file.name;
            fileData.FileSize = file.size;
            fileData.FileType = file.type;

            if (!fileData.FocalLengthIn35mmFormat) {
                const props = {
                    FocalLengthIn35mmFormat: fileData.FocalLengthIn35mmFormat,
                    FocalLength: fileData.FocalLength,
                    ExifImageHeight: fileData.ExifImageHeight,
                    ExifImageWidth: fileData.ExifImageWidth,
                    FocalPlaneXResolution: fileData.FocalPlaneXResolution,
                    FocalPlaneYResolution: fileData.FocalPlaneYResolution,
                    ResolutionUnit: fileData.ResolutionUnit,
                    FocalPlaneResolutionUnit: fileData.FocalPlaneResolutionUnit,
                };
                fileData.FocalLengthIn35mmFormat =
                    calculate35mmFocalLength(props);
            }

            if (fileData.DateTimeOriginal) {
                fileData.DateTimeOriginal =
                    fileData.DateTimeOriginal.toLocaleString();
            }
            setError("")
            setSelectedImageDetails(fileData);
            setImage(URL.createObjectURL(file));
        } catch (e:any) {
            console.log(e);
            setError(e.toString())
            setImage("")
            setSelectedImageDetails(undefined)
        }
    };
    return (
        <div className="xl:flex">
            <section className="image-picker m-2 xl:w-3/6">
                <ImageWrapper
                    onImageSelected={onImageSelected}
                    image={image}
                    error={error}
                />
            </section>
            <section className="tags-viewer m-2 xl:w-3/6">
                <DataWrapper details={selectedImageDetails} />
            </section>
        </div>
    );
};

export default Body;
