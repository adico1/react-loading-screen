import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

const ReactDataGrid = require("react-data-grid");

const styles = theme => ({
  
});

class HoursReportMonthlyMissReport extends React.Component {
  constructor(props, context) {
    super(props, context);

    const 
      colDate =           { key: "title", name: "דיווח העדרות חודשי", width: 60 },
      colDay =            { key: "sick", name: "מחל", width: 40 },
      colWorkDay =        { key: "vacation", name: "חפש", width: 90 }
      ;


    if(props.dir === 'rtl') {
      this._columns = [
        colDate,
        colDay,
        colWorkDay,
      ];
  
    } else {
      this._columns = [
        colWorkDay,
        colDay,
        colDate
      ];
  
    }

    this.state = { rows: this.createRows(32) };
  }

  createRows = () => {
    let rows = [];
    const today = new Date();
    const currentYear = today.getFullYear();

    
    let nextRow = {
      title: 'שעות:',
      sick: '17:12',
      vacation: '25:48'
    };
    rows.push(nextRow);
  
    nextRow = {
      title: 'חלקי ימים:',
      sick: '2:00',
      vacation: '3:00'
    };
    rows.push(nextRow);

    nextRow = {
      title: 'ספירת ימים:',
      sick: '2',
      vacation: '3'
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

HoursReportMonthlyMissReport.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(HoursReportMonthlyMissReport);

