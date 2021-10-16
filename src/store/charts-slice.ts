import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import ChartData, { DataSet } from "../components/models/ChartData";
import ImageDetails from "../components/models/ImageDetails";
import formatShutter from "../functions/formatShutter";

const initialState: {
    focalLength: ChartData;
    aperture: ChartData;
    shutterSpeed: ChartData;
    iso: ChartData;
    raw: ImageDetails[];
} = {
    focalLength: {},
    aperture: {},
    shutterSpeed: {},
    iso: {},
    raw: [],
};

const ROUNDING_FACTOR = 10;

const rainbow = (numOfSteps: number, step: number) => {
    // This function generates vibrant, "evenly spaced" colours (i.e. no clustering). This is ideal for creating easily distinguishable vibrant markers in Google Maps and other apps.
    // Adam Cole, 2011-Sept-14
    // HSV to RBG adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
    var r: number, g: number, b: number;
    var h = step / numOfSteps;
    var i = ~~(h * 6);
    var f = h * 6 - i;
    var q = 1 - f;
    switch (i % 6) {
        case 0:
            r = 1;
            g = f;
            b = 0;
            break;
        case 1:
            r = q;
            g = 1;
            b = 0;
            break;
        case 2:
            r = 0;
            g = 1;
            b = f;
            break;
        case 3:
            r = 0;
            g = q;
            b = 1;
            break;
        case 4:
            r = f;
            g = 0;
            b = 1;
            break;
        case 5:
            r = 1;
            g = 0;
            b = q;
            break;
    }
    var c =
        "#" +
        ("00" + (~~(r! * 255)).toString(16)).slice(-2) +
        ("00" + (~~(g! * 255)).toString(16)).slice(-2) +
        ("00" + (~~(b! * 255)).toString(16)).slice(-2);

    return c;
};

const hexToRgbA = (hex: string, opacity: string) => {
    var c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split("");
        if (c.length === 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = "0x" + c.join("");
        return (
            "rgba(" +
            [
                (Number(c) >> 16) & 255,
                (Number(c) >> 8) & 255,
                Number(c) & 255,
            ].join(",") +
            "," +
            opacity +
            ")"
        );
    }
    throw new Error("Bad Hex");
};


