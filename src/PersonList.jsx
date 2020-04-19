import React from 'react';
import {findDOMNode} from 'react-dom';

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
            <div class="person-list-container">
                <div>{ this.props.people.length } people</div>
                <ul>{ this.props.people.map(this.renderPerson) }</ul>
                <p className="error-message">{ this.state.errorMessage }</p>
            </div>
        )
    }

    renderPerson = (person) => {
        return (
            <div key={person.id}>
                <input value={ person.name } ref={ person.name } className="iterated-input" onFocus={ this.startEditingPerson.bind(this, person, 'inputFocus') } onChange={ this.handleChange }/>
                <span className="clickable" onClick={ this.startEditingPerson.bind(this, person, 'editButton') }>Edit</span>
                <span className="clickable right-clickable" onClick={ this.deletePerson.bind(this, person) }>Delete</span>
            </div>
        )
    }

    startEditingPerson(person, from) {
        findDOMNode(this.refs[person.name]).focus(); 
        if (from === 'editButton') {
            findDOMNode(this.refs[person.name]).select(); 
        }

        this.setState({
            editingId: person.id
        })
    }

    deletePerson(person) {
        this.props.deletePerson(person.id);
    }

    handleChange = (event) => {
        if (event.target.value.trim().length > 0) {
            this.props.editPerson(event.target.value, this.state.editingId)
        }
    }
}

export default PersonListComponent;