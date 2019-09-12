import React, { Component } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import styles from "../backoffice.module.css";

export default class Users extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      loading: false,
      error: null
    };
  }

  componentDidMount = async () => {
    this.setState({ loading: true });

    let res;
    try {
      res = await axios.get("/users");
      this.setState({
        users: res.data
      });
    } catch (e) {
      this.setState({ error: e.toString(), loading: false });
    } finally {
      this.setState({ loading: false });
    }
  };

  removeUser = async userId => {
    this.setState({ loading: true });

    try {
      await axios.delete("/users/" + userId);
      const updatedUsers = this.state.users.filter(user => user._id !== userId);
      this.setState({ users: updatedUsers });
    } catch (e) {
      this.setState({ error: e.toString(), loading: false });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    let feedback = "";
    if (this.state.loading) {
      feedback = <CircularProgress />;
    }
    if (this.state.error) {
      feedback = this.state.error;
    }

    const users = this.state.users.map((user, index) => {
      return (
        <div className={styles.row} key={index}>
          <div className={styles.cell}>{user.name}</div>
          <div className={styles.cell + " " + styles.actionCell}>
            <Link to={"/user/edit/" + user._id}>
              <FontAwesomeIcon icon={faEdit} title="Edit user" />
            </Link>

            <button onClick={() => this.removeUser(user._id)}>
              <FontAwesomeIcon icon={faTrashAlt} title="Delete user" />
            </button>
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
        <div className={styles.feedback}>{feedback}</div>
      </div>
    );
  }
}