const chartsSlice = createSlice({
    initialState,
    name: "charts",
    reducers: {
        updateChartData: (state, action: PayloadAction<ImageDetails[]>) => {
            // action.payload is an array of all selected images, each image being an Object (interface ImageDetails)
            // console.log("ChartSlice reducer: updateChartData");
            state.raw = action.payload;
            state.focalLength = {};
            state.aperture = {};
            state.shutterSpeed = {};
            state.iso = {};
        },
        generateChartData: (state) => {
            // console.log("ChartSlice reducer: generateChartData");


            // Only proceed with generating if it's not already generated

            const images = state.raw;

            interface DatasetObjectSchema {
                [key: string]: {
                    [key: number]: number;
                };
            }

            /*
                    Sample object for dataSetObjects below

                    {
                        "Canon 800D||Canon 18-135mm IS STM": {
                            2.8: 100,
                            5.6: 123,
                            8: 143
                        },
                        "Canon EOS M5||Sigma 100-400mm C": {
                            4: 521,
                            8: 702
                        }
                    }

                */
            const focalLengthsFound: { [key: number]: 1 } = {};
            const aperturesFound: { [key: number]: 1 } = {};
            const shutterSpeedsFound: { [key: number]: 1 } = {};
            const isosFound: { [key: number]: 1 } = {};

            const dataSetObjectsFocalLength: DatasetObjectSchema = {};
            const dataSetObjectsAperture: DatasetObjectSchema = {};
            const dataSetObjectsShutterSpeed: DatasetObjectSchema = {};
            const dataSetObjectsIso: DatasetObjectSchema = {};

            images.forEach((image) => {
                let cameraAndLensCombination = `${
                    image.cameraModel || "Unknown"
                }||${image.lensModel || "Unknown"}`;

                /* Handling the FOCAL LENGTH Chart */

                if (!image.focalLength) {
                    console.log(
                        "This image's focal length was not parsed correctly: ",
                        image
                    );
                } else {
                    let adjustedFocalLength =
                        ROUNDING_FACTOR *
                        Math.ceil(image.focalLength / ROUNDING_FACTOR);
                    if (!focalLengthsFound[adjustedFocalLength])
                        focalLengthsFound[adjustedFocalLength] = 1;
                    else focalLengthsFound[adjustedFocalLength]++;

                    // Check if this combi has already been added
                    let combination =
                        dataSetObjectsFocalLength[cameraAndLensCombination];
                    if (!combination) {
                        // Hasn't been added yet
                        dataSetObjectsFocalLength[cameraAndLensCombination] =
                            {};
                        dataSetObjectsFocalLength[cameraAndLensCombination][
                            adjustedFocalLength
                        ] = 1;
                    } else {
                        // Combination has already been added
                        // Check if the focal length has been added
                        if (!combination[adjustedFocalLength]) {
                            // Hasn't been added yet, add it
                            combination[adjustedFocalLength] = 1;
                        } else {
                            // Has already been added, increment number of pictures by 1
                            combination[adjustedFocalLength]++;
                        }
                    }
                }

                /* Handling the APERTURE chart */
                if (!image.aperture) {
                    console.log(
                        "This image's aperture was not parsed correctly: ",
                        image
                    );
                } else {
                    if (!aperturesFound[image.aperture])
                        aperturesFound[image.aperture] = 1;
                    else aperturesFound[image.aperture]++;

                    // Check if this combi has already been added
                    let combination =
                        dataSetObjectsAperture[cameraAndLensCombination];
                    if (!combination) {
                        // Hasn't been added yet
                        dataSetObjectsAperture[cameraAndLensCombination] = {};
                        dataSetObjectsAperture[cameraAndLensCombination][
                            image.aperture
                        ] = 1;
                    } else {
                        // Combination has already been added
                        // Check if the focal length has been added
                        if (!combination[image.aperture]) {
                            // Hasn't been added yet, add it
                            combination[image.aperture] = 1;
                        } else {
                            // Has already been added, increment number of pictures by 1
                            combination[image.aperture]++;
                        }
                    }
                }

                /* Handling the SHUTTER SPEED chart */
                if (!image.shutterSpeed) {
                    console.log(
                        "This image's shutterSpeed was not parsed correctly: ",
                        image
                    );
                } else {
                    if (!shutterSpeedsFound[Number(image.shutterSpeed)])
                        shutterSpeedsFound[Number(image.shutterSpeed)] = 1;
                    else shutterSpeedsFound[Number(image.shutterSpeed)]++;

                    // Check if this combi has already been added
                    let combination =
                        dataSetObjectsShutterSpeed[cameraAndLensCombination];
                    if (!combination) {
                        // Hasn't been added yet
                        dataSetObjectsShutterSpeed[cameraAndLensCombination] =
                            {};
                        dataSetObjectsShutterSpeed[cameraAndLensCombination][
                            Number(image.shutterSpeed)
                        ] = 1;
                    } else {
                        // Combination has already been added
                        // Check if the focal length has been added
                        if (!combination[Number(image.shutterSpeed)]) {
                            // Hasn't been added yet, add it
                            combination[Number(image.shutterSpeed)] = 1;
                        } else {
                            // Has already been added, increment number of pictures by 1
                            combination[Number(image.shutterSpeed)]++;
                        }
                    }
                }

                /* Handling the ISO chart */
                if (!image.iso) {
                    console.log(
                        "This image's iso was not parsed correctly: ",
                        image
                    );
                } else {
                    if (!isosFound[image.iso]) isosFound[image.iso] = 1;
                    else isosFound[image.iso]++;

                    // Check if this combi has already been added
                    let combination =
                        dataSetObjectsIso[cameraAndLensCombination];
                    if (!combination) {
                        // Hasn't been added yet
                        dataSetObjectsIso[cameraAndLensCombination] = {};
                        dataSetObjectsIso[cameraAndLensCombination][
                            image.iso
                        ] = 1;
                    } else {
                        // Combination has already been added
                        // Check if the focal length has been added
                        if (!combination[image.iso]) {
                            // Hasn't been added yet, add it
                            combination[image.iso] = 1;
                        } else {
                            // Has already been added, increment number of pictures by 1
                            combination[image.iso]++;
                        }
                    }
                }
            });

            /* Handling the FOCAL LENGTH Chart */

            const labelsFocalLength: string[] = Object.keys(focalLengthsFound); // Remember, Object.keys returns array of strings even though the keys are numbers
            const datasetsFocalLength: DataSet[] = [];

            const combinationsFocalLength = Object.keys(
                dataSetObjectsFocalLength
            );
            for (let i = 0; i < combinationsFocalLength.length; i++) {
                let combination = combinationsFocalLength[i];

                // combination: Canon EOS M5||100-400 F5-6.3 DG OS HSM | C (for e.g.)
                // each combination is a new Dataset

                // Data - how to get?
                // We need to loop through all the labels ( which is focal length ).
                // IF - focal length is one of the keys in dataSetObjects[combination] - it is a focal length shot by this lens, therefore, add the # (value) to the data.
                // If it is not, then add zero.
                // Remember, the dataSetObjects[combination] == { 260: 3, 400: 10, 600: 1 }

                let data: number[] = [];
                labelsFocalLength.forEach((focalLength) => {
                    let focalLengthNum = Number(focalLength);
                    if (
                        dataSetObjectsFocalLength[combination][focalLengthNum]
                    ) {
                        data.push(
                            dataSetObjectsFocalLength[combination][
                                focalLengthNum
                            ]
                        );
                    } else {
                        data.push(0);
                    }
                });

                let dataset: DataSet = {
                    label: combination.replace("||", " w/ "),
                    data,
                    backgroundColor: hexToRgbA(
                        rainbow(combinationsFocalLength.length, i),
                        "0.4"
                    ),
                    borderColor: rainbow(combinationsFocalLength.length, i),
                    borderWidth: 2,
                };
                datasetsFocalLength.push(dataset);
            }

            state.focalLength = {
                labels: labelsFocalLength.map(
                    (focalLength) =>
                        `${Number(focalLength) - 9} - ${focalLength} mm`
                ),
                // labels: labelsFocalLength.map(focalLength => `${focalLength} mm`),
                datasets: datasetsFocalLength,
            };

            /* Handling the Aperture Chart */

            const labelsAperture: string[] = Object.keys(aperturesFound); // Remember, Object.keys returns array of strings even though the keys are numbers
            labelsAperture.sort((a, b) => Number(a) - Number(b));
            const datasetsAperture: DataSet[] = [];

            const combinationsAperture = Object.keys(dataSetObjectsAperture);
            for (let i = 0; i < combinationsAperture.length; i++) {
                let combination = combinationsAperture[i];

                // combination: Canon EOS M5||100-400 F5-6.3 DG OS HSM | C (for e.g.)
                // each combination is a new Dataset

                // Data - how to get?
                // We need to loop through all the labels ( which is focal length ).
                // IF - focal length is one of the keys in dataSetObjects[combination] - it is a focal length shot by this lens, therefore, add the # (value) to the data.
                // If it is not, then add zero.
                // Remember, the dataSetObjects[combination] == { 260: 3, 400: 10, 600: 1 }

                let data: number[] = [];
                labelsAperture.forEach((aperture) => {
                    let apertureNum = Number(aperture);
                    if (dataSetObjectsAperture[combination][apertureNum]) {
                        data.push(
                            dataSetObjectsAperture[combination][apertureNum]
                        );
                    } else {
                        data.push(0);
                    }
                });

                let dataset: DataSet = {
                    label: combination.replace("||", " w/ "),
                    data,
                    backgroundColor: hexToRgbA(
                        rainbow(combinationsAperture.length, i),
                        "0.4"
                    ),
                    borderColor: rainbow(combinationsAperture.length, i),
                    borderWidth: 2,
                };
                datasetsAperture.push(dataset);
            }

            state.aperture = {
                labels: labelsAperture.map((aperture) => `f/${aperture}`),
                datasets: datasetsAperture,
            };

            /* Handling the ShutterSpeed Chart */

            const labelsShutterSpeed: string[] =
                Object.keys(shutterSpeedsFound); // Remember, Object.keys returns array of strings even though the keys are numbers
            labelsShutterSpeed.sort((a, b) => Number(b) - Number(a));
            const datasetsShutterSpeed: DataSet[] = [];

            const combinationsShutterSpeed = Object.keys(
                dataSetObjectsShutterSpeed
            );
            for (let i = 0; i < combinationsShutterSpeed.length; i++) {
                let combination = combinationsShutterSpeed[i];

                // combination: Canon EOS M5||100-400 F5-6.3 DG OS HSM | C (for e.g.)
                // each combination is a new Dataset

                // Data - how to get?
                // We need to loop through all the labels ( which is focal length ).
                // IF - focal length is one of the keys in dataSetObjects[combination] - it is a focal length shot by this lens, therefore, add the # (value) to the data.
                // If it is not, then add zero.
                // Remember, the dataSetObjects[combination] == { 260: 3, 400: 10, 600: 1 }

                let data: number[] = [];
                labelsShutterSpeed.forEach((shutterSpeed) => {
                    let shutterSpeedNum = Number(shutterSpeed);
                    if (
                        dataSetObjectsShutterSpeed[combination][shutterSpeedNum]
                    ) {
                        data.push(
                            dataSetObjectsShutterSpeed[combination][
                                shutterSpeedNum
                            ]
                        );
                    } else {
                        data.push(0);
                    }
                });

                let dataset: DataSet = {
                    label: combination.replace("||", " w/ "),
                    data,
                    backgroundColor: hexToRgbA(
                        rainbow(combinationsShutterSpeed.length, i),
                        "0.4"
                    ),
                    borderColor: rainbow(combinationsShutterSpeed.length, i),
                    borderWidth: 2,
                };
                datasetsShutterSpeed.push(dataset);
            }

            state.shutterSpeed = {
                labels: labelsShutterSpeed.map(formatShutter),
                datasets: datasetsShutterSpeed,
            };

            /* Handling the ISO Chart */

            const labelsIso: string[] = Object.keys(isosFound); // Remember, Object.keys returns array of strings even though the keys are numbers
            const datasetsIso: DataSet[] = [];

            const combinationsIso = Object.keys(dataSetObjectsIso);
            for (let i = 0; i < combinationsIso.length; i++) {
                let combination = combinationsIso[i];

                // combination: Canon EOS M5||100-400 F5-6.3 DG OS HSM | C (for e.g.)
                // each combination is a new Dataset

                // Data - how to get?
                // We need to loop through all the labels ( which is focal length ).
                // IF - focal length is one of the keys in dataSetObjects[combination] - it is a focal length shot by this lens, therefore, add the # (value) to the data.
                // If it is not, then add zero.
                // Remember, the dataSetObjects[combination] == { 260: 3, 400: 10, 600: 1 }

                let data: number[] = [];
                labelsIso.forEach((iso) => {
                    let isoNum = Number(iso);
                    if (dataSetObjectsIso[combination][isoNum]) {
                        data.push(dataSetObjectsIso[combination][isoNum]);
                    } else {
                        data.push(0);
                    }
                });

                let dataset: DataSet = {
                    label: combination.replace("||", " w/ "),
                    data,
                    backgroundColor: hexToRgbA(
                        rainbow(combinationsIso.length, i),
                        "0.4"
                    ),
                    borderColor: rainbow(combinationsIso.length, i),
                    borderWidth: 2,
                };
                datasetsIso.push(dataset);
            }

            state.iso = {
                labels: labelsIso,
                datasets: datasetsIso,
            };

        },
    },
});

export default chartsSlice;
export const chartsActions = chartsSlice.actions;
