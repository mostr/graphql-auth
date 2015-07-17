import { graphql, GraphQLString, GraphQLInt, GraphQLBoolean } from 'graphql';
import { objectType, schemaFrom, listOf, notNull } from 'graphql-schema';

import {doAsAuthenticatedUser} from './auth';
import actions from './actions';

const todoItemType = objectType('TodoItemType')
  .field('id', notNull(GraphQLInt), 'Task id')
  .field('title', notNull(GraphQLString), 'Task title')
  .field('completed', notNull(GraphQLBoolean), 'Task state')
  .end();

const queryType = objectType('QueryRoot')
  .field('items', listOf(todoItemType))
    .arg('includeCompleted', GraphQLBoolean)
    .resolve((root, data, context) => doAsAuthenticatedUser(context.authToken, user => actions.listItems(user, data)))
  .end();

const mutationType = objectType('MutationRoot')
  .field('markItemAsCompleted', todoItemType)
    .arg('itemId', notNull(GraphQLInt))
    .resolve((root, {itemId}, context) => doAsAuthenticatedUser(context.authToken, user => actions.markItemAsCompleted(user, itemId)))
  .field('addItem', todoItemType)
    .arg('title', notNull(GraphQLString))
    .resolve((root, itemData, context) => doAsAuthenticatedUser(context.authToken, user => actions.addItem(user, itemData)))
  .end();

export default schemaFrom(queryType, mutationType);