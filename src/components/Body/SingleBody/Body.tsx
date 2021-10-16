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

    const onImageSelected = async () => {
        const file: File = await fileOpen({
            extensions: CONSTANTS.SUPPORTED_FILETYPES,
            description: "Pick an image",
            mimeTypes: ["image/*"],
        });
        const fileData: ImageDetailsDetailed = await exifr.parse(file);
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
            fileData.FocalLengthIn35mmFormat = calculate35mmFocalLength(props);
        }

        if (fileData.DateTimeOriginal) {
            fileData.DateTimeOriginal = fileData.DateTimeOriginal.toLocaleString()
        }



        setSelectedImageDetails(fileData);
        setImage(URL.createObjectURL(file));
    };
    return (
        <div className="xl:flex">
            <section className="image-picker m-2 xl:w-3/6">
                <ImageWrapper onImageSelected={onImageSelected} image={image} />
            </section>
            <section className="tags-viewer m-2 xl:w-3/6">
                <DataWrapper details={selectedImageDetails} />
            </section>
        </div>
    );
};

export default Body;
