import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

// const rgba = "225,119,3,.9";
// const bg_grad_start = "253, 155, 18, .8";
// const bg_grad_middle = "255, 42, 4, .8";
// const bg_grad_end = "253, 125, 45, .8";
// const outer_after_boxshadow_rgba = "255, 119, 3, 1";

// const inner_bg_grad_start = "253, 125, 45, .3";
// const inner_bg_grad_middle = "255, 42, 4, .3";
// const inner_bg_grad_end = "253, 125, 45, .3";
// const inner_boxshadow_rgba = "255, 119, 3, .9";

// const mostinner_border_rgba = "225, 119, 3, 1";

const rgba = "3,119,225,.9";
const bg_grad_start = "18, 155, 253, .8";
const bg_grad_middle = "4, 42, 255, .8";
const bg_grad_end = "45, 125, 253, .8";
const outer_after_boxshadow_rgba = "3, 119, 255, 1";

const inner_bg_grad_start = "45, 125, 253, .3";
const inner_bg_grad_middle = "4, 42, 255, .3";
const inner_bg_grad_end = "45, 125, 253, .3";
const inner_boxshadow_rgba = "3, 119, 255, .9";

const mostinner_border_rgba = "3, 119, 225, 1";

const styles = theme => ({
  outer: {
    position: "relative",
    display: "inline-block",
    left: "50%",
    marginLeft: -150,
    height: 300,
    width: 300,
    border: "1px solid rgba(" + rgba + ")",
    borderRadius: "50%",
    background:
      "linear-gradient( to bottom, rgba(" +
      bg_grad_start +
      ") 0%,rgba(" +
      bg_grad_middle +
      ") 73%, rgba(" +
      bg_grad_end +
      ") 100%)",
    boxShadow:
      "0px 0px 31px 2px rgba(" +
      rgba +
      "), inset 0px 0px 31px 2px rgba(" +
      rgba +
      ")",
    "&::after": {
      content: `''`,
      position: "absolute",
      zIndex: "-1",
      marginTop: -225,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      boxShadow:
        "0px 0px 100px 2px rgba(" +
        outer_after_boxshadow_rgba +
        "), inset 0px 0px 100px 2px rgba(" +
        outer_after_boxshadow_rgba +
        ")",
      animation: "shadowFade 4s infinite ease-in"
    }
  },
  inner: {
    height: 175,
    width: 250,
    border: "1px solid rgba(" + rgba + ")",
    borderRadius: "50%",
    marginTop: 50,
    marginLeft: 25,
    marginRight: 25,
    background:
      "linear-gradient(to bottom, rgba(" +
      inner_bg_grad_start +
      ") 0%, rgba(" +
      inner_bg_grad_middle +
      ") 73%, rgba(" +
      inner_bg_grad_end +
      ") 100%)",
    boxShadow:
      "0px 0px 31px 2px rgba(" +
      inner_boxshadow_rgba +
      "), inset 0px 0px 31px 2px rgba(" +
      inner_boxshadow_rgba +
      ")"
  },
  mostinner: {
    textAlign: "center",
    height: 87,
    width: 200,
    border: "1px solid rgba(" + mostinner_border_rgba + ")",
    borderRadius: 63,
    marginTop: 45,
    marginLeft: 25,
    marginRight: 25,
    boxShadow:
      "0px 0px 31px 2px rgba(" +
      inner_boxshadow_rgba +
      "), inset 0px 0px 31px 2px rgba(" +
      inner_boxshadow_rgba +
      ")",
    textShadow:
      "0 0 5px #fff, 0 0 10px #fff, 0 0 7px #fff, 0 0 20px #88dfff, 0 0 35px #68ffc8, 0 0 40px #68ffc8, 0 0 50px #68ffc8, 0 0 75px #68ffc8",
    background:
      "repeating-linear-gradient(45deg, transparent, transparent 4px, #171717 4px, black 8px), linear-gradient( to bottom, #171717, black); background-repeat: no-repeat; background-attachment: fixed;"
  },
  time: {
    color: "white",
    fontSize: 35,
    position: "relative",
    display: "block",
    marginTop: 23
  },
  date: {
    position: "relative",
    display: "block",
    width: 120,
    marginLeft: 16,
    color: "white",
    fontSize: 12
  },
  amPm: {
    position: "relative",
    display: "block",
    width: 40,
    marginLeft: 126,
    marginTop: -15,
    color: "white",
    fontSize: 12
  },
  blink: {
    animation: "blinking .5s infinite"
  }
});

class Clock extends React.Component {
  state = {
    time: "00:00:00",
    amPm: "בוקר"
  };

  // getInitialState() {
  //   return {
  //     time: "00:00:00",
  //     amPm: "am"
  //   };
  // }

  componentDidMount() {
    this.getTime();
  }

  componentWillUnmount() {
    console.log("componentWillUnmount clock");
    clearInterval(this.interval);
    this.interval = null;
  }

  getTime() {
    const takeTwelve = n => (n > 12 ? n - 12 : n),
      addZero = n => (n < 10 ? "0" + n : n);

    this.interval = setInterval(() => {
      let d, h, m, s, t, amPm;

      d = new Date();
      h = addZero(takeTwelve(d.getHours()));
      m = addZero(d.getMinutes());
      s = addZero(d.getSeconds());
      t = `${h}:${m}:${s}`;

      amPm = d.getHours() >= 12 ? 'אחה"צ' : "בוקר";

      this.setState({
        time: t,
        amPm: amPm
      });
    }, 1000);
  }

  formatDate(date) {
    var monthNames = [
      "ינואר",
      "פברואר",
      "מרץ",
      "אפריל",
      "מאי",
      "יוני",
      "יולי",
      "אוגוסט",
      "ספטמבר",
      "אוקטובר",
      "נובמבר",
      "דצמבר"
    ];

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return day + " " + monthNames[monthIndex] + " " + year;
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.outer}>
        <div className={classes.inner}>
          <div className={classes.mostinner}>
            <span
              className={
                this.state.time === "00:00:00"
                  ? classes.time + " " + classes.blink
                  : classes.time
              }
            >
              {" "}
              {this.state.time}
            </span>
            <span className={classes.date}>{this.formatDate(new Date())}</span>
            <span className={classes.amPm}>{this.state.amPm}</span>
          </div>
        </div>
      </div>
    );
  }
}

Clock.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Clock);
