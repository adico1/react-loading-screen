import * as React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Checkbox from '@material-ui/core/Checkbox';

const styles = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap"
  },
  checkbox: {
    height: "auto",
    float: "left"
  }
});

const toTime = testTime => {
  const [hours, minutes] = testTime.split(':');

  console.log('entry.time', entry.time);

  console.log('hours', hours, 'minutes', minutes);
  
  return minutes * 60 + hours * 3600;
};

class KidPresence extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        name: props.name,
        in: props.in || false,
        out: props.out || false,
        kidId: props.kidId
    }

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = name => event => {

    console.log('this.state.out',this.state.out);
    console.log('this.state.in',this.state.in);
    console.log('name',name);

    if(name === 'out') {
      if(!this.state.in) {
        console.log('aborting 0');
        return;
      }
    }

    if(name === 'in') {
      if(this.state.out) {
        console.log('aborting 1');
        return;
      }
    }
    
    const testNow = new Date();
    let testTime = testNow.getHours() * 3600 + testNow.getMinutes() * 60;
    const quarterOfHour = 15 * 60;

    console.log('testTime',testTime);
    console.log('testTime -  quarterOfHour',testTime -  quarterOfHour);

    if(name === 'in' && this.state.in ) {
      if(this.state.in < testTime -  quarterOfHour) {
        console.log('aborting 2');
        return;
      } else {
        testTime = false;
      }
    }
    if(name === 'out' && this.state.out ) {
      if(this.state.out < testTime -  quarterOfHour) {
        console.log('aborting 3');
        return;
      } else {
        testTime = false;
      }
    }

    this.setState({ [name]: testTime });
    this.props.handleChange(name, testTime, this.state);
  };

  render() {
    const { classes } = this.props;
    
    const { state } = this;

    return (
      <div key={'kidid_' + this.state.kidId}>
          {this.state.name}
          <Checkbox
            key={'cbin' + this.state.kidId}
            className={classes.checkbox}
            checked={state.in}
            onChange={this.handleChange('in').bind(this)}
            value="in"
          />
          <Checkbox
            key={'cbout' + this.state.kidId}
            className={classes.checkbox}
            checked={state.out}
            onChange={this.handleChange('out').bind(this)}
            value="out"
            color="primary"
          />
      </div>
    );
  }
}
KidPresence.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(KidPresence);
