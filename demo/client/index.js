import React from 'react'
import ReactDOM from 'react-dom'
import App from "./components/App";
import "./index.css";
import LoadingScreen from '../../src'
//import HoursReport from './components/hours-report/HoursReport';
import KidsPresence from './components/kids-presence/KidsPresence';
import CssBaseline from '@material-ui/core/CssBaseline';

import { BrowserRouter, Route, IndexRoute, Switch } from 'react-router-dom';

import AdminLayout from './components/layout/AdminLayout';
import MainLayout from './components/layout/MainLayout';
import LoginPg from './components/login/LoginPg';
import HoursReportReport from './components/hours-report/HoursReportReport';

class Demo extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      loading: true
    }
  }

  componentDidMount () {
    // fake promise
    setTimeout(() =>
      this.setState({ loading: false })
    , 1500)
  }

  render () {
    const { loading } = this.state

    return (
      <LoadingScreen
        loading={loading}
        bgColor='#f1f1f1'
        spinnerColor='#9ee5f8'
        textColor='#676767'
        logoSrc='https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/250px-React-icon.svg.png'
        text='מערכת ניהול גנים - יוצרה ע&quot;י דיויזיית הפיתוח של רזטק טכנולוגיות'
      >
        <div id="welcome"></div>
      </LoadingScreen>
    )
  }
}

ReactDOM.render(<Demo />, document.getElementById('root'))

ReactDOM.render(
  <div>
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={KidsPresence} />
        <Route exact path="/admin" component={HoursReportReport} />
      </Switch>
    </BrowserRouter>
  </div>,
  document.getElementById("welcome")
 );