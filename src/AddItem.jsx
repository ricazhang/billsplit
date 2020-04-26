import React from 'react';
import {findDOMNode} from 'react-dom';

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
                <div className="responsive-inline-input-container">
                    <label htmlFor="itemName">Item Name: </label>
                    <input type="text" ref="itemName" name="itemName"/>
                </div>
                <div className="responsive-inline-input-container aligned-row">
                    <label htmlFor="itemPrice">Item Price: $</label>
                    <input type="tel" ref="itemPrice" name="itemPrice" className="left-input" onKeyDown={ this.splitItem }/>
                    <button className="right-button" onClick={ this.appendPeriod }>.</button>
                </div>
                <div>
                    <p className="section-label">Who is splitting this item?
                        <span type="button" className="clickable left-pad" onClick={ this.selectEveryone }>{ this.state.selectText }</span>
                    </p>
                    <div id="person-checkbox-container">{ this.props.people.map( this.renderPersonCheckbox ) }</div>
                    <p className="error-message">{ this.state.errorMessage }</p>
                    <button id="add-item-button" type="button" onClick={ this.addItem }>Add Item</button>
                </div>
            </div>
        )
    }

    renderPersonCheckbox = (person) => {
        return (
            <div className="person-checkbox-line" key={ person.id } onClick={ this.togglePersonCheckbox.bind(this, person.name) }>
                <input type="checkbox" className="person-checkbox" name={ person.name } checked={ this.props.selectedPeople.indexOf(person.name) > -1 }/>
                <label htmlFor={ person.name } className="person-checkbox-label">
                    <span className="person-checkbox-plus">
                        <svg class="bi bi-plus" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M8 3.5a.5.5 0 01.5.5v4a.5.5 0 01-.5.5H4a.5.5 0 010-1h3.5V4a.5.5 0 01.5-.5z" clip-rule="evenodd"/>
                            <path fill-rule="evenodd" d="M7.5 8a.5.5 0 01.5-.5h4a.5.5 0 010 1H8.5V12a.5.5 0 01-1 0V8z" clip-rule="evenodd"/>
                        </svg>
                    </span>
                    <span className="person-checkbox-name">
                        { person.name }
                    </span>
                </label>
            </div>
        )
    }  

    addItem = () => {
        var priceInput = this.refs.itemPrice.value
        var price = parseFloat(priceInput)

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
        // Toggle select everyone back to unselected
        this.deselectEveryone();
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
                selectText: 'Deselect Everyone'
            })
        }
        else {
            this.deselectEveryone();
        }
    }

    // Toggle select everyone back to unselected and change button state.
    deselectEveryone = () => {
        this.props.selectEveryone(false);
        this.setState({
            selectAll: true,
            selectText: 'Select Everyone'
        })
    }
    
    // this method is bound in the render
    togglePersonCheckbox(name) {
        this.props.togglePerson(name)
    }
}

export default AddItemComponent;