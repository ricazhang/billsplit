import React from 'react';
import {findDOMNode} from 'react-dom';

import FeesComponent from './Fees.jsx';

class SplitComponent extends React.Component {
    constructor(props) {
        super(props)

        var total = 0.0;

        Object.keys(this.props.items).forEach((item) => {
            total += parseFloat(this.props.items[item].price);
        })

        this.state = {
            tipUnits: "%",
            total: total,
            fees: []
        }
    }

    render() {
        return (
            <div>
                <div style={{marginTop: '15px', marginBottom: '15px'}}>Here is the split { this.props.status }!</div>
                <div className="responsive-inline-input-container aligned-row">
                    <label>Tip:  </label>
                    <input type="number" className="tax-tip" ref="tip" defaultValue="0" onBlur={ this.applyTaxTip.bind(this, null) } onFocus={ this.highlightAllText }/>

                    <input type="checkbox" ref="percentCheck" className="tip-units-checkbox" name="tip-percent" checked={this.state.tipUnits === '%'}/>
                    <label htmlFor="tip-percent" className="tip-units-checkbox-label" onClick={ this.applyTaxTip.bind(this, '%') }>%</label>
                    <input type="checkbox" ref="dollarCheck" className="tip-units-checkbox" name="tip-dollars" checked={this.state.tipUnits === '$'}/>
                    <label htmlFor="tip-dollars" className="tip-units-checkbox-label" onClick={ this.applyTaxTip.bind(this, '$') }>$</label>
                </div>
                <div className="responsive-inline-input-container aligned-row">
                    <label>Taxes and Fees: $</label>
                    <input type="tel" className="tax-tip left-input" ref="tax" defaultValue="0" onBlur={ this.applyTaxTip.bind(this, null) } onFocus={ this.highlightAllText }/>
                    <button className="right-button decimal-button" onClick={ this.appendPeriod }>.</button>
                    <span className="clickable right-clickable" onClick={ this.addFeeBox }>+ Fee</span>
                </div>
                <FeesComponent fees={ this.state.fees } editFee={ this.editFee } deleteFee={ this.deleteFee } />

                <div className="section-label">Subtotal: ${ this.getBillSubtotal().toFixed(2) }</div>
                <div className="section-label">Gratuity: ${ this.calculateGratuity().toFixed(2) }</div>
                { this.renderFeesTotal() }
                <div className="section-label">Total: ${ this.state.total.toFixed(2) }</div>
                <div className="breakdown-container">{ this.props.people.map(this.renderPerson) }</div>
            </div>
        )
    }

    renderFeesTotal = () => {
        if (this.getFeesTotal() > 0 || this.state.fees.length > 0) {
            let totalTaxesAndFees = this.getFeesTotal() + this.getTaxAsNumber();
            let formattedTotal = totalTaxesAndFees.toFixed(2);
            return (
                <div className="section-label">
                    <span>Taxes and Fees: $</span>
                    <span>{ formattedTotal }</span>
                </div>
            )
        }
    }

    renderPerson = (person) => {
        return (
            <div className="person-split-container" key={ person.id }>{ person.name } owes ${ this.getPersonTotal(person.name).toFixed(2) }
                <ul>{ Object.keys(this.props.items).map( item => this.personItem(person.name, item) ) }</ul>
            </div>
        )
    }

    componentDidMount() {
        window.addEventListener("beforeunload", this.onUnload);
        this.loadSavedState();
        var tax = this.getTaxAsNumber();
        var tip = parseFloat(this.refs.tip.value.trim()) || 0;
        this.props.calculateTotals(tip, tax, this.state.tipUnits);
    }
 
    componentWillUnmount() {
         window.removeEventListener("beforeunload", this.onUnload)
    }

    onUnload = () => {
        if (this.state.fees.length > 0 || this.state.tipUnits !== "%") {
            console.log("SplitComponent detected back/refresh, saving: ", this.state);
            localStorage.setItem("SplitComponent", JSON.stringify(this.state));
        }
    }

    loadSavedState = () => {
        if (localStorage.getItem("SplitComponent")) {
            console.log("loaded", JSON.parse(localStorage.getItem("SplitComponent")));
            this.setState(JSON.parse(localStorage.getItem("SplitComponent")));
        }
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

    personItem = (person, itemId) => {
        if (this.props.items[itemId].people.indexOf(person) >= 0) {
            const itemPrice = this.props.items[itemId].price
            const numPeople = this.props.items[itemId].people.length
            const itemName = this.props.items[itemId].name
            const perItemPrice = parseFloat(itemPrice/numPeople).toFixed(2)
            if (numPeople == 1) {
                return (
                    <li key={ itemId + person }>{ itemName } is ${ perItemPrice }</li>
                )
            }
            return (
                <li key={ itemId + person }>{ itemName } is ${ perItemPrice } per person</li>
            )
        }
        else {
            return null
        }
    }

    calculateGratuity = () => {
        if (!this.refs.tip) {
            // Return 0 if tip element isn't loaded yet
            return 0;
        }
        if (this.state.tipUnits === '%') {
            var tip = (parseFloat(this.refs.tip.value.trim()) / 100) || 0
            return tip * this.getBillSubtotal();
        }
        // units is $
        return parseFloat(this.refs.tip.value.trim()) || 0
    }

    applyTaxTip = (units) => {
        units = units || this.state.tipUnits;
        var tax = this.getTaxAsNumber();
        const fees = this.getFeesTotal();
        var subtotal = this.getBillSubtotal();
        var newTotal;
        if (units === '%') {
            var tip = (parseFloat(this.refs.tip.value.trim()) / 100) || 0
            newTotal = (subtotal + tax) + (subtotal * tip) + fees
            this.setState({
                total: newTotal,
                tipUnits: units
            })
        }
        else if (units === '$') {
            var tip = parseFloat(this.refs.tip.value.trim()) || 0
            newTotal = subtotal + tax + tip + fees
            this.setState({
                total: newTotal,
                tipUnits: units
            })
        }

        console.log("tip: " , tip + " taxAndFees: " , tax + fees, "total: ", newTotal);
        this.props.calculateTotals(tip, tax + fees, units)
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

    addFeeBox = () => {
        this.setState({
            fees: this.state.fees.concat({
                amount: 0,
            })
        })
    }

    getFeesTotal = () => {
        console.log('fees total:', this.state.fees, "= $",  this.state.fees.reduce((a, b) => a + b.amount, 0));
        return this.state.fees.reduce((a, b) => a + b.amount, 0);
    }

    getTaxAsNumber = () => {
        if (this.refs.hasOwnProperty('tax')) {
            return parseFloat(this.refs.tax.value || 0);
        }
        return 0;
    }

    editFee = (editedFee, index) => {
        if (editedFee.amount >= 0) {
            let newFees = this.state.fees;
            newFees[index] = editedFee;
            this.setState({
                fees: newFees,
            })
        }
    }

    deleteFee = (index) => {
        if (index > -1 && index < this.state.fees.length) {
            let newFee = this.state.fees;
            newFee.splice(index, 1);
            this.setState({
                fees: newFee,
            })
        }
    }
}

export default SplitComponent;