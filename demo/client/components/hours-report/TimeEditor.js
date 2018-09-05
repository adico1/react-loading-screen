const React = require('react');
//import PropTypes from 'prop-types';
import TextField from "@material-ui/core/TextField";
const { editors: { EditorBase } } = require('react-data-grid');
import ReactDOM from 'react-dom';

class TimeEditor extends EditorBase {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value
    };
  }

  getValue() {
    let updated = {};
    updated[this.props.column.key] = this.state.value;
    return updated;
  }

  getInputNode() {
    return ReactDOM.findDOMNode(this);
  }

  onClick() {
    this.getInputNode().focus();
  }

  onDoubleClick() {
    this.getInputNode().focus();
  }

  handleChange(ev) {
    this.setState({value:ev.target.value});
  }

  render() {
    const hanleChange = this.handleChange.bind(this);

    return (
      <div style={this.getStyle()} onBlur={this.props.onBlur}>
          <TextField
              id="time"
              type="time"
              width="80"
              defaultValue={this.state.value}
              InputLabelProps={{
                shrink: true
              }}
              onChange={hanleChange}
              inputProps={{
                step: 300 // 5 min
              }}
            />
      </div>);
  }
}

// TimeEditor.propTypes = {
//     id: PropTypes.string,
//     title: PropTypes.string,
//     value: PropTypes.string,
//     text: PropTypes.string
// };

module.exports = TimeEditor;