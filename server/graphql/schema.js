import { graphql, GraphQLString, GraphQLInt, GraphQLBoolean } from 'graphql';
import { objectType, schemaFrom, listOf, notNull } from 'graphql-schema';

import actions from './actions';

const todoItemType = objectType('TodoItemType')
  .field('id', notNull(GraphQLInt), 'Task id')
  .field('title', notNull(GraphQLString), 'Task title')
  .field('completed', notNull(GraphQLBoolean), 'Task state')
  .end();

const queryType = objectType('QueryRoot')
  .field('items', listOf(todoItemType))
    .arg('includeCompleted', GraphQLBoolean)
    .resolve((root, {includeCompleted}) => actions.listItems(includeCompleted))
  .end();

const mutationType = objectType('MutationRoot')
  .field('markItemAsCompleted', todoItemType)
    .arg('itemId', notNull(GraphQLInt))
    .resolve((root, {itemId})  => actions.markItemAsCompleted(itemId))
  .field('addItem', todoItemType)
    .arg('title', notNull(GraphQLString))
    .resolve((root, itemData) => actions.addItem(itemData))
  .end();

export default schemaFrom(queryType, mutationType);