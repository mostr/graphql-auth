## Authentication and authorization in GraphQL-based apps 

One approach to authenticate and authorize actions in GraphQL-based servers built using GraphQL reference implementation. 

___GraphQL itself is authentication/authorization-agnostic, you can use anything you want to do this auth-part of your app. This repo just demonstrates how to work with already authenticated users on GraphQL-level operations___

As for the use case this is simple todo list, nothing fancy.

Thanks to [@charypar](http://twitter.com/charypar) for help and valuable discussion while I was sorting that stuff out.

### Requirements

#### All queries/mutations should be available only to authenticated users

This is done in two steps:

1. Express middlewares that reject request if no `Auth` header is present (or its value is empty string) or authenticate user with provided token.
2. GraphQL is called with 3rd parameter - context, that contains authenticated user. It is then passed down to actions to authorize user provided.

#### Each action requires user having certain permissions otherwise it will not be executed

This is implemented in actions themselves as this is part of core business-logic. Each action has guard on entry that checks whether user provided is allowed to execute it. Authenticated user is provided as first argument to action, so action already has everything it needs to make this check.


### Implementation

`graphql` entry point usually takes two params: schema definition and query to execute. There is third parameter, I call it context that seems to be user-defined thing that is being passed down to all GraphQL operations (including `resolve` functions). 
This `context` param is populated with authenticated user instance, passed to `graphql` function and then passed down to action functions. It allows actions themselves to decide whether given user is allowed to execute them or not. If user is not allowed (has no roles required), error is thrown. 

In the real world it could be promise-based flow, but here it just throws Error to keep things simple. This error is intercepted by GraphQL internals and returned to called as regular GraphQL error (as stated in spec).


The only thing I'm worried about is that reference implementation returns promise that is always resolved, no matter if query was executed successfully or error was thrown. Also potential errors are returned as string messages only. These two things make it quite hard to distinct different types of errors and react accordingly (e.g. by returning correct HTTP status).


### Try it at home

1. Install stuff with `npm install`
2. Run server with `npm run dev`. It will start server and you should be interested in [http://localhost:3000/api](http://localhost:3000/api) endpoint.
3. Issue any of the following requests to GraphQL endpoint. They need to be `POST` requests with `Content-Type` header set to `application/graphql`. 
4. All requests must have `Auth` header with token value of the user you are executing this request as. For the list of users and their tokens see [core/auth.js](core/auth.js) file

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

This one marks item with given ID (see [core/store.js](core/store.js) file) as completed. It requires authenticated user to with `write` role, otherwise it will return an error as well. 

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
