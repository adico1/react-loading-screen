import React from 'react'
import { Switch, Route } from 'react-router-dom'
import HoursReport from './hours-report/HoursReport';
import KidsPresence from './kids-presence/KidsPresence';
import HoursReportReport from './hours-report/HoursReportReport';

// The Main component renders one of the three provided
// Routes (provided that one matches). Both the /roster
// and /schedule routes will match any pathname that starts
// with /roster or /schedule. The / route will only match
// when the pathname is exactly the string "/"
const Main = () => (
  <main>
    <Switch>
      <Route exact path="/" component={HoursReport} />
      <Route exact path="/admin" component={HoursReportReport} />
      <Route path="/kids-presence" component={KidsPresence} />
    </Switch>
  </main>
)

export default Main
