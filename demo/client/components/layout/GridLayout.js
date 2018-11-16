import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import MainLayout from "./MainLayout";

const styles = theme => ({
  mainGrid: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
  },
  formContainer: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    display: "flex",
    flexDirection: "column",
    margin: `${theme.spacing.unit}px 0`,
    background: theme.palette.background.default
  }
});

class GridLayout extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <MainLayout>
        <Grid className={classes.mainGrid} container spacing={16}>
          <Grid item xs={12}>
            <div className={classes.formContainer}>
              {this.props.children}
            </div>
          </Grid>
        </Grid>
      </MainLayout>
    );
  }
}

GridLayout.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(GridLayout);
