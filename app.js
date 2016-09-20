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
            <div onClick={ this.togglePersonCheckbox.bind(this, person) }>
                <input type="checkbox" name={ person } checked={ this.props.selectedPeople.indexOf(person) > -1 }/>
                { person }
            </div>
        )
    },
    render: function() {
        return (
            <div>
                <ul>{ this.props.people.map( this.renderPersonCheckbox ) }</ul>
                <button type="button" ref="next-item-button" onClick={ this.addItem }>Add Item</button>
            </div>
        )
    },
    togglePersonCheckbox: function(name) {
        this.props.togglePerson(name)
    },
    addItem: function() {
        this.props.addItem()
    }
})

var AddItem = React.createClass({
    getInitialState: function() {
        return {
            status: "new",
            mostRecentItem: "",
            mostRecentPrice: 0
        }
    },
    render: function() {
        console.log("rendering " + this.state.status)
        if (this.state.status === "splitting") {
            return (
                <div>
                    <input type="text" ref="itemName" disabled/>
                    <input type="text" ref="itemPrice" disabled/>
                    <button type="button" ref="add-item-button" disabled>Split Item</button>
                    <p>Who partook in the enjoyment of { this.state.mostRecentItem }?</p>
                    <PersonChecklist selectedPeople={ this.props.selectedPeople } people={ this.props.people } addItem={ this.addItem } togglePerson = { this.props.togglePerson }/>
                </div>
            )
        }
        return (
            <div>
                <input autoFocus type="text" ref="itemName" />
                <input type="text" ref="itemPrice" onKeyDown={ this.splitItem }/>
                <button type="button" ref="add-item-button" onClick={ this.splitItem }>Split Item</button>
            </div>
        )
    },
    splitItem: function() {
        if (event.key == 'Enter' || event.type === "click") {
            event.preventDefault()
            this.setState({
                status: "splitting",
                mostRecentItem: this.refs.itemName.value,
                mostRecentPrice: this.refs.itemPrice.value
            })
        }
    },
    addItem: function() {
        var item = {
            name: this.state.mostRecentItem,
            price: this.state.mostRecentPrice
        }
        this.setState({
            status: "new",
            mostRecentItem: this.state.mostRecentItem,
            mostRecentPrice: this.mostRecentPrice
        })
        this.props.addItem(item)
        ReactDOM.findDOMNode(this.refs.itemName).value = "";
        ReactDOM.findDOMNode(this.refs.itemPrice).value = "";
        ReactDOM.findDOMNode(this.refs.itemName).focus();    
    }
})

var prettyArray = function(arr) {
    var str = ""
    if (arr.length < 1) {
        return "no one"
    }
    else if (arr.length == 1) {
        return arr[0]
    }
    else if (arr.length == 2) {
        str = arr[0] + " and " + arr[1]
        return str
    }
    
    for (var i in arr) {
        if (i != arr.length - 1) {
            str += arr[i] + ", "
        }
        else {
            str += " and " + arr[i]
        }
    }
    return str
}

var ItemList = React.createClass({
    renderItem: function(item) {
        return (
            <li id={item} content={item}>{ item } for ${ this.props.items[item].price } <strong>split by</strong> { prettyArray(this.props.items[item].people) }</li>
        )
    },
    render: function() {
        //console.log(this.props.items)
        return (
            <div>
                <ul>{ Object.keys(this.props.items).map(this.renderItem) }</ul>
                
            </div>
        )
    }
})

var PersonList = React.createClass({
    renderPerson: function(person) {
        return (
            <li content={person}>{ person }</li>
        )
    },
    render: function() {
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
            items: {},
            status: "people",
            selectedPeople: []
        }
    },
    render: function() {
        if (this.state.status === "items") {
            return (
                <section>
                    <h1>Bill Split</h1>
                    <p>Now enter in all the items.</p>
                    <ItemList items={ this.state.items } itemsDone={ this.finish }/>
                    <AddItem addItem={ this.addItem } selectedPeople={ this.state.selectedPeople } people={ this.state.people } togglePerson={ this.togglePerson }/>
                    <button type="button" ref="done-button" onClick={ this.done }>Done with Items</button>
                </section>
            )
        }
        else if (this.state.status === "people") {
            return (
                <section>
                    <h1>Bill Split</h1>
                    <p>First, enter in all the people involved in this transaction.</p>
                    <AddPerson onAdd={ this.addPerson } />
                    <PersonList people={ this.state.people } peopleDone={ this.switchToItems } />
                </section>
            )
        }
    },
    addPerson: function(name) {
        this.setState({
            people: this.state.people.concat(name),
            items: this.state.items,
            status: this.state.status,
            selectedPeople: this.state.selectedPeople
        })
    },
    addItem: function(item) {
        var updatedItems = this.state.items
        updatedItems[item.name] = {
            price: item.price,
            people: this.state.selectedPeople
        }
        this.setState({
            people: this.state.people,
            items: updatedItems,
            status: this.state.status,
            selectedPeople: []
        })
        console.log(updatedItems)
    },
    switchToItems: function() {
        this.setState({
            people: this.state.people,
            items: this.state.items,
            status: "items",
            selectedPeople: this.state.selectedPeople
        })
    },
    togglePerson: function(name) {
        if (this.state.selectedPeople.indexOf(name) > -1) {
            this.setState({
                people: this.state.people,
                items: this.state.items,
                status: this.state.status,
                selectedPeople: this.state.selectedPeople.filter(function(existingName) {
                    return existingName !== name
                })
            })
        }
        else if (this.state.selectedPeople.indexOf(name) == -1 ) {
            console.log("adding name")
            this.setState({
                people: this.state.people,
                items: this.state.items,
                status: this.state.status,
                selectedPeople: this.state.selectedPeople.concat(name)
            })
        }
    },
    done: function(event) {
        event.preventDefault()
        alert("Done")
    }
})

ReactDOM.render(<App />, document.getElementById('entry-point'))