import ImageDetails from "./ImageDetails";

export default interface TableDataObject extends ImageDetails {
    id: number;
    shutterSpeed: string,
    image: string
    
}