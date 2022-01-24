import React, { Component } from "react";
import { Button, Container, Form, FormGroup, Alert } from "reactstrap";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import '../src/app/App.css'
import { Link } from "react-router-dom";
import { addDays } from "date-fns";
import moment from "moment";
import ConfirmOutbound from "../ConfirmationClasses/ConfirmSoldMaterial";
import AuthService from "../Services/AuthService";

import "@reach/dialog/styles.css";
import "../StyleSheet/ParentStylesheet.css";

class SoldMaterial extends Component {
  // state = {  }

  emptyItem = {
    customersName: "",
    materialType: "",
    soldWeightTicketNumber: "",
    BOLNumber: "",
    date: new Date(),
    SoldWeightInLbs: "",
    SoldBales: "",
  };

  constructor(props) {
    super(props);

    this.state = {
      customers: [],
      materialCategories: [],
      isLoading: true,
      date: new Date(),
      visible: false,
      item: this.emptyItem,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onShowAlert = this.onShowAlert.bind(this);
    this.deductInvetoryCountBySoldBalesNumber = this.deductInvetoryCountBySoldBalesNumber.bind(
      this
    );
  }

  //handleChange method implementation

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    let item = { ...this.state.item };
    item[name] = value; //code update the value selected in the form to items array.

    this.setState({ item }); //Setting the value of item with the updated value selected in the form
    console.log(this.state); //show value on the console (press F12 and check console for the updated value)
  }

  //END

  //handleDateChange method implementation
  handleDateChange(date) {
    let item = { ...this.state.item };
    item.date = date;
    this.setState({ item });
  }

  //END

