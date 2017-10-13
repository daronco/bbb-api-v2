const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');

const schema = require('./schema');
const database = require('./lib/database');
const routes = require('./lib/routes');

const PORT = 4000;

database.connect((err, _) => {
  var app = express();
  app.use('/graphql', bodyParser.json(), graphqlExpress({schema}));
  app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql',
  }));
  app.get('/bigbluebutton/api/enter', routes.enter);
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}.`);
  });

  // database.close();
});
