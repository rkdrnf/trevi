$(function() {

	var width = 960;
	var height = 1160;

	var projection = d3.geo.mercator()
	.scale(1)
	.translate([0, 0]);

	var path = d3.geo.path()
	.projection(projection);

	var svg = d3.select("body").append("svg")
	.attr("width", width)
	.attr("height", height);

	d3.json("/datas/skorea-topo.json", function(error, kor) {
		var featureCollections = topojson.feature(kor, kor.objects["skorea-geo"]);

		console.log(featureCollections);

		var b = path.bounds(featureCollections.features[0]);
		var	s = 0.95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height);
		var	t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

		projection
		.scale(s)
		.translate(t);

		svg.append("path")
		.datum(featureCollections)
		.attr("d", path);
	});
});
