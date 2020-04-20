import React from 'react';

class ItemListComponent extends React.Component {
    render() {
        return (
            <div>
                <ul>{ Object.keys(this.props.items).slice(0).reverse().map(this.renderItem) }</ul>
            </div>
        )
    }

    renderItem = (itemId) => {
        const itemPrice = this.props.items[itemId].price.toFixed(2);
        const itemPeople = this.props.items[itemId].people;
        const itemName = this.props.items[itemId].name;
        const pricePerPerson = parseFloat(itemPrice/itemPeople.length).toFixed(2);
        return (
            <li id={itemId} key={itemId} content={itemId}>
                { itemName } for ${ itemPrice } <strong>split by</strong> { this.prettyArray(itemPeople, this.props.numPeople ) } (${ pricePerPerson } per person)
                <div className="clickable remove-item" onClick={this.removeItem.bind(this, itemId)}>Remove Item</div>
            </li>
        )
    }

    prettyArray(peopleList, numPeople) {
        var str = ""
        if (peopleList.length < 1) {
            return "no one"
        }
        else if (peopleList.length == 1) {
            return peopleList[0]
        }
        else if (peopleList.length == 2) {
            str = peopleList[0] + " and " + peopleList[1]
            return str
        }
        else if (peopleList.length == numPeople) {
            return "everyone"
        }
        let sortedPeopleList = peopleList.slice(0).sort();
        for (var i in sortedPeopleList) {
            if (i != sortedPeopleList.length - 1) {
                str += sortedPeopleList[i] + ", "
            }
            else {
                str += " and " + sortedPeopleList[i]
            }
        }
        return str
    }

    removeItem(itemId) {
        this.props.removeItem(itemId);
    }
}

export default ItemListComponent;