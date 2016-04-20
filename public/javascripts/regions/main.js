$(function() {
	var mainModule = angular.module('region.main', ['google.map', 'place.modal']);

	mainModule.controller('hotTravelCtrl', function($scope, $http, $window) {
		$http.get('/ajax/hot_travels', {
			params: {
				region: $window.local_data.region._id
			}
		}).then(function(res) {
			$scope.travels = res.data.travels;
			$scope.mainTravel = $scope.travels.length > 0 ? $scope.travels[0] : undefined;
		}, function(err) {
			console.log(err);
			alert(err);
		});

		$scope.onOverSideItem = function(travel) {
			$scope.mainTravel = travel;
		}
	});

	mainModule.controller('hotPhotosCtrl', function($scope, $http, $window) {
		$scope.region = $window.local_data.region
		$http.get('/ajax/hot_photos', {
			params: {
				region: $window.local_data.region._id
			}
		}).then(function(res) {
			$scope.photos = res.data.photos;
		}, function(err) {
			console.log(err);
			alert(err);
		});

	});
});
