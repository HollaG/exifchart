export default interface ChartData {
    labels?: string[];
    datasets?: DataSet[];
}

export interface DataSet { 
    label: string,
    data: number[],
    backgroundColor?: string,
    borderColor?: string,
    borderWidth?: string|number
}