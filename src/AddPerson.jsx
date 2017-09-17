import React from 'react';
import {findDOMNode, render} from 'react-dom';

class AddPersonComponent extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>
                <input className="left-input" autoFocus type="text" ref="content" onKeyDown={ this.addPerson }/>
                <button className="right-button" onClick={ this.addPersonClick }>Add Person to List</button>
                <button onClick={ this.addBlock } className="sub-button" ref="blockButton">Add Blockity Block</button>
            </div>
        )
    }

    addBlock = () => {
        this.refs.blockButton.setAttribute("disabled", "disabled");
        this.props.addBlock();

    }

    addPerson = (event) => {
        // || event.key == ' '
        if (event.key == 'Enter') {
            if (this.refs.content.value.trim().length > 0) {
                event.preventDefault()
                this.props.onAdd(this.refs.content.value)
                findDOMNode(this.refs.content).value = "";  
                findDOMNode(this.refs.content).focus();  
            }
        }
    }

    addPersonClick = () => {
        if (this.refs.content.value.trim().length > 0) {
            this.props.onAdd(this.refs.content.value)
        }
    }
}

export default AddPersonComponent;