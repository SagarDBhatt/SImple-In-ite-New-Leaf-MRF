import React, { Component } from "react";
import AuthService from "../../Services/AuthService";
import AppNav from "../../AppNav";

import "../../StyleSheet/ParentStylesheet.css";

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: AuthService.getCurrentUser(),
    };
  }

  render() {
    const { currentUser } = this.state;

    return (
      <div className="container profile-background">
        {/* <AppNav />     */}

        <header className="jumbotron">
          <h3>
            Hi, <strong>{currentUser.name}</strong>
          </h3>
        </header>

        {/* <p>
                <strong>Token:</strong>{" "}
                {currentUser.accessToken.substring(0, 20)} ...{" "}
                {currentUser.accessToken.substr(currentUser.accessToken.length - 20)}
                </p> */}
        <p>
          <strong>Id:</strong> {currentUser.id}
        </p>
        <p>
          <strong>Email:</strong> {currentUser.email}
        </p>
        {/* <strong>Authorities:</strong>
                <ul>
                {currentUser.roles &&
                    currentUser.roles.map((role, index) => <li key={index}>{role}</li>)}
                </ul> */}
      </div>
    );
  }
}

export default Profile;
