'use strict';

var app = angular.module('myApp');


/*app.service('Users', function($http, $rootScope, $cookies, $state, $q, TOKENNAME){
  this.getAll = () =>{
    return $http.get('/api/users');
  }
})*/
app.service('WallPost', function($http, $q) {
  
  this.addWallPost = (post) =>{
    console.log("add post in servies: ", post);
    return $http.post(`/api/wallposts`, post)
      .then(res => {
        return $q.resolve(res.data);
      })
      .catch(err => {   
        console.log('err:', err);
      })
    };
});

app.service('User', function($http, $q) {

  this.profile = () => {
    return $http.get('/api/users/profile')
      .then(res => {
        return $q.resolve(res.data);
      });
  };

  this.getProfile = (id) =>{
     return $http.get(`/api/users/profile/${id}`)
    .then(res => {
        return $q.resolve(res.data);
    })
    .catch(err =>{
      console.log("err:", err);
    });
  }

  this.getAll = () =>{
    return $http.get('/api/users');
  }

  this.updateProfile = (id, profileObj) =>{
    console.log("here");
    console.log(id , " " ,profileObj);
    return $http.put(`/api/users/profile/${id}`,  profileObj)
    .then(res => {
        console.log("res.data", res.data);
        console.log("profileObj", profileObj);

        return $q.resolve();
    })
    .catch(err =>{
      console.log("err:", err);
    });
  }

  this.addStock = (user, stock) =>{
    console.log("put to id:", user._id);
    return $http.put(`/api/users/profile/${user._id}/addStock`,  stock)
    .then(res => {
         console.log("res.data:", res.data);
        return $q.resolve();
    })
    .catch(err =>{
      console.log("err:", err);
    });
  }

  this.deleteAccount = (id) =>{
    return $http.delete(`/api/users/profile/${id}`)
    .then(res => {
        return $q.resolve();
    })
    .catch(err =>{
      console.log("err:", err);
    });
  }

  this.addWallPostToUser = (userId, postId) =>{
    console.log("userId: ",userId ," postId: ", postId)
    return $http.put(`/api/users/profile/${userId}/addWallPost/${postId}`)
    .then(res => {
        return $q.resolve(res.data);
    })
    .catch(err => {   
        console.log('err:', err);
    })
  }; 

});