  /**
   * Method to validate and report the outbound entry.
   * @param {Data from UI/input textbox} event
   */
  async handleSubmit(event) {
    const item = this.state.item;
    const localhost_URL = "http://localhost:5000/";
    const ROOT_URL = "http://simpleinsite.us-east-2.elasticbeanstalk.com";
    const GLOBAL_URL = process.env.REACT_APP_GLOBAL_URL;

    await fetch(GLOBAL_URL+ "SimpleIn$ite/soldMaterial/entry", {
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
          this.onShowAlert();
          this.deductInvetoryCountBySoldBalesNumber();
        }
      })
      .catch((Error) => {
        console.log("Error is", Error);
        //alert("Alertt");
        //AuthService.logout();
        // this.props.history.push('/login')
        //window.location.reload();
      });
  } //END

  /**
   * API to deduct the current inventory count by number of
   * sold bales.
   */
  async deductInvetoryCountBySoldBalesNumber() {
    const item = this.state.item;
    const ROOT_URL = "http://simpleinsite.us-east-2.elasticbeanstalk.com";
    const GLOBAL_URL = process.env.REACT_APP_GLOBAL_URL;

    await fetch(GLOBAL_URL+ "SimpleIn$ite/deductSoldBalesFromInventory", {
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
        alert("Alert");
        AuthService.logout();
        // this.props.history.push('/login')
        window.location.reload();
      });
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

      fetch(GLOBAL_URL + "SimpleIn$ite/getCustomers", {
        method: "GET",
        headers: myHeaders,
      })
        .then((response) => response.json())
        .then((result) => {
          console.log("Result value = ", result);
          this.setState({ customers: result, isLoading: false });
        })
        .catch((e) => {
          alert("Token Expired. Pleae re-login");
          console.log("Error is", e);
          AuthService.logout();
          this.props.history.push("/login");
          window.location.reload();
        });

      fetch(GLOBAL_URL + "SimpleIn$ite/getMaterials", {
        method: "GET",
        headers: myHeaders,
      })
        .then((response) => response.json())
        .then((result) => {
          //console.log("Result value = ", result);
          this.setState({ materialCategories: result, isLoading: false });
        })
        .catch((e) => {
          alert("Token Expired. Pleae re-login");
          console.log("Error is", e);
          AuthService.logout();
          // this.props.history.push('/login')
          window.location.reload();
        });

      // const responseCustomers = await fetch('/SimpleIn$ite/getCustomers',{
      //     method: 'GET',
      //     headers: myHeaders,
      // });

      // const respMaterialType = await fetch('/SimpleIn$ite/getMaterials',{
      //     method: 'GET',
      //     headers: myHeaders,
      // });

      // // const responseCustomers = await fetch("/SimpleIn$ite/getCustomers");
      // const bodyCustomers = await responseCustomers.json();

      // //const respMaterialType = await fetch("/SimpleIn$ite/getMaterials");
      // const bodyMaterialType = await respMaterialType.json();

      // this.setState( {customers : bodyCustomers, isLoading : false,
      //                 materialCategories : bodyMaterialType } )
    }
  }

  // Function to set state.visible = false after 2 seconds. This will automatically
  // hide the alert message box in 2 seconds after the pop up.
  onShowAlert = () => {
    this.setState({ visible: true }, () => {
      window.setTimeout(() => {
        this.setState({ visible: false });
        window.location.reload(1);
      }, 2000);
    });
  };

  render() {
    const title = <h3>Shipped Material Reporting </h3>;
    const { customers, materialCategories, isLoading } = this.state;

    let customersList = customers.map((customer) => (
      <option value={customer.customer_Name} key={customer.customer_id}>
        {customer.customer_Name}
      </option>
    ));

    let materialList = materialCategories.map((material) => (
      <option value={material.material_Type} key={material.material_ID}>
        {material.material_Type}
      </option>
    ));

    if (isLoading) return <div>Loading...</div>;

    return (
      <div className="sold-background">
        <Alert color="info" isOpen={this.state.visible}>
          Congratulations!!! The data entered successfully!
        </Alert>
        <Container>
          <u>{title}</u>
          <br />

          <ConfirmOutbound
            title="Please verify the data entry"
            customerNameDesc="Customer Name = "
            customerName={this.state.item.customersName}
            materialTypeDesc=" Material Type = "
            materialType={this.state.item.materialType}
            weighTicketDesc=" Weigh Ticket Number = "
            weighTicket={this.state.item.soldWeightTicketNumber}
            bolNumberDesc=" BOL Number = "
            bolNumber={this.state.item.BOLNumber}
            shippedDateDesc=" Shipped Date = "
            shippedDate={moment(this.state.item.date).format("MM-DD-yyyy")}
            soldWeightDesc=" Sold Weight = "
            soldWeight={this.state.item.SoldWeightInLbs}
            soldBalesDesc=" Sold Bales = "
            soldBales={this.state.item.SoldBales}
          >
            {(ConfirmOutbound) => (
              <Form onSubmit={ConfirmOutbound(this.handleSubmit)}>
                <FormGroup>
                  <label for="customersName">Customer's Name*</label>{" "}
                  <select
                    name="customersName"
                    onChange={this.handleChange}
                    required
                  >
                    <option></option>
                    {customersList}
                  </select>
                </FormGroup>

                <FormGroup>
                  <label for="materialType">Material Type*</label>{" "}
                  <select
                    name="materialType"
                    required
                    onChange={this.handleChange}
                    required
                  >
                    <option></option>
                    {materialList}
                  </select>
                </FormGroup>

                <FormGroup>
                  <label for="SoldWeightTicket"> 
                    <abbr title="Accepts numeric value ONLY"> Weight Ticket* </abbr>
                  </label>{" "}
                  <input
                    type="number"
                    pattern="[0-9]*"
                    inputmode="numeric"
                    min="1.0"
                    placeholder="Ex: 98234"
                    required
                    name="soldWeightTicketNumber"
                    id="soldWeightTicketNumber"
                    onChange={this.handleChange}
                  ></input>
                </FormGroup>

                <FormGroup>
                  <label for="BOLNumber">
                    <abbr title="Bill Of Lading, accepts alpha-numeric values ONLY ">BOL Number* </abbr>
                  </label>{" "}
                  <input
                    pattern="[0-9A-Za-z]*"
                    placeholder="Ex: 234A"
                    required
                    name="BOLNumber"
                    id="BOLNumber"
                    onChange={this.handleChange}
                  ></input>
                </FormGroup>

                <FormGroup>
                  <label for="Date"> Date* </label>{" "}
                  <DatePicker
                    maxDate={new Date()}
                    minDate={addDays(new Date(), -14)}
                    required
                    selected={this.state.item.date}
                    onChange={this.handleDateChange}
                  />
                </FormGroup>

                <FormGroup>
                  <label for="SoldWeightInLbs"> Sold Weight (lbs)* </label>{" "}
                  <input
                    type="number"
                    pattern="[0-9]*"
                    inputmode="numeric"
                    required
                    placeholder="Ex: 2,496"
                    min="10000.00"
                    max="50000.00"
                    step="1"
                    name="SoldWeightInLbs"
                    id="SoldWeightInLbs"
                    onChange={this.handleChange}
                  ></input>
                </FormGroup>

                <FormGroup>
                  <label for="SoldBales">
                    <abbr title="Number of bales shipped for each material"> Sold Bales* </abbr> 
                  </label>{" "}
                  <input
                    type="number"
                    pattern="[0-9]*"
                    inputmode="numeric"
                    min="1"
                    max="60"
                    step="1"
                    placeholder="Ex: 32"
                    required
                    name="SoldBales"
                    id="SoldBales"
                    onChange={this.handleChange}
                  ></input>
                </FormGroup>

                <FormGroup>
                  <Button color="primary"> Save </Button>{" "}
                  <Button color="secondary" tag={Link} to="/soldMaterial">
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
                </FormGroup>

              </Form>
            )}
          </ConfirmOutbound>
        </Container>
      </div>
    );
  }
}

export default SoldMaterial;
