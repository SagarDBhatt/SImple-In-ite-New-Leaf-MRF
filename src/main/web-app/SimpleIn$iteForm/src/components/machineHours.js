import React, { Component } from "react";
import AppNav from "../AppNav";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import '../src/app/App.css'
import { Button, Container, FormGroup, Form, label, Alert } from "reactstrap";
import { Link } from "react-router-dom";
import Moment from "react";
import { format } from "date-fns";
import { addDays } from "date-fns";

import moment from "moment";
import AuthService from "../Services/AuthService";
import ConfirmMachineHours from "../ConfirmationClasses/ConfirmMachineHours";
import "@reach/dialog/styles.css";

import "../StyleSheet/ParentStylesheet.css";

class machinehours extends Component {
  // state = {  }
  emptyItem = {
    clockhours: "",
    comments: "",
    date: "",
  };

  constructor(props) {
    super(props);

    this.state = {
      inMaterials: this.emptyItem,
      visible: false,
      isLoading: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onShowAlert = this.onShowAlert.bind(this);
  }

  //handleSubmit method implementation
  async handleSubmit(event) {
    const inMaterials = this.state.inMaterials;
    const ROOT_URL = "http://simpleinsite.us-east-2.elasticbeanstalk.com";
    const GLOBAL_URL = process.env.REACT_APP_GLOBAL_URL;

    await fetch(GLOBAL_URL + "SimpleIn$ite/machinehours/entry", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inMaterials),
    })
      .then((response) => {
        if (response.status >= 400 && response.status < 600) {
          alert("Bad response from server");
          throw new Error("Bad response from server");
        }
      })
      .then((newresponse) => {
        // alert("Congratualtions!!! The data entered successfully!");
        // window.location.reload();
        this.onShowAlert();
      })
      .catch((err) => {
        console.log("Error is", err);
        // AuthService.logout();
        // this.props.history.push("/login");
        // window.location.reload();
      });

    // console.print(this.state);
    // event.preventDefault();
    // this.props.history.push("/");
    // alert("Congratualtions!!! The data entered successfully!")
    // window.location.reload();
  }

  //END

  //handleChange method implementation
  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    let inMaterials = { ...this.state.inMaterials };
    inMaterials[name] = value;

    this.setState({ inMaterials });
    console.log(this.state);
  }

  //END

  //handleDateChange method implementation
  handleDateChange(date) {
    let inMaterials = { ...this.state.inMaterials };
    inMaterials.date = date;
    this.setState({ inMaterials });
  }
  //END

  // Function to set state.visible = false after 2 seconds. This will automatically
  // hide the alert message box in 2 seconds after the pop up.
  onShowAlert = () => {
    // console.log("Inside Alert box");
    this.setState({ visible: true }, () => {
      window.setTimeout(() => {
        this.setState({ visible: false });
        window.location.reload(1);
      }, 2000);
    });
  };

  render() {
    const title = <h3> Machine Hours Reporting </h3>;

    return (
      <div className="machine-background">
        <Alert color="info" isOpen={this.state.visible}>
          Congratualtions!!! The data entered successfully!
        </Alert>

        <Container>
          <u>{title}</u>
          <br />

          <ConfirmMachineHours
            title="Please verify the data entry"
            clockHoursDesc="Clock Hours ="
            clockHours={this.state.inMaterials.clockhours}
            machineDateDesc="Date ="
            machineDate={moment(this.state.inMaterials.date).format(
              "MM-DD-yyyy"
            )}
            commentsDesc="Comments = "
            comments={this.state.inMaterials.comments}
          >
            {(ConfirmMachineHours) => (
              <Form onSubmit={ConfirmMachineHours(this.handleSubmit)}>
                <FormGroup>
                  <label for="clockhours"> <abbr title="Clock Hours can be found at the PLC Box of Revolution Systems"> Clock Hours* </abbr> </label>{" "}
                  <input
                    placeholder="Ex: 5823.5"
                    step="0.1"
                    min="1.0"
                    type="number"
                    pattern="[0-9]*"
                    inputmode="numeric"
                    required
                    name="clockhours"
                    id="clockhours"
                    onChange={this.handleChange}
                  ></input>
                </FormGroup>

                <FormGroup>
                  <label for="date"> Date* </label>{" "}
                  <DatePicker
                    maxDate={new Date()}
                    minDate={addDays(new Date(), -14)}
                    required
                    selected={this.state.inMaterials.date}
                    onChange={this.handleDateChange}
                  />
                </FormGroup>

                <FormGroup>
                  <label for="comments"> <abbr title="Any activity/event for reference "> Maintenance Comments: </abbr> </label>{" "}
                </FormGroup>

                <FormGroup>
                  <textarea
                    rows={4}
                    cols={42}
                    maxLength="128"
                    pattern="[A-Za-z]*"
                    placeholder="Ex: Conveyor belt broke"
                    //required
                    name="comments"
                    id="comments"
                    onChange={this.handleChange}
                  ></textarea>
                </FormGroup>

                <FormGroup>
                  <Button color="primary" type="submit">
                    {" "}
                    Save{" "}
                  </Button>{" "}
                  <Button color="secondary" tag={Link} to="/machinehours">
                    {" "}
                    Cancel{" "}
                  </Button>
                </FormGroup>

                <FormGroup>
                  <label for="required">* = required</label>{" "}
                </FormGroup>

                <FormGroup>
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                </FormGroup>
              </Form>
            )}
          </ConfirmMachineHours>
        </Container>
      </div>
    );
  }
}

export default machinehours;
