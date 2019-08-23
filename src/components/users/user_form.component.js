import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import styles from "../backoffice.module.css";

export default function UserForm(props) {
  return (
    <div className={styles.limiter}>
      <div className={styles.container_table100}>
        <form className={styles.backofficeForm}>
          <div className="form-group">
            <label>Name: </label>
            <input
              type="text"
              name="name"
              required
              className="form-control"
              value={props.data.name}
              onChange={props.change}
            />
          </div>
          <div className="form-group">
            <label>Email: </label>
            <input
              type="email"
              name="email"
              required
              className="form-control"
              value={props.data.email}
              onChange={props.change}
            />
          </div>
          <div className="form-group">
            <label>Password: </label>
            <input
              type="password"
              name="password"
              required
              className="form-control"
              onChange={props.change}
            />
          </div>
          <div className="form-group">
            <button onClick={props.submit}>
              <FontAwesomeIcon icon={faSave} title="Save user" /> Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
