import React from 'react'
import DataTable from 'react-data-table-component';

const noData = (
    <div className="d-flex flex-column justify-content-center align-items-center">
        <img src="/images/not_found.svg" width="150px" height="90px" alt="" />
        <small>No Data Available</small>
    </div>
)

const DataTableBase = (props) => {
    return (
        <DataTable
            direction="auto"
            responsive
            subHeaderAlign="right"
            subHeaderWrap
            striped
            highlightOnHover
            fixedHeader
            theme='light'
            noDataComponent={noData}
            {...props}
        />
    )
}

export default DataTableBase