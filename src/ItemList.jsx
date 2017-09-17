import React from 'react';
import {findDOMNode, render} from 'react-dom';

class ItemListComponent extends React.Component {
    render() {
        //console.log(this.props.items)
        return (
            <div>
                <ul>{ Object.keys(this.props.items).map(this.renderItem) }</ul>
            </div>
        )
    }

    renderItem = (item) => { 
        //var perPersonPrice = parseFloat(this.props.items[item].price)
        var itemPrice = this.props.items[item].price;
        var itemPeople = this.props.items[item].people;
        var pricePerPerson = parseFloat(itemPrice/itemPeople.length).toFixed(2);
        return (
            <li id={item} content={item}>
                { item } for ${ itemPrice } <strong>split by</strong> { this.prettyArray(itemPeople) } (for ${ pricePerPerson } per person)
            </li>
        )
    }

    prettyArray(arr) {
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
}

export default ItemListComponent;