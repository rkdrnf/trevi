var placeModal = angular.module('place.modal', ['ui.bootstrap']);
	placeModal.factory('PlaceModalOpener', ['$uibModal', function($uibModal) {
		return function(place) {
			$uibModal.open({
				templateUrl: 'placeModal.html',
				controller: 'PlaceModalController',
				resolve: {
					place: function() {
						return place;
					}
				}
			});
		};
	}]);
	placeModal.controller('PlaceModalController', function($scope, $uibModalInstance, place) {
		$scope.place = place;

		$scope.close = function(){
			$uibModalInstance.close($scope.place);
		};
	});

