import {Option} from 'giftbox';

import * as utils from './utils';
import items from './store';

const actions = {

  listItems(data) {
    const {includeCompleted = false} = data;
    return includeCompleted ? items : items.filter(i => !i.completed)
  },

  markItemAsCompleted(itemId) {
    return Option(items.find(i => i.id === itemId))
      .map(i => {
        i.completed = true
        return i;
      }).getOrElse(utils.signalError(`Could not find todo item ${itemId}`))
  },

  addItem(itemData) {
    const maxId = Math.max(...items.map(i => i.id));
    const newItem = {id: maxId + 1, completed: false, ...itemData};
    items.push(newItem);
    return newItem;
  }

};

export default actions;