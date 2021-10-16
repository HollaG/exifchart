import Container from "../../../../ui/Container";
import ContainerContents from "../../../../ui/ContainerContents";
import ContainerHeader from "../../../../ui/ContainerHeader";
import DirectoryButton from "../../../../ui/DirectoryButton";
import TableViewer from "./TableViewer";

import XLSX from "xlsx";
import { useSelector } from "react-redux";
import RootState from "../../../../models/RootState";

// Convert string to array buffer
function s2ab(s: string) {
    const buf = new ArrayBuffer(s.length);

    const view = new Uint8Array(buf);

    for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;

    return buf;
}
const Table = () => {
    const tableData = useSelector((state: RootState) => state.files.tableData);

    const exportToExcelHandler = () => {
        // let cols = columns.map(column => {return {"name": column.Header, "key": column.accessor}})
        let data = tableData.map((row) => [
            row.id,
            row.path,
            row.cameraModel,
            row.lensModel,
            row.focalLength,
            row.shutterSpeed,
            row.aperture,
            row.iso,
            row.exposureMode,
            row.exposureCompensation,
            row.whiteBalance,
        ]);

        data.unshift([
            "#",
            "File Path",
            "Camera Model",
            "Lens Model",
            "Focal Length",
            "Shutter Speed",
            "Aperture",
            "ISO",
            "Exposure Mode",
            "Exposure Compensation",
            "White Balance",
        ]);
        let worksheet = XLSX.utils.aoa_to_sheet(data);
        let new_workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(new_workbook, worksheet, "EXIFChart");

        let wbout = XLSX.write(new_workbook, {
            bookType: "xlsx",
            bookSST: true,
            type: "binary",
        });
        let blob = window.URL.createObjectURL(
            new Blob([s2ab(wbout)], { type: "" })
        );

        // Using ref - ignore as this is only for without pagination
        // let wb = XLSX.utils.table_to_book(tableRef.current, {raw: true})
        // let wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:true, type: 'binary'})
        // let blob = URL.createObjectURL(new Blob([s2ab(wbout)], {type:''}))
        saveAs(blob, "EXIFChart.xlsx");
    };

    return (
        <Container>
            <ContainerHeader>
                <h1 className="flex-grow text-xl px-3">Table view</h1>

                <DirectoryButton
                    onClick={exportToExcelHandler}
                    extraClasses="mx-2"
                >
                    Export to Excel
                </DirectoryButton>
            </ContainerHeader>
            <ContainerContents>
                <TableViewer />
            </ContainerContents>
        </Container>
    );
};

export default Table;
