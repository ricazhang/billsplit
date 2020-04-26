import React from 'react';

class ItemListComponent extends React.Component {
    render() {
        return (
            <div>
                <div>{ Object.keys(this.props.items).slice(0).reverse().map(this.renderItem) }</div>
            </div>
        )
    }

    renderItem = (itemName) => { 
        //var perPersonPrice = parseFloat(this.props.items[item].price)
        var itemPrice = this.props.items[itemName].price.toFixed(2);
        var itemPeople = this.props.items[itemName].people;
        var itemId = this.props.items[itemName].id;
        var pricePerPerson = parseFloat(itemPrice/itemPeople.length).toFixed(2);
        return (
            <div className="item-container" id={itemName} key={itemName + itemPrice} content={itemName}>
                <div className="item-title">
                    <div className="item-name">{ itemName }</div>
                    <div className="item-price">${ itemPrice }</div>
                </div>
                <div className="split-by-subtitle">SPLIT BY</div>
                <div>
                    { this.prettyArray(itemPeople, this.props.numPeople ) }
                </div>
                <div className="item-price-per-person">
                    ${ pricePerPerson } per person
                </div>
                <div className="clickable remove-item" onClick={this.removeItem.bind(this, itemName)}>
                    <svg className="bi bi-trash" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.5 5.5A.5.5 0 016 6v6a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm2.5 0a.5.5 0 01.5.5v6a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm3 .5a.5.5 0 00-1 0v6a.5.5 0 001 0V6z"/>
                        <path fillRule="evenodd" d="M14.5 3a1 1 0 01-1 1H13v9a2 2 0 01-2 2H5a2 2 0 01-2-2V4h-.5a1 1 0 01-1-1V2a1 1 0 011-1H6a1 1 0 011-1h2a1 1 0 011 1h3.5a1 1 0 011 1v1zM4.118 4L4 4.059V13a1 1 0 001 1h6a1 1 0 001-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" clipRule="evenodd"/>
                    </svg>
                </div>
            </div>
        )
    }

    prettyArray(peopleList, numPeople) {
        var str = ""
        if (peopleList.length < 1) {
            return "No one"
        }
        else if (peopleList.length == 1) {
            return peopleList[0]
        }
        else if (peopleList.length == 2) {
            str = peopleList[0] + " and " + peopleList[1]
            return str
        }
        else if (peopleList.length == numPeople) {
            return "Everyone"
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

    removeItem(itemName) {
        this.props.removeItem(itemName);
    }
}

export default ItemListComponent;