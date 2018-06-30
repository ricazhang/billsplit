import React from 'react';
import {findDOMNode, render} from 'react-dom';

class PersonListComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            errorMessage: "",
            editingId: 0
        }
    }

    render() {
        return (
            <div>
                <ul>{ this.props.people.map(this.renderPerson) }</ul>
                <p className="error-message">{ this.state.errorMessage }</p>
            </div>
        )
    }

    renderPerson = (person) => {
        return (
            <div key={person.id}>
                <input value={ person.name } ref={ person.name } className="iterated-input" onFocus={ this.startEditingPerson.bind(this, person, '') } onChange={ this.handleChange }/>
                <span className="clickable" onClick={ this.startEditingPerson.bind(this, person, 'editButton') }>Edit</span>
                <span className="clickable remove-person" onClick={ this.deletePerson.bind(this, person) }>Delete</span>
            </div>
        )
    }

    startEditingPerson(person, from) {
        console.log("editing: ", person);
        if (from === 'editButton') {
            console.log("from edit button")
            findDOMNode(this.refs[person.name]).focus(); 
            findDOMNode(this.refs[person.name]).select(); 
        }

        this.setState({
            editingId: person.id
        })
    }

    deletePerson(person) {
        console.log("deleting: ", person);
        this.props.deletePerson(person.id);
    }

    handleChange = (event) => {
        console.log("onChange event: ", event.target.value);

        if (event.target.value.trim().length > 0) {
            console.log("Editing: ", event.target.value, " id ", this.state.editingId);
            this.props.editPerson(event.target.value, this.state.editingId)
        }
    }
}

export default PersonListComponent;