import { ImageDetailsDetailed } from "../../../../models/ImageDetailsDetailed";
import Container from "../../../../ui/Container";
import ContainerContents from "../../../../ui/ContainerContents";
import ContainerHeader from "../../../../ui/ContainerHeader";

const DataWrapper: React.FC<{
    details: ImageDetailsDetailed | undefined;
}> = ({ details }) => {
    let formattedDetails: any[] = [];
    let remainingDetails = { ...details };
    if (details) {
        const ensureExists = (input: string | number | Date, key: string) => {
            if (details) {
                if (key in details) {
                    delete remainingDetails[key];
                }
            }
            if (!input) return "Unknown";
            let formatted = input;
            switch (key) {
                case "FocalLength":
                    formatted = `${formatted} mm`;
                    break;
                case "FocalLengthIn35mmFormat":
                    formatted = `${formatted} mm`;
                    break;
                case "ScaleFactorTo35mmEquivalent":
                    formatted = `${formatted}x`;
                    break;
                case "ExposureTime":
                    if (formatted === 1) formatted = '1"';
                    else if (formatted < 4)
                        formatted = `${
                            Math.round(10 / Number(formatted)) / 10
                        }"`;
                    else formatted = `1/${formatted}`;
                    break;
                case "ExposureCompensation":
                    formatted = Math.round(10 * Number(formatted)) / 10;
                    break;
                case "FNumber":
                    formatted = `f/${formatted}`;
                    break;
            }
            return formatted;
        };
        formattedDetails = [
            {
                "File Info": {
                    "File name": ensureExists(details.FileName, "FileName"),
                    "File type": ensureExists(details.FileType, "FileType"),
                    "File size": ensureExists(
                        `${Math.round(details.FileSize / 10000) / 100} MB`,
                        "FileSize"
                    ), // 2 decimal places
                    "Date created": ensureExists(
                        details.DateTimeOriginal,
                        "DateTimeOriginal"
                    ),
                    "Image resolution": `${ensureExists(
                        details.ExifImageWidth,
                        "ExifImageWidth"
                    )} x ${ensureExists(
                        details.ExifImageHeight,
                        "ExifImageHeight"
                    )}`,
                    Orientation: ensureExists(
                        details.Orientation,
                        "Orientation"
                    ),
                },
            },
            {
                "Image details": {
                    "Camera model": ensureExists(details.Model, "Model"),
                    "Lens model": ensureExists(details.LensModel, "LensModel"),
                    "Focal length (35mm equiv)": ensureExists(
                        details.FocalLengthIn35mmFormat,
                        "FocalLengthIn35mmFormat"
                    ),
                    "Focal length": ensureExists(
                        details.FocalLength,
                        "FocalLength"
                    ),
                    "Crop factor": ensureExists(
                        Math.round(
                            (details.FocalLengthIn35mmFormat /
                                details.FocalLength) *
                                10
                        ) / 10,
                        "ScaleFactorTo35mmEquivalent"
                    ),
                    "Shutter speed": ensureExists(
                        Math.round(10 / details.ExposureTime) / 10,
                        "ExposureTime"
                    ),
                    Aperture: ensureExists(details.FNumber, "FNumber"),
                    ISO: ensureExists(details.ISO, "ISO"),
                    "Exposure compensation": ensureExists(
                        details.ExposureCompensation,
                        "ExposureCompensation"
                    ),
                    "Exposure mode": ensureExists(
                        details.ExposureMode,
                        "ExposureMode"
                    ),
                    "White balance": ensureExists(
                        details.WhiteBalance,
                        "WhiteBalance"
                    ),
                    Flash: ensureExists(details.Flash, "Flash"),
                    "Metering mode": ensureExists(
                        details.MeteringMode,
                        "MeteringMode"
                    ),
                },
            },
            {
                "Other information": remainingDetails,
            },
        ];
    }
    return (
        <Container>
            <ContainerHeader>
                <h1 className="flex-grow text-xl px-3"> Parsed info </h1>
            </ContainerHeader>
            {formattedDetails.length ? 
            <ContainerContents>
                {formattedDetails.map((group, index) => (
                    <DataItem data={group} key={index} />
                ))}
            </ContainerContents> : null}
        </Container>
    );
};

const DataItem: React.FC<{
    data: { [key: string]: any };
}> = ({ data }) => {
    let header = Object.keys(data)[0];
    return (
        <section className={`details ${header}`}>
            <h2 className="text-center text-lg font-bold border-b-4 border-gray-700 p-2 font-bold">
                {header}
            </h2>

            {Object.keys(data[header]).map((key, index) => {
                let props = data[header];
                return (
                    <div
                        className={`row flex ${index % 2 && "bg-gray-100"}`}
                        key={key}
                    >
                        <div className="key w-3/6 text-right p-2 border-r-2 border-gray-200 font-semibold break-all">
                            {key}
                        </div>
                        <div className="value w-3/6 p-2 border-l-2 border-gray-200 break-all">
                            {props[key]?.toString()}
                        </div>
                    </div>
                );
            })}
        </section>
    );
};

export default DataWrapper;
