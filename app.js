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
                <p>Who partook in the enjoyment of { this.props.recentItem }?</p>
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
            mostRecentPrice: 0,
            errorMessage: ""
        }
    },
    render: function() {
        if (this.state.status === "splitting") {
            return (
                <div>
                    <label for="itemName">Item Name: </label>
                    <input type="text" ref="itemName" name="itemName" disabled/>
                    <label for="itemPrice">Item Price: $</label>
                    <input type="tel" ref="itemPrice" name="itemPrice" disabled/>
                    <button type="button" ref="add-item-button" disabled>Split Item</button>
                    <PersonChecklist selectedPeople={ this.props.selectedPeople } people={ this.props.people } addItem={ this.addItem } togglePerson={ this.props.togglePerson } recentItem ={ this.state.mostRecentItem }/>
                </div>
            )
        }
        return (
            <div>
                <p className="error-message" ref="itemError">{ this.state.errorMessage }</p>
                <label for="itemName">Item Name: </label>
                <input autoFocus type="text" ref="itemName" name="itemName"/>
                <label for="itemPrice">Item Price: $</label>
                <input type="tel" ref="itemPrice" name="itemPrice" onKeyDown={ this.splitItem }/>
                <button type="button" ref="add-item-button" onClick={ this.splitItem }>Split Item</button>
            </div>
        )
    },
    splitItem: function() {
        if (event.key == 'Enter' || event.type === "click") {
            event.preventDefault()

            var priceInput = this.refs.itemPrice.value
            var price = parseFloat(priceInput).toFixed(2)

            if (isNaN(price)) {
                this.setState({
                    status: this.state.status,
                    mostRecentItem: this.state.mostRecentItem,
                    mostRecentPrice: this.state.mostRecentPrice,
                    errorMessage: "The item price must be a decimal number"
                })
                return;
            }

            this.setState({
                status: "splitting",
                mostRecentItem: this.refs.itemName.value,
                mostRecentPrice: price,
                errorMessage: ""
            })
        }
        // backspace and delete
        else if (event.keyCode == 46 || event.keyCode == 8) {
            
        }
        else {

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
        //var perPersonPrice = parseFloat(this.props.items[item].price)
        var itemPrice = this.props.items[item].price;
        var itemPeople = this.props.items[item].people;
        var pricePerPerson = parseFloat(itemPrice/itemPeople.length).toFixed(2);
        return (
            <li id={item} content={item}>
                { item } for ${ itemPrice } <strong>split by</strong> { prettyArray(itemPeople) } (for ${ pricePerPerson } per person)
            </li>
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
            <li>{ person }</li>
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

var Split = React.createClass({
    getInitialState: function() {
        return {
            status: "subtotal"
        }
    },
    personOwes: function(person) {
        if (this.state.status === "subtotal") {
            var sum = 0.0;
            for (var itemName in this.props.items) {
                if (this.props.items.hasOwnProperty(itemName)) {
                    if (this.props.items[itemName].people.indexOf(person) >= 0) {
                        var itemPrice = this.props.items[itemName].price
                        var numPeople = this.props.items[itemName].people.length
                        var perItemPrice = parseFloat(itemPrice/numPeople)
                        sum += perItemPrice
                    }
                }
            }
            return sum.toFixed(2)
        }
        else if (this.state.status === "total") {
            var sum = 0.0;
            for (var itemName in this.props.items) {
                if (this.props.items.hasOwnProperty(itemName)) {
                    if (this.props.items[itemName].people.indexOf(person) >= 0) {
                        var itemPrice = this.props.items[itemName].price
                        var numPeople = this.props.items[itemName].people.length
                        var perItemPrice = parseFloat(itemPrice/numPeople)
                        sum += perItemPrice
                    }
                }
            }
            sum = (sum * 1.15) + (sum * 0.0875)
            return sum.toFixed(2)
        }
        
    },
    personItem: function(person, itemName) {
        if (this.props.items[itemName].people.indexOf(person) >= 0) {
            var itemPrice = this.props.items[itemName].price
            var numPeople = this.props.items[itemName].people.length
            var perItemPrice = parseFloat(itemPrice/numPeople).toFixed(2)
            if (numPeople == 1) {
                return (
                    <li>{ itemName }, is ${ perItemPrice }</li>
                )
            }
            return (
                <li>{ itemName }, split is ${ perItemPrice } per person</li>
            )
        }
        else {
            return null
        }
    },
    applyTaxTip: function() {
        this.setState({
            status: "total"
        })
        this.refs.applyTaxTipButton.disabled = true
    },
    renderPerson: function(person) {
        return (
            <li>{ person }'s { this.state.status } is ${ this.personOwes(person) } 
                <input type="tel" value="15"/>% tip
                <ul>{ Object.keys(this.props.items).map( item => this.personItem(person, item) )
                }</ul>
            </li>
        )
    },
    render: function() {
        return (
            <div>
                <p>Here is the split { this.state.status }!</p>
                <label>Enter ZIP Code for Tax Rate (only SF currently supported): </label>
                <input type="tel" value="94103"/>
                <ul>{ this.props.people.map(this.renderPerson) }</ul>
                <button ref="applyTaxTipButton" onClick={ this.applyTaxTip }>Apply Tax and Tip</button>
            </div>
        )
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
                    <p>First, enter in all the people involved in this transaction.</p>
                    <AddPerson onAdd={ this.addPerson } />
                    <PersonList people={ this.state.people } peopleDone={ this.switchToItems } />
                </section>
            )
        }
        else if (this.state.status === "done") {
            return (
                <section>
                    <Split people={ this.state.people } items={ this.state.items } />
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
        this.setState({
            people: this.state.people,
            items: this.state.items,
            status: "done",
            selectedPeople: this.state.selectedPeople
        })

        
    }
})

ReactDOM.render(<App />, document.getElementById('entry-point'))