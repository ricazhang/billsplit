import React from 'react';
import {findDOMNode, render} from 'react-dom';

class AddPersonComponent extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            personIndex: 0
        }
    }

    render() {
        return (
            <div>
                <input className="left-input" autoFocus type="text" ref="content" onKeyDown={ this.addPerson }/>
                <button className="right-button" onClick={ this.addPersonClick }>Add</button>
                <span onClick={ this.addBlock } className="clickable" id="blockButton" ref="blockButton">Sample!</span>
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
                this.props.onAdd(this.refs.content.value, this.state.personIndex)
                this.setState({
                    personIndex: this.state.personIndex + 1
                })
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