import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import RootState from "../../models/RootState";
import { Cell, usePagination, useSortBy, useTable } from "react-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import DirectoryButton from "../../../ui/DirectoryButton";
import TableDataObject from "../../models/TableDataObject";
import { columns } from "../../../config/table_config";
import useWindowDimensions from "../../../hooks/use-window-dimensions";
import { get } from "idb-keyval";
import { modalActions } from "../../../store/modal-slice";
import verifyPermission from "../../../functions/verifyPermissions";

const TableViewer = React.forwardRef<HTMLTableElement>((props, ref) => {
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

    const imageMap = useSelector((state: RootState) => state.files.files);
    const dispatch = useDispatch();
    const viewImageHandler = async (cell: Cell<TableDataObject>) => {
        let path = cell.row.original.path;
        let idbFile:
            | { entry: FileSystemFileHandle | File; thumbnail: string }
            | undefined = await get(path);

        let imageBlob: File;
        if (!idbFile) return;
        if ("getFile" in idbFile.entry) {
            let perm = await verifyPermission(idbFile.entry, false);
            if (!perm)
                return alert(
                    "You need to provide permission to view this image!"
                );
            imageBlob = await idbFile.entry.getFile();
        } else {
            imageBlob = idbFile.entry;
        }

        let imageSrc = URL.createObjectURL(imageBlob);

        let image = imageMap[path];
        dispatch(
            modalActions.setModal({
                src: imageSrc,
                detailObject: {
                    cameraModel: image.cameraModel,
                    lensModel: image.lensModel,
                    aperture: image.aperture,
                    shutterSpeed: Number(image.shutterSpeed),
                    focalLength: image.focalLength,
                    iso: image.iso,
                },
                path,
                index: cell.row.original.id,
            })
        );
    };

    return (
        <div style={{ maxHeight: "85vh" }}>
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
                                                        onClick={() =>
                                                            viewImageHandler(
                                                                cell
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
});

export default TableViewer;
