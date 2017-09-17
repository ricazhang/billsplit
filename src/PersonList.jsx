import React from 'react';
import ReactDOM from 'react-dom';

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
            <input value={ person.name } key={person.id} onFocus={ this.startEditingPerson.bind(this, person.id) } onChange={ this.handleChange }/>
        )
    }

    deletePerson = (person) => {
        console.log("Deleting: " + person)
    }

    startEditingPerson(id) {
        this.setState({
            errorMessage: this.state.errorMessage,
            editingId: id
        })
    }

    handleChange = (event) => {
        console.log("onChange event: ", event.target.value);

        if (event.target.value.trim().length > 0) {
            console.log("Editing: ", event.target.value, " id ", this.state.editingId);
            this.props.editPerson(event.target.value, this.state.editingId)
            this.setState({
                errorMessage: this.state.errorMessage,
                editingId: 0
            })
        }
    }
}

export default PersonListComponent;