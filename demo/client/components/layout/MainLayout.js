import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { create } from "jss";
import rtl from "jss-rtl";
import JssProvider from "react-jss/lib/JssProvider";
import { createGenerateClassName, jssPreset } from "@material-ui/core/styles";

const theme = createMuiTheme({
  direction: "rtl", // Both here and <body dir="rtl">
  typography: {
    body1: {
      letterSpacing: "0.4em"
    },
    caption: {
      letterSpacing: "0.4em"
    }
  },
  overrides: {
    MuiFormLabel: {
      root: {
        fontSize: "24px"
      }
    },
    MuiToggleButton: {
      root: {
        fontSize: "24px",
        border: "1px solid #000"
      }
    }
  }
});

// Configure JSS
const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

// Custom Material-UI class name generator.
const generateClassName = createGenerateClassName();

const styles = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap"
  },
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
});

class MainLayout extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <JssProvider jss={jss} generateClassName={generateClassName}>
        <MuiThemeProvider theme={theme}>
          <div dir="rtl">
            <form className={classes.root} autoComplete="off">
              {this.props.children}
            </form>
          </div>
        </MuiThemeProvider>
      </JssProvider>
    );
  }
}

MainLayout.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(MainLayout);
