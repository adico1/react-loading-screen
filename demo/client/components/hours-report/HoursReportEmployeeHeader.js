import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  
});

class HoursReportEmployeeHeader extends React.Component {
  
  render() {
    return (
      <div class="employee_header">
        <div>גלובלים</div><div>שם הסכם העברה לשכר:</div><div>61</div><div>מספר תג:</div><div>0029</div><div>מספר עובד:</div>
        <div>משרה מלאה</div><div>שם הסכם עבודה:</div><div>לוח מוע</div><div>לוח שנה:</div><div>כהן עובדיה</div><div>שם העובד:</div>
        <div>1</div><div>יום תשלום:</div><div>31/08/2018 תאריך עד 01/08/2018 מתאריך</div><div>תקופת החישוב:</div><div>פיתוח - 002</div><div>מחלקה:</div>
      </div>
    );
  }
}

HoursReportEmployeeHeader.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(HoursReportEmployeeHeader);

