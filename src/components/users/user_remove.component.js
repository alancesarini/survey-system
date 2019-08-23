import { Component } from "react";
import { createBrowserHistory } from "history";

export default class UserRemove extends Component {
  history = createBrowserHistory({ forceRefresh: true });

  componentDidMount = async () => {
    const id = this.props.match.params.id;
    try {
      await this.props.axios.delete("/users/" + id);
      this.history.push("/users");
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    return "";
  }
}
