import React from 'react';
import {findDOMNode} from 'react-dom';

class AddPersonComponent extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="aligned-row top-spacing-xsmall">
                <input className="left-input" autoFocus type="text" ref="content" onKeyDown={ this.addPerson } placeholder="Name"/>
                <button className="right-button" onClick={ this.addPersonClick }>Add</button>
                <span onClick={ this.addBlock } className="clickable right-clickable" ref="blockButton">Sample</span>
            </div>
        )
    }

    addBlock = () => {
        this.props.addBlock();
    }

    addPerson = (event) => {
        if (event.key == 'Enter') {
            if (this.refs.content.value.trim().length > 0) {
                event.preventDefault()
                this.addPersonClick(event);
            }
        }
    }

    addPersonClick = () => {
        if (this.refs.content.value.trim().length > 0) {
            this.props.onAdd(this.refs.content.value);
            findDOMNode(this.refs.content).value = "";  
            findDOMNode(this.refs.content).focus();  
        }
    }
}

export default AddPersonComponent;