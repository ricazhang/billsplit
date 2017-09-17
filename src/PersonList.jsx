import React from 'react';
import ReactDOM from 'react-dom';

class PersonListComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            errorMessage: ""
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
            <input value={ person.name } onChange={ this.editPerson }/>
        )
    }

    deletePerson = (person) => {
        console.log("Deleting: " + person)
    }

    editPerson = (person) => {
        console.log("Editing: " + person + " to " + event.srcElement.value)
        this.props.editPerson(person, event.srcElement.value)
    }
}

export default PersonListComponent;