/* globals tinymce */
$(function() {
	'use strict';

	tinymce.init({ 
		selector: '.tinymce',
		elementpath: false,
		plugins: [
			'advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker',
			'searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking',
			'save table contextmenu directionality emoticons template paste textcolor'
		],
		inline: true,
		fixed_toolbar_container: ".tinymce-toolbar",
		toolbar: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | print preview media fullpage | forecolor backcolor emoticons',
		file_browser_callback: function(field_name, url, type) {
			if(type=='image') {
				var $input = $('#singleImageInput');
				$input.data('target_field', field_name);
				$('.tinymce-single-image-input').click();
			}
		},
		file_browser_callback_types: 'image',
		init_instance_callback: function () { tinymce.activeEditor.focus();
		},
		setup: function (editor) {
			editor.on('blur', function (e) {
				e.stopImmediatePropagation();
				e.preventDefault();
			});
		},
	});

	$(document).on('change', '#allFileInput', function() {
		$('#fileupload').fileupload('add', {
			fileInput: $(this) });
	});

	$(document).on('change', '#singleImageInput', function() {
		var self = $(this);
		$('#fileupload').fileupload('add', {
			fileInput: $(this),
			doneCallback: function(url) {
				var selector = self.data('target_field');
				$('#' + selector).val(url);
			}
		});
	});

	var url = '/uploads';

	$('#fileupload').fileupload({
		url: url,
		dataType: 'json',
		autoUpload: true,
		acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
		maxFileSize: 999000,
		// Enable image resizing, except for Android and Opera,
		// which actually support image resizing, but fail to
		// send Blob objects via XHR requests:
		disableImageResize: /Android(?!.*Chrome)|Opera/
		.test(window.navigator.userAgent),
		previewMaxWidth: 100,
		previewMaxHeight: 100,
		previewCrop: true,
		previewCanvas: false,
		disableImagePreview: true
	}).on('fileuploadadd', function (e, data) {
		data.context = [];
		$.each(data.files, function (index, file) {
			var node = $('<div class="upload-node"/>');
			node.data(file);
			node.appendTo('#files');
			data.context.push(node);
		});
	}).on('fileuploadprocessalways', function (e, data) {
		var index = data.index;
		var	file = data.files[index];
		var node = data.context[index];

		if (file.error) {
			node .append('<br>')
			.append($('<span class="text-danger"/>').text(file.error));
		}
	}).on('fileuploaddone', function (e, data) {
		console.log(data.result);
		$.each(data.result, function (index, file) {
			var node = data.context[index];
			if (file.original) {
				node.append('<img class="preview" src="' + file.original.path + '" />');

				var link = $('<a>')
				.attr('target', '_blank')
				.prop('href', file.original.path);

				node.wrap(link);

				if (data.doneCallback) {
					data.doneCallback(file.original.path);
				}

				addImageId(file.id);
			} else if (file.error) {
				var error = $('<span class="text-danger"/>').text(file.error);
				node
				.append('<br>')
				.append(error);
			}
		});
	}).on('fileuploadfail', function (e, data) {
		$.each(data.files, function (index) {
			var error = $('<span class="text-danger"/>').text('File upload failed.');
			$(data.context.children()[index])
			.append('<br>')
			.append(error);
		});
	}).prop('disabled', !$.support.fileInput)
	.parent().addClass($.support.fileInput ? undefined : 'disabled');

	function addImageId(id) {
		var ids = $('#imageIds').val().split(';');
		ids = ids.map(function(id) { return id.trim(); }).filter(function(id) { return id.length > 0; });
		ids.push(id);

		$('#imageIds').val(ids.join(';'));
	}

	
	$('.tag-select').makeTagSelector();

	$('input[type="text"]').keydown(function(e) {
		if (e.keyCode == 13)
			{
				e.preventDefault();
				$(this).trigger("enterKey");
			}
	});
});

(function() {
	var newArticle = angular.module('articles.new', []);
	newArticle.controller('newArticleCtrl', function($scope, $http, $window) {

		$scope.regionSelector = null;
$scope.regionSelectorData = {
			selected: []
		};

		$scope.boardData = {
			selected: undefined
		};

		$http.get('/ajax/regions_boards_data')
		.then(function(res) {

			$scope.regions = res.data.regions;
			$scope.boards = res.data.boards;

			$scope.regionSelectorData.selected = $scope.regions.filter(function(region) { return $window.local_data.regions.find(function(r) { return r === region._id; }); });

			$scope.setAvailableBoards();
			$scope.boardData.selected = $scope.availableBoards.find(function(board) { return board._id === $window.local_data.board; });

		}, function(err) {
			console.log(err);
			alert(err);
		});

		$scope.initRegionSelect = function() {
			$scope.regionSelector = $('.region-select').makeRegionSelector({
				regions: $scope.regions,
				data: $scope.regionSelectorData,
				onAddRegion: function() {
					$scope.setAvailableBoards();
					$scope.$apply();
				}
			});
		};

		$scope.getRegionsValue = function(selected) {
			return selected.map(function(region) { return region._id; }).join(';');
		};

		$scope.removeSelectedRegion = function(region) {
			var selected = $scope.regionSelectorData.selected;
			var index = selected.findIndex(function(r) { return r._id === region._id; });
			if (index === -1 ) return;

			selected.splice(index, 1);
			$scope.setAvailableBoards();
		};

		$scope.setAvailableBoards = function() {
			if ($scope.regionSelectorData.selected.length === 0) {
				var noRegion = {
					_id: -1,
					name: "지역을 먼저 선택해주세요."
				};
				$scope.availableBoards = [noRegion];
			} else {
				$scope.availableBoards = $scope.boards.filter(function(board) {
					var included = true;
					$scope.regionSelectorData.selected.forEach(function(region) {
						if (!region.boards.find(function(b) {
							return b === board._id; }))
							included = false;
					});
					return included;
				});
			}
		
			if ($scope.availableBoards.indexOf($scope.boardData.selected) === -1) {
				$scope.boardData.selected = $scope.availableBoards[0];
			}
		};
	});
})();
