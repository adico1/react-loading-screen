import React from 'react'
import ReactDOM from 'react-dom'
import App from "./components/App";
import "./index.css";
import LoadingScreen from '../../src'
import { BrowserRouter } from 'react-router-dom';

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
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("welcome")
 );