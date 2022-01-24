import React, { Component } from "react";
import { Container, Form, FormGroup, Button, Alert } from "reactstrap";

import DatePicker from "react-datepicker";
import { addDays } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";

import moment from "moment";
import Confirm from "../ConfirmationClasses/Confirm";
import "@reach/dialog/styles.css";

import AuthService from "../Services/AuthService";

class employeeTimesheet extends Component {
  // state = {  }

  emptyItem = {
    employeeName: "",
    date: new Date(),
    Total_Worked_Hours: "",
    Break_Hours: "",
  };

  constructor(props) {
    super(props);

    this.state = {
      employees: [],
      empTimesheet: this.emptyItem,
      visible: false,
      isLoading: true,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onShowAlert = this.onShowAlert.bind(this);
  }

  async componentDidMount() {
    const user = JSON.parse(localStorage.getItem("user"));
    const ROOT_URL = "http://simpleinsite.us-east-2.elasticbeanstalk.com";
    const GLOBAL_URL = process.env.REACT_APP_GLOBAL_URL;

    if (!user) {
      this.props.history.push("/login");
    } else {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + user.accessToken);

      const respEmployees = await fetch(GLOBAL_URL + "SimpleIn$ite/getEmployees",
        {
          method: "GET",
          headers: myHeaders,
        }
      );

      //const respEmployees = await fetch("/SimpleIn$ite/getEmployees")
      const bodyEmployees = await respEmployees.json();

      this.setState({ employees: bodyEmployees, isLoading: false });
    }
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    let empTimesheet = { ...this.state.empTimesheet };
    empTimesheet[name] = value;

    this.setState({ empTimesheet });
    console.log(this.state);
  }

  handleDateChange(date) {
    let empTimesheet = { ...this.state.empTimesheet };
    empTimesheet.date = date;

    this.setState({ empTimesheet });
  }

  // - EndPoint -- /employeeTimesheet/entry

  async handleSubmit(event) {
    const empTimesheet = this.state.empTimesheet;
    const ROOT_URL = "http://simpleinsite.us-east-2.elasticbeanstalk.com";
    const GLOBAL_URL = process.env.REACT_APP_GLOBAL_URL;

    //const data = new FormData(event.target);
    await fetch(GLOBAL_URL + "SimpleIn$ite/employeeTimesheet/entry", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(empTimesheet),
    })
      .then((response) => {
        if (response.status >= 400 && response.status < 600) {
          alert("Bad response from server");
          throw new Error("Bad response from server");
        }
      })
      .then((newresponse) => {
        //Below function shows the alert message with customized text and reload the
        // window after 2 seconds. SetTimeOut(func){ function, timeout in ms} is used for that purpose
        this.onShowAlert();
      })
      .catch((err) => {
        console.log("Error is", err);
        // alert("Alert");
        // AuthService.logout();
        // this.props.history.push("/login");
        // window.location.reload();
      });
  }

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

  //handleReset = event => alert("Resetted")

  render() {
    const title = <h4> Employee Timesheet </h4>;
    const { employees, isLoading } = this.state;

    let employeeList = employees.map((employee) => (
      <option key={employee.employee_id} value={employee.employee_Name}>
        {employee.employee_Name}
      </option>
    ));

    if (isLoading) {
      return (
        <div>
          {/* <AppNav /> */}
          Loading...
        </div>
      );
    }

    return (
      <div className="employeeTimesheet-background">
        <Alert color="info" isOpen={this.state.visible}>
          Congratulations!!! The data entered successfully!
        </Alert>
        <Container>
          <u>{title}</u>
          <br />

          <Confirm
            title="Please verify the data entry"
            empNameDesc="Employee Name ="
            empName={this.state.empTimesheet.employeeName}
            empDateDesc="Date = "
            //empDate = {(this.state.timesheetDate).toString()}
            empDate={moment(this.state.timesheetDate).format("MM-DD-yyyy")}
            hoursWorkedDesc=" Today's worked hours = "
            hoursWorked={this.state.empTimesheet.Total_Worked_Hours}
            breakHoursDesc="Break Hours = "
            breakHours={this.state.empTimesheet.Break_Hours}
          >
            {(confirm) => (
              <Form onSubmit={confirm(this.handleSubmit)}>
                <FormGroup>
                  <label for="employeeName">Employee*</label>{" "}
                  <select name="employeeName" onChange={this.handleChange}>
                    <option>Select Employee Name</option>
                    {employeeList}
                  </select>
                </FormGroup>

                <FormGroup>
                  <label for="timesheetDate"> Date* </label>{" "}
                  <DatePicker
                    maxDate={new Date()}
                    required
                    selected={this.state.empTimesheet.date}
                    name="timesheetDate"
                    minDate={addDays(new Date(), -14)}
                    onChange={this.handleDateChange}
                    dateFormat="MM/dd/yyyy"
                  />
                </FormGroup>

                <FormGroup>
                  <label for="Total_Worked_Hours">
                    <abbr title="Number of actual work hours WITHOUT break. Total work-hours = Today's work hours + Break" >Today's work hours* </abbr>
                  </label>{" "}
                  <input
                    placeholder="E.g. : 7.25"
                    step="0.25"
                    type="number"
                    pattern="[0-9]*"
                    inputmode="numeric"
                    min="0"
                    max="20"
                    required
                    name="Total_Worked_Hours"
                    id="Total_Worked_Hours"
                    onChange={this.handleChange}
                  ></input>
                </FormGroup>

                <FormGroup>
                  <label for="Break_Hours">
                    <abbr title="Number of break hours for the day. Total work-hours = Today's work hours + Break"> Break hours* </abbr>
                  </label>{" "}
                  <input
                    placeholder="E.g. : 0.25"
                    step="0.25"
                    type="number"
                    pattern="[0-9]*"
                    inputmode="numeric"
                    min="0"
                    max="12"
                    required
                    name="Break_Hours"
                    id="Break_Hours"
                    onChange={this.handleChange}
                    dateFormat="MM-dd-yyyy"
                  ></input>
                </FormGroup>

                <FormGroup>
                  <Button color="primary" type="submit">
                    {" "}
                    Save{" "}
                  </Button>{" "}
                  <Button color="secondary" tag={Link} to="/employeeTimesheet">
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
          </Confirm>
        </Container>
      </div>
    );
  }
}

export default employeeTimesheet;
