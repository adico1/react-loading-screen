import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import 'bootstrap/dist/css/bootstrap.css';

const ReactDataGrid = require("react-data-grid");

const styles = theme => ({
  
});

class HoursReportMonthyMissCountReport extends React.Component {
  constructor(props, context) {
    super(props, context);

    const 
      colDate =           { key: "uses", name: "ניצולים", width: 60 },
      colDay =            { key: "quantity", name: "כמות", width: 40 }
      ;


    if(props.dir === 'rtl') {
      this._columns = [
        colDate,
        colDay,
      ];
  
    } else {
      this._columns = [
        colDay,
        colDate
      ];
  
    }

    this.state = { rows: this.createRows(3) };
  }

  createRows = () => {
    let rows = [];
    
    let nextRow = {
      uses: 'חופשה',
      quantity: '3.00',
    };
    rows.push(nextRow);
  
    nextRow = {
      uses: 'מחלת עובד',
      quantity: '2.00',
    };
    rows.push(nextRow);

    nextRow = {
      uses: 'פנקס חופשה',
      quantity: '3.00',
    };
    rows.push(nextRow);
    return rows;
  };
  
  rowGetter = i => {
    return this.state.rows[i];
  };
  
  render() {
    const rowHeight = 35;
    const scrollBarSize = 20;
    const resultsPerPage = 3;

    return (
      <ReactDataGrid
        dir="rtl"
        enableCellSelect={true}
        columns={this._columns}
        rowGetter={this.rowGetter}
        rowsCount={this.state.rows.length}
        minHeight={((resultsPerPage + 1) * rowHeight) + scrollBarSize}
        onGridRowsUpdated={this.handleGridRowsUpdated}
      />   
    );
  }
}

HoursReportMonthyMissCountReport.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(HoursReportMonthyMissCountReport);

