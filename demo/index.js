import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import LoadingScreen from '../src'
import HoursReport from './HoursReport';

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

class Hello extends React.Component {
  render() {
    return <div>
      <div style={{ textAlign: 'center' }}>
      <div>Hello {this.props.toWhat}</div>
      <h1>ברוכים הבאים למערכת ניהול גנים</h1>
      <h2>אנא בחרו בפעולה הרצויה</h2>
      <button id="hoursReport" style={{height:'100px', width:'100px'}}>דיווח שעות</button>
    </div></div>;
  }
}

// ReactDOM.render(
//   <Hello toWhat="World" />,
//   document.getElementById('welcome')
// );

// ReactDOM.render(
//   <BrowserRouter>
//     <App />
//   </BrowserRouter>,
//   document.getElementById("welcome")
//  );

 ReactDOM.render(
    <HoursReport />,
  document.getElementById("welcome")
 );