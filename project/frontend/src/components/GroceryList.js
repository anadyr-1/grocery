import React, { Component } from "react";
import PropTypes from "prop-types";
import ExpandingList from "./ExpandingList"

class GroceryList extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired, //Array of grocery objects
    onChange: PropTypes.func.isRequired, //Executed on change to grocery field input box
    onCheckout: PropTypes.func.isRequired, //Executed on click to Checkout button
    onClearClick: PropTypes.func.isRequired, //Executed on click to Clear button
    areSuggestionsUpdated: PropTypes.bool.isRequired, //If false, refresh suggestion data
    onUpdate: PropTypes.func.isRequired, //Parent function to execute on suggestion refresh
    objectFields: PropTypes.array.isRequired, //Array of strings indicating relevant object parameters
  }
  constructor(props) {
    super(props);
  }

  //Test if all relevant fields in an object are empty
  fieldsAreEmpty(o) {
    for (var key in o) {
      if (o[key] !== "" && this.props.objectFields.includes(key))
        return false;
    }
    return true;
  }

  //Test if all objects in an array are empty
  objectsAreEmpty(array) {
    for (var i = 0;i < array.length;i++) {
      if (!this.fieldsAreEmpty(array[i]))
        return false;
    }
    return true;
  }

  //Handle clicks to checkout button associated with grocery list
  checkoutClickHandler() {
    //Check if grocery list is populated
    if (this.props.data.length == 0 || this.objectsAreEmpty(this.props.data)) {
      alert("Grocery list contains no groceries");
      return;
    }

    //Send grocery list to server
    var data = this.props.data.filter((x) => !this.fieldsAreEmpty(x));
    data = {grocery_set: data}
    const conf = {
      method: "put",
      body: JSON.stringify(data),
      headers: new Headers({ "Content-Type": "application/json" })
    };
    fetch("api/grocerylist/submit/", conf)
      .then(response => {
        console.log(response.json());
        this.props.onCheckout();
      });
  }
  render() {
    return(
      <div>
        <div className="sectionHeading">Grocery List</div>
        <ExpandingList 
            suggestionsAreUpdated={this.props.areGroceriesUpdated}
            onUpdate={this.props.onUpdate}
            data={this.props.data}
            objectFields={this.props.objectFields}
            onChange={(newData) => {this.props.onChange(newData)}}
            onDelete={(newData) => {this.props.onChange(newData)}}
        />
        <div className="buttonElement" onClick={() => {this.checkoutClickHandler()}}>Checkout</div>
      </div>
    )
  }
}
export default GroceryList