var placeModal = angular.module('place.modal', ['ui.bootstrap', 'comment.form']);
placeModal.factory('PlaceModalOpener', ['$uibModal', function($uibModal) {
	return function(place) {
		$uibModal.open({
			templateUrl: 'placeModal.html',
			controller: 'PlaceModalController',
			resolve: {
				place: function() {
					return place;
				} }
		});
	};
}]);
placeModal.controller('PlaceModalController', function($scope, $http, $timeout, $uibModalInstance, CommentFormInitializer, place) {
	$scope.place = place;

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

	CommentFormInitializer.initialize("/comments/create_place_ajax", "place", $scope.place);

	$http({
		method: 'GET',
		url: '/ajax/get_place_comments',
		data: $.param({ place: $scope.place._id }),
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
	}).then(function(res) {
		if (res.data.error) {
			alert(res.data.error);
			return;
		} 

		$scope.comments = res.data.comments;
		console.log(res.data.comments);
	}, function(err) {
		console.log(err);
	});
});

