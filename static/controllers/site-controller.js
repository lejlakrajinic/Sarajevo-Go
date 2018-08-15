function SiteController($scope, $http, toastr,  $ngConfirm){

    get_users();

/*
    $scope.add_user = function(){
        $http.post('/users', $scope.user).then(function(data) {
            $scope.user = null;
            $scope.users_list.push(data);
            toastr.success("User added successfully")
            get_users();
        });
    }*/

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

    $scope.update_user = function(user_id){
        console.log('1')
        $http.put('/users/'+$scope.user._id, $scope.user).then(function(data){
          get_users();
          $scope.user = null;
        });
      }

      $scope.add_user = function(){
        var confirmAdd = $ngConfirm({
          title: "Add User?",
          contentUrl:'views/modal.html',
          type: 'red',
          typeAnimated: true,
          icon: 'fa fa-warning',
          scope: $scope,
          buttons: {
            yes: {
              text: "Add",
              btnClass: 'btn-red',
              action: function(scope, button){
                $http.post('/users', $scope.user).then(function(data) {
                    $scope.user = null;
                    $scope.users_list.push(data);
                    confirmAdd.close();
                    toastr.success("User added successfully")
                    get_users();
                });
                
                }
              }  
            }
          })
        }

  
    $scope.delete_user = function(user_id, user_name){
        $ngConfirm({
          title: "Delete User?",
          content: "Are you sure you want to delete <strong>" + user_name + "</strong>?",
          type: 'red',
          typeAnimated: true,
          icon: 'fa fa-warning',
          scope: $scope,
          buttons: {
            yes: {
              text: "Yes",
              btnClass: 'btn-red',
              action: function(scope, button){
                $http.delete('/users/'+ user_id).then(function(data){
                  get_users();
                  toastr.success(user_name + ' deleted');
                });
              }  
            },
            close: function(scope, button){
              //Closes Modal
            }
          }
        })
    }
}