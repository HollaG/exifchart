import  { useMemo } from "react";
import { useSelector } from "react-redux";
import RootState from "../../models/RootState";
import { usePagination, useSortBy, useTable } from "react-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import DirectoryButton from "../../../ui/DirectoryButton";
import TableDataObject from "../../models/TableDataObject";
import { columns } from "../../../config/table_config";
import useWindowDimensions from "../../../hooks/use-window-dimensions";
import useImage from "../../../hooks/use-image";

const TableViewer = () => {
    const { height } = useWindowDimensions();
    const numberOfRowsShowing = Math.floor(height / 90 - 2) || 1;

    const rawData: TableDataObject[] = useSelector(
        (state: RootState) => state.files.tableData
    );
    const data = useMemo(() => rawData, [rawData]);

    // See https://github.com/tannerlinsley/react-table/discussions/2848 for disableSortRemove
    const tableInstance = useTable<TableDataObject>(
        {
            columns,
            data,
            disableSortRemove: true,
            initialState: { pageSize: numberOfRowsShowing },
        },
        useSortBy,
        usePagination
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
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
        state: { pageIndex },
    } = tableInstance;

    const { setCurrentBigImage } = useImage();

    return (
        <div>
            <div className="pagination text-right">
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
                    Page <strong> {pageIndex + 1} </strong>
                    of
                    <strong> {pageOptions.length} </strong>
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
                        style={{ width: "50px" }}
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
            <table {...getTableProps()} className="w-full">
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
                                                        onClick={() =>
                                                            setCurrentBigImage(
                                                                cell.row
                                                                    .original
                                                                    .path,
                                                                cell.row
                                                                    .original
                                                                    .index
                                                            )
                                                        }
                                                    >
                                                        View
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
        </div>
    );
};

export default TableViewer;
