import React from 'react';
import {render} from 'react-dom';
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
            subtotal: 0.0,
            loadedSavedData: false,
        }
    }

    render() {
        if (this.state.status === "people") {
            return (
                <section>
                    <div className="section" id="people-section">
                        <div className="top-spacing-small">Easily split bills between friends.</div>
                        { this.renderLoadSavedState() }
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
                        <ItemListComponent items={ this.state.items } removeItem={this.removeItem} numPeople={ this.state.people.length }/>
                    </div>
                    <p className="error-message">{ this.state.errorMessage }</p>
                    <button type="button" ref="done-button" className="accent-button" onClick={ this.switchPage.bind(this, "subtotal") }>Calculate Split &rsaquo;</button>
                    <div className="clickable right-clickable" onClick={ this.addSampleItems }>Sample Items</div>
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

    renderLoadSavedState = () => {
        if (localStorage.getItem("AppComponent")) {
            return (
                <div className="clickable top-spacing-small" onClick={ this.loadSavedState }>Load Previous Session</div>
            )
        }
    }

    componentDidMount = () => {
        window.addEventListener("beforeunload", this.onUnload)
    }
 
    componentWillUnmount = () => {
         window.removeEventListener("beforeunload", this.onUnload)
    }

    onUnload = () => {
        if (this.state.people.length > 0) {
            console.log("AppComponent detected back/refresh, saving: ", this.state);
            localStorage.setItem("AppComponent", JSON.stringify(this.state));
        }
    }

    loadSavedState = () => {
        if (localStorage.getItem("AppComponent")) {
            console.log("loaded", JSON.parse(localStorage.getItem("AppComponent")));
            this.setState(JSON.parse(localStorage.getItem("AppComponent")));
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
                people: [person].concat(this.state.people),
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
        newPeople[id].name = newName
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
        updatedItems[item.id] = {
            name: item.name,
            price: item.price,
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

    removeItem = (itemId) => {
        if (itemId) {
            var newItems = this.state.items;
            delete newItems[itemId];
            console.log(newItems)
            this.setState({
                items: newItems
            })
        }
    }

    calculateTotals = (tip, taxAndFees, tipUnits) => {
        var subtotal = Object.values(this.state.items).reduce(function(a, b) {
            return { price: a.price + b.price };
        }).price;

        var people = this.state.people.map((person) => {
            var percentOfSubtotal = person.subtotal / subtotal;
            var shareOfTax = percentOfSubtotal * taxAndFees;
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