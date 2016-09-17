var AddPerson = React.createClass({
    render: function() {
        return (
            <div>
                <input autoFocus type="text" ref="content" onKeyDown={ this.addPerson }/>
                <button type="button" ref="add-person-button" onClick={ this.addPerson }>Add Person</button>
                
            </div>
        )
    },
    addPerson: function(event) {
        if (event.key == 'Enter' || event.type === "click") {
            event.preventDefault()
            this.props.onAdd(this.refs.content.value)
            ReactDOM.findDOMNode(this.refs.content).value = "";  
            ReactDOM.findDOMNode(this.refs.content).focus();  
        }
    }
})

var PersonChecklist = React.createClass({
    renderPersonCheckbox: function(person) {
        return (
            <div>
                <input type="checkbox" name={ person.name } onClick={ this.toggleCheck } checked={ this.isPersonChecked.bind(this, person.name ) }/>
                <div>{ person.name }</div>
            </div>
        )
    },
    render: function() {
        return (
            <div>
                <ul>{ this.props.people.map( this.renderPersonCheckbox ) }</ul>
                <button type="button" ref="next-item-button" onClick={ this.next }>Next Item</button>
            </div>
        )
    },
    isPersonChecked: function(name) {
        this.props.items.
    },
    toggleCheck: function() {
        this.props.toggleCheck()
    },
    next: function() {
        this.props.nextItem()
    }
})

var AddItem = React.createClass({
    getInitialState: function() {
        return {
            status: "new",
            mostRecentItem: ""
        }
    },
    render: function() {
        if (this.state.status === "splitting") {
            return (
                <div>
                    <input autoFocus type="text" ref="content"/>
                    <button type="button" ref="add-item-button" onClick={ this.next }>Split Item</button>
                    <p>Who partook in the enjoyment of { this.state.mostRecentItem }?</p>
                    <PersonChecklist people={ this.props.people } nextItem={ this.props.nextItem } />
                </div>
            )
        }
        return (
            <div>
                <input type="text" ref="content"/>
                <button type="button" ref="add-item-button" onClick={ this.next }>Next</button>
            </div>
        )
    },
    next: function() {
        event.preventDefault()
        this.setState({
            status: "splitting",
            mostRecentItem: this.refs.content.value
        })
    },
    nextItem: function() {
        this.props.addItem()
    }
})

var ItemList = React.createClass({
    renderItem: function(item) {
        return (
            <li id={item.id} content={item.name}>{ item.name } split by { item.people }</li>
        )
    },
    render: function() {
        console.log(this.props.items)
        return (
            <div>
                <ul>{ this.props.items.map(this.renderItem) }</ul>
                <button type="button" ref="done-button" onClick={ this.done }>Done with Items</button>
            </div>
        )
    },
    done: function(event) {
        event.preventDefault()
        this.props.itemsDone()
    }
})

var PersonList = React.createClass({
    renderPerson: function(person) {
        return (
            <li id={person.id} content={person.name}>{ person.name }</li>
        )
    },
    render: function() {
        console.log(this.props.people)
        return (
            <div>
                <ul>{ this.props.people.map(this.renderPerson) }</ul>
                <button type="button" ref="done-button" onClick={ this.done }>Done with People</button>
            </div>
        )
    },
    done: function(event) {
        event.preventDefault()
        this.props.peopleDone()
    }
})

var App = React.createClass({
    getInitialState: function() {
        return {
            people: [],
            items: [],
            status: "people"
        }
    },
    render: function() {
        if (this.state.status === "items") {
            return (
                <section>
                    <h1>Bill Split</h1>
                    <p>Now enter in all the items.</p>
                    <AddItem addItem={ this.addItem } people={ this.state.people }/>
                    <ItemList items={ this.state.items } itemsDone={ this.finish }/>
                </section>
            )
        }
        return (
            <section>
                <h1>Bill Split</h1>
                <p>First, enter in all the people involved in this transaction.</p>
                <AddPerson onAdd={ this.addPerson } />
                <PersonList people={ this.state.people } peopleDone={ this.switchToItems } />
            </section>
        )
    },
    addPerson: function(name) {
        var person = {
            id: Date.now().toString(),
            name: name
        }
        console.log("Adding: " + person.name)
        this.setState({
            people: this.state.people.concat(person),
            items: this.state.items
        })
        console.log(this.state.people)
    },
    addItem: function(name, people) {
        var item = {
            id: Date.now().toString(),
            name: name,
            people: people
        }
        console.log("Adding: " + item.name + " " + item.people)
        this.setState({
            people: this.state.people,
            items: this.state.items.concat(item)
        })
    },
    switchToItems: function() {
        this.setState({
            people: this.state.people,
            items: this.state.items,
            status: "items"
        })
    },
    finish: function() {
        alert("Done")
    }
})

ReactDOM.render(<App />, document.getElementById('entry-point'))