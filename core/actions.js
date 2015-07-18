import {Option} from 'giftbox';

import items from './store';
import * as auth from './auth';

const actions = {

  listItems(user, data) {
    auth.haltOnMissingRole(user, 'read');
    const {includeCompleted = false} = data;
    return includeCompleted ? items : items.filter(i => !i.completed)
  },

  markItemAsCompleted(user, itemId) {
    auth.haltOnMissingRole(user, 'write');
    return Option(items.find(i => i.id === itemId))
      .map(i => {
        i.completed = true;
        return i;
      }).getOrElse(() => { throw new Error(`Could not find todo item ${itemId}`) } )
  },

  addItem(user, itemData) {
    auth.haltOnMissingRole(user, 'write');
    const maxId = Math.max(...items.map(i => i.id));
    const newItem = {id: maxId + 1, completed: false, ...itemData};
    items.push(newItem);
    return newItem;
  }

};

export default actions;