import {graphql} from 'graphql';

import todoSchema from './graphql/schema';

function handlePost(req, res) {
  graphql(todoSchema, req.body).then((result) => {
    res.send(result);
  });
}

export default (app) => {
  app.post('/api', handlePost)
};