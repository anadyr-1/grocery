import React, { Component } from "react";
import PropTypes from "prop-types";
import ExpandingList from "./ExpandingList"

function GroceryList(props) {
  GroceryList.propTypes = {
    data: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    onCheckoutClick: PropTypes.func.isRequired,
    onClearClick: PropTypes.func.isRequired,
  }
  return(
    <div>
      <div className="sectionHeading">Grocery List</div>
      <ExpandingList 
          isUpdated={props.isUpdated}
          onUpdate={props.onUpdate}
          data={props.data}
          objectFields={["name","quantity","unit"]}
          onChange={(newData) => {props.onChange(newData)}}
          onDelete={(newData) => {props.onChange(newData)}}
      />
      <div className="buttonElement" onClick={() => {props.onCheckoutClick()}}>Checkout</div>
    </div>
  )
}
export default GroceryList