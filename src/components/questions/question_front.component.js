import React, { Component } from "react";
import Slider, { createSliderWithTooltip } from "rc-slider";
import "rc-slider/assets/index.css";
import styles from "../frontoffice.module.css";

export default class QuestionFront extends Component {
  constructor(props) {
    super(props);

    this.state = {
      multipleOptions: []
    };
  }

  render() {
    let customText = "";
    let inputRange = "";
    let singleOption = "";
    let multipleOptions = "";

    if (this.props.data) {
      const SliderWithTooltip = createSliderWithTooltip(Slider);

      customText =
        this.props.data.question_type === "custom" ? (
          <div className="form-group">
            <input
              type="text"
              name="custom"
              onChange={this.props.change}
              required={true}
              className="form-control"
            />
          </div>
        ) : (
          ""
        );
      inputRange =
        this.props.data.question_type === "range" ? (
          <div className="form-group">
            <SliderWithTooltip
              min={this.props.data.min_value}
              max={this.props.data.max_value}
              step={1}
              dots={true}
              onChange={this.props.changeRange}
              name="range"
              value={this.props.range}
            />
          </div>
        ) : (
          ""
        );

      singleOption = "";
      if (this.props.data.question_type === "single_option") {
        singleOption = this.props.data.options.map((option, index) => {
          return (
            <div key={index} className="form-group">
              <input
                type="radio"
                name="single_option"
                value={option}
                onChange={this.props.change}
                required={true}
              />
              &nbsp;{option}
            </div>
          );
        });
      }

      multipleOptions = "";
      if (this.props.data.question_type === "multiple_options") {
        multipleOptions = this.props.data.options.map((option, index) => {
          return (
            <div key={index} className="form-group">
              <input
                type="checkbox"
                name="multiple_options"
                value={option}
                onChange={this.props.change}
              />
              &nbsp;{option}
            </div>
          );
        });
      }

      return (
        <form onSubmit={this.props.submit}>
          <div className={styles.question}>
            <p>{this.props.data.question_text}</p>
            {customText}
            {inputRange}
            {singleOption}
            {multipleOptions}
            {this.props.next}
          </div>
        </form>
      );
    } else {
      return "";
    }
  }
}
