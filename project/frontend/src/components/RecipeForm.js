import React, { Component } from 'react';
import PropTypes from "prop-types";
import ExpandingList from './ExpandingList';

class RecipeForm extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired, //Recipe data
    onGroceriesChange: PropTypes.func.isRequired, //Called whenever grocery server data changed
    objectFields: PropTypes.array.isRequired, //Relevant grocery object fields
    navigateBack: PropTypes.func.isRequired, //Called when recipe is submitted/removed
  };

  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
    }
  }

  fieldsAreEmpty(o) {
    //Test if all relevant fields in an object are empty
    for (var key in o) {
      if (o[key] !== "" && this.props.objectFields.includes(key))
        return false;
    }
    return true;
  }

  handleChange(newGroceries) {
    var newData = this.props.data;
    newData.grocery_set = newGroceries;
    this.setState({
      data: newData,
    })
  }

  formatDataOutput(data) {
    var formattedGroceries = data.grocery_set.filter((x) => !this.fieldsAreEmpty(x))
    var newData = data;
    newData.grocery_set = formattedGroceries;
    return newData;
  }

  //Submit recipe edit page data to add/update/delete
  submitClickHandler(data) {
    const conf = {
      method: "put",
      body: JSON.stringify(data),
      headers: new Headers({ "Content-Type": "application/json" })
    };
    fetch("api/recipes/" + (data.id ? data.id : "submit") + "/", conf)
      .then(response => {
        console.log(response.json());
        this.props.onGroceriesChange();
      });
    this.props.navigateBack();
  }

  removeClickHandler(recipe) {
    //Send request to server
    const conf = {
      method: "delete",
      body: JSON.stringify(recipe),
      headers: new Headers({ "Content-Type": "application/json" })
    };
    fetch("api/recipes/", conf)
      .then(response => {
        console.log(response.json());
        this.props.onGroceriesChange();
      });
    this.props.navigateBack();
  }

  render() {
    return(
      <div className="recipeContainer">
        <div className="sectionHeading">{this.props.data.name}</div>
        <ExpandingList 
          data={this.state.data.grocery_set}
          objectFields={this.props.objectFields}
          onChange={(newData) => {this.handleChange(newData)}}
          onDelete={(newData) => {this.handleChange(newData)}}
        />
        <div
          className="buttonElement"
          onClick={() => {this.removeClickHandler(this.state.data)}}>Remove
        </div>
        <div className="buttonElement" 
          onClick={() => {this.submitClickHandler(this.formatDataOutput(this.state.data))}}>
          Submit
        </div>
      </div>
    )
  }
}
export default RecipeForm