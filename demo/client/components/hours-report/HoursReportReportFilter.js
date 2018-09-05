import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";

const styles = theme => ({
  
});

const kindergarten = [
  {
    value: "0",
    label: "גן שוש"
  },
  {
    value: "1",
    label: "גן אהובה"
  }
];
const employee = [
  {
    value: "0",
    label: "שושנה דמרי"
  },
  {
    value: "1",
    label: "אסתי לאודר"
  }
];

const year = [
  {
    value: "2018",
    label: "2018"
  },
  {
    value: "2019",
    label: "2019"
  }
];

const month = [
  {
    value: "1",
    label: "ינואר"
  },
  {
    value: "2",
    label: "פברואר"
  }
];

class HoursReportReportFilter extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      kindergarten: '',
      employee: '',
      year: '',
      month: ''
    };
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };
  
  render() {
    const { classes } = this.props;

    return (
      <div>
      <TextField
        id="select-kindergarten"
        select
        label="גן"
        className={classes.textField}
        value={this.state.kindergarten}
        onChange={this.handleChange("kindergarten")}
        SelectProps={{
          native: true,
          MenuProps: {
            className: classes.menu
          }
        }}
        helperText="בחר גן"
        margin="normal"
      >
        {kindergarten.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </TextField>
      <TextField
        id="select-currency"
        select
        label="עובד"
        className={classes.textField}
        value={this.state.employee}
        onChange={this.handleChange("employee")}
        SelectProps={{
          MenuProps: {
            className: classes.menu
          }
        }}
        helperText="בחר עובד"
        margin="normal"
      >
        {employee.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        id="select-year"
        select
        label="שנה"
        className={classes.textField}
        value={this.state.year}
        onChange={this.handleChange("year")}
        SelectProps={{
          MenuProps: {
            className: classes.menu
          }
        }}
        helperText="בחר שנה"
        margin="normal"
      >
        {year.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        id="select-currency"
        select
        label="חודש"
        className={classes.textField}
        value={this.state.month}
        onChange={this.handleChange("currency")}
        SelectProps={{
          MenuProps: {
            className: classes.menu
          }
        }}
        helperText="בחר חודש"
        margin="normal"
      >
        {month.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
      </div>
    );
  }
}

HoursReportReportFilter.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(HoursReportReportFilter);