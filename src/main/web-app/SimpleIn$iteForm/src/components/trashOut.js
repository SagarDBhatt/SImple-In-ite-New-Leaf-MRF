import React, { Component } from "react";

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

import ConfirmTrashout from "../ConfirmationClasses/ConfirmTrashout";
import "@reach/dialog/styles.css";
import "../StyleSheet/ParentStylesheet.css";

class trashOut extends Component {
  // state = {  }
  emptyItem = {
    TrashoutWeightTicket: "",
    TrashoutWeightLb: "",
    Landfill_Owner_Name: "",
    date: new Date(),
  };

  constructor(props) {
    super(props);

    this.state = {
      landfillOwners: [],
      inMaterials: this.emptyItem,
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

      // const response = await fetch(ROOT_URL+'/SimpleIn$ite/getLandfillOwner',{
      //     method: 'GET',
      //     headers: myHeaders,
      // });

      // // const response = await fetch('/SimpleIn$ite/supplier');
      // const body = await response.json();
      // this.setState( {landfillOwners : body, isLoading : false} )

      fetch(GLOBAL_URL + "SimpleIn$ite/getLandfillOwner", {
        method: "GET",
        headers: myHeaders,
      })
        .then((response) => response.json())
        .then((result) => {
          //console.log("Result value = ", result);
          this.setState({ landfillOwners: result, isLoading: false });
        })
        .catch((e) => {
          alert("Token Expired. Pleae re-login");
          console.log("Error is", e);
          AuthService.logout();
          this.props.history.push("/login");
          window.location.reload();
        });
    }
  }

  //handleSubmit method implementation
  async handleSubmit(event) {
    const inMaterials = this.state.inMaterials;
    const ROOT_URL = "http://simpleinsite.us-east-2.elasticbeanstalk.com";
    const GLOBAL_URL = process.env.REACT_APP_GLOBAL_URL;

    await fetch(GLOBAL_URL + "SimpleIn$ite/trashout/entry", {
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
        // alert("Alertt");
        // AuthService.logout();
        // this.props.history.push("/login");
        // window.location.reload();
      });

    // console.print(this.state);
    // event.preventDefault()
    // this.props.history.push("/")
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
  }; //End

  render() {
    const title = <h3> TrashOut Reporting </h3>;
    const { landfillOwners, isLoading } = this.state;

    let landfillOwnerList = landfillOwners.map((landfillOwner) => (
      <option
        value={landfillOwner.landfill_owner_name}
        key={landfillOwner.landfill_owner_id}
      >
        {landfillOwner.landfill_owner_name}
      </option>
    ));

    if (isLoading) return <div>Loading...</div>;

    return (
      <div className="trash-background">
        <Alert color="info" isOpen={this.state.visible}>
          Congratulations!!! The data entered successfully!
        </Alert>
        <Container>
          <u>{title}</u>
          <br></br>

          <ConfirmTrashout
            title="Please verify the data entry"
            LandfillOwnerDesc=" Customer Name = "
            LandfillOwner={this.state.inMaterials.Landfill_Owner_Name}
            TrashoutWeightTicketDesc=" Trash Weigh Ticket = "
            TrashoutWeightTicket={this.state.inMaterials.TrashoutWeightTicket}
            trashDateDesc=" Trash Date = "
            trashDate={moment(this.state.inMaterials.date).format("MM-DD-yyyy")}
            TrashoutWeightLbDesc="Trashout Weight = "
            TrashoutWeightLb={this.state.inMaterials.TrashoutWeightLb}
          >
            {(ConfirmTrashout) => (
              <Form onSubmit={ConfirmTrashout(this.handleSubmit)}>
                <FormGroup>
                  <label for="Landfill_Owner_Name">Landfill*</label>{" "}
                  <select
                    name="Landfill_Owner_Name"
                    onChange={this.handleChange}
                    required
                  >
                    <option></option>
                    {landfillOwnerList}
                  </select>
                </FormGroup>

                <FormGroup>
                  <label for="TrashoutWeightTicket"> 
                    <abbr title="A ticket to provide details of Residue material dumped into the Landfill">Trash Weight Ticket* </abbr>
                  </label>{" "}
                  <input
                    placeholder="Ex: 98023"
                    type="number"
                    pattern="[0-9]*"
                    inputmode="numeric"
                    min="1.0"
                    required
                    name="TrashoutWeightTicket"
                    id="TrashoutWeightTicket"
                    onChange={this.handleChange}
                  ></input>
                </FormGroup>

                <FormGroup>
                  <label for="date"> Date* </label>{" "}
                  <DatePicker
                    maxDate={new Date()}
                    minDate={addDays(new Date(), -14)}
                    selected={this.state.inMaterials.date}
                    required
                    onChange={this.handleDateChange}
                  />
                </FormGroup>

                <FormGroup>
                  <label for="TrashoutWeightLb"> 
                    <abbr title="Weight of Residue material in lbs dumped into the Landfill">Trash out Weight (lbs)* </abbr>
                  </label>{" "}
                  <input
                    type="number"
                    pattern="[0-9]*"
                    inputmode="numeric"
                    required
                    placeholder="Ex : 3,456"
                    min="100.00"
                    max="10000.00"
                    step="1"
                    name="TrashoutWeightLb"
                    id="TrashoutWeightLb"
                    onChange={this.handleChange}
                  ></input>
                </FormGroup>

                <FormGroup>
                  <Button color="primary" type="submit">
                    {" "}
                    Save{" "}
                  </Button>{" "}
                  <Button color="secondary" tag={Link} to="/">
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
          </ConfirmTrashout>
        </Container>
      </div>
    );
  }
}

export default trashOut;
