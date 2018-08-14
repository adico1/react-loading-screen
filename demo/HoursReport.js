import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { hot } from 'react-hot-loader'
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import ToggleButton, { ToggleButtonGroup } from "@material-ui/lab/ToggleButton";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { create } from "jss";
import rtl from "jss-rtl";
import JssProvider from "react-jss/lib/JssProvider";
import { createGenerateClassName, jssPreset } from "@material-ui/core/styles";
//import Keyboard from "react-material-ui-keyboard";
//import { numericKeyboard } from "react-material-ui-keyboard/layouts";
import Clock from "./clock";
import Password from "./password";

const theme = createMuiTheme({
  direction: "rtl" // Both here and <body dir="rtl">
});

// Configure JSS
const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

// Custom Material-UI class name generator.
const generateClassName = createGenerateClassName();

function RTL(props) {
  return (
    <JssProvider jss={jss} generateClassName={generateClassName}>
      {props.children}
    </JssProvider>
  );
}

const styles = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap"
  },
  mainGrid: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2
  },
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    textAlign: "right",
    flex: "0 50%",
    width: "auto"
  },
  menu: {
    width: 200
  },
  formContainer: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    display: "flex",
    flexDirection: "column",
    margin: `${theme.spacing.unit}px 0`,
    background: theme.palette.background.default
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

const names = [
  {
    value: "0",
    label: "חיה כהן"
  },
  {
    value: "1",
    label: "שיפרה גולדשטיין"
  },
  {
    value: "2",
    label: "ברכה לוין"
  }
];

class SimpleSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      value: "",
      keyboardValue: "",
      name: "0",
      alignment: "left",
      formats: ["in"]
    };

    this.onInput = this.handleInput.bind(this);
    this.onFocus = this.handleFocus.bind(this);
    this.onChange = this.handleChange.bind(this);
    this.onChangeKeyboard = this.handleChangeKeyboard.bind(this);
    this.onRequestClose = this.handleRequestClose.bind(this);
    this.onInputKeyboard = this.handleInputKeyboard.bind(this);

  }

  handleInput(input) {
    this.setState({ value: input });
  }

  handleFormat = formats => this.setState({ formats });

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

  handleChangeKeyboard(event, value) {
    console.log(value);
    this.setState({ keyboardValue: value });
  }

  handleRequestClose() {
    this.setState({ open: false });
  }

  handleInputKeyboard(input) {
    console.log(input);
    this.setState({ keyboardValue: input });
  }

  render() {
    const { classes } = this.props;
    const { formats } = this.state;

    const { state, onFocus, onChangeKeyboard, onInputKeyboard } = this;
    const { keyboardValue } = state;

    const textField = (
      <TextField
        id="text"
        required
        label="סיסמה"
        className={classes.textField}
        type="password"
        value={keyboardValue}
        margin="normal"
        onFocus={onFocus}
        onChange={onChangeKeyboard}
      />
    );

    return (
      <JssProvider jss={jss} generateClassName={generateClassName}>
        <MuiThemeProvider theme={theme}>
          <div dir="rtl">
            <form className={classes.root} autoComplete="off">
              <Grid className={classes.mainGrid} container spacing={16}>
                <Grid item xs={12} sm={6}>
                  <div className={classes.formContainer}>
                    <Clock />
                    <div className={classes.toggleContainer}>
                      <ToggleButtonGroup
                        value={formats}
                        onChange={this.handleFormat}
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
                        {names.map(option => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                      <Password className={classes.textField} />
                    </div>
                  </div>
                </Grid>
              </Grid>
            </form>
          </div>
        </MuiThemeProvider>
      </JssProvider>
    );
  }
}

SimpleSelect.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SimpleSelect);
