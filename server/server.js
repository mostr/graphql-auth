import express from 'express';
import defineRoutes from './routes';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.text({type: 'application/graphql'}));

defineRoutes(app);

const port = 3000;
const server = app.listen(port, () => {
  console.log(`Started at http://localhost:${port}`);
});