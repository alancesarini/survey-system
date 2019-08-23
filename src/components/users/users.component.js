import React, { Component } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import styles from "../backoffice.module.css";

export default class Users extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: []
    };
  }

  componentDidMount = async () => {
    let res;
    try {
      res = await this.props.axios.get("/users");
      this.setState({
        users: res.data
      });
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    const users = this.state.users.map((user, index) => {
      return (
        <div className={styles.row} key={index}>
          <div className={styles.cell}>{user.name}</div>
          <div className={styles.cell + " " + styles.actionCell}>
            <Link to={"/user/edit/" + user._id}>
              <FontAwesomeIcon icon={faEdit} title="Edit user" />
            </Link>

            <Link to={"/user/remove/" + user._id}>
              <FontAwesomeIcon icon={faTrashAlt} title="Delete user" />
            </Link>
          </div>
        </div>
      );
    });

    return (
      <div className={styles.limiter}>
        <div className={styles.container_table100}>
          <p>
            This are the users that can create surveys. You can{" "}
            <Link to={"/users/new"}>add a new user</Link>
          </p>
          <div className={styles.wrap_table100}>
            <div className={styles.table}>
              <div className={styles.row + " " + styles.header}>
                <div className={styles.cell}>User</div>
                <div className={styles.cell}>Actions</div>
              </div>
              {users}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
