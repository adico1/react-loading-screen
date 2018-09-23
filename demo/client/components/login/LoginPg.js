import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  selectEmpty: {
    marginTop: theme.spacing.unit * 2
  },
});

class LoginPg extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { classes } = this.props;

    return (
      <GridLayout>
      </GridLayout>              
    );
  }
}

LoginPg.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(LoginPg);
