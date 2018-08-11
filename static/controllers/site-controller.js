function SiteController($scope, $http){

    get_users()

    console.log("Hello from angular contorller!");

    $scope.add_user = function(){
        $http.post('/user', $scope.user).then(function(data) {
            $scope.users_list.push(data);
        });
    }

    function get_users(){
        $http.get('/users').then(function(res){
            $scope.users_list = res.data;
        })
    }

    $scope.edit_user = function(user){
        $scope.user ={
            _id: user._id,
            name: user.name,
            email: user.email,
            password: user.password
        }
    }

    $scope.update_user = function(){
        $http.put('/user/'+$scope.user._id, $scope.user).then(function(data){
          get_users();
          $scope.user = null;
        });
      }

      $scope.delete_user = function(user_id){
        $http.delete('/user/'+ user_id).then(function(data){
            get_users();
        });
    }
}