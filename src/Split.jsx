import React from 'react';
import {findDOMNode, render} from 'react-dom';

class SplitComponent extends React.Component {
    constructor(props) {
        super(props)

        var total = 0.0;

        Object.keys(this.props.items).forEach((item) => {
            total += parseFloat(this.props.items[item].price);
        })

        this.state = {
            tipUnits: "%",
            total: total
        }
    }

    render() {
        // call render person
        return (
            <div>
                <div style={{marginTop: '15px', marginBottom: '15px'}}>Here is the split { this.props.status }!</div>
                <div className="responsive-inline-input-container">
                    <label>Taxes and Fees: $</label>
                    <input type="tel" className="left-input" ref="tax" defaultValue="0" onBlur={ this.applyTaxTip.bind(this, null) } onFocus={ this.highlightAllText }/>
                    <button className="right-button" onClick={ this.appendPeriod }>.</button>
                </div>
                <div className="responsive-inline-input-container">
                    <label>Tip:  </label>
                    <input type="tel" ref="tip" defaultValue="0" onBlur={ this.applyTaxTip.bind(this, null) } onFocus={ this.highlightAllText }/>

                    <input type="checkbox" ref="percentCheck" className="tip-units-checkbox" name="tip-percent" checked={this.state.tipUnits === '%'}/>
                    <label htmlFor="tip-percent" className="tip-units-checkbox-label" onClick={ this.applyTaxTip.bind(this, '%') }>%</label>
                    <input type="checkbox" ref="dollarCheck" className="tip-units-checkbox" name="tip-dollars" checked={this.state.tipUnits === '$'}/>
                    <label htmlFor="tip-dollars" className="tip-units-checkbox-label" onClick={ this.applyTaxTip.bind(this, '$') }>$</label>
                </div>
                <div className="section-label">Total: ${ this.state.total.toFixed(2) }</div>
                <div className="section-label">Subtotal: ${ this.getBillSubtotal().toFixed(2) }</div>
                <div className="breakdown-container">{ this.props.people.map(this.renderPerson) }</div>
            </div>
        )
    }

    renderPerson = (person) => {
        return (
            <div className="person-split-container" key={ person.id }>{ person.name } owes ${ this.getPersonTotal(person.name).toFixed(2) }
                <ul>{ Object.keys(this.props.items).map( item => this.personItem(person.name, item) ) }</ul>
            </div>
        )
    }

    checkCheckbox = (refName) => {
        this.refs[refName + "Check"].checked = true;
        this.setState({
            tipUnits: (refName === "percent") ? "%" : "$"
        });
    }

    getBillSubtotal = () => {
        var sum = Object.values(this.props.items).reduce(function(a, b) {
            return { price: a.price + b.price };
        }).price;
        return sum;
    }

    checkBillTotal() {
        var total = 0;
        console.log("items", this.props.items);
        this.props.items.forEach((item) => {
            total += item.price
        });
        console.log("total", total)
        return "Bill Total: $" + total;
    }

    getPersonTotal = (name) => {
        var index = this.props.people.findIndex(person => person.name == name)
        return this.props.people[index].total
    }

    personItem = (person, itemName) => {
        if (this.props.items[itemName].people.indexOf(person) >= 0) {
            var itemPrice = this.props.items[itemName].price
            var numPeople = this.props.items[itemName].people.length
            var perItemPrice = parseFloat(itemPrice/numPeople).toFixed(2)
            if (numPeople == 1) {
                return (
                    <li key={ itemName + itemPrice }>{ itemName } is ${ perItemPrice }</li>
                )
            }
            return (
                <li key={ itemName + "-" + itemPrice }>{ itemName } is ${ perItemPrice } per person</li>
            )
        }
        else {
            return null
        }
    }

    applyTaxTip = (units) => {
        units = units || this.state.tipUnits;

        if (units === '%') {
            var tip = (parseFloat(this.refs.tip.value.trim()) / 100) || 0
        }
        else if (units === '$') {
            var tip = parseFloat(this.refs.tip.value.trim()) || 0
        }

        var tax = parseFloat(this.refs.tax.value.trim()) || 0
        var subtotal = this.getBillSubtotal();
        var newTotal;
        if (units === '%') {
            newTotal = (subtotal + tax) + (subtotal * tip)
            this.setState({
                total: newTotal,
                tipUnits: units
            })
        }
        else if (units === '$') {
            newTotal = subtotal + tax + tip
            this.setState({
                total: newTotal,
                tipUnits: units
            })
        }

        console.log("tip: " , tip + " tax: " , tax, "total: ", newTotal);
        this.props.calculateTotals(tip, tax, units)
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