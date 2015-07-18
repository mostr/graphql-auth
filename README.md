## Authentication and authorization in GraphQL 

One approach to authenticate and authorize actions in GraphQL-based servers built using GraphQL reference implementation. 

As for the use case this is simple todo list, nothing fancy.

Thanks to [@charypar](http://twitter.com/charypar) for help and valuable discussion while I was sorting that stuff out.

### Requirements

#### All queries/mutations should be available only to authenticated users

This is done in two steps:

1. Express middleware that rejects request if no `Auth` header is present (or its value is empty string)
2. `resolve` action called by GraphQL is wrapped into kind of guard that authenticates user with token provided and passes this user down to actual action. If user cannot be authenticated (invalid token) request is rejected and action is not invoked.

#### Each action requires user having certain permissions otherwise it will not be executed

This is implemented in actions themselves as this is part of core business-logic. Each action has guard on entry that checks whether user provided is allowed to execute it. Authenticated user is provided as first argument to action, so acion already has everything it needs to make this check.


### Implementation

TODO: describe it shortly


### Try it at home

1. Install stuff with `npm install`
2. Run server with `npm run dev`. It will start server and you should be interested in [http://localhost:3000/api](http://localhost:3000/api) endpoint.
3. Issue any of the following requests to GraphQL endpoint. They need to be `POST` requests with `Content-Type` header set to `application/graphql`. 
4. All requests must have `Auth` header with token value of the user you are executing this request as. For the list of users and their tokens see [server/graphql/auth.js](server/graphql/auth.js) file

#### Get todo items on list

The following query will return list of all not yet completed items. It requires authenticated user (as mentioned above) with `read` role, otherwise it will return an error. Try it with different users and see how it works.

```
{
  items {
	id,
	title,
	completed
  }
}
```

You may add query param as `items(includeCompleted: true)` to include completed items too.

#### Mark item as completed

This one marks item with given ID (see [server/graphql/store.js](server/graphql/store.js) file) as completed. It requires authenticated user to with `write` role, otherwise it will return an error as well. 

```
mutation completeItem {
  markItemAsCompleted(id: 2) {
	id,
	title,
	completed
  }
}
```

#### Add new item

This one adds new item and also requires authenticated userwith `write` role.

```
mutation addItemToList {
  addItem(title: "take some sleep") {
	id,
	title,
	completed
  }
}
```