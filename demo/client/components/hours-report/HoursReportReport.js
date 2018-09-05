import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

import MainLayout from '../layout/MainLayout'
import update from "immutability-helper";

import HoursReportReportFilter from './HoursReportReportFilter';
import HoursReportCompanyHeader from './HoursReportCompanyHeader';
import HoursReportEmployeeHeader from './HoursReportEmployeeHeader';

import {HoursReportMonthFactory, TotalRow} from './HoursReportRowFactory'
import HoursReportMonthyPresence from './HoursReportMonthyPresence';
import HoursReportMonthlyMissReport from './HoursReportMonthyMissReport';
import HoursReportMonthyMissCountReport from './HoursReportMonthyMissCountReport';

import 'bootstrap/dist/css/bootstrap.css';
import '../../../client/hours-report.css';

const ReactDataGrid = require("react-data-grid");
const { Editors } = require("react-data-grid-addons");
const TimeEditor = require('./TimeEditor');

const { AutoComplete: AutoCompleteEditor } = Editors;

const styles = theme => ({
  
});

// Custom Formatter component
class TimeFormatter extends React.Component {
  static propTypes = {
    value: PropTypes.string.isRequired
  };

  render() {
    const currentTime = this.props.value;
    return (
      <TextField
        id="time"
        type="time"
        width="80"
        defaultValue={currentTime}
        InputLabelProps={{
          shrink: true
        }}
        inputProps={{
          step: 300 // 5 min
        }}
      />
    );
  }
}

// options for specialReport autocomplete editor
const specialReport = [
  { id: 0, title: "" },
  { id: 1, title: "חפש" },
  { id: 2, title: "מחל" },
  { id: 3, title: "מהבית" }
];
const SpecialReportEditor = <AutoCompleteEditor options={specialReport} />;



class HoursReportReport extends React.Component {
  constructor(props, context) {
    super(props, context);

    const 
      colDate =           { key: "date", name: "תאריך", width: 60 },
      colDay =            { key: "day", name: "יום", width: 40 },
      colWorkDay =        { key: "workDay", name: "יום עבודה", width: 90 },
      colSpecialReport =  { key: "specialReport", name: "דיווח", editor: SpecialReportEditor, width: 90 },
      colEntry =          { key: "entry", name: "כניסה", editor: TimeEditor, width: 90 },
      colExit =           { key: "exit", name: "יציאה", editor: TimeEditor, width: 90 },
      colPresence =       { key: "presence", name: "נוכחות", width: 100 },
      colWorkTime =       { key: "workTime", name: "עבודה", width: 100 },
      colStandardHours =  { key: "standardHours", name: "תקן", width: 100 },
      colOrdinaryHours =  { key: "ordinaryHours", name: "רגילות", width: 100 },
      colExtraHours =     { key: "extraHours", name: "עודפות", width: 100 },
      colMissingHours =   { key: "missingHours", name: "העדרות", width: 100 },
      colSickDay =        { key: "sickDay", name: "מחלה", width: 100 },
      colVacation =       { key: "vacation", name: "חופשה", width: 100 }
      ;


    if(props.dir === 'rtl') {
      this._columns = [
        colDate,
        colDay,
        colWorkDay,
        colSpecialReport,
        colEntry,
        colExit,
        colPresence,
        colWorkTime,
        colStandardHours,
        colOrdinaryHours,
        colExtraHours,
        colMissingHours,
        colSickDay,
        colVacation
      ];
  
    } else {
      this._columns = [
        colVacation,
        colSickDay,
        colMissingHours,
        colExtraHours,
        colOrdinaryHours,
        colStandardHours,
        colWorkTime,
        colPresence,
        colExit,
        colEntry,
        colSpecialReport,
        colWorkDay,
        colDay,
        colDate
      ];
  
    }

    this.state = { rows: this.createRows(32) };
  }

  diceRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  diceDayValues() {
    const dayType = this.diceRandom(1, 15);

    switch(dayType) {
      case 1:
        // missing
        return {
          dayType: dayType,
          entry: '08:00',
          exit: '16:00',
        }
      case 2:
        // extra
        return {
          dayType: dayType,
          entry: '08:00',
          exit: '17:36',
        }
      case 3:
        // vacation
        return {
          dayType: dayType,
          entry: '*08:00',
          exit: '*16:36',
        }
      case 4:
        // sick
        return {
          dayType: dayType,
          entry: '08:00',
          exit: '16:36',
        }
      case 5:
        // work from home 
        return {
          dayType: dayType,
          entry: '08:00',
          exit: '16:36',
        }
      default:
        return {
          dayType: dayType,
          entry: '08:00',
          exit: '16:36',
        }
    }
  }

  createRows = () => {
    let rows = [];
    const today = new Date();
    const currentYear = today.getFullYear();

    const hoursReportMonthFactory = new HoursReportMonthFactory(today.getMonth(), currentYear);
    const totalRow = new TotalRow();

    while(hoursReportMonthFactory.isNextDay()) {
      const dayValues = this.diceDayValues();
      const nextRow = hoursReportMonthFactory.createNextDayReportRow(dayValues.dayType, dayValues.entry, dayValues.exit);
      rows.push(nextRow);
      totalRow.add(nextRow);
    }

    rows.push(totalRow.getTotalDaily());
    rows.push(totalRow.getTotalMonth());
    rows.push(totalRow.getTotalCount());

    return rows;
  };

  rowGetter = i => {
    return this.state.rows[i];
  };

  handleGridRowsUpdated = ({ fromRow, toRow, updated }) => {
    let rows = this.state.rows.slice();

    for (let i = fromRow; i <= toRow; i++) {
      let rowToUpdate = rows[i];
      let updatedRow = update(rowToUpdate, { $merge: updated });
      rows[i] = updatedRow;
    }

    this.setState({ rows });
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };
  
  render() {
    const { classes } = this.props;
    const rowHeight = 35;
    const scrollBarSize = 20;
    const resultsPerPage = 33;

    return (
      <MainLayout>
        <div class="wrapper">
          <header class="header">
            <div class="report-heading">
              <HoursReportReportFilter />
              <HoursReportCompanyHeader />
              <HoursReportEmployeeHeader />
            </div>
          </header>
          <article class="main">
            <ReactDataGrid
              dir="rtl"
              enableCellSelect={true}
              columns={this._columns}
              rowGetter={this.rowGetter}
              rowsCount={this.state.rows.length}
              minHeight={((resultsPerPage + 1) * rowHeight) + scrollBarSize}
              onGridRowsUpdated={this.handleGridRowsUpdated}
            />
          </article>
          {/* <aside class="aside aside-1">Aside 1</aside> */}
          <footer class="footer">
            <div class="report-summary">
              <HoursReportMonthyPresence />
              <HoursReportMonthlyMissReport />
              <HoursReportMonthyMissCountReport />
            </div>
          </footer>
        </div>
      </MainLayout>    
    );
  }
}

HoursReportReport.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(HoursReportReport);

