/* globals local_data */
(function() {
	var restaurantsModule = angular.module("regions.restaurants.index", []);

	restaurantsModule.controller("restaurantsCtrl", function($scope, $http) {
		$scope.filter = {};
		$scope.filter.categories = {
			restaurant: { name: '음식점', innerVal: ['음식점'] },
			dessert: { name: '디저트', innerVal: ['디저트'] },
			cafe: { name: '차/카페', innerVal: ['찻집', '카페']},
			bar: { name: '바/술집', innerVal: ['바', '술집']}
		};

		$scope.filter.prices = {
			low: { name: '저렴한', innerVal: 'low' },
			middle: { name: '보통', innerVal: 'middle' },
			high: { name: '고급', innerVal: 'high' }
		};
		
		$http.get('/ajax/get_restaurants', {
			params: { region_id: local_data.region_id }
		}).then(function (res) {
			console.log(res);
			$scope.restaurants = res.data.restaurants;
		}, function(err) {
			console.log(err);
			alert(err);
		});

		$scope.onChangeCategory = function() {
			$scope.loadRestaurants($scope.filter);
		};

		$scope.onChangePrice = function() {
			$scope.loadRestaurants($scope.filter);
		};

		$scope.loadRestaurants = function(filter) {
			var categoriesArr = filter.categories.filter(function(category) { return category.checked; }).map(function(category) { return category.innerVal; });

			var categories = [];
			categoriesArr.forEach(function(cats) {
				categories = categories.concat(cats);
			});

			var prices = filter.prices.filter(function(price) { return price.checked; }).map(function(price) { return price.innerVal; });

			$http.get('/ajax/get_restaurants', {
				params: { region_id: local_data.region_id, categories: categories, prices: prices }
			}).then(function (res) {
				console.log(res);
				$scope.restaurants = res.data.restaurants;
			}, function(err) {
				console.log(err);
				alert(err);
			});
		};

	}); 
})();
