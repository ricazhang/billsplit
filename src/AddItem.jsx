import React from 'react';
import {findDOMNode, render} from 'react-dom';

class AddItemComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            errorMessage: "",
            itemIndex: 0,
            selectAll: true,
            selectText: 'Select Everyone'
        }
    }

    render() {
        return (
            <div>
                <p className="error-message">{ this.state.errorMessage }</p>
                <div className="input-label-line">
                    <label htmlFor="itemName">Item Name: </label>
                    <input type="text" ref="itemName" name="itemName"/>
                </div>
                <div className="input-label-line">
                    <label htmlFor="itemPrice">Item Price: $</label>
                    <input type="tel" ref="itemPrice" name="itemPrice" className="left-input" onKeyDown={ this.splitItem }/>
                    <button className="right-button" onClick={ this.appendPeriod }>.</button>
                </div>
                <div>
                    <p>Split By</p>
                    <button type="button" className="sub-button" id="select-everyone-button" onClick={ this.selectEveryone }>Select Everyone</button>
                    <div id="person-checkbox-container">{ this.props.people.map( this.renderPersonCheckbox ) }</div>
                    <button id="add-item-button" type="button" onClick={ this.addItem }>Add Item</button>
                </div>
            </div>
        )
    }

    renderPersonCheckbox = (person) => {
        return (
            <div className="person-checkbox-line" onClick={ this.togglePersonCheckbox.bind(this, person.name) }>
                <input type="checkbox" className="person-checkbox" name={ person.name } checked={ this.props.selectedPeople.indexOf(person.name) > -1 }/>
                <label htmlFor={ person.name } className="person-checkbox-label">{ person.name }</label>
            </div>
        )
    }  

    addItem = () => {
        var priceInput = this.refs.itemPrice.value
        var price = parseFloat(priceInput).toFixed(2)

        if (isNaN(price)) {
            this.setState({
                errorMessage: "The item price must be a decimal number",
            })
            return;
        }
        if (this.refs.itemName.value.length === 0) {
            this.setState({
                errorMessage: "The item must have a name.",
            })
        }
        if (price == 0.00) {
            this.setState({
                errorMessage: "The item price cannot be 0.",
            })
            return;
        }
        if (this.props.selectedPeople.length < 1) {
            console.log("Num selected: " + this.props.selectedPeople.length)
            this.setState({
                errorMessage: "You must assign this item to at least one person.",
            })
            return;
        }
        var item = {
            name: this.refs.itemName.value,
            id: this.state.itemIndex,
            price: price
        }

        this.props.addItem(item)
        this.setState({
            itemIndex: this.state.itemIndex + 1,
            errorMessage: "",
        })
        findDOMNode(this.refs.itemName).value = "";
        findDOMNode(this.refs.itemPrice).value = "";
        findDOMNode(this.refs.itemName).focus();   
    } 

    appendPeriod = () => {
        if (this.refs.itemPrice.value.indexOf(".") === -1) {
            this.refs.itemPrice.value = this.refs.itemPrice.value + "."
        }
        findDOMNode(this.refs.itemPrice).focus(); 
    }  

    selectEveryone = () => {
        if (this.state.selectAll) {
            this.props.selectEveryone(true);
            this.setState({
                selectAll: false,
                selectEveryone: 'Deselect Everyone'
            })
        }
        else {
            this.props.selectEveryone(false);
            this.setState({
                selectAll: true,
                selectEveryone: 'Select Everyone'
            })
        }
    }
    
    // this method is bound in the render
    togglePersonCheckbox(name) {
        this.props.togglePerson(name)
    }
}

export default AddItemComponent;