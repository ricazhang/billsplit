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
            status: "people",
            selectedPeople: [],
            tax: 0.0,
            errorMessage: ""
        }
    }

    render() {
        if (this.state.status === "people") {
            return (
                <section>
                    <div className="section" id="people-section">
                        <h3>People</h3>
                        <AddPersonComponent onAdd={ this.addPerson } addBlock={ this.addBlock }/>
                        <PersonListComponment handleNameChange={ this.handleNameChange } editPerson={ this.editPerson } people={ this.state.people } peopleDone={ this.switchToItems } />
                    </div>
                    <div className="section" id="item-section">
                        <h3>Things on the Bill</h3>
                        <ItemListComponent items={ this.state.items }/>
                        <AddItemComponent addItem={ this.addItem } selectEveryone={ this.selectAllPeople } selectedPeople={ this.state.selectedPeople } people={ this.state.people } togglePerson={ this.togglePerson }/>
                    </div>
                    <p className="error-message">{ this.state.errorMessage }</p>
                    <button type="button" ref="done-button" className="accent-button" onClick={ this.doneWithItems }>Calculate Split</button>
                </section>
            )
        }
        else if (this.state.status === "subtotal" || this.state.status === "total") {
            return (
                <section>
                    <SplitComponent people={ this.state.people } items={ this.state.items } calculateTotals={ this.calculateTotals } status={ this.state.status }/>
                </section>
            )
        }
    }

    addPerson = (name, index) => {
        var personExists = this.state.people.findIndex(person => person.name === name)
        if (personExists > -1) {
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
        var person = { "name": name, "id": index, "subtotal": 0, "total": 0 }
        this.setState({
            people: this.state.people.concat(person),
            items: this.state.items,
            status: this.state.status,
            selectedPeople: this.state.selectedPeople,
            errorMessage: ""
        })
    }

    addBlock = () => {
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
    }

    editPerson = (newName, id) => {
        var newPeople = this.state.people
        console.log("new name: ", newName, " for ", newPeople[id])
        newPeople[id].name = newName
        console.log(newPeople)
        this.setState({
            people: newPeople,
            items: this.state.items,
            status: this.state.status,
            selectedPeople: this.state.selectedPeople
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
            people: this.state.people,
            items: updatedItems,
            status: this.state.status,
            selectedPeople: [],
            errorMessage: ""
        })
        //console.log(updatedItems)
    }

    switchToItems = () => {
        this.setState({
            people: this.state.people,
            items: this.state.items,
            status: "items",
            selectedPeople: this.state.selectedPeople
        })
    }

    selectAllPeople = () => {
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
    }

    togglePerson = (name) => {
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
    }

    calculateTotals = (tip, tax) => {
        var personTotals = {}

        var subtotal = 0.0;
        for (var itemName in this.state.items) {
            if (this.state.items.hasOwnProperty(itemName)) {
                subtotal += parseFloat(this.state.items[itemName].price)
            }
        }
        console.log("subtotal is: " + subtotal)

        for (var personIndex in this.state.people) {
            var person = this.state.people[personIndex]
            var percentOfSubtotal = person.subtotal / subtotal
            var shareOfTax = percentOfSubtotal * tax
            var totalSum = (person.subtotal * tip) + shareOfTax
            var total = totalSum.toFixed(2)
            // console.log(person.name + " percent of subtotal " + percentOfSubtotal)
            // console.log(person.name + " share of tax " + shareOfTax)
            // console.log(person.name + " total sum " + totalSum)
            personTotals[person.name] = total
        }
        /* end for loop */

        console.log(personTotals)

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
    }

    doneWithItems = (event) => {
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

}

render(<App />, document.getElementById('entry-point'))