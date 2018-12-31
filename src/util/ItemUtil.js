class ItemUtil {
    constructor() {

    }

    /**
     * Returns true if item with same name exists, otherwise returns false
     * @param {*} items 
     * @param {*} itemName 
     */
    hasItemWithName(items, itemName) {
        for (let i = 0; i < items.length; i++) {
            if (items[i].name === itemName) {
                return true;
            }
        }
        return false;
    }

    /**
     * Returns first instance of item with the same name, otherwise null
     * @param {*} items 
     * @param {*} itemName 
     */
    getItemWithName(items, itemName) {
        for (let i = 0; i < items.length; i++) {
            if (items[i].name === itemName) {
                return items[i];
            }
        }
        return null;
    }

    hasItemWithId(items, itemId) {
        for (let i = 0; i < items.length; i++) {
            if (items[i].id === itemId) {
                return true;
            }
        }
        return false;
    }

    getItemWithId(items, itemId) {
        for (let i = 0; i < items.length; i++) {
            if (items[i].id === itemId) {
                return items[i];
            }
        }
        return null;
    }

    addItem(items, item) {
        items.push(item);
        return items;
    }
}

export default ItemUtil;