import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  
});

class HoursReportCompanyHeader extends React.Component {
  
  render() {
    return (
      <div class="company_header">
        <div>2018/09/02</div><div>הודפס בתאריך</div><div>דו''ח נוכחות חודשי לעובד</div><div>052 - ג'ניו חדשנות בע"מ</div><div>חברה:</div>
        <div></div><div></div><div></div><div></div><div>923578405</div><div>תיק ניכויים:</div>
        <div>2018/08</div><div>חודש משכורת</div><div>תל אביב</div><div>ישוב:</div><div>הברזל</div><div>כתובת:</div>
      </div>
    );
  }
}

HoursReportCompanyHeader.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(HoursReportCompanyHeader);

