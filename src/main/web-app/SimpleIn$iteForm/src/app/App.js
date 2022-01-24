import React, { Component } from "react";
import {
  Route,
  Switch,
  BrowserRouter as Router,
  Link,
  withRouter,
  useHistory,
  Redirect,
} from "react-router-dom";
import { Navbar, Nav} from "react-bootstrap";

// import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Material_dim from "../components/Material_dim";
import incomingMaterial from "../components/incomingMaterial";
import Home from "../components/Home";
import Production from "../components/Production";
import soldMaterial from "../components/SoldMaterial";
import trashOut from "../components/trashOut";
import machinehours from "../components/machineHours";
import employeeTimesheet from "../components/employeeTimesheet";
import Login from "../user/login/Login";
import Profile from "../user/profile/profile";

import AuthService from "../Services/AuthService";
import image from "./Revolution_Icon.jpg";

import file from "../Documents/Lakeshore Recycling Systems Report.xlsx";

// import "../StyleSheet/ParentStylesheet.css"

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: undefined,
    };

    this.events = [
      "load",
      "mousemove",
      "mousedown",
      "click",
      "scroll",
      "keypress",
    ];

    this.logOut = this.logOut.bind(this);
    this.warn = this.warn.bind(this);
    this.resetTimeout = this.resetTimeout.bind(this);

    for (var i in this.events) {
      window.addEventListener(this.events[i], this.resetTimeout);
    }

    this.setTimeout();
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();
    // const accessTokenToVerifyExpiration = user.accessToken;

    if (user) {
      //console.log("Current Token = " + user.accessToken);

      this.setState({
        currentUser: user,
      });
    }
  }

  clearTimeout() {
    if (this.warnTimeout) clearTimeout(this.warnTimeout);

    if (this.logoutTimeout) clearTimeout(this.logoutTimeout);
  }

  setTimeout() {
    this.warnTimeout = setTimeout(this.warn, 1000 * 60 * 19);

    this.logoutTimeout = setTimeout(this.logOut, 1000 * 60 * 20);
  }

  resetTimeout() {
    this.clearTimeout();
    this.setTimeout();
  }

  warn() {
    alert("You will be logged out automatically in 1 minute.");
  }

  async logOut() {
    AuthService.logout();
    this.props.history.push("/login");
    window.location.reload();
    this.destroy();
  }

  destroy() {
    this.clearTimeout();

    for (var i in this.events) {
      window.removeEventListener(this.events[i], this.resetTimeout);
    }
  }

  render() {
    const { currentUser } = this.state;

    return (
      <div>
        <Navbar
          className="header-contact"
          collapseOnSelect
          // fixed="top"
          expand="sm"
          // bg="dark"
          variant="light"
          width="80vw"
        >
          <Navbar.Toggle aria-controls="responsive-navbar-nav"></Navbar.Toggle>
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav>
              <a
                className="navbar-brand"
                href="https://www.revolutionsystems.net/"
              >
                <div>
                  <img src={image} class="image-fluid"></img>
                </div>
              </a>
              <Nav.Link className="header-contact" href="/">
                SimpleIn$ite
              </Nav.Link>
              <Nav.Link className="header-contact" href="/home">
                Home (Pagina de Inicio)
              </Nav.Link>
              <Nav.Link className="header-contact" href="/incomingMaterial">
                InboundMaterial (Material Entrante)
              </Nav.Link>
              <Nav.Link className="header-contact" href="/Production">
                Bale Production (Produccion de Pacas)
              </Nav.Link>
              <Nav.Link className="header-contact" href="/soldMaterial">
                Shipped Material (Material Enviado)
              </Nav.Link>
              <Nav.Link className="header-contact" href="/trashOut">
                TrashOut (Basura)
              </Nav.Link>
              <Nav.Link className="header-contact" href="/machinehours">
                Machine hours (Horas de Maquina)
              </Nav.Link>
              <Nav.Link className="header-contact" href="/employeeTimesheet">
                Employee Timesheet (Horas del Empleados)
              </Nav.Link>

              {currentUser ? (
                <Nav>
                  <Nav.Link className="header-contact" href="/profile">
                    Hi, {currentUser.name}
                  </Nav.Link>
                  <Nav.Link
                    className="header-contact"
                    href="/login"
                    onClick={this.logOut}
                  >
                    Log Out (Carrar Sesion)
                  </Nav.Link>

                  {/* Anchor tag <a> is used in place of <Nav.Link> to use the download attribute */}
                  <a className="header-contact" href={file} download>
                    Report
                  </a>
                </Nav>
              ) : (
                <Nav>
                  <Nav.Link className="header-contact" href="/login">
                    Login (Iniciar Sesion)
                  </Nav.Link>
                </Nav>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <div>
          <Switch>
            <Route path="/home" exact={true} component={Home} />
            <Route path="/" exact={true} component={Home} />
            <Route path="/api/material" exact={true} component={Material_dim} />
            <Route path="/Production" exact={true} component={Production} />
            <Route
              path="/incomingMaterial"
              exact={true}
              component={incomingMaterial}
            />
            <Route path="/soldMaterial" exact={true} component={soldMaterial} />
            <Route path="/trashOut" exact={true} component={trashOut} />
            <Route path="/machinehours" exact={true} component={machinehours} />
            <Route
              path="/employeeTimesheet"
              exact={true}
              component={employeeTimesheet}
            />
            <Route exact path="/login" exact={true} component={Login} />
            <Route path="/profile" exact={true} component={Profile} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default withRouter(App);
