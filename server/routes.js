import {graphql} from 'graphql';

import todoSchema from '../graphql/schema';
import {authenticateUser} from  '../core/auth';

function handleRequest(req, res) {
	const context = { user: req.user };
	const query = req.body;
  graphql(todoSchema, query, context).then(handleResponse(res));
}

function handleResponse(res) {
	return (result) => {
		if(result.errors && result.errors.length) {
			const msgs = result.errors.map(e => e.message);
			return sendErrors(res, ...msgs)
		}
		return res.status(200).json(result);
	}
}

export default (app) => {
  app.post('/api', [ensureAuthTokenPresent, ensureUserAuthenticated], handleRequest
  )
};


// auth middlewares and helpers

function ensureAuthTokenPresent(req, res, next) {
	const authToken = req.get('Auth');
	if(authToken && authToken.length) {
		req.authToken = authToken;
		return next();
	}
	return sendErrors(res, 'Auth token not found in request.');
}

function ensureUserAuthenticated(req, res, next) {
	const user = authenticateUser(req.authToken);
	if(user) {
		req.user = user;
		return next();
	}
	return sendErrors(res, 'Could not authenticate user');
}

function sendErrors(res, ...msgs) {
	return res.status(400).json({ errors: msgs });
}

