/* globals local_data */
(function() {
	var restaurantsModule = angular.module("regions.restaurants.index", []);

	restaurantsModule.controller("restaurantsCtrl", function($scope, $http) {
		$http.get('/ajax/get_restaurants', {
			params: { region_id: local_data.region_id}
		}).then(function (res) {
			console.log(res);
			$scope.restaurants = res.data.restaurants;
		}, function(err) {
			console.log(err);
			alert(err);
		});
	}); 
})();
