var commentForm = angular.module('comment.form', []);

commentForm.controller('CommentFormController', function($scope, $rootScope, $http) {
	$scope.formData = {};
	
	$scope.processForm = function() {
		$http({
			method  : 'POST',
			url     : submitOptions.action,
			data    : $.param($scope.formData),  
			headers : { 'Content-Type': 'application/x-www-form-urlencoded' } 
		}).then(function(res) {
			var data = res.data;

			if (data.error) {
				alert(data.error);
				return;
			}

			$rootScope.$emit('newCommentCreated', { comment: data.newComment });
		}, function(error) {
			console.log(error);
		});
	};

	var submitOptions = {};

	$scope.initialize = function(data) {
		submitOptions.action = data.action;
		$scope.formData[data.name] = data.id;
	};
});
