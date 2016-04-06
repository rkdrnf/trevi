var placeModal = angular.module('place.modal', ['ui.bootstrap', 'comment.form']);
placeModal.factory('PlaceModalOpener', ['$uibModal', function($uibModal) {
	return function(place_id) {
		$uibModal.open({
			templateUrl: 'placeModal.html',
			controller: 'PlaceModalController',
			resolve: {
				place_id: function() {
					return place_id;
				} }
		});
	};
}]);
placeModal.controller('PlaceModalController', function($scope, $rootScope, $http, $timeout, $uibModalInstance, place_id) {

	$scope.close = function(){
		$uibModalInstance.close($scope.place);
	};

	$scope.makeSlick = function() {
		$timeout(function() {
			$('.photos-block').slick({
				infinite: false,
				slidesToShow: 3,
				slidesToScroll: 3,
			});
		});
	};

	$scope.formInitData = {
		action: "/comments/create_place_ajax",
		name: "place",
		id: place_id
	};

	var newCommentHandler = $rootScope.$on('newCommentCreated', function(e, data) {
		if (data.comment.place === $scope.place._id)
			$scope.place.comments.push(data.comment);
	});

	$scope.$on('$destroy', newCommentHandler);

	$http.get('/ajax/get_place', {
		params: { place_id: place_id }
	}).then(function(res) {
		$scope.place = res.data.place;
	}, function(err) {
		console.log(err);
		alert(err);
	});
});

