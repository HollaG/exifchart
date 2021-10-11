import Container from "../../../ui/Container";
import ContainerContents from "../../../ui/ContainerContents";
import ContainerHeader from "../../../ui/ContainerHeader";
import DirectoryButton from "../../../ui/DirectoryButton";
import TableViewer from "./TableViewer";

import XLSX from "xlsx";
import { useSelector } from "react-redux";
import RootState from "../../models/RootState";
import { columns } from "../../../config/table_config";
import React, { useRef } from "react";


function s2ab(s:any) {
    const buf = new ArrayBuffer(s.length)

    const view = new Uint8Array(buf)

    for (let i=0; i !== s.length; ++i)
        view[i] = s.charCodeAt(i) & 0xFF

    return buf
}

function make_cols(refstr:string) {
    var o = [];
    var range = XLSX.utils.decode_range(refstr);
    for(var i = 0; i <= range.e.c; ++i) {
      o.push({name: XLSX.utils.encode_col(i), key:i});
    }
    return o;
  }

const Table = () => {

    const tableRef = React.createRef<HTMLTableElement>()

    const exportToExcelHandler = () => {
        // let cols = columns.map(column => {return {"name": column.Header, "key": column.accessor}})
        // let data = tableData.map(row => [row.id, row.path, row.image, row.cameraModel, row.lensModel, row.focalLength, row.shutterSpeed, row.aperture, row.iso, row.exposureMode, row.exposureCompensation, row.whiteBalance])
        // console.log(data)

        // // let worksheet = XLSX.utils.aoa_to_sheet(data)
        // // let new_workbook = XLSX.utils.book_new()
        // // XLSX.utils.book_append_sheet(new_workbook, worksheet, "EXIFChart")
        // // make_cols("EXIFChart")
        
        // // let wbout = XLSX.write(new_workbook, {bookType:'xlsx', bookSST:true, type: 'binary'})
        // // let blob = window.URL.createObjectURL(new Blob([s2ab(wbout)], {type:''}))
        // // console.log(blob)
        console.log(tableRef.current)
        let wb = XLSX.utils.table_to_book(tableRef.current, {raw: true})
        let wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:true, type: 'binary'})

        console.log(wb)
        let blob = URL.createObjectURL(new Blob([s2ab(wbout)], {type:''}))

        saveAs(blob, "EXIFChart.xlsx")
    }

    return (
        <Container>
            <ContainerHeader>
                <h1 className="flex-grow text-xl px-3">Table view</h1>
                <DirectoryButton onClick={exportToExcelHandler} extraClasses="mx-2">
                    Export to Excel
                </DirectoryButton>
            </ContainerHeader>
            <ContainerContents>
                <TableViewer ref={tableRef} />
            </ContainerContents>
        </Container>
    );
};

export default Table;
