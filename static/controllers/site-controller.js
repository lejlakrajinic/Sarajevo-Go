function SiteController($scope, $http){
    console.log("EVO GA");

    get_users();

    $scope.add_user = function(){
        $http.post('/user', $scope.user).then(function(data) {
            $scope.user = null;
            $scope.users_list.push(data);
            //toastr.success('Car added successfully!');
        });
    }

    function get_users(){
        $http.get('/user').then(function(res){
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
          //console.log($scope.car);
          //toastr.info('You have successfully updated car!');
          $scope.car = null;
        });
      }

      $scope.delete_user = function(user_id){
        $http.delete('/user/'+ user_id).then(function(data){
            get_users();
        });
    }
}