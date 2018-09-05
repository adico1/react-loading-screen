function timestrToSec(timestr) {
  if( typeof timestr !== 'string' ) return 0;
  if( timestr.length === 0 ) return 0;

  var parts = timestr.split(":");

  if(parts.length < 2) return 0;

  return (parts[0] * 3600) +
         (parts[1] * 60);
}

function pad(num) {
  if(num < 10) {
    return "0" + num;
  } else {
    return "" + num;
  }
}

function formatTime(seconds) {
  return [pad(Math.floor(seconds/3600)),
          pad(Math.floor(seconds/60)%60),
          ].join(":");
}

class HoursReportMonthFactory {
  constructor(month,year) {
    this.standardHours = "08:36";

    this.month = month;
    this.year = year;

    this.currentDay = 1;
    this.currentDayStr = "01";
    
    const currentReportDay = new Date(`${month}/${this.currentDayStr}/${year}`);

    this.currentDayStr += `/${('' + this.month).padStart(2, '0')}`;

    this.currentDayOfWeek = currentReportDay.getDay();
    this.daysInCurrentMonth = this.daysInMonth(month, year);
  }

  daysInMonth (month, year) { // Use 1 for January, 2 for February, etc.
    return new Date(year, month, 0).getDate();
  }

  isNextDay() {
    if( this.currentDay < this.daysInCurrentMonth ) {
      return true;
    }

    return false;
  }

  incrementDay() {
    if( this.currentDay < this.daysInCurrentMonth ) {
      this.currentDay++;
      this.currentDayStr = `${('' + this.currentDay).padStart(2, '0')}/${('' + this.month).padStart(2, '0')}`;
      this.currentDayOfWeek = ( this.currentDayOfWeek + 1 ) % 7;
    }
  }

  createNextDayReportRow(reportType, entry, exit) {
    let nextRow = null;

    switch(this.currentDayOfWeek) {
      case 5:
      case 6:
        nextRow = new ReportRowWeekend(this.currentDay, this.currentDayStr, this.currentDayOfWeek);
        this.incrementDay();
        return nextRow;
    }

    switch(reportType){
      case 2: // vacation
        nextRow = new ReportRowVacation(this.currentDay, this.currentDayStr, this.currentDayOfWeek);
        this.incrementDay();
        return nextRow;
      case 3: // sick
        nextRow = new ReportRowSick(this.currentDay, this.currentDayStr, this.currentDayOfWeek);
        this.incrementDay();
        return nextRow;
    }

    const workOutsideTheOffice = reportType === 5;
    nextRow = new ReportRowStandard(this.currentDay, this.currentDayStr, this.currentDayOfWeek, 
                                 entry, exit, workOutsideTheOffice);
    this.incrementDay();
    return nextRow;
  }

}

class ReportRow {
  constructor(id, date, day) {
    this.id = id;
    this.date = date;
    this.day = this.toDayShortName(day);
  }

  toDayShortName(currentDayOfWeek) {
    switch (currentDayOfWeek) {
      case 0:
        return "א";
      case 1:
        return "ב";
      case 2:
        return "ג";
      case 3:
        return "ד";
      case 4:
        return "ה";
      case 5:
        return "ו";
      case 6:
        return "ש";
    }

    return currentDayOfWeek;
  }
}

class ReportRowWorkDay extends ReportRow {
  constructor(id, date, day, entry, exit) {
    super(id,date,day);
    this.workDay = 'רגיל 8:36';
    this.entry = entry;
    this.exit = exit;
    this.standardHours = '08:36';
  }
}

class ReportRowStandard extends ReportRowWorkDay {
  constructor(id, date, day, entry, exit, workOutsideTheOffice) {
    super(id,date,day, entry, exit);

    const presence = timestrToSec(exit) - timestrToSec(entry);
    const presenceStr = formatTime(presence);

    this.presence = presenceStr;
    this.workTime = presenceStr;
    
    const standardHoursSec = timestrToSec(this.standardHours);

    if(presence === standardHoursSec) {
      this.ordinaryHours = this.standardHours;
      console.log('equal');
    } else if(presence > standardHoursSec) {
      this.ordinaryHours = this.standardHours;
      this.extraHours = formatTime(presence - standardHoursSec);
      console.log('extra', this.extra);

    } else {
      this.ordinaryHours = presenceStr;
      this.missingHours = formatTime(standardHoursSec - presence);
      console.log('less', this.missing);

    }
    
    if(workOutsideTheOffice) {
      this.specialReport = 'מהבית';
      this.presence = '';
    }
  }
}

class ReportRowVacation extends ReportRowWorkDay {
  constructor(id, date, day) {
    super(id, date, day, '08:00', '16:36');
    this.vacation = '08:36';
    this.specialReport = 'חפש';
  }
}

class ReportRowSick extends ReportRowWorkDay {
  constructor(id, date, day) {
    super(id, date, day, '08:00', '16:36');
    this.sickDay = '08:36';
    this.specialReport = 'מחל';
  }
}

class ReportRowWeekend extends ReportRow {
  constructor(id, date, day) {
    super(id,date,day);

    if(day === 5) {
      this.workDay = "שישי תקן 0";
    } else { // day ===6
      this.workDay = "יום מנוחה";
    }
  }
}

class TotalRow {
  constructor() {
    this.presenceTotalCount = 0;
    this.presenceTotalSec = 0;
    this.ordinaryHoursTotalCount = 0;
    this.ordinaryHoursTotalSec = 0;
    this.standardHoursTotalCount = 0;
    this.standardHoursTotalSec = 0;
    this.workTimeTotalCount = 0;
    this.workTimeTotalSec = 0;
    this.missingTotalCount = 0;
    this.missingTotalSec = 0;
    this.extraTotalCount = 0;
    this.extraTotalSec = 0;
    this.sickDayTotalCount = 0;
    this.sickDayTotalSec = 0;
    this.vacationTotalCount = 0;
    this.vacationTotalSec = 0;
    this.missingDeducedExtra = 0;
    this.missingPartDays = 0;
    this.sickPartDays = 0;
    this.vacationPartDays = 0;
  }

  add(row) {
    this.ordinaryHoursTotalCount += ( !!row.ordinaryHours > 0 ) ? 1 : 0;
    this.workTimeTotalCount += ( !!row.workTime > 0 ) ? 1 : 0;
    this.standardHoursTotalCount += ( !!row.standardHours > 0 ) ? 1 : 0;
    this.missingTotalCount += ( !!row.missingHours > 0 ) ? 1 : 0;
    this.extraTotalCount += ( !!row.extraHours > 0 ) ? 1 : 0;
    this.sickDayTotalCount += ( !!row.sickDay > 0 ) ? 1 : 0;
    this.vacationTotalCount += ( !!row.vacation > 0 ) ? 1 : 0;
    
    this.presenceTotalSec += timestrToSec(row.presence);
    this.ordinaryHoursTotalSec += timestrToSec(row.ordinaryHours);
    this.workTimeTotalSec += timestrToSec(row.workTime);
    this.standardHoursTotalSec += timestrToSec(row.standardHours);
    this.missingTotalSec += timestrToSec(row.missingHours);
    this.extraTotalSec += timestrToSec(row.extraHours);
    this.sickDayTotalSec += timestrToSec(row.sickDay);
    this.vacationTotalSec += timestrToSec(row.vacation);

    //console.log(this.workTimeTotalSec, formatTime(this.workTimeTotalSec));
    
  }

  getTotalDaily() {
    return {
      workDay: 'מונים יומיים:',
      presence: formatTime(this.presenceTotalSec),
      ordinaryHours: formatTime(this.ordinaryHoursTotalSec),
      workTime: formatTime(this.workTimeTotalSec),
      standardHours: formatTime(this.standardHoursTotalSec),
      missingHours: formatTime(this.missingTotalSec),
      extraHours: formatTime(this.extraTotalSec),
      sickDay: formatTime(this.sickDayTotalSec),
      vacation: formatTime(this.vacationTotalSec),
    }
  }
  getTotalMonth() {
    const ret = {
      workDay: 'מונים חודשיים:',
      presence: formatTime(this.presenceTotalSec),
      ordinaryHours: formatTime(this.ordinaryHoursTotalSec),
      workTime: formatTime(this.workTimeTotalSec),
      standardHours: formatTime(this.standardHoursTotalSec),
      sickDay: formatTime(this.sickDayTotalSec),
      vacation: formatTime(this.vacationTotalSec),
    };

    this.totalExtraMinusMissing = this.extraTotalSec - this.missingTotalSec;
    if(this.totalExtraMinusMissing > 0) {
      ret.extraHours = formatTime(this.totalExtraMinusMissing)
    } else {
      ret.missingHours = formatTime(-1 * this.totalExtraMinusMissing)
    }

    return ret;
  }

  getPartDays() {
    return {
      workDay: 'חלקי ימים:',
      missingHours: formatTime(this.missingTotalSec),
      sickDay: formatTime(this.sickDayTotalSec),
      vacation: formatTime(this.vacationTotalSec),
    }
  }

  getTotalCount() {
    return {
      workDay: 'ספירת ימים:',
      ordinaryHours: this.ordinaryHoursTotalCount,
      workTime: this.workTimeTotalCount,
      standardHours: this.standardHoursTotalCount,
      missingHours: this.missingTotalCount,
      extraHours: this.extraTotalCount,
      sickDay: this.sickDayTotalCount,
      vacation: this.vacationTotalCount,
    };
  }
}

module.exports = {HoursReportMonthFactory, TotalRow, ReportRow, ReportRowWorkDay, ReportRowStandard, ReportRowVacation, ReportRowSick, ReportRowWeekend}