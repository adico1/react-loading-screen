import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import GridLayout from '../layout/GridLayout'

import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import ToggleButton, { ToggleButtonGroup } from "@material-ui/lab/ToggleButton";
import Clock from "./Clock";
import Password from "./Password";

import EmployeesService from '../../services/employees-service';
import HoursReportService from '../../services/hours-report-service';

import { KINDERGARTEN_ID_REQUIRED, EMPLOYEE_ID_REQUIRED, EMPLOYEE_CODE_REQUIRED, 
  NOT_EMPLOYEE, EMPLOYEE_CODE_INVALID, ENTRY_SUCCESS, EXIT_SUCCESS, DOUBLE_ENTRY, DOUBLE_EXIT } from '../../../server/shared/hours-report-consts';

import HoursReportAudio from './Audio';

const styles = theme => ({
  selectEmpty: {
    marginTop: theme.spacing.unit * 2
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    textAlign: "right",
    flex: "0 50%",
    width: "auto"
  },
  menu: {
  },
  toggleContainer: {
    height: 56,
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-evenly",
    margin: `${theme.spacing.unit}px 0`,
    marginTop: 20
  },
  toggleButton: {
    height: 60,
    width: 100
  },
  inputs: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    display: "flex",
    justifyContent: "flex-start",
    margin: `${theme.spacing.unit}px 0`
  }
});

class HoursReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      kindergartenId: '5b7735edf3796162842507c1',
      open: false,
      value: "",
      keyboardValue: "",
      name: "0",
      alignment: "left",
      direction: "in",
      names: []
    };

    this.togglePlay = this.togglePlay.bind(this);
    this.onInput = this.handleInput.bind(this);
    this.onFocus = this.handleFocus.bind(this);
    this.onChange = this.handleChange.bind(this);
    this.onChangeKeyboard = this.handleChangeKeyboard.bind(this);
    this.onRequestClose = this.handleRequestClose.bind(this);
  }

  togglePlay(name) {
    HoursReportAudio.play(name);
  }

  componentDidMount() {
    this.listEmployeesByKindergarten(this.state.kindergartenId);
  }

  listEmployeesByKindergarten(kindergartenId) {
    EmployeesService
      .listEmployeesByKindergarten(kindergartenId)
      .then(employees => {
        const newNames = [];

        employees.forEach((item) => {
          console.log('item: ');
          console.dir(item);
  
          newNames.push({
            value: item._id,
            label: item.name
          });
        });

        console.log('newNames:');
        console.dir(newNames);

        this.setState({ names: newNames});
      })
      .catch(error => {
          console.log(error);
          return;
      });
  }

  handleInput(input) {
    this.setState({ value: input });
  }

  handleDirection = direction => this.setState({ direction });

  handleAlignment = alignment => this.setState({ alignment });

  handleChange = event => {
    this.setState({ name: event.target.value });
  };

  canOpenKeyboard() {
    return true;
  }

  handleFocus(event) {
    if (this.canOpenKeyboard()) {
      this.setState({ open: true });
    }
  }

  handleChangeKeyboard(value) {
    console.log('handleChangeKeyboard', value);
    
    value = value.trim();

    this.setState({ keyboardValue: value });
    if(this.state.direction === 'in') {
      this.signEntry(value);
    } else {
      this.signExit(value);
    }
  }

  handleRequestClose() {
    this.setState({ open: false });
  }

  signEntry(employeeCode) {
    console.log('this.state.keyboardValue:', this.state.keyboardValue);

    HoursReportService.signEntry(this.state.kindergartenId,this.state.name,employeeCode)
      .then(res => {
        console.log('res:', res);
        this.togglePlay('entryRegistered');
      })
      .catch(err => {
        console.log('err:', err);
        this.signErrorHandler(err)
      });
  }

  signExit(employeeCode) {
    HoursReportService.signExit(this.state.kindergartenId,this.state.name,employeeCode)
      .then(() => {
        this.togglePlayExit();
      })
      .catch((err) => {
        console.log('err:', err)
        this.signErrorHandler(err)
      });
  }

  signErrorHandler(err) {
    switch(err.code) {
      case EMPLOYEE_CODE_INVALID.code:
        this.togglePlay('employeeCodeInvalid');
        break;
      case DOUBLE_ENTRY.code:
        this.togglePlay('doubleEntry');
        break;
      case DOUBLE_EXIT.code:
        this.togglePlay('doubleExit');
        break;
      case KINDERGARTEN_ID_REQUIRED.code:
      case EMPLOYEE_ID_REQUIRED.code: 
      case EMPLOYEE_CODE_REQUIRED.code:
      case NOT_EMPLOYEE.code:
        this.togglePlay('unexpectedError');
        break;
      default:
        this.togglePlay('unexpectedError');
    }
  }

  render() {
    const { classes } = this.props;
    const { direction } = this.state;

    const { onChangeKeyboard } = this;

    return (
      <GridLayout>
        <Clock />
        <div className={classes.toggleContainer}>
          <ToggleButtonGroup
            value={direction}
            onChange={this.handleDirection}
            exclusive={true}
          >
            <ToggleButton value="in" className={classes.toggleButton}>כניסה</ToggleButton>
            <ToggleButton value="out"className={classes.toggleButton}>יציאה</ToggleButton>
          </ToggleButtonGroup>
        </div>
        <div className={classes.inputs}>
          <TextField
            id="select-name"
            select
            label="שם"
            className={classes.textField}
            onChange={this.onChange}
            value={this.state.name}
            SelectProps={{
              MenuProps: {
                className: classes.menu
              }
            }}
            helperText="בחרי את שמך מהרשימה"
            margin="normal"
          >
            {this.state.names.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <Password className={classes.textField} onChange={onChangeKeyboard} />
        </div>
      </GridLayout>              
    );
  }
}

HoursReport.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(HoursReport);
