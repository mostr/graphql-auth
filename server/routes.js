import {graphql} from 'graphql';

import todoSchema from './graphql/schema';

function ensureAuthTokenPresent(req, res, next) {
	const authToken = req.get('Auth');
	if(authToken && authToken.length) {
		req.authToken = authToken;
		return next();
	}
	return res.status(403).json({ error: 'Auth token not found in request' });
}

function handlePost(req, res) {
	const context = { authToken: req.authToken }
	const query = req.body;
  graphql(todoSchema, query, context).then((result) => {
    res.send(result);
  });
}

export default (app) => {
  app.post('/api', ensureAuthTokenPresent, handlePost)
};