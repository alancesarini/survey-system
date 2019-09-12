import React, { Component } from "react";
import { Link } from "react-router-dom";

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      update: 1
    };
  }

  render() {
    const loginLink =
      this.props.usertoken !== "" ? (
        <Link to="/logout" className="nav-link">
          Logout
        </Link>
      ) : (
        <Link to="/login" className="nav-link">
          Login
        </Link>
      );

    const createUserMenu =
      Number.parseInt(this.props.userlevel) === 0 ? (
        <li className="navbar-item">
          <Link to="/users" className="nav-link">
            Users
          </Link>
        </li>
      ) : (
        ""
      );

    const actionsMenu =
      this.props.usertoken !== "" ? (
        <li className="navbar-item">
          <Link to="/surveys" className="nav-link">
            Surveys
          </Link>
        </li>
      ) : (
        ""
      );

    const parts = this.props.history.location.pathname.split("/");
    if (parts.includes("front")) {
      return "";
    } else {
      return (
        <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
          <Link to="/" className="navbar-brand">
            Survey system
          </Link>
          <div className="collpase navbar-collapse">
            <ul className="navbar-nav mr-auto">
              <li className="navbar-item">{loginLink}</li>
              {createUserMenu}
              {actionsMenu}
            </ul>
          </div>
        </nav>
      );
    }
  }
}

export default Navbar;
