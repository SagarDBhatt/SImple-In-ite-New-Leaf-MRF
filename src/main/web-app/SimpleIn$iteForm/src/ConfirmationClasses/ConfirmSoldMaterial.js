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
            <h6>{this.props.customerNameDesc}{this.props.customerName}</h6>
            <h6>{this.props.materialTypeDesc}{this.props.materialType}</h6>
            <h6>{this.props.weighTicketDesc}{this.props.weighTicket}</h6>
            <h6>{this.props.bolNumberDesc}{this.props.bolNumber}</h6>
            <h6>{this.props.shippedDateDesc}{this.props.shippedDate}</h6>
            <h6>{this.props.soldWeightDesc}{this.props.soldWeight}</h6>
            <h6>{this.props.soldBalesDesc}{this.props.soldBales}</h6>

            <button onClick={this.hide}>Cancel</button>
            <button onClick={this.confirm}>OK</button>
          </Dialog>
        )}
      </React.Fragment>
    )
  }
}
