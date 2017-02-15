var AddPerson = React.createClass({
    render: function() {
        return (
            <div>
                <input autoFocus type="text" ref="content" onKeyDown={ this.addPerson }/><button>Add Person to List</button>
            </div>
        )
    },
    addPerson: function(event) {
        // || event.key == ' '
        if (event.key == 'Enter') {
            if (this.refs.content.value.trim().length > 0) {
                event.preventDefault()
                this.props.onAdd(this.refs.content.value)
                ReactDOM.findDOMNode(this.refs.content).value = "";  
                ReactDOM.findDOMNode(this.refs.content).focus();  
            }
        }
    },
    addPersonButton: function(event) {
        console.log(event)
    }
})

var AddItem = React.createClass({
    getInitialState: function() {
        return {
            errorMessage: ""
        }
    },
    renderPersonCheckbox: function(person) {
        return (
            <div onClick={ this.togglePersonCheckbox.bind(this, person.name) }>
                <input type="checkbox" name={ person.name } checked={ this.props.selectedPeople.indexOf(person.name) > -1 }/>
                { person.name }
            </div>
        )
    },
    render: function() {
        return (
            <div>
                <p className="error-message">{ this.state.errorMessage }</p>
                <div class="input-label-line">
                    <label for="itemName">Item Name: </label>
                    <input type="text" ref="itemName" name="itemName"/>
                </div>
                <div class="input-label-line">
                    <label for="itemPrice">Item Price: $</label>
                    <input type="tel" ref="itemPrice" name="itemPrice" onKeyDown={ this.splitItem }/>
                </div>
                <div>
                    <p>Split By</p>
                    <ul>{ this.props.people.map( this.renderPersonCheckbox ) }</ul>
                    <button type="button" onClick={ this.addItem }>Add Item</button>
                </div>
            </div>
        )
    },
    addItem: function() {
        var priceInput = this.refs.itemPrice.value
        var price = parseFloat(priceInput).toFixed(2)

        if (isNaN(price)) {
            this.setState({
                errorMessage: "The item price must be a decimal number"
            })
            return;

        }
        if (price == 0.00) {
            this.setState({
                errorMessage: "The item price cannot be 0."
            })
            return;
        }
        if (this.props.selectedPeople.length < 1) {
            console.log("Num selected: " + this.props.selectedPeople.length)
            this.setState({
                errorMessage: "You must assign this item to at least one person."
            })
            return;
        }

        var item = {
            name: this.refs.itemName.value,
            price: price
        }

        this.props.addItem(item)
        ReactDOM.findDOMNode(this.refs.itemName).value = "";
        ReactDOM.findDOMNode(this.refs.itemPrice).value = "";
        ReactDOM.findDOMNode(this.refs.itemName).focus();    
    }, togglePersonCheckbox: function(name) {
        this.props.togglePerson(name)
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
    getInitialState: function() {
        return {
            errorMessage: ""
        }
    },
    renderPerson: function(person) {
        return (
            <div>
                <input onKeyDown={ this.editPerson } value={ person.name }/>
                <button>Delete</button>
            </div>
        )
    },
    render: function() {
        return (
            <div>
                <ol>{ this.props.people.map(this.renderPerson) }</ol>
                <p className="error-message">{ this.state.errorMessage }</p>
                <button type="button" ref="done-button" onClick={ this.done }>Go to Add Items</button>
            </div>
        )
    },
    editPerson: function(person) {
        console.log(person)
        console.log("Edit: " + person + " to " + event)
        this.props.editPerson(person, event)
    },
    deletePerson: function(person) {
        console.log("Deleting: " + person)
    },
    done: function(event) {
        if (this.props.people.length <= 1) {
            this.setState({
                errorMessage: "You must add at least two people to this Bill Split."
            })
            return;
        }
        else {
            this.setState({
                errorMessage: ""
            })
        }
        /*
        event.preventDefault()
        this.props.peopleDone()
        */
    }
})

var Split = React.createClass({
    getInitialState: function() {
        return {
            status: "subtotal",
        }
    },
    personOwes: function(name) {
        var index = this.props.people.findIndex(person => person.name == name)
        if (this.state.status === "subtotal") {
            return this.props.people[index].subtotal
        }
        else if (this.state.status === "total") {
            return this.props.people[index].total
            // console.log("total")
            // var sum = 0.0;
            // for (var itemName in this.props.items) {
            //     if (this.props.items.hasOwnProperty(itemName)) {
            //         if (this.props.items[itemName].people.indexOf(name) >= 0) {
            //             var itemPrice = this.props.items[itemName].price
            //             var numPeople = this.props.items[itemName].people.length
            //             var perItemPrice = parseFloat(itemPrice/numPeople)
            //             sum += perItemPrice
            //         }
            //     }
            // }
            // var tip = (parseFloat(this.refs.tip.value.trim()) / 100) + 1
            // sum = (sum * tip) + (sum * 0.0875)
            // var total = sum.toFixed(2)
            // this.props.updatePersonTotal(name, total)
            // return total
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
                <li>{ itemName } for ${ perItemPrice } per person</li>
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
            <li>{ person.name }'s { this.state.status } is ${ this.personOwes(person.name) } 
                <ul>{ Object.keys(this.props.items).map( item => this.personItem(person.name, item) ) }</ul>
            </li>
        )
    },
    render: function() {
        // call render person
        return (
            <div>
                <p>Here is the split { this.state.status }!</p>
                <label>Enter ZIP Code for to Calculate Tax Rate (only SF currently supported): </label>
                <input type="tel" value="94103"/>
                Tip <input type="tel" ref="tip"  onBlur={ this.applyTaxTip }/>%
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
                    <p>Now add the items in the transaction.</p>
                    <ItemList items={ this.state.items } itemsDone={ this.finish }/>
                    <AddItem addItem={ this.addItem } selectedPeople={ this.state.selectedPeople } people={ this.state.people } togglePerson={ this.togglePerson }/>
                    <button type="button" ref="done-button" onClick={ this.done }>Done with Items</button>
                </section>
            )
        }
        else if (this.state.status === "people") {
            return (
                <section>
                    <h3>People</h3>
                    <AddPerson onAdd={ this.addPerson } />
                    <PersonList editPerson={ this.editPerson } deletePerson={ this.deletePerson } people={ this.state.people } peopleDone={ this.switchToItems } />
                    <h3>Things on the Bill</h3>
                    <ItemList items={ this.state.items } itemsDone={ this.finish }/>
                    <AddItem addItem={ this.addItem } selectedPeople={ this.state.selectedPeople } people={ this.state.people } togglePerson={ this.togglePerson }/>
                    <button type="button" ref="done-button" onClick={ this.done }>Done with Items</button>
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
        var person = { "name": name, "subtotal": 0, "total": 0 }
        this.setState({
            people: this.state.people.concat(person),
            items: this.state.items,
            status: this.state.status,
            selectedPeople: this.state.selectedPeople
        })
    },
    updateSubtotal: function(personSubtotals) {
        var oldPeople = this.state.people
        for (var person in this.state.people) {
            var newPerson = { "name": person.name, "subtotal": personSubtotals[person.name], "total": person.total }
            oldPeople[person.name] = newPerson
        }
        // console.log("Update subtotal for " + name + " to " + subtotal)
        // var index = this.state.people.findIndex(person => person.name == name)
        // var oldPerson = this.state.people[index]
        // var oldPeople = this.state.people
        // var newPerson = { "name": name, "subtotal": subtotal, "total": oldPerson.total }
        // oldPeople[index] = newPerson 
        this.setState({
            people: oldPeople,
            items: this.state.items,
            status: this.state.status,
            selectedPeople: this.state.selectedPeople
        })
        //console.log(this.state.people)
    },
    updateTotal: function(personTotals) {
        console.log("Update subtotal for " + name + " to " + total)
        var index = this.state.people.findIndex(person => person.name == name)
        var oldPerson = this.state.people[index]
        var oldPeople = this.state.people
        var newPerson = { "name": name, "subtotal": oldPerson.subtotal, "total": total }
        oldPeople[index] = newPerson 
        this.setState({
            people: oldPeople,
            items: this.state.items,
            status: this.state.status,
            selectedPeople: this.state.selectedPeople
        })
    },
    editPerson: function(oldName, newName) {
        var person = { "name": newName, "subtotal": 0, "total": 0 }
        //index = this.state.people.indexOf(oldName)
        var index = this.state.people.findIndex(person => person.name == oldName)
        var newPeople = this.state.people
        newPeople[index] = person
        this.setState({
            people: newPeople,
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
            console.log("Found and unchecking: " + name)
            this.setState({
                people: this.state.people,
                items: this.state.items,
                status: this.state.status,
                selectedPeople: this.state.selectedPeople.filter(function(existingName) {
                    // remove existingName from list of selectedPeople
                    return existingName !== name
                })
            })
        }
        else if (this.state.selectedPeople.indexOf(name) == -1 ) {
            console.log("Not found and checking: " + name)
            this.setState({
                people: this.state.people,
                items: this.state.items,
                status: this.state.status,
                selectedPeople: this.state.selectedPeople.concat(name)
            })
        }
    },
    done: function(event) {
        var personSubtotals = {}
        var personTotals = {}
        
        for (var person in this.state.people) {
            var sum = 0.0;
            for (var i = 0; i < this.state.items.length; i++) {
                var item = this.state.items[i]
                console.log(i + " itemName: " + item)
                if (this.state.items.hasOwnProperty(item)) {
                    console.log("does have own prop")
                    if (this.state.items[i].people.indexOf(name) >= 0) {
                        var itemPrice = this.state.items[i].price
                        var numPeople = this.state.items[i].people.length
                        var perItemPrice = parseFloat(itemPrice/numPeople)
                        sum += perItemPrice
                    }
                }
            }
            var subtotal = sum.toFixed(2)
            personSubtotals[person] = subtotal

            // update total
            var totalSum = 0.0;
            for (var itemName in this.state.items) {
                if (this.state.items.hasOwnProperty(itemName)) {
                    if (this.state.items[itemName].people.indexOf(person.name) >= 0) {
                        var itemPrice = this.state.items[itemName].price
                        var numPeople = this.state.items[itemName].people.length
                        var perItemPrice = parseFloat(itemPrice/numPeople)
                        totalSum += perItemPrice
                    }
                }
            }
            //var tip = (parseFloat(this.refs.tip.value.trim()) / 100) + 1
            var tip = 1.15
            totalSum = (totalSum * tip) + (totalSum * 0.0875)
            var total = totalSum.toFixed(2)
            personTotals[person.name] = total
        }

        var oldPeople = this.state.people
        for (var person in this.state.people) {
            var newPerson = { "name": person.name, "subtotal": personSubtotals[person.name], "total": personTotals[person.name] }
            oldPeople[person.name] = newPerson
        }

        this.setState({
            people: this.state.people,
            items: this.state.items,
            status: "done",
            selectedPeople: this.state.selectedPeople
        })
    }
})

ReactDOM.render(<App />, document.getElementById('entry-point'))