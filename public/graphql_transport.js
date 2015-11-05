/*
  Simple GraphQL transport which send queries to a GraphQL endpoint
*/
function GraphQLTransport(path) {
  this.path = path || "/graphql";
}

GraphQLTransport.prototype.sendQuery = function (query, vars) {
  var self = this;
  vars = vars || {};
  return new Promise(function(resolve, reject) {
    // use fetch to get the result
    fetch(self.path, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query,
        vars
      })
    })
    // get the result as JSON
    .then(function(res) {
      return res.json();
    })
    // trigger result or reject
    .then(function(response) {
      if(response.errors) {
        return reject(response.errors);
      }

      return resolve(response.data);
    })
    .catch(reject);
  });
};
