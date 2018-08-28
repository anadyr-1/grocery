import React, { Component } from 'react';
import PropTypes from "prop-types";
import ExpandingList from './ExpandingList';

class RecipeForm extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
    recipe: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    console.log(props.data)
    this.state = {
      data: this.props.data,
      objectFields: ["name","quantity","unit"]
    }
  }

  fieldsAreEmpty(o) {
    //Test if all relevant fields in an object are empty
    for (var key in o) {
      if (o[key] !== "" && this.state.objectFields.includes(key))
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

  render() {
    return(
      <div className="recipeContainer">
        <div className="sectionHeading">{this.props.recipe}</div>
        <ExpandingList 
          data={this.state.data.grocery_set}
          objectFields={["name","quantity","unit"]}
          onChange={(newData) => {this.handleChange(newData)}}
          onDelete={(newData) => {this.handleChange(newData)}}
        />
        <div
          className="buttonElement"
          onClick={() => {this.props.onRemove(this.state.data)}}>Remove
        </div>
        <div className="buttonElement" 
          onClick={() => {this.props.onSubmit(this.formatDataOutput(this.state.data))}}>
          Submit
        </div>
        <div className="buttonElement" onClick={() => this.props.onBack()}>Back</div>
      </div>
    )
  }
}
export default RecipeForm