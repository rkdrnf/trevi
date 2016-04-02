var commentForm = angular.module('comment.form', []);

commentForm.config(['$httpProvider', function ($httpProvider) {
  //Reset headers to avoid OPTIONS request (aka preflight)
  $httpProvider.defaults.headers.common = {};
  $httpProvider.defaults.headers.post = {};
  $httpProvider.defaults.headers.put = {};
  $httpProvider.defaults.headers.patch = {};
}]);

commentForm.controller('CommentFormController', function($scope, $rootScope, $http, CommentFormInitializer) {
	$scope.formData = {};
	
	$scope.processForm = function() {
		$http({
			method  : 'POST',
			url     : $scope.action,
			data    : $.param($scope.formData),  
			headers : { 'Content-Type': 'application/x-www-form-urlencoded' } 
		}).then(function(res) {
			var data = res.data;

			if (data.error) {
				alert(data.error);
			}

			$rootScope.emit('newCommentCreated', { comment: data.newComment });
		}, function(error) {
			console.log(error);
		});
	};

	var data = CommentFormInitializer.getData();
	
	$scope.action = data.action;
	$scope.name = data.name;
	$scope.model = data.model;

	$scope.formData[$scope.name] = $scope.model._id;
});

commentForm.service('CommentFormInitializer', function() {
	var data = {};

	this.initialize = function(actionVal, nameVal, modelVal) {
		data.action = actionVal;	
		data.name = nameVal;
		data.model = modelVal;
	};

	this.getData = function() {
		return data;
	};

});
