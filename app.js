var AddPerson = React.createClass({
    render: function() {
        return (
            <div>
                <input className="left-input" autoFocus type="text" ref="content" onKeyDown={ this.addPerson }/>
                <button className="right-button" onClick={ this.addPersonClick }>Add Person to List</button>
                <button onClick={ this.addBlock } className="sub-button" ref="blockButton">Add Blockity Block</button>
            </div>
        )
    },
    addBlock: function() {
        this.refs.blockButton.setAttribute("disabled", "disabled");
        this.props.addBlock();

    },
    addPersonClick: function() {
        if (this.refs.content.value.trim().length > 0) {
            this.props.onAdd(this.refs.content.value)
        }
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
    appendPeriod: function() {
        if (this.refs.itemPrice.value.indexOf(".") === -1) {
            this.refs.itemPrice.value = this.refs.itemPrice.value + "."
        }
        ReactDOM.findDOMNode(this.refs.itemPrice).focus(); 
    },
    renderPersonCheckbox: function(person) {
        return (
            <div className="person-checkbox-line" onClick={ this.togglePersonCheckbox.bind(this, person.name) }>
                <input type="checkbox" className="person-checkbox" name={ person.name } checked={ this.props.selectedPeople.indexOf(person.name) > -1 }/>
                <label for={ person.name } className="person-checkbox-label">{ person.name }</label>
            </div>
        )
    },
    render: function() {
        return (
            <div>
                <p className="error-message">{ this.state.errorMessage }</p>
                <div className="input-label-line">
                    <label for="itemName">Item Name: </label>
                    <input type="text" ref="itemName" name="itemName"/>
                </div>
                <div className="input-label-line">
                    <label for="itemPrice">Item Price: $</label>
                    <input type="tel" ref="itemPrice" name="itemPrice" className="left-input" onKeyDown={ this.splitItem }/>
                    <button className="right-button" onClick={ this.appendPeriod }>.</button>
                </div>
                <div>
                    <p>Split By</p>
                    <button type="button" className="sub-button" id="select-everyone-button" onClick={ this.selectEveryone }>Select Everyone</button>
                    <div id="person-checkbox-container">{ this.props.people.map( this.renderPersonCheckbox ) }</div>
                    <button id="add-item-button" type="button" onClick={ this.addItem }>Add Item</button>
                </div>
            </div>
        )
    },
    selectEveryone: function() {
        this.props.selectEveryone();
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
        if (this.refs.itemName.value.length === 0) {
            this.setState({
                errorMessage: "The item must have a name."
            })
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
        this.setState({
            errorMessage: ""
        }) 
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
            <li>{ person.name }</li>
        )
    },
    render: function() {
        return (
            <div>
                <ul>{ this.props.people.map(this.renderPerson) }</ul>
                <p className="error-message">{ this.state.errorMessage }</p>
            </div>
        )
    },
    editPerson: function(person) {
        console.log("Editing: " + person + " to " + event.srcElement.value)
        this.props.editPerson(person, event.srcElement.value)
    },
    deletePerson: function(person) {
        console.log("Deleting: " + person)
    }
})

var Split = React.createClass({
    personOwes: function(name) {
        var index = this.props.people.findIndex(person => person.name == name)
        if (this.props.status === "subtotal") {
            return this.props.people[index].subtotal
        }
        else if (this.props.status === "total") {
            return this.props.people[index].total
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
        var tip = (parseFloat(this.refs.tip.value.trim()) / 100) + 1
        if (isNaN(tip)) {
            tip = 0;
        }
        var tax = parseFloat(this.refs.tax.value.trim())
        if (isNaN(tax)) {
            tax = 0;
        }
        this.props.calculateTotals(tip, tax)
    },
    highlightAllText: function(event) {
        event.target.select()
    },
    appendPeriod: function() {
        if (this.refs.tax.value.indexOf(".") === -1) {
            this.refs.tax.value = this.refs.tax.value + "."
        }
        ReactDOM.findDOMNode(this.refs.tax).focus(); 
    },
    renderPerson: function(person) {
        return (
            <li>{ person.name }'s { this.props.status } is ${ this.personOwes(person.name) } 
                <ul>{ Object.keys(this.props.items).map( item => this.personItem(person.name, item) ) }</ul>
            </li>
        )
    },
    render: function() {
        // call render person
        return (
            <div>
                <p>Here is the split { this.props.status }!</p>
                Total Tax and Fees <input type="tel" className="left-input" ref="tax" defaultValue="0" onBlur={ this.applyTaxTip } onFocus={ this.highlightAllText }/>
                <button className="right-button" onClick={ this.appendPeriod }>.</button>
                Tip <input type="tel" ref="tip" defaultValue="0" onBlur={ this.applyTaxTip } onFocus={ this.highlightAllText }/>%
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
            selectedPeople: [],
            tax: 0.0,
            errorMessage: ""
        }
    },
    render: function() {
        if (this.state.status === "people") {
            return (
                <section>
                    <div className="section" id="people-section">
                        <h3>People</h3>
                        <AddPerson onAdd={ this.addPerson } addBlock={ this.addBlock }/>
                        <PersonList editPerson={ this.editPerson } deletePerson={ this.deletePerson } people={ this.state.people } peopleDone={ this.switchToItems } />
                    </div>
                    <div className="section" id="item-section">
                        <h3>Things on the Bill</h3>
                        <ItemList items={ this.state.items } itemsDone={ this.finish }/>
                        <AddItem addItem={ this.addItem } selectEveryone={ this.selectAllPeople } selectedPeople={ this.state.selectedPeople } people={ this.state.people } togglePerson={ this.togglePerson }/>
                    </div>
                    <p className="error-message">{ this.state.errorMessage }</p>
                    <button type="button" ref="done-button" className="accent-button" onClick={ this.doneWithItems }>Calculate Split</button>
                </section>
            )
        }
        else if (this.state.status === "subtotal" || this.state.status === "total") {
            return (
                <section>
                    <Split people={ this.state.people } items={ this.state.items } calculateTotals={ this.calculateTotals } status={ this.state.status }/>
                </section>
            )
        }
    },
    addPerson: function(name) {
        var index = this.state.people.findIndex(person => person.name === name)
        if (index > -1) {
            var err = "Not adding duplicate person"
            this.setState({
                people: this.state.people,
                items: this.state.items,
                status: this.state.status,
                selectedPeople: this.state.selectedPeople,
                errorMessage: err
            })
            return;
        }
        var person = { "name": name, "subtotal": 0, "total": 0 }
        this.setState({
            people: this.state.people.concat(person),
            items: this.state.items,
            status: this.state.status,
            selectedPeople: this.state.selectedPeople,
            errorMessage: ""
        })
    },
    addBlock: function() {
        var newPeople = this.state.people
        var block = ["Carrina", "Nicole", "Rica", "Shaina", "Shangnon", "vovoon"]
        for (var index in block) {
            var person = { "name": block[index], "subtotal": 0, "total": 0 }
            newPeople.push(person)
        } 
        console.log(newPeople)
        this.setState({
            people: newPeople,
            items: this.state.items,
            status: this.state.status,
            selectedPeople: this.state.selectedPeople,
        })
    },
    editPerson: function(oldName, newName) {
        var person = { "name": newName, "subtotal": 0, "total": 0 }
        //index = this.state.people.indexOf(oldName)
        console.log(this.state.people)
        var index = this.state.people.findIndex(person => person.name === oldName)
        console.log("Found " + oldName + " at index " + index + ". New people is now")
        var newPeople = this.state.people
        newPeople[index] = person
        console.log(newPeople)
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
            selectedPeople: [],
            errorMessage: ""
        })
        //console.log(updatedItems)
    },
    switchToItems: function() {
        this.setState({
            people: this.state.people,
            items: this.state.items,
            status: "items",
            selectedPeople: this.state.selectedPeople
        })
    },
    selectAllPeople: function() {
        var toSelect = [];
        for (var personIndex in this.state.people) {
            toSelect.push(this.state.people[personIndex].name)
        }

        this.setState({
            people: this.state.people,
            items: this.state.items,
            status: this.state.status,
            selectedPeople: toSelect
        })
    },
    togglePerson: function(name) {
        if (this.state.selectedPeople.indexOf(name) > -1) {
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
            this.setState({
                people: this.state.people,
                items: this.state.items,
                status: this.state.status,
                selectedPeople: this.state.selectedPeople.concat(name)
            })
        }
    },
    calculateTotals: function(tip, tax) {
        var personTotals = {}

        var subtotal = 0.0;
        for (var itemName in this.state.items) {
            if (this.state.items.hasOwnProperty(itemName)) {
                subtotal += this.state.items[itemName].price
            }
        }

        for (var personIndex in this.state.people) {
            var person = this.state.people[personIndex]
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
            var percentOfSubtotal = person.subtotal / subtotal
            var shareOfTax = percentOfSubtotal * tax
            totalSum = (totalSum * tip) + shareOfTax
            var total = totalSum.toFixed(2)
            personTotals[person.name] = total
        }
        /* end for loop */

        var oldPeople = this.state.people
        for (var personIndex in this.state.people) {
            var person = this.state.people[personIndex]
            var newPerson = { "name": person.name, "subtotal": person.subtotal, "total": personTotals[person.name] }
            oldPeople[personIndex] = newPerson
        }

        this.setState({
            people: oldPeople,
            items: this.state.items,
            status: "total",
            selectedPeople: this.state.selectedPeople
        })
    },
    doneWithItems: function(event) {
        console.log("Done with items")
        if (Object.keys(this.state.items).length < 1) {
            var err = "You must add at least one item"
            this.setState({
                people: this.state.people,
                items: this.state.items,
                status: this.state.status,
                selectedPeople: this.state.selectedPeople,
                errorMessage: err
            })
            return
        }

        var personSubtotals = {}

        for (var personIndex in this.state.people) {
            var person = this.state.people[personIndex]
            var sum = 0.0;
            for (var item in this.state.items) {
                if (this.state.items.hasOwnProperty(item)) {
                    if (this.state.items[item].people.indexOf(person.name) >= 0) {
                        //console.log("adding to sum for item " + item + " for person " + person.name)
                        var itemPrice = this.state.items[item].price
                        var numPeople = this.state.items[item].people.length
                        var perItemPrice = parseFloat(itemPrice/numPeople)
                        sum += perItemPrice
                    }
                }
            }
            var subtotal = sum.toFixed(2)
            personSubtotals[person.name] = subtotal
        }
        /* end for loop */

        var oldPeople = this.state.people
        for (var personIndex in this.state.people) {
            var person = this.state.people[personIndex]
            var newPerson = { "name": person.name, "subtotal": personSubtotals[person.name], "total": person.total }
            oldPeople[personIndex] = newPerson
        }

        this.setState({
            people: oldPeople,
            items: this.state.items,
            status: "subtotal",
            selectedPeople: this.state.selectedPeople
        })
    }
})

ReactDOM.render(<App />, document.getElementById('entry-point'))