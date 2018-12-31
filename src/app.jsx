import React from 'react';
import {findDOMNode, render} from 'react-dom';
import AddPersonComponent from './AddPerson.jsx';
import ItemListComponent from './ItemList.jsx';
import AddItemComponent from './AddItem.jsx';
import PersonListComponment from './PersonList.jsx';
import SplitComponent from './Split.jsx';

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            people: [],
            items: {},
            idCounter: 0,
            addedBlock: false,
            status: "people",
            selectedPeople: [],
            tax: 0.0,
            errorMessage: "",
            subtotal: 0.0
        }
    }

    render() {
        if (this.state.status === "people") {
            return (
                <section>
                    <div className="section" id="people-section">
                        <h3>People</h3>
                        <AddPersonComponent onAdd={ this.addPerson } addBlock={ this.addBlock.bind(this) }/>
                        <PersonListComponment handleNameChange={ this.handleNameChange } editPerson={ this.editPerson } deletePerson={ this.deletePerson } people={ this.state.people } />
                    </div>
                    <p className="error-message">{ this.state.errorMessage }</p>
                    <button type="button" ref="done-button" className="accent-button" onClick={ this.switchPage.bind(this, "items") }>Add Items to the Bill  &rsaquo;</button>
                    <div className="vertical-space"></div>
                </section>
            )
        }
        else if (this.state.status === "items") {
            return (
                <section>
                    <button onClick={ this.switchPage.bind(this, "people") }>&lsaquo; Edit People</button>
                    <div className="section" id="item-section">
                        <h3>Add Items to Bill</h3>
                        <AddItemComponent addItem={ this.addItem } selectEveryone={ this.selectAllPeople } selectedPeople={ this.state.selectedPeople } people={ this.state.people } togglePerson={ this.togglePerson }/>
                    </div>
                    <div className="section">
                        <h3>Items on the Bill ({Object.keys(this.state.items).length})</h3>
                        <div>Subtotal: ${ this.state.subtotal.toFixed(2) }</div>
                        <ItemListComponent items={ this.state.items } removeItem={this.removeItem}/>
                    </div>
                    <p className="error-message">{ this.state.errorMessage }</p>
                    <button type="button" ref="done-button" className="accent-button" onClick={ this.switchPage.bind(this, "subtotal") }>Calculate Split &rsaquo;</button>
                    {/* <div className="clickable right-clickable" onClick={ this.addSampleItems }>Sample Items</div> */}
                    <div className="vertical-space"></div>
                </section>
            )
        }
        else if (this.state.status === "subtotal" || this.state.status === "total") {
            return (
                <section>
                    <button onClick={ this.switchPage.bind(this, "people") }>&laquo; Edit People</button>
                    <button onClick={ this.switchPage.bind(this, "items") }>&lsaquo; Edit Items</button>
                    <SplitComponent people={ this.state.people } items={ this.state.items } calculateTotals={ this.calculateTotals } status={ this.state.status }/>
                    <div className="vertical-space"></div>
                </section>
            )
        }
    }

    addPerson = (name) => {
        var personExists = this.state.people.findIndex(person => person.name === name)
        if (personExists > -1) {
            this.setState({
                errorMessage: "Not adding duplicate person"
            })
        }
        else {
            var person = { "name": name, "id": this.state.idCounter, "subtotal": 0, "total": 0 }
            this.setState({
                people: this.state.people.concat(person),
                errorMessage: "",
                idCounter: this.state.idCounter + 1
            })
        }
    }

    addBlock = () => {
        if (this.state.addedBlock) {
            return
        } else {
           this.setState({
               addedBlock: true
           })
        }
        var block = ["Carrina", "Nicole", "Rica", "Shaina", "Shangnon", "vovoon"].map((name, i) => {
            return { "name": name, "id": this.state.idCounter + i, "subtotal": 0, "total": 0 };
        });
        console.log("block people", block)
        this.setState({
            people: this.state.people.concat(block),
            idCounter: this.state.idCounter + block.length
        })
    }

    addSampleItems = () => {
        if (this.state.addedBlock) {
            var item1 = {
                name: "apple",
                id: 0,
                price: 2,
                people: this.state.people.map((person) => {return person.name}),
            }
            var item2 = {
                name: "orange",
                id: 1,
                price: 10,
                people: this.state.people.map((person) => {return person.name}),
            }
            let newItems = this.state.items;
            newItems[item1.name] = item1;
            newItems[item2.name] = item2;
            this.setState({
                items: newItems,
                subtotal: this.getBillSubtotal(),
            })
        }
    }

    editPerson = (newName, id) => {
        var newPeople = this.state.people
        console.log("new name: ", newName, " for ", newPeople[id])
        newPeople[id].name = newName
        console.log(newPeople)
        this.setState({
            people: newPeople,
        })
    }

    deletePerson = (id) => {
        var personIndex = this.state.people.findIndex(person => person.id === id);
        var newPeople = this.state.people;
        if (personIndex > -1) {
            newPeople.splice(personIndex, 1);
        }
        this.setState({
            people: newPeople,
        })
    }

    handleNameChange = (newName) => {
        console.log("name change 2", newName);
    }

    addItem = (item) => {
        var updatedItems = this.state.items
        updatedItems[item.name] = {
            price: item.price,
            id: item.id,
            people: this.state.selectedPeople
        }
        this.setState({
            items: updatedItems,
            selectedPeople: [],
            errorMessage: "",
            subtotal: this.getBillSubtotal()
        })
    }

    getBillSubtotal = () => {
        var sum = Object.values(this.state.items).reduce(function(a, b) {
            return { price: a.price + b.price };
        }).price;
        console.log("subtotal", sum);
        return sum;
    }

    selectAllPeople = (all) => {
        var toSelect = [];

        if (all) {
            for (var personIndex in this.state.people) {
                toSelect.push(this.state.people[personIndex].name)
            }
        }

        this.setState({
            selectedPeople: toSelect
        })
    }

    togglePerson = (name) => {
        if (this.state.selectedPeople.indexOf(name) > -1) {
            this.setState({
                selectedPeople: this.state.selectedPeople.filter(function(existingName) {
                    // remove existingName from list of selectedPeople
                    return existingName !== name
                })
            })
        }
        else if (this.state.selectedPeople.indexOf(name) == -1 ) {
            this.setState({
                selectedPeople: this.state.selectedPeople.concat(name)
            })
        }
    }

    removeItem = (itemName) => {
        console.log("removing: ", itemName);
        if (itemName) {
            var newItems = this.state.items;
            delete newItems[itemName];
            console.log(newItems)
            this.setState({
                items: newItems
            })
        }
    }

    calculateTotals = (tip, tax, tipUnits) => {
        var subtotal = Object.values(this.state.items).reduce(function(a, b) {
            return { price: a.price + b.price };
        }).price;

        var people = this.state.people.map((person) => {
            var percentOfSubtotal = person.subtotal / subtotal;
            var shareOfTax = percentOfSubtotal * tax;
            var totalSum = 0.0;
            if (tipUnits === '%') {
                totalSum = (person.subtotal * (tip + 1)) + shareOfTax;
            }
            else if (tipUnits === '$') {
                totalSum = person.subtotal + (tip * percentOfSubtotal) + shareOfTax;
            }
            person.total = totalSum;
            return person;
        });

        this.setState({
            people: people,
            status: "total",
            subtotal: this.getBillSubtotal()
        })
    }

    switchPage = (page) => {
        // console.log("switch to", page);
        if (page === "items") {
            if (this.state.people < 1) {
                this.setState({
                    errorMessage: "You must add at least one person first"
                })
                return;
            }
        }
        else if (page === "subtotal") {
            if (Object.keys(this.state.items).length < 1) {
                this.setState({
                    errorMessage: "You must add at least one item first"
                })
                return;
            }
            else {
                this.doneWithItems();
            }
        }
        // console.log("allowed to switch page")
        this.setState({
            status: page
        })
    }
    doneWithItems = () => {
        var personSubtotals = {}

        for (var personIndex in this.state.people) {
            var person = this.state.people[personIndex]
            var subtotalSum = 0.0;
            for (var item in this.state.items) {
                if (this.state.items.hasOwnProperty(item)) {
                    if (this.state.items[item].people.indexOf(person.name) >= 0) {
                        //console.log("adding to sum for item " + item + " for person " + person.name)
                        var itemPrice = this.state.items[item].price
                        var numPeople = this.state.items[item].people.length
                        var perItemPrice = parseFloat(itemPrice/numPeople)
                        subtotalSum += perItemPrice
                    }
                }
            }
            personSubtotals[person.name] = subtotalSum
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
            status: "subtotal",
        })
    }

}

render(<App />, document.getElementById('entry-point'))