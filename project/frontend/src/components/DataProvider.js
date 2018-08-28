import React, { Component } from "react";
import PropTypes from "prop-types";

class DataProvider extends Component {
  static propTypes = {
    endpoint: PropTypes.string.isRequired,
    render: PropTypes.func.isRequired,
    isUpdated: PropTypes.bool.isRequired,
    onUpdate: PropTypes.func.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loaded: false,
      placeholder: "Loading..."
    }
    this.refreshTable();
  }
  componentDidUpdate(prevProps) {
    if (prevProps.endpoint !== this.props.endpoint) {
      this.setState({
        loaded: false,
      })
      this.refreshTable();
    }
    if (prevProps.isUpdated == true && this.props.isUpdated == false) {
      this.refreshTable();
    }
  }
  refreshTable() {
    fetch(this.props.endpoint,{method:"GET"})
      .then(response => {
        if (response.status !== 200) {
          return this.setState({ placeholder: "Something went wrong" });
        }
        return response.json();
      })
      .then(data => {
        this.setState({ data: data, loaded: true });
        this.props.onUpdate();
        console.log(data);
      });
  }
  render() {
    const { data, loaded, placeholder } = this.state;
    return loaded ? this.props.render(data) : <p>{placeholder}</p>;
  }
}
export default DataProvider;