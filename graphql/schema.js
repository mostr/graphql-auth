import { graphql, GraphQLString, GraphQLInt, GraphQLBoolean } from 'graphql';
import { objectType, schemaFrom, listOf, notNull } from 'graphql-schema';

import actions from '../core/actions';

const todoItemType = objectType('TodoItemType')
  .field('id', notNull(GraphQLInt), 'Task id')
  .field('title', notNull(GraphQLString), 'Task title')
  .field('completed', notNull(GraphQLBoolean), 'Task state')
  .end();

const queryType = objectType('QueryRoot')
  .field('items', listOf(todoItemType))
    .arg('includeCompleted', GraphQLBoolean)
    .resolve((root, data, context) => actions.listItems(context.user, data))
  .end();

const mutationType = objectType('MutationRoot')
  .field('markItemAsCompleted', todoItemType)
    .arg('itemId', notNull(GraphQLInt))
    .resolve((root, {itemId}, context) => actions.markItemAsCompleted(context.user, itemId))
  .field('addItem', todoItemType)
    .arg('title', notNull(GraphQLString))
    .resolve((root, itemData, context) => actions.addItem(context.user, itemData))
  .end();

export default schemaFrom(queryType, mutationType);