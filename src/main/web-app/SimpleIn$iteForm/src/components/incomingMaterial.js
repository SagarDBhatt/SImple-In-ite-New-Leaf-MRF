import React, { Component } from "react";
import { Container, FormGroup, Form, Button, Label, Alert } from "reactstrap";
// import AppNav from "../AppNav";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";
import moment from "moment";
import { addDays } from "date-fns";

import AuthService from "../Services/AuthService";

import "../StyleSheet/ParentStylesheet.css";

import ConfirmInbound from "../ConfirmationClasses/ConfirmInbound";

import OverwriteInbound from "../ConfirmationClasses/OverwriteInbound";
// import "@reach/dialog/styles.css"

class incomingMaterial extends Component {
  // state = {  }

  emptyItem = {
    IncomingWeightTicket: "",
    IncomingWeightLb: "",
    supplier_Name: "",
    inboundMaterialType: "",
    date: new Date(),
  };

  constructor(props) {
    super(props);

    this.state = {
      suppliers: [],
      inMaterials: this.emptyItem,
      visible: false,
      isError: false,
      isLoading: true,
      isOverwrite: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onShowAlert = this.onShowAlert.bind(this);
    this.onShowError = this.onShowError.bind(this);
    this.handleOverwrite = this.handleOverwrite.bind(this);
    this.handleOverwriteConfirmationBox = this.handleOverwriteConfirmationBox.bind(this);
  }

  async componentDidMount() {
    //console.log("Within /supplier API")

    const user = JSON.parse(localStorage.getItem("user"));
    const ROOT_URL = "http://simpleinsite.us-east-2.elasticbeanstalk.com";
    const GLOBAL_URL = process.env.REACT_APP_GLOBAL_URL;
    const test = "http://simpleinsite-for-teton-county.us-east-2.elasticbeanstalk.com/SimpleIn$ite/supplier";

    if (!user) {
      this.props.history.push("/login");
    } else {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + user.accessToken);

      console.log("Global URL = " + GLOBAL_URL)

      // fetch(GLOBAL_URL+"SimpleIn$ite/supplier", {
      //   method: "GET",
      //   headers: myHeaders,
      // })
      fetch(test, {
        method: "GET",
        headers: myHeaders,
      })
        .then((response) => response.json())
        .then((result) => {
          //   console.log("Result value = ", result);
          this.setState({ suppliers: result, isLoading: false });
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
  

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    let inMaterials = { ...this.state.inMaterials };
    inMaterials[name] = value;

    this.setState({ inMaterials });
    console.log(this.state);
  }

  handleDateChange(date) {
    let inMaterials = { ...this.state.inMaterials };
    inMaterials.date = date;
    this.setState({ inMaterials });
  }

  async handleSubmit(event) {
    const inMaterials = this.state.inMaterials;
    const ROOT_URL = "http://simpleinsite.us-east-2.elasticbeanstalk.com";
    const GLOBAL_URL = process.env.REACT_APP_GLOBAL_URL;
    const test = "http://simpleinsite-for-teton-county.us-east-2.elasticbeanstalk.com/SimpleIn$ite/SingleStream/entry";

    //await fetch(GLOBAL_URL + "SimpleIn$ite/SingleStream/entry", {
    await fetch(test, {  
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inMaterials),
    })
      .then((response) => {
        if (response.status >= 400 && response.status < 600) {
          //alert("Bad response from server");
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
       //this.onShowError();
        this.handleOverwriteConfirmationBox();

        //alert("Alert");
        //AuthService.logout();
        //this.props.history.push("/login");
        //window.location.reload();
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

  //Function to set state.visible = false after 2 seconds. This function will show the alert error message that 
  //Weight Ticket is already entered.
  onShowError = () => {
    // console.log("Inside Alert box");
    this.setState({ isError: true }, () => {
      window.setTimeout(() => {
        this.setState({ isError: false });
        window.location.reload(1);
      }, 4000);
    });
  };

  /**
   * Call REST endpoint to update/overwrite transaction with the latest value. 
   */
  async handleOverwrite(event){

    const inMaterials = this.state.inMaterials;
    //const ROOT_URL = "http://simpleinsite.us-east-2.elasticbeanstalk.com";
    //const ROOT_URL = "http://localhost:5000";
    const GLOBAL_URL = process.env.REACT_APP_GLOBAL_URL;

    await fetch(GLOBAL_URL + "SimpleIn$ite/update/inbound", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inMaterials),
    })
      .then((response) => {
        if (response.status >= 400 && response.status < 600) {
          //alert("Bad response from server");
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
      });

  }

  /**
   * Toggle Overwrite confirmation box
   */
  handleOverwriteConfirmationBox = () => {
    if(!this.state.isOverwrite){
      console.log(" IF block isOverwrite value is = " + this.state.isOverwrite)
      document.querySelector(".confirm-bg-overwrite").style.display = "flex"
      document.querySelector(".container-overwrite").style.display = "flex"
      this.setState({isOverwrite: true})
    }

    else{
      console.log("Else Block isOverwrite value is = " + this.state.isOverwrite);
      document.querySelector(".confirm-bg-overwrite").style.display = "none"
      document.querySelector(".container-overwrite").style.display = "none"
      this.setState({isOverwrite:false})
    }

  }

  handleReset = (event) => alert("Resetted");

  render() {
    const title = <h4> Inbound Material Reporting </h4>;
    const { suppliers, isLoading } = this.state;

    let supplierList = suppliers.map((supplier) => (
      <option value={supplier.supplier_name} key={supplier.supplier_id}>
        {supplier.supplier_Name}
      </option>
    ));

    if (isLoading) return <div>Loading...</div>;

    return (
      <div className="container">

        {/* Customized Alert message to acknowledge the successful entry show in a pop up window. This Alert will automatically disappeard in 2 secs. */}
        <Alert color="info" isOpen={this.state.visible}>
          Congratulations!!! The data entered successfully!
        </Alert>

        {/* Customized error message to show the alert message that weigh ticket is already reported.  */}
        <Alert color="primary" isOpen={this.state.isError}>
          ALERT!! The weight ticket is already entered!!
        </Alert>


        {/* Below DIV tag will invoke in case of duplicate entry. User will have to acknowledge to overwrite the ticket or NOT  */}

        <div className="container-overwrite">
          <div className="confirmation-text">
            Ticket already entered. Do you really want to overwrite?
          </div>
          <div className="button-container">
            <button 
              className="cancel-button" 
              onClick={this.handleOverwriteConfirmationBox}>
                Cancel
            </button>
            <button 
              className="confirmation-button"
              onClick={this.handleOverwrite}>
                Overwrite
              </button>
          </div>
        </div>

        <div 
          className="confirm-bg-overwrite" 
          onClick={this.handleOverwriteConfirmationBox}>
        </div>

        <div className="incoming-background">
          <Container>
            <u>{title}</u>
            <br />

            <ConfirmInbound
              title="Please verify the data entry"
              //description="test"
              haulerNameDesc="Hauler Name = "
              haulerName={this.state.inMaterials.supplier_Name}
              inboundMaterialTypeDesc="Inbound Material Type = "
              inboundMaterialType={this.state.inMaterials.inboundMaterialType}
              inboundWeighTicketDesc="Weight Ticket = "
              inboundWeighTicket={this.state.inMaterials.IncomingWeightTicket}
              inboundDateDesc="Date = "
              inboundDate={moment(this.state.inMaterials.date).format(
                "MM-DD-yyyy"
              )}
              inboundWeighLBDesc="Inbound weight = "
              inboundWeighLB={this.state.inMaterials.IncomingWeightLb}
            >
              {(confirm) => (
                <Form onSubmit={confirm(this.handleSubmit)}>
                  <FormGroup>
                    <label for="supplier_dim"> <abbr title="Truck hauler that drops off the single stream"> Hauler* </abbr> </label>{" "}
                    <select
                      name="supplier_Name"
                      id="supplier_Name"
                      onChange={this.handleChange}
                      required
                    >
                      <option></option>
                      {supplierList}
                    </select>
                  </FormGroup>

                  <FormGroup>
                    <label for="inboundMaterialType">
                      <abbr title="Inbound material dropped at the tip floor">Inbound Material Type* </abbr>
                    </label>{" "}
                    <select
                      name="inboundMaterialType"
                      onChange={this.handleChange}
                      required
                    >
                      <option></option>
                      <option>Single Stream</option>
                      <option>302C - OCC</option>
                    </select>
                  </FormGroup>

                  <FormGroup>
                    <label for="IncomingWeightTicket">
                      <abbr title="Ticket to record the hauler truck detaiks, date, Net weight of the single steam ect. ">Weight Ticket*</abbr>
                    </label>{" "}
                    <input
                      placeholder="Ex: 98023"
                      required
                      type="number"
                      pattern="[0-9]*"
                      step="1"
                      required
                      min="1.00"
                      inputmode="numeric"
                      name="IncomingWeightTicket"
                      id="IncomingWeightTicket"
                      onChange={this.handleChange}
                    ></input>
                  </FormGroup>

                  <FormGroup>
                    <label for="IncomingDate"> Date of Weight Ticket* </label>{" "}
                    <DatePicker
                      selected={this.state.inMaterials.date}
                      maxDate={new Date()}
                      minDate={addDays(new Date(), -14)}
                      onChange={this.handleDateChange}
                    />
                  </FormGroup>

                  <FormGroup>
                    <label for="IncomingWeightLb">
                      Net Inbound Weight (lbs)*{" "}
                    </label>{" "}
                    <input
                      type="number"
                      pattern="[0-9]*"
                      inputmode="numeric"
                      step="1"
                      placeholder="Ex: 3,456"
                      required
                      min="1.00"
                      max="42000.00"
                      name="IncomingWeightLb"
                      id="IncomingWeightLb"
                      onChange={this.handleChange}
                    ></input>
                  </FormGroup>

                  <FormGroup>
                    <Button
                      color="primary"
                      type="submit"
                      //   onClick={this.onShowAlert}
                    >
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
            </ConfirmInbound>
          </Container>
        </div>
      </div>
    );
  }
}

export default incomingMaterial;
