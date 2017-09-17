import React from 'react';
import ReactDOM from 'react-dom';

class SplitComponent extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        // call render person
        return (
            <div>
                <p>Here is the split { this.props.status }!</p>
                Total Tax and Fees <input type="tel" className="left-input" ref="tax" defaultValue="0" onBlur={ this.applyTaxTip } onFocus={ this.highlightAllText }/>
                <button className="right-button" onClick={ this.appendPeriod }>.</button>
                Tip <input type="tel" ref="tip" defaultValue="0" onBlur={ this.applyTaxTip } onFocus={ this.highlightAllText }/>%
                <ul>{ this.props.people.map(this.renderPerson) }</ul>
                <button ref="applyTaxTipButton" onClick={ this.applyTaxTip }>Apply Tax and Tip</button>
            </div>
        )
    }

    renderPerson = (person) => {
        return (
            <li>{ person.name }'s { this.props.status } is ${ this.personOwes(person.name) } 
                <ul>{ Object.keys(this.props.items).map( item => this.personItem(person.name, item) ) }</ul>
            </li>
        )
    }

    personOwes = (name) => {
        var index = this.props.people.findIndex(person => person.name == name)
        if (this.props.status === "subtotal") {
            return this.props.people[index].subtotal
        }
        else if (this.props.status === "total") {
            return this.props.people[index].total
        }
    }

    personItem = (person, itemName) => {
        if (this.props.items[itemName].people.indexOf(person) >= 0) {
            var itemPrice = this.props.items[itemName].price
            var numPeople = this.props.items[itemName].people.length
            var perItemPrice = parseFloat(itemPrice/numPeople).toFixed(2)
            if (numPeople == 1) {
                return (
                    <li>{ itemName }, is ${ perItemPrice }</li>
                )
            }
            return (
                <li>{ itemName } for ${ perItemPrice } per person</li>
            )
        }
        else {
            return null
        }
    }

    applyTaxTip = () => {
        var tip = (parseFloat(this.refs.tip.value.trim()) / 100) + 1
        if (isNaN(tip)) {
            tip = 0;
        }
        var tax = parseFloat(this.refs.tax.value.trim())
        if (isNaN(tax)) {
            tax = 0;
        }
        console.log("tip is " + tip + " tax is " + tax)
        this.props.calculateTotals(tip, tax)
    }

    highlightAllText = (event) => {
        event.target.select()
    }

    appendPeriod = () => {
        if (this.refs.tax.value.indexOf(".") === -1) {
            this.refs.tax.value = this.refs.tax.value + "."
        }
        findDOMNode(this.refs.tax).focus(); 
    }
}

export default SplitComponent;