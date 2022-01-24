import * as React from "react"
import { Dialog, DialogOverlay, DialogContent } from "@reach/dialog";
import "@reach/dialog/styles.css";

export default class ConfirmStatusChange extends React.Component {
  state = {
    open: false,
    callback: null
  }

  show = callback => event => {
    event.preventDefault()

    event = {
      ...event,
      target: { ...event.target, value: event.target.value }
    }

    this.setState({
      open: true,
      callback: () => callback(event)
    })
  }

  hide = () => this.setState({ open: false, callback: null })

  confirm = () => {
    this.state.callback()
    this.hide()
  }

  render() {
    return (
      <React.Fragment>
        {this.props.children(this.show)}

        {this.state.open && (
          <Dialog>
            <h4>{this.props.title}</h4>
            <br/>
            <h6>{this.props.empNameDesc}{this.props.empName}</h6>
            <h6>{this.props.empDateDesc}{this.props.empDate}</h6>
            <h6>{this.props.hoursWorkedDesc}{this.props.hoursWorked}</h6>
            <h6>{this.props.breakHoursDesc}{this.props.breakHours}</h6>

            <button onClick={this.hide}>Cancel</button>
            <button onClick={this.confirm}>OK</button>
          </Dialog>
        )}
      </React.Fragment>
    )
  }
}
