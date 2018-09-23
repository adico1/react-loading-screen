import * as React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';
import Keyboard from "react-material-ui-keyboard";
import { numericKeyboard } from "react-material-ui-keyboard/layouts";

function corrector(value) {
  console.log(`correction ${value}`);
  this.makeCorrection(value);
}

const styles = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    textAlign: "right",
    flexGrow: 1,
    fontWeight: "bold"
  }
});

class Password extends React.Component {
  constructor(props) {
    super(props);

    this.state = { open: false, value: " ", play: false };
    this.onFocus = this.handleFocus.bind(this);
    this.onChange = this.handleChange.bind(this);
    this.onRequestClose = this.handleRequestClose.bind(this);
    this.onInput = this.handleInput.bind(this);
  }

  togglePlay() {
    this.setState({ play: !this.state.play });
    console.log(this.audio);
    this.audio.play();
  }

  canOpenKeyboard() {
    console.log("canOpenKeyboard");
    return true;
  }

  handleFocus(event) {
    if (this.canOpenKeyboard()) {
      this.setState({ open: true });
    }
  }

  handleChange(event, value) {
    console.log("handleChange", value);
    this.setState({ value: value });
  }

  handleRequestClose() {
    console.log("handleRequestClose");
    this.setState({ open: false });
    this.props.onChange(this.state.value);
  }

  handleInput(input) {
    console.log("handleInput", input);
    this.setState({ value: input });
  }

  handleValid(value) {
    console.debug(`valid ${value}`);
  }

  componentDidMount() {
    //setTimeout(() => this.setState({ value: "2" }), 1000);
    console.log("componentDidMount");
  }

  componentWillUnmount() {
    console.log("componentWillUnmount");
  }

  render() {
    const { classes } = this.props;
    
    const { state, onFocus, onChange, onInput, onRequestClose } = this;
    const { value } = state;
    const textField = (
      <TextField
        id="num"
        label="קוד עובד"
        required
        margin="normal"
        className={classes.textField}
        value={value}
        onFocus={onFocus}
        onChange={onChange}
        helperText="הקלד/י קוד עובד"
      />
    );

    console.log("render");
    return (
      <div>
      <Keyboard
        textField={textField}
        open={this.state.open}
        onInput={onInput}
        onRequestClose={onRequestClose}
        onInputValueChange={onInput}
        layouts={[numericKeyboard]}
        correctorName="onRequestValue"
        corrector={corrector}
        keyboardKeyHeight={50}
        keyboardKeyWidth={100}
        keyboardKeySymbolSize={36}
        disableEffects={true}
      />
      </div>
    );
  }
}
Password.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Password);
