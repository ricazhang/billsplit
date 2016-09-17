var NotesForm = React.createClass({
    render: function() {
        return (
            <form ref="form" onSubmit={ this.handleSubmission }>
                <input type="text" ref="content"/>
                <input type="submit" value="Add Note"/>
            </form>
        )
    },
    handleSubmission: function(event) {
        event.preventDefault()
        this.props.onSubmit(this.refs.content.value)
        alert(this.refs.content.value);
        this.refs.form.reset()
    }
})

var Note = React.createClass({
    render() {
        return (<li>
            {this.props.content}
            <button type="button" ref="button" onClick={ this.onDeleteClick }>Remove</button>
        </li>)
    },
    onDeleteClick(event) {
        event.preventDefault()
        console.log("onDeleteClick in Note: " + this.props.id)
        this.props.onDelete(this.props.id)
    }
})

var NotesList = React.createClass({
    renderNote(note) {
        return <Note id={ note.id } content={ note.content } onDelete={ this.props.onDelete } />
        //return React.createElement(Note, { key: note.id, content: note.content })
    },
    render() {
        return <ul>{ this.props.notes.map(this.renderNote) }</ul>
        //return React.createElement('ul', {}, this.state.notes.map(this.renderNote))
    }
})

var App = React.createClass({
    getInitialState: function() {
        return { notes: [
            { id: 1, content: 'Learn React' },
            { id: 2, content: 'Get Lunch' },
            { id: 3, content: 'Learn React Native' }
        ]}
    },
    render() {
        return (
            <section>
                <h1>You have { this.state.notes.length } reminders</h1>
                <NotesList notes={ this.state.notes } onDelete={ this.noteWasDestroyed } />
                <NotesForm onSubmit={ this.formWasSubmitted }/>
            </section>
        )
    },
    formWasSubmitted: function(content) {
        var note = {
            id: Date.now().toString(),
            content: content
        }
        this.setState({
            notes: this.state.notes.concat(note)
        })
    },
    noteWasDestroyed: function(id) {
        console.log("delete note: " + id)
        this.setState({
            // filter creates an array of all the non-destroyed items
            notes: this.state.notes.filter(function(note) {
                return note.id !== id
            })
        })
    }
})

ReactDOM.render(<App />, document.getElementById('entry-point'))
//ReactDOM.render(React.createElement(App, { notes: notes }), document.getElementById('entry-point'))