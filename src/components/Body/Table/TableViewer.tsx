import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import RootState from "../../models/RootState";
import {
    Column,
    TableOptions,
    usePagination,
    useSortBy,
    useTable,
} from "react-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import DirectoryButton from "../../../ui/DirectoryButton";
import TableDataObject from "../../models/TableDataObject";
import { columns } from "../../../config/table_config";

import { createSelector } from "reselect";
import useWindowDimensions from "../../../hooks/use-window-dimensions";
const selectTableData = createSelector(
    (state: RootState) => state.files.tableData,
    (tableData) => tableData
);

const TableViewer = React.forwardRef<HTMLTableElement>((props, ref) => {
    // const filesObject = useSelector((state: RootState) => state.files.files);
    console.log("tableviwer rerendering");

    const {height, width} = useWindowDimensions()

    console.log(height)
    const numberOfRowsShowing = Math.floor(height / 90 - 2) || 1

    // interface DataObject {
    //     id: number;
    //     filePath: string;
    //     image: string;
    //     cameraModel: string;
    //     lensModel: string;
    //     focalLength: number;
    //     shutterSpeed: number;
    //     aperture: number;
    //     iso: number;
    //     exposureMode: string;
    //     exposureComp: number;
    //     whiteBalance: string;
    // }
    // const data: DataObject[] = useMemo(() => {
    //     let fileArr = [];

    //     let fileIDs = Object.keys(filesObject);
    //     for (let i = fileIDs.length - 1; i > 0; i--) {
    //         let filePath = fileIDs[i];
    //         let file = filesObject[filePath];

    //         fileArr.push({
    //             id: i,
    //             filePath,
    //             image: "Load",
    //             cameraModel: file.cameraModel,
    //             lensModel: file.lensModel,
    //             focalLength: file.focalLength,
    //             shutterSpeed: file.shutterSpeed,
    //             aperture: file.aperture,
    //             iso: file.iso,
    //             exposureMode: file.exposureMode,
    //             exposureComp: file.exposureCompensation,
    //             whiteBalance: file.whiteBalance,
    //         });
    //     }

    //     return fileArr;
    // }, [filesObject]);

    const rawData: TableDataObject[] = useSelector(
        (state: RootState) => state.files.tableData
    );
    const data = useMemo(() => rawData, [rawData]);
    // const columns: Column<TableDataObject>[] = useMemo(
    //     () => [
    //         {
    //             Header: "#",
    //             accessor: "id" as keyof TableDataObject,
    //         },
    //         {
    //             Header: "File Path",
    //             accessor: "path" as keyof TableDataObject,
    //         },
    //         {
    //             Header: "Preview",
    //             accessor: "image" as keyof TableDataObject,
    //         },
    //         {
    //             Header: "Camera Model",
    //             accessor: "cameraModel" as keyof TableDataObject,
    //         },
    //         {
    //             Header: "Lens Model",
    //             accessor: "lensModel" as keyof TableDataObject,
    //         },
    //         {
    //             Header: "Focal Length (35mm equiv)",
    //             accessor: "focalLength" as keyof TableDataObject,
    //         },
    //         {
    //             Header: "Shutter Speed",
    //             accessor: "shutterSpeed" as keyof TableDataObject,
    //         },
    //         {
    //             Header: "Aperture",
    //             accessor: "aperture" as keyof TableDataObject,
    //         },

    //         {
    //             Header: "ISO",
    //             accessor: "iso" as keyof TableDataObject,
    //         },
    //         {
    //             Header: "Exposure Mode",
    //             accessor: "exposureMode" as keyof TableDataObject,
    //         },
    //         {
    //             Header: "Exposure Compensation" as keyof TableDataObject,
    //             accessor: "exposureCompensation",
    //         },
    //         {
    //             Header: "White Balance",
    //             accessor: "whiteBalance" as keyof TableDataObject,
    //         },
    //     ],
    //     []
    // );

    // See https://github.com/tannerlinsley/react-table/discussions/2848 for disableSortRemove
    const tableInstance = useTable<TableDataObject>(
        { columns, data, disableSortRemove: true, initialState: {pageSize: numberOfRowsShowing} },
        useSortBy,
        usePagination
    );

    
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        page, // Instead of using 'rows', we'll use page,
        // which has only the rows for the active page

        // The rest of these things are super handy, too ;)
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
    } = tableInstance;

    

    return (
        <div style={{ maxHeight: "85vh" }}>
            <table ref={ref} {...getTableProps()} className="w-full">
                <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <th
                                    className="border-b-4 border-gray-700 cursor-pointer font-bold"
                                    {...column.getHeaderProps(
                                        column.getSortByToggleProps()
                                    )}
                                >
                                    {column.render("Header")}
                                    <span>
                                        {column.isSorted ? (
                                            column.isSortedDesc ? (
                                                <FontAwesomeIcon
                                                    className="text-xs mx-1 text-blue-700"
                                                    icon={faChevronDown}
                                                />
                                            ) : (
                                                <FontAwesomeIcon
                                                    className="text-xs mx-1 text-blue-700"
                                                    icon={faChevronUp}
                                                />
                                            )
                                        ) : (
                                            ""
                                        )}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map((row, index) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map((cell) => {
                                    if (cell.column.Header === "Preview") {
                                        return (
                                            <td
                                                {...cell.getCellProps()}
                                                className={`p-2 ${
                                                    index % 2
                                                        ? "bg-gray-100"
                                                        : ""
                                                }`}
                                            >
                                                {
                                                    <DirectoryButton
                                                        onClick={() => {console.log(cell)}}
                                                    >
                                                        {" "}
                                                        Load{" "}
                                                    </DirectoryButton>
                                                }
                                            </td>
                                        );
                                    } else {
                                        return (
                                            <td
                                                {...cell.getCellProps()}
                                                className={`p-2 ${
                                                    index % 2
                                                        ? "bg-gray-100"
                                                        : ""
                                                }`}
                                            >
                                                {cell.render("Cell")}
                                            </td>
                                        );
                                    }
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <div className="pagination">
                <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                    {"<<"}
                </button>{" "}
                <button
                    onClick={() => previousPage()}
                    disabled={!canPreviousPage}
                >
                    {"<"}
                </button>{" "}
                <button onClick={() => nextPage()} disabled={!canNextPage}>
                    {">"}
                </button>{" "}
                <button
                    onClick={() => gotoPage(pageCount - 1)}
                    disabled={!canNextPage}
                >
                    {">>"}
                </button>{" "}
                <span>
                    Page{" "}
                    <strong>
                        {pageIndex + 1} of {pageOptions.length}
                    </strong>{" "}
                </span>
                <span>
                    | Go to page:{" "}
                    <input
                        type="number"
                        defaultValue={pageIndex + 1}
                        onChange={(e) => {
                            const page = e.target.value
                                ? Number(e.target.value) - 1
                                : 0;
                            gotoPage(page);
                        }}
                        style={{ width: "100px" }}
                    />
                </span>{" "}
                {/* <select
                    value={pageSize}
                    onChange={(e) => {
                        setPageSize(Number(e.target.value));
                    }}
                >
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select> */}
            </div>
        </div>
    );
    return (
        <table {...getTableProps()}>
            <thead>
                {headerGroups.map((headerGroup) => {
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => {
                            <th {...column.getHeaderProps()}>
                                {column.render("Header")}
                            </th>;
                        })}
                    </tr>;
                })}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map((row) => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map((cell) => {
                                return (
                                    <td {...cell.getCellProps()}>
                                        {cell.render("Cell")}
                                    </td>
                                );
                            })}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
});

export default TableViewer;
