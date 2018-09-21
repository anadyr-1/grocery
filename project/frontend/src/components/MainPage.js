import React, { Component } from "react";
import RecipeForm from "./RecipeForm";
import DataProvider from "./DataProvider";
import AccordionList from "./AccordionList";
import GroceryList from "./GroceryList";
import GroceryListHistory from "./GroceryListHistory";
import GroceryListForm from "./GroceryListForm";
import Header from "./Header";
import Footer from "./Footer";

class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //App views, if neither is true then it defaults to recipe page view
      isEditRecipeMode: false,
      isEditGroceryListMode: false,
      isCheckoutMode: false,

      //Grocery list
      groceries: [],
      
      //Edit screen
      toEditData: null,

      //Flags to set false when server data is updated
      areGroceriesUpdated: true,
      areGroceryListsUpdated: true,

      //Relevant fields in grocery object
      objectFields: ["name","quantity","unit"]
    }
  }

  //Handle clicks to recipe Edit button
  editRecipeClickHandler(recipe) {
    this.setState({
      isRecipeEditMode: true,
      toEditData: recipe,
    });
  }

  //Handle clicks to grocery list Edit button
  editGroceryListClickHandler(groceryList) {
    this.setState({
      isGroceryListEditMode: true,
      toEditData: groceryList,
    });
  }

  //Handle clicks to recipe [ + ] (Add) button: Adds a recipe's ingredients to grocery list
  addClickHandler(recipe) {
    var groceries = this.state.groceries;
    recipe.grocery_set.forEach((x) => {groceries.push(Object.assign({},x))})
    this.setState({groceries: groceries});
  }

  //Handle clicks to ingredient remove button on grocery list
  removeClickHandler(idx) {
    const groceries = this.state.groceries;
    this.setState({
      groceries: groceries.slice(0,idx).concat(groceries.slice(idx+1)),
    })
  }

  //Handle clicks to clear button associated with grocery list
  clearClickHandler() {
    this.setState({
      groceries: [],
    })
  }

  onGroceryListCheckout() {
    this.setState({
      areGroceryListsUpdated: false,
      areGroceriesUpdated: false,
      isCheckoutMode: true,
      groceries:[],
    });
  }

  onRecipeUpdate() {
    this.setState({
      isTableUpdated: false,
      areGroceriesUpdated: false,
      newRecipe: false,
    });
  }

  //Call when recipe list data has been updated with server data
  tableUpdateHandler() {
    this.setState({
      areGroceriesUpdated: true,
    })
  }

  //Handles click on button to add new recipe to recipe list
  createRecipeHandler() {
    //Prompt user for recipe name
    var recipe = prompt("Input recipe name");
    //Render recipe edit view for new recipe
    if (recipe != null && recipe != "") {
      this.setState({
        toEditData: {name: recipe, grocery_set: []},
        isRecipeEditMode: true,
      });
    }
  }

  onRecipeRemove() {
    this.setState({
      areGroceriesUpdated: false,
      isRecipeEditMode: false,
    });
  }

  //Handles change to grocery list data
  groceryListChangeHandler(newData) {
    this.setState({
      groceries: newData,
    })
  }

  //Call when grocery list data has been updated to reflect server data
  groceryListUpdateHandler() {
    this.setState({
      isGroceryListUpdated: true,
    })
  }

  groceryHistoryAddHandler(list) {
    var groceries = this.state.groceries;
    list.grocery_set.forEach((x) => {groceries.push(x)});
    this.setState({groceries:groceries});
  }

  suggestionsUpdateHandler() {
    this.setState({
      areGroceriesUpdated: true,
    })
  }

  //Called whenever groceries in server are changed
  onGroceriesChange() {
    this.setState({
      areGroceriesUpdated: false,
    })
  }

  //Called whenever a child element has updated its local grocery data to fit server data 
  onGroceriesUpdate() {
    this.setState({
      areGroceriesUpdated: true,
    })
  }

  //Called whenever grocery lists in server are changed
  onGroceryListsChange() {
    this.setState({
      areGroceryListsUpdated: false,
    })
  }

  //Called whenever a child element has updated its local grocery list data to fit server data 
  onGroceryListsUpdate() {
    this.setState({
      areGroceryListsUpdated: true,
    })
  }

  render() {
    var body;
    if (this.state.isRecipeEditMode) {
      //Recipe edit view
      body = (
        <div className="editFormContainer">
          <RecipeForm 
            data={this.state.toEditData}
            onGroceriesChange={() => {this.onGroceriesChange()}}
            navigateBack={() => {this.setState({isRecipeEditMode: false})}}
            objectFields={this.state.objectFields}
          />
        </div>
      )
    } else if (this.state.isGroceryListEditMode) {
      //Grocery list edit view
      body = (
        <div className="editFormContainer">
          <GroceryListForm 
            data={this.state.toEditData}
            onGroceriesChange={() => {this.onGroceriesChange()}}
            onGroceryListsChange={() => {this.onGroceryListsChange()}}
            navigateBack={() => {this.setState({isGroceryListEditMode: false})}}
            objectFields={this.state.objectFields}
          />
        </div>
      )
    } else if (!this.state.isCheckoutMode) {
      //Static recipe list view
      body = 
        <div>
          <div className="sectionHeading">Recipes</div>
          <DataProvider 
            endpoint="api/recipes/" 
            isUpdated={this.state.areGroceriesUpdated}
            onUpdate={() => {this.onGroceriesUpdate()}}
            render={(data) => 
            <AccordionList 
              data={data} 
              addClickHandler={(ings) => this.addClickHandler(ings)} 
              editClickHandler={(recipe) => {this.editRecipeClickHandler(recipe)}}
              parentPropName="name"
              childrenPropName="grocery_set"
            />}
          />
          <div className="listAddButton buttonElement" onClick={() => this.createRecipeHandler()}>[ + ]</div>
        </div>
    } else {
      //Grocery list history view
      body = 
        <div>
          <DataProvider 
            endpoint="api/grocerylist/"
            isUpdated={this.state.areGroceryListsUpdated}
            onUpdate={() => {this.onGroceryListsUpdate()}}
            render={(data) => 
            <GroceryListHistory 
              data={data}
              onEdit={(groceryList) => {this.editGroceryListClickHandler(groceryList)}}
              onAdd={(list) => {this.groceryHistoryAddHandler(list)}}
            />}
          />
        </div>
    }
    return(
      <div className="appContainer">
        <Header 
          onListsClick={() => {this.setState({isCheckoutMode:true,isRecipeEditMode:false,isGroceryListEditMode:false})}}
          onRecipesClick={() => {this.setState({isCheckoutMode:false,isRecipeEditMode:false,isGroceryListEditMode:false})}}
        />
        <div className="sidebar-container">
          <GroceryList 
            data={this.state.groceries} 
            onCheckout={() => {this.onGroceryListCheckout()}}
            onClearClick={() => {this.clearClickHandler()}}
            onChange={(newData) => {this.groceryListChangeHandler(newData)}}
            areSuggestionsUpdated={this.state.areGroceriesUpdated}
            onUpdate={() => {this.onGroceriesUpdate()}}
            objectFields={this.state.objectFields}
          />
        </div>
        <div className="body-container">
          {body}
        </div>
        <Footer />
      </div>
    )
  }
}
export default MainPage;