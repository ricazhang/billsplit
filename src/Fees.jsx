import React from 'react';
import {findDOMNode} from 'react-dom';

class FeesComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            editingIndex: -1
        }
    }

    render = () => {
        return (
            <div>
                <ul>{ this.props.fees.map(this.renderFee) }</ul>
            </div>
        )
    }

    renderFee = (fee, index) => {
        return (
            <div key={ this.getKey(index) } className="aligned-row fee-container">
                {/*Input type is tel for mobile users to use telephone pad to type in numbers instead of keyboard*/}
                <input type="tel" defaultValue="0" ref={ this.getKey(index) } className="iterated-input" onFocus={ this.startEditingFee.bind(this, index, 'inputFocus') } onChange={ this.handleChange }/>
                <button className="right-button" onClick={ this.appendPeriod.bind(this, index) }>.</button>
                <span className="clickable right-clickable" onClick={ this.startEditingFee.bind(this, index, 'editButton') }>Edit</span>
                <span className="clickable right-clickable" onClick={ this.deleteFee.bind(this, index) }>Delete</span>
            </div>
        )
    }

    getKey = (index) => {
        return "fee-" + index;
    }

    appendPeriod = (index) => {
        if (this.refs[this.getKey(index)].value.indexOf(".") === -1) {
            this.props.editFee({
                amount: this.props.fees[index].amount,
            }, this.state.editingIndex)
        }
        findDOMNode(this.refs[this.getKey(index)]).focus(); 
    }

    startEditingFee(index, from) {
        findDOMNode(this.refs[this.getKey(index)]).focus(); 
        if (from === 'editButton') {
            findDOMNode(this.refs[this.getKey(index)]).select(); 
        }
        
        this.setState({
            editingIndex: index
        })
    }

    deleteFee(index) {
        console.log("deleted fee index", index, this.props.fees);
        this.props.deleteFee(index);
    }

    handleChange = (event) => {
    console.log("editing", this.state.editingIndex);
    const trimmedValue = event.target.value.trim() || "0";
        this.props.editFee({
            amount: parseFloat(trimmedValue),
        }, this.state.editingIndex)
    }
} 

export default FeesComponent;