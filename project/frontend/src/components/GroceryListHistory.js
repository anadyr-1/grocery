import React, { Component } from "react";
import AccordionList from "./AccordionList";

class GroceryListHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groceryListIsExpanded: Array(props.data.length).fill(false),
    }
  }

  expandClickHandler(idx) {
    const groceryListIsExpanded = this.state.groceryListIsExpanded;
    groceryListIsExpanded[idx] = !groceryListIsExpanded[idx];
    this.setState({
      groceryListIsExpanded: groceryListIsExpanded,
    });
  }

  componentWillReceiveProps() {
    this.setState({
      groceryListIsExpanded: Array(this.props.data.length).fill(false),
    });
  }

  render() {
    return(
      <React.Fragment>
        <div className="sectionHeading">Grocery list history</div>
        <AccordionList 
          data={this.props.data} 
          addClickHandler={(recipe) => this.props.onAdd(recipe)} 
          editClickHandler={(recipe) => {this.props.onEdit(recipe)}}
          parentPropName="created_at"
          childrenPropName="grocery_set"
        />
      </React.Fragment>
    )
  }
}
export default GroceryListHistory;