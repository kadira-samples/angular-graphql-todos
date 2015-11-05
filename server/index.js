import Schema from './schema';
import { graphql } from 'graphql';
import bodyParser from 'body-parser';
import express from 'express';

const {
  PORT = "3000"
} = process.env;

const app = express();
app.use(express.static('public'));
app.use(bodyParser.json());
app.post('/graphql', (req, res) => {
  const {query, vars} = req.body;
  graphql(Schema, query, null, vars).then(result => {
    res.send(result);
  });
});


app.listen(PORT, (err, result) => {
  if(err) {
    throw err;
  }
  console.log(`Listening at localhost:${PORT}`);
});
