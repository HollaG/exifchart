export default interface ImageDetails { 
    name: string,
    path: string,
    aperture: number,
    focalLength: number,
    focalLength35: number,
    iso: number,
    shutterSpeed: number|string,
    exposureCompensation: number,    
    exposureMode: string,
    lensModel: string,
    cameraModel: string,
    whiteBalance: string,
    index: number
}