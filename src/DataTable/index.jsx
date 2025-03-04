import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTable } from 'react-table';
import Table from './Table';

import getVisibleColumns from './utils/getVisibleColumns';
import { requiredWhen } from './utils/propTypesUtils';
import getTableArgs from './utils/getTableArgs';
import TableControlBar from './TableControlBar';
import EmptyTableContent from './EmptyTableContent';
import TableFooter from './TableFooter';
import BulkActions from './BulkActions';
import DropdownFilters from './DropdownFilters';
import FilterStatus from './FilterStatus';
import RowStatus from './RowStatus';
import SelectionStatus from './SelectionStatus';
import SmartStatus from './SmartStatus';
import TableFilters from './TableFilters';
import TableHeaderCell from './TableHeaderCell';
import TableCell from './TableCell';
import TableHeaderRow from './TableHeaderRow';
import TablePagination from './TablePagination';

function DataTable({
  columns, data, bulkActions, defaultColumnValues, additionalColumns, isSelectable,
  isPaginated, manualPagination, pageCount, itemCount,
  isFilterable, manualFilters, fetchData, initialState,
  isSortable, manualSortBy,
  initialTableOptions,
  EmptyTableComponent,
}) {
  const defaultColumn = React.useMemo(
    () => (defaultColumnValues),
    [defaultColumnValues],
  );
  const tableOptions = useMemo(() => ({
    columns,
    data,
    defaultColumn,
    manualFilters,
    manualPagination,
    manualSortBy,
    initialState,
    ...initialTableOptions,
  }), [columns, data, defaultColumn, manualFilters, manualPagination, initialState, initialTableOptions]);

  if (isPaginated && manualPagination) {
    // pageCount is required when pagination is manual, if it's not there passing -1 as per react-table docs
    tableOptions.pageCount = pageCount || -1;
  }

  // NB: Table args *must* be in a particular order
  const tableArgs = getTableArgs({
    tableOptions, isFilterable, isSelectable, isPaginated, isSortable,
  });
  // adds selection column and action columns as necessary
  tableArgs.push(hooks => {
    hooks.visibleColumns.push(visibleColumns => getVisibleColumns(isSelectable, visibleColumns, additionalColumns));
  });

  // Use the state and functions returned from useTable to build your UI
  const instance = useTable(...tableArgs);

  useEffect(() => {
    if (fetchData) {
      fetchData(instance.state);
    }
    // Stringifying the data gives a quick way of checking deep equality
  }, [fetchData, JSON.stringify(instance.state)]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = instance;

  const filterNames = instance.state.filters ? instance.state.filters.map((filter) => filter.id) : [];
  const resetAllFilters = instance.setAllFilters ? () => instance.setAllFilters([]) : null;
  const pageSize = instance.page ? instance.page.length : rows.length;

  return (
    <div className="pgn__data-table-wrapper">
      <TableControlBar
        isSelectable={isSelectable}
        selectedFlatRows={instance.selectedFlatRows}
        toggleAllRowsSelected={instance.toggleAllRowsSelected}
        isFilterable={isFilterable}
        filterNames={filterNames}
        pageSize={pageSize}
        itemCount={itemCount}
        bulkActions={bulkActions}
        columns={instance.columns}
        rows={instance.flatRows}
        resetAllFilters={resetAllFilters}
      />
      {rows.length > 0 && (
        <Table
          getTableProps={getTableProps}
          getTableBodyProps={getTableBodyProps}
          headerGroups={headerGroups}
          /* the page contains only the rows in it, as opposed to all rows.
            it is only available when the table is paginated */
          rows={instance.page ? instance.page : rows}
          prepareRow={prepareRow}
        />
      )}
      {rows.length <= 0 && <EmptyTableComponent />}
      <TableFooter
        itemCount={itemCount}
        pageSize={pageSize}
        isPaginated={isPaginated}
        previousPage={instance.previousPage}
        nextPage={instance.nextPage}
        canNextPage={instance.canNextPage}
        canPreviousPage={instance.canPreviousPage}
        pageIndex={instance.state.pageIndex}
        pageCount={instance.pageCount}
      />
    </div>
  );
}

DataTable.defaultProps = {
  additionalColumns: [],
  bulkActions: [],
  defaultColumnValues: {},
  isFilterable: false,
  isPaginated: false,
  isSelectable: false,
  isSortable: false,
  manualFilters: false,
  manualPagination: false,
  manualSortBy: false,
  fetchData: null,
  initialState: {},
  initialTableOptions: {},
  EmptyTableComponent: EmptyTableContent,
};

DataTable.propTypes = {
  /** Definition of table columns */
  columns: PropTypes.arrayOf(PropTypes.shape({
    /** User visible column name P */
    Header: PropTypes.string.isRequired,
    /** String used to access the correct cell data for this column */
    accessor: PropTypes.string.isRequired,
  })).isRequired,
  /** Data to be displayed in the table */
  data: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  /** table rows can be selected */
  isSelectable: PropTypes.bool,
  /** Table columns can be sorted */
  isSortable: PropTypes.bool,
  /** Indicates that sorting will be done via backend API. A fetchData function must be provided */
  manualSortBy: PropTypes.bool,
  /** Paginate the table */
  isPaginated: PropTypes.bool,
  /* Indicates that pagination will be done manually. A fetchData function must be provided */
  manualPagination: PropTypes.bool,
  // eslint-disable-next-line react/require-default-props
  pageCount: requiredWhen(PropTypes.number, 'manualPagination'),
  itemCount: PropTypes.number.isRequired,
  /** Table rows can be filtered, using a default filter in the default column values, or in the column definition */
  isFilterable: PropTypes.bool,
  /** Indicates that filtering will be done via a backend API. A fetchData function must be provided */
  manualFilters: PropTypes.bool,
  /** Actions to be performed on the table. isSelectable must be true to use bulk actions */
  bulkActions: PropTypes.arrayOf(PropTypes.shape({
    /** Text displayed to the user for each action */
    buttonText: PropTypes.string.isRequired,
    /** Click handler for the action; it will be passed the selected rows */
    handleClick: PropTypes.func.isRequired,
  })),
  /** defaults that will be set on each column. Will be overridden by individual column values */
  defaultColumnValues: PropTypes.shape({
    /** A default filter component for the column */
    Filter: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  }),
  /** Actions or other additional non-data columns can be added here  */
  additionalColumns: PropTypes.arrayOf(PropTypes.shape({
    /** id must be unique from other columns ids */
    id: PropTypes.string.isRequired,
    /** column header that will be displayed to the user */
    Header: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    /** Component that renders in the added column. It will receive the row as a prop */
    Cell: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  })),
  /** Function that will fetch table data. Called when page size, page index or filters change.
    * Meant to be used with manual filters and pagination */
  fetchData: PropTypes.func,
  /** Initial state passed to react-table's documentation https://react-table.tanstack.com/docs/api/useTable */
  initialState: PropTypes.shape({
    pageSize: requiredWhen(PropTypes.number, 'isPaginated'),
    pageIndex: requiredWhen(PropTypes.number, 'isPaginated'),
    filters: requiredWhen(PropTypes.arrayOf(PropTypes.shape()), 'manualFilters'),
    sortBy: requiredWhen(PropTypes.arrayOf(PropTypes.shape()), 'manualSortBy'),
  }),
  /** Table options passed to react-table's useTable hook. Will override some options passed in to DataTable, such
     as: data, columns, defaultColumn, manualFilters, manualPagination, manualSortBy, and initialState */
  initialTableOptions: PropTypes.shape(),
  /** Component to be displayed when the table is empty */
  EmptyTableComponent: PropTypes.func,
};

DataTable.BulkActions = BulkActions;
DataTable.EmptyTable = EmptyTableContent;
DataTable.DropdownFilters = DropdownFilters;
DataTable.FilterStatus = FilterStatus;
DataTable.RowStatus = RowStatus;
DataTable.SelectionStatus = SelectionStatus;
DataTable.SmartStatus = SmartStatus;
DataTable.Table = Table;
DataTable.TableCell = TableCell;
DataTable.TableControlBar = TableControlBar;
DataTable.TableFilters = TableFilters;
DataTable.TableFooter = TableFooter;
DataTable.TableHeaderCell = TableHeaderCell;
DataTable.TableHeaderRow = TableHeaderRow;
DataTable.TablePagination = TablePagination;

export default DataTable;
