import React, { Component } from "react";
// import AppNav from './AppNav'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import '../src/app/App.css'
import { Button, Container, FormGroup, Form, label, Alert } from "reactstrap";
import { Link } from "react-router-dom";
import moment from "moment";
import { addDays } from "date-fns";

import ConfirmProduction from "../ConfirmationClasses/ConfirmProduction";
import AuthService from "../Services/AuthService";

import "@reach/dialog/styles.css";
import "../StyleSheet/ParentStylesheet.css";

// import {} from 'react-router-dom'

class Production extends Component {

  emptyItem = {
    date: new Date(),
    material_Type: "",
    total_Weight_Lb: "",
    system_Created_Date: new Date(),
  };

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      expneses: [],
      categories: [],
      date: new Date(),
      isDisabled: false,
      testValueGlass: "",
      visible: false,
      item: this.emptyItem,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.addInventoryCount = this.addInventoryCount.bind(this);
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

      fetch(GLOBAL_URL + "SimpleIn$ite/getMaterials", {
        method: "GET",
        headers: myHeaders,
      })
        .then((response) => response.json())
        .then((result) => {
          console.log("Result value = ", result);
          this.setState({ categories: result, isLoading: false });
        })
        .catch((e) => {
          alert("Get Materials API NOT loading");
          console.log("Error is", e);
          AuthService.logout();
          this.props.history.push("/login");
          window.location.reload();
        });
    }
  } //End of async componentDidMount

  /**
   * Method to validate and report the production entry. 
   * @param {Data from UI/input textbox } event 
   */
  async handleSubmit(event) {
    const item = this.state.item;
    const ROOT_URL = "http://simpleinsite.us-east-2.elasticbeanstalk.com";
    // const ROOT_URL_local = "http://localhost.com:3000"
    const GLOBAL_URL = process.env.REACT_APP_GLOBAL_URL;

    await fetch(GLOBAL_URL + "SimpleIn$ite/production/entry", {
      method: "POST",
      headers: {
        Accept: "applicatio/json",
        "Content-Type": "application/json",
      },
      // stringify() converts javascript into JSON to send the data outside
      body: JSON.stringify(item),
    })
      .then((response) => {
        if (response.status >= 400 && response.status < 600) {
          throw new Error("Handle submit API for PRODUCTION NOT working");
        }

        return response;
      })
      .then((response) => {
        if (response.status == 200) {
          this.onShowAlert();

          /**
           * Update the inventory count after successful
           * reporting of production entry.
           */
          this.addInventoryCount()
        }
      })
      .catch((Error) => {
        console.log("Error is", Error);
        alert("Handle submit API for PRODUCTION NOT working");
        AuthService.logout();
        // this.props.history.push('/login')
        window.location.reload();
      });
      
  }// END

  /**
   * API to add inventory count for each bale production. Update 
   * the inventory count by 1 for each bale production. 
   */
  async addInventoryCount(){
    const item = this.state.item;
    const ROOT_URL = "http://simpleinsite.us-east-2.elasticbeanstalk.com";
    const GLOBAL_URL = process.env.REACT_APP_GLOBAL_URL;

    await fetch(GLOBAL_URL + "SimpleIn$ite/addProductionInventoryCount", {
      method: "POST",
      headers: {
        Accept: "applicatio/json",
        "Content-Type": "application/json",
      },
      // stringify() converts javascript into JSON to send the data outside
      body: JSON.stringify(item),
    })
      .then((response) => {
        if (response.status >= 400 && response.status < 600) {
          throw new Error("Bad response from Server");
        }

        return response;
      })
      .then((response) => {
        if (response.status == 200) {
          //   alert("Congratualtions!!! The data entered successfully!");
          //   window.location.reload();
          this.onShowAlert();
        }
      })
      .catch((Error) => {
        console.log("Error is", Error);
        alert("Handle Add_Inventory API for PRODUCTION NOT working");
        AuthService.logout();
        // this.props.history.push('/login')
        window.location.reload();
      });
  }//END

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    let item = { ...this.state.item };
    item[name] = value;

    if (item[name] === "Glass") {
      //console.log("Conditional value for Glass")
      //this.setState({item});
      this.state.testValueGlass = 850;
      this.state.item.total_Weight_Lb = 850;
      this.state.item.material_Type = "Glass";
      this.state.isDisabled = true;
      //this.setState({item})
      this.setState({
        item: {
          ...this.state.item,
          total_Weight_Lb: "850",
          material_Type: "Glass",
        },
      });

      console.log(this.state);
    } else {
      this.state.isDisabled = false;
      this.setState({ item });
      console.log(this.state);
    }

    // console.log(this.state);
  }

  handleDateChange(date) {
    //"let" keyword is similar to "var" keyword and used to declare a variable.
    let item = { ...this.state.item };
    item.date = date;
    this.setState({ item });
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

  render() {
    const title = <h3>Bale Production Reporting</h3>;
    const { categories, isLoading } = this.state;

    let optionList = categories.map((category) => (
      <option value={category.material_id} key={category.material_id}>
        {category.material_Type}
      </option>
    ));

    if (isLoading)
      return (
        <div>
          {/* <AppNav/> */}
          Loading...
        </div>
      );

    return (
      <div className="container">
        <Alert color="info" isOpen={this.state.visible}>
          Congratulations!!! The data entered successfully!
        </Alert>
        <div className="production-background">
          <Container>
            <u>{title}</u>
            <br />

            <ConfirmProduction
              title="Please verify the data entry"
              materialTypeDesc="Material Type = "
              materialType={this.state.item.material_Type}
              productionDateDesc=" Production Date = "
              productionDate={moment(this.state.item.date).format("MM-DD-yyyy")}
              baleWeightDesc=" Bale Weight (in LBs) = "
              baleWeight={this.state.item.total_Weight_Lb}
            >
              {(confirmProduction) => (
                <Form onSubmit={confirmProduction(this.handleSubmit)}>
                  <FormGroup>
                    <label for="material_dim">Material Type*</label>{" "}
                    <select
                      name="material_Type"
                      onChange={this.handleChange}
                      required
                    >
                      <option></option>
                      {optionList}
                    </select>
                  </FormGroup>

                  <FormGroup>
                    <label for="productionDate">Production Date*</label>{" "}
                    <DatePicker
                      selected={this.state.item.date}
                      maxDate={new Date()}
                      minDate={addDays(new Date(), -14)}
                      required
                      onChange={this.handleDateChange}
                    />
                  </FormGroup>

                  <FormGroup>
                    <label for="BaleWeight">
                      <abbr title="Weight of produced bale in lbs. For Glass, the container weight will automatically populate">Bale Weight (lbs)* </abbr>
                    </label>{" "}
                    <input
                      placeholder="Ex: 1234"
                      required
                      type="number"
                      pattern="[0-9]*"
                      inputmode="numeric"
                      step="1"
                      min="200.00"
                      max="3200.00"
                      name="total_Weight_Lb"
                      id="BaleWeight"
                      value={this.state.total_Weight_Lb}
                      disabled={this.state.isDisabled ? "disabled" : ""}
                      onChange={this.handleChange}
                    ></input>
                  </FormGroup>

                  <FormGroup>
                    <Button color="primary" type="Submit">
                      Save
                    </Button>{" "}
                    <Button color="secondary" tag={Link} to="/production">
                      Cancel
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
            </ConfirmProduction>
          </Container>
        </div>
      </div>
    );
  }
}

export default Production;
