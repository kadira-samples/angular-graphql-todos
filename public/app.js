// Here, we use promises to simply the logic
function TodoCtrl($scope) {
  $scope.todos = [];
  var transport = new GraphQLTransport();
  var todosPromise = transport.sendQuery('{items}')
    .then(function(res) {
      return res.items;
    });
  applyTodos(todosPromise);

  $scope.getTotalTodos = function() {
    return $scope.todos.length;
  };

  $scope.addTodo = function() {
    // We add the todo item right away to showcase optimistic updates
    var newItem = $scope.formTodoText
    var simulatedTodos = todosPromise
      .then(function(items) {
        return items.concat(["adding " + newItem + " ..."]);
      });

    applyTodos(simulatedTodos);
    $scope.formTodoText = '';

    // add the actual item
    transport
      // Invoke the GraphQL query, which invoke our `addItem` mutation
      .sendQuery('mutation _ {item: addItem(item: "' + newItem + '")}')
      .then(function(data) {
        return data.item;
      })
      .then(function(item) {
        // if success, we replace the todosPromise by adding the newly added item
        todosPromise = todosPromise.then(function(items) {
          return items.concat([item]);
        });
      }, function(error) {
        // if there is an error, we simply alert it
        alert('Error adding item');
      })
      // delay 600ms to show changes from optimistic updates
      .then(function() {
        return new Promise(function(resolve) {
          setTimeout(resolve, 600);
        })
      })
      .then(function() {
        // finally apply the actual state of the todos
        applyTodos(todosPromise);
      })
  };

  function applyTodos(todosPromise) {
    todosPromise.then(function(items) {
      $scope.todos = [];
      items.forEach(function(item) {
        $scope.todos.push({
          text: item,
          done: false
        });
      });

      $scope.$apply();
    })
  }
}
