import {Column, Row, useRowSelect, useTable} from "react-table";
import BTable from "react-bootstrap/Table";

import {observer} from "mobx-react-lite";

export interface ITable<T> {
    columns: Column[];
    data: T[];
    selectRowCallback: (index: number) => void;
    onlyOneValue?: boolean;
}

function Table<T extends Object>({ columns, data, selectRowCallback }: ITable<T>) {
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, toggleRowSelected } = useTable(
        {
            columns,
            data,
            stateReducer: (newState, action) => {
                if (action.type === "toggleRowSelected") {
                    newState.selectedRowIds = {
                        [action.id]: action.value,
                    };

                    selectRowCallback(action.value ? +action.id : -1);
                }

                return newState;
            },
        },
        useRowSelect,
    );

    function selectRowHandler(e: React.MouseEvent<HTMLTableRowElement>, row: Row) {
        toggleRowSelected(row.id, !row.isSelected);
    }

    return (
        <BTable bordered {...getTableProps()}>
            <thead>
                {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                            <th {...column.getHeaderProps()}>{column.render("Header")}</th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map((row, i) => {
                    prepareRow(row);
                    return (
                        <tr
                            style={{ background: row.isSelected ? "lightgrey" : "white" }}
                            onClick={(e) => selectRowHandler(e, row)}
                            {...row.getRowProps()}
                        >
                            {row.cells.map((cell) => {
                                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
                            })}
                        </tr>
                    );
                })}
            </tbody>
        </BTable>
    );
}

export default observer(Table);
