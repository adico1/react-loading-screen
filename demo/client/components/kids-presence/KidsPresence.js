import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import GridLayout from '../layout/GridLayout'

import KidPresence from "./KidPresence";

import KidsPresenceService from '../../services/kids-presence-report-service';

import { 
  NOT_KID, ENTRY_SUCCESS, DOUBLE_ENTRY, DOUBLE_EXIT, 
  KINDERGARTEN_ID_REQUIRED, KID_ID_REQUIRED } from '../../../server/shared/kids-report-consts';

const styles = theme => ({
  gridLayout: {
    padding: 0,
    margin:0,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    textAlign: "right",
    flex: "0 50%",
    width: "auto",
    fontWeight: "bold",
    fontSize: "18px !important"
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
    width: 100,
    fontWeight: "bold"
  },
  inputs: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    display: "flex",
    justifyContent: "flex-start",
    margin: `${theme.spacing.unit}px 0`
  }
});

class KidsPresence extends React.Component {
  constructor() {
    super();
    //this.onClick = this.onClick.bind(this);
    this.state = {
      kindergartenId: '5b7735edf3796162842507c1',
      arr: [],
      activeId: null
    }

    // this.handleChange = this.handleChange.bind(this)
  }

  // onClick(index){
  //     this.setState({activeId: index});
  // }
  
  componentDidMount() {
    this.listKidsByKindergarten(this.state.kindergartenId);
  }

  listKidsByKindergarten(kindergartenId) {
    KidsPresenceService
      .listKidsPresenceByDate(kindergartenId)
      .then(kids => {
        const newNames = [];

        kids.forEach((item) => {
          console.log('item: ');
          console.dir(item);
  
          newNames.push({
            kidId: item._id,
            name: item.lname + ' ' + item.fname,
            in: item.in,  
            out: item.out 
          });
        });

        console.log('newNames:');
        console.dir(newNames);

        this.setState({ arr: newNames});
      })
      .catch(error => {
          console.log(error);
          return;
      });
  }

  // handleChange(value) {
  //   console.log('handleChange:');
  //   console.dir(value)

  //   value = value.trim();
  //   if(value === '') value = ' ';

  //   console.log('value', '{' + value + '}');
  //   console.log('this.state.keyboardValue', '{' + this.state.keyboardValue + '}');
  //   if( value === this.state.keyboardValue ) return;

  //   this.setState({ keyboardValue: value });
  //   console.log('this.state.direction:', this.state.direction);
  //   console.log('this.state.name:', this.state.name);

  //   if(value === ' ') return;

  //   if(this.state.direction === '' || this.state.name === '0' ) {
  //     this.togglePlay('missingInput');
  //     this.clearPassword();
  //     return;
  //   }

  //   if(this.state.direction === 'in') {
  //     this.signEntry(value);
  //   } else {
  //     this.signExit(value);
  //   }
  // }

  // handleRequestClose() {
  //   this.setState({ open: false });
  // }

  signEntry(kidid) {
    KidsPresenceService.signEntry(this.state.kindergartenId,kidid)
      .then(res => {
        console.log('res:', res);
        //this.togglePlay('entryRegistered');
        //this.clearForm();
      })
      .catch(err => {
        console.log('err:', err);
        this.signErrorHandler(err)
      });
  }

  signExit(kidid) {
    KidsPresenceService.signExit(this.state.kindergartenId,kidid)
      .then(() => {
        //this.togglePlay('exitRegistered');
        //this.clearForm();
      })
      .catch((err) => {
        console.log('err:', err)
        this.signErrorHandler(err)
      });
  }

  removeEntry(kidid) {
    KidsPresenceService.removeEntry(this.state.kindergartenId,kidid)
      .then(res => {
        console.log('res:', res);
        //this.togglePlay('entryRegistered');
        //this.clearForm();
      })
      .catch(err => {
        console.log('err:', err);
        this.signErrorHandler(err)
      });
  }

  removeExit(kidid) {
    KidsPresenceService.removeExit(this.state.kindergartenId,kidid)
      .then(() => {
        //this.togglePlay('exitRegistered');
        //this.clearForm();
      })
      .catch((err) => {
        console.log('err:', err)
        this.signErrorHandler(err)
      });
  }

  signErrorHandler(err) {
    switch(err.code) {
      case DOUBLE_ENTRY.code:
        //this.togglePlay('doubleEntry');
        break;
      case DOUBLE_EXIT.code:
        //this.togglePlay('doubleExit');
        break;
      case KINDERGARTEN_ID_REQUIRED.code:
      case KID_ID_REQUIRED.code: 
      case NOT_KID.code:
        //this.togglePlay('unexpectedError');
        break;
      default:
        //this.togglePlay('unexpectedError');
    }

    //this.clearPassword();
  }
  
  render() {
    const { classes } = this.props;
    const { direction } = this.state;
    const handleChange = (name, direction, isEntry, objState) => {
      console.log('name', name);
      console.log('direction');
      console.dir(direction);
      console.log('objState');
      console.dir(objState);
      console.log('isEntry', isEntry);

      if(direction === 'in' && isEntry ) {
        this.signEntry(objState.kidId)
      } else if(direction === 'out' && isEntry ) {
        this.signExit(objState.kidId)
      } else if(direction === 'in' && !isEntry ) {
        this.removeEntry(objState.kidId)
      } else if(direction === 'out' && !isEntry ) {
        this.removeExit(objState.kidId)
      }
    }

    const { onChangeKeyboard } = this;

    const event = new Date();

    return (
      <GridLayout className={classes.gridLayout}>
        <div class="header">
          <h1>נוכחות ילדים {event.toLocaleDateString()}</h1>
        </div>

        <div class="row">
          <div class="col-3 menu">
            שם, כניסה , יציאה
          </div>
          <div class="col-3 menu">
            שם, כניסה , יציאה
          </div>
          <div class="col-3 menu">
            שם, כניסה , יציאה
          </div>
          <div class="col-3 menu">
            שם, כניסה , יציאה
          </div>
          {this.state.arr.map((el, index) => 
            <div class="col-3 menu" key={index}>
              <KidPresence name={el.name} in={el.in} out={el.out} kidId={el.kidId} handleChange={handleChange.bind(this, el.kidId)}></KidPresence>
            </div>
          )}
        </div>
      </GridLayout>              
    );
  }
}

KidsPresence.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(KidsPresence);
