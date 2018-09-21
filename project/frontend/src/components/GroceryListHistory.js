import React, { Component } from "react";
import AccordionList from "./AccordionList";

function GroceryListHistory(props) {
  return(
    <React.Fragment>
      <div className="sectionHeading">Grocery list history</div>
      <AccordionList 
        data={props.data} 
        addClickHandler={(recipe) => props.onAdd(recipe)} 
        editClickHandler={(recipe) => {props.onEdit(recipe)}}
        parentPropName="created_at"
        childrenPropName="grocery_set"
      />
    </React.Fragment>
  )
}
export default GroceryListHistory;