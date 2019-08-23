import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import styles from "../backoffice.module.css";

export default function SurveyForm(props) {
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
            <button onClick={props.submit}>
              <FontAwesomeIcon icon={faSave} title="Save survey" /> Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
