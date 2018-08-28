import React, { Component } from "react";
import RecipeForm from "./RecipeForm";
import DataProvider from "./DataProvider";
import AccordionList from "./AccordionList";
import GroceryList from "./GroceryList";
import GroceryListHistory from "./GroceryListHistory";
import Header from "./Header";
import Footer from "./Footer";

class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditMode: false,
      isCheckoutMode: false,
      groceries: [],
      recipeToEdit: null,
      recipeToEditData: null,
      newRecipe: false,
      isTableUpdated: true,
      areSuggestionsUpdated: true,
      isGroceryListUpdated: true,
      objectFields: ["name","quantity","unit"]
    }
  }

  //Handle clicks to Back button
  backClickHandler() {
    this.setState({
      isEditMode: false,
      isCheckoutMode: false,
    });
  }

  //Handle clicks to recipe Edit button
  editRecipeClickHandler(recipe) {
    this.setState({
      isEditMode: true,
      recipeToEditData: recipe,
      recipeToEdit: recipe.name,
      editEndpoint: "api/recipes/",
    });
  }

  editGroceryListClickHandler(groceryList) {
    this.setState({
      isEditMode: true,
      recipeToEditData: groceryList,
      recipeToEdit: groceryList.date,
      editEndpoint: "api/grocerylist/",
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
      areSuggestionsUpdated: false,
    })
  }

  //Handle clicks to clear button associated with grocery list
  clearClickHandler() {
    this.setState({
      groceries: [],
    })
  }

  //Test if all relevant fields in an object are empty
  fieldsAreEmpty(o) {
    for (var key in o) {
      if (o[key] !== "" && this.state.objectFields.includes(key))
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
    if (this.state.groceries.length == 0 || this.objectsAreEmpty(this.state.groceries)) {
      alert("Grocery list contains no groceries");
      return;
    }

    //Send grocery list to server
    var data = this.state.groceries.filter((x) => !this.fieldsAreEmpty(x));
    data = {grocery_set: data}
    const conf = {
      method: "put",
      body: JSON.stringify(data),
      headers: new Headers({ "Content-Type": "application/json" })
    };
    fetch("api/grocerylist/submit/", conf)
      .then(response => {
        console.log(response.json());
        this.setState({
          isGroceryListUpdated: false,
          areSuggestionsUpdated: false,
        })
      });
    //Set to checkout mode
    this.setState({isCheckoutMode: true,groceries:[]});
  }

  //Submit recipe edit page data to add/update/delete
  submitClickHandler(data) {
    /*
    Send request to server including (a) ingredients to be deleted from server and 
    (b) new data
    */
    const conf = {
      method: "put",
      body: JSON.stringify(data),
      headers: new Headers({ "Content-Type": "application/json" })
    };
    fetch(this.state.editEndpoint + (this.state.newRecipe ? "submit" : data.id) + "/", conf)
      .then(response => {
        console.log(response.json());
        this.setState({
          isTableUpdated: false,
          areSuggestionsUpdated: false,
          newRecipe: false,
        })
      });

    //Set view back to grocery list view
    this.backClickHandler();
  }

  //Call when recipe list data has been updated with server data
  tableUpdateHandler() {
    this.setState({
      isTableUpdated: true,
    })
  }

  //Handles click on button to add new recipe to recipe list
  createRecipeHandler() {
    //Prompt user for recipe name
    var recipe = prompt("Input recipe name");
    //Render recipe edit view for new recipe
    if (recipe != null && recipe != "") {
      this.setState({
        recipeToEdit: recipe,
        recipeToEditData: {name: recipe, grocery_set: []},
        isEditMode: true,
        newRecipe: true,
      });
    }
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

  groceryListDeleteHandler(id) {
    //Send request to server
    const conf = {
      method: "delete",
      headers: new Headers({ "Content-Type": "application/json" })
    };
    fetch("api/grocerylist/" + id + "/", conf)
      .then(response => {
        console.log(response.json());
        this.setState({
          isGroceryListUpdated: false,
        })
      });
  }

  groceryHistoryAddHandler(list) {
    var groceries = this.state.groceries;
    list.grocery_set.forEach((x) => {groceries.push(x)});
    this.setState({groceries:groceries});
  }

  removeRecipeHandler(recipe) {
    //Send request to server
    const conf = {
      method: "delete",
      body: JSON.stringify(recipe),
      headers: new Headers({ "Content-Type": "application/json" })
    };
    fetch(this.state.editEndpoint + recipe.id + "/", conf)
      .then(response => {
        console.log(response.json());
        this.setState({
          isTableUpdated: false,
          isGroceryListUpdated: false,
          isEditMode: false,
        })
      });
  }

  suggestionsUpdateHandler() {
    this.setState({
      areSuggestionsUpdated: true,
    })
  }

  render() {
    var body;
    if (this.state.isEditMode) {
      //Recipe edit view
      body = (
        <div class="editFormContainer">
          <RecipeForm 
            data={this.state.recipeToEditData}
            recipe={this.state.recipeToEdit}
            onSubmit={(data) => {this.submitClickHandler(data)}}
            onRemove={(recipe) => {this.removeRecipeHandler(recipe)}}
            onBack={() => {this.backClickHandler()}}
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
            isUpdated={this.state.isTableUpdated}
            onUpdate={() => {this.tableUpdateHandler()}}
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
            isUpdated={this.state.isGroceryListUpdated}
            onUpdate={() => {this.groceryListUpdateHandler()}}
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
          onListsClick={() => {this.setState({isCheckoutMode:true})}}
          onRecipesClick={() => {this.setState({isCheckoutMode:false,isEditMode:false})}}
        />
        <div className="sidebar-container">
          <GroceryList 
            data={this.state.groceries} 
            onCheckoutClick={() => {this.checkoutClickHandler()}}
            onClearClick={() => {this.clearClickHandler()}}
            onChange={(newData) => {this.groceryListChangeHandler(newData)}}
            isUpdated={this.state.areSuggestionsUpdated}
            onUpdate={() => {this.suggestionsUpdateHandler()}}
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