import React from 'react'
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Link } from 'react-router-dom'
import s from './style.css';

const styles = theme => ({
  layout: {
    margin: 0,
    textAlign: "right",
    position: "absolute",
    padding: "5px",
    top: 0,
    left: 0,
  },
});

class Header extends React.Component {
  constructor() {
    super();
    this.state = {}
  }
  
  // The Header creates links that can be used to navigate
  // between routes.
  render() {
    const { classes } = this.props;
    return  (
      <header className={classes.layout}>
        <nav>
          <ul>
            <li><Link to='/'>דיווח שעות</Link></li>
            <li><Link to='/kids-presence'>כניסת ילדים</Link></li>
          </ul>
        </nav>
      </header>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles, s)(Header);