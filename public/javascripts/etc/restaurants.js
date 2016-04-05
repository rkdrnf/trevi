(function() {
	angular.module('etc.restaurants', ['ngMaterial'])
	.controller("regionSearchCtrl", function($scope, $http) {
		$scope.getRegions = function(searchText) {
			return $http.get('/ajax/regions_for_search?region_name=' + encodeURIComponent(searchText))
			.then(function(res) {
				return res.data;
			});
		};

		$scope.onChange = function(){
		};
	});
})();
