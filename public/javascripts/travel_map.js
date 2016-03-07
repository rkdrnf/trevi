$(function() {

	var width = 1600;
	var height = 1600;

	var projection = d3.geo.mercator()
	.scale(1)
	.translate([0, 0]);

	var path = d3.geo.path()
	.projection(projection);

	var svg = d3.select("body").append("svg")
	.attr("width", width)
	.attr("height", height);

	d3.json("/datas/skorea-municipalities-topo.json", function(error, kor) {
		var featureCollections = topojson.feature(kor, kor.objects["skorea-municipalities-geo"]);

		var minX = Number.POSITIVE_INFINITY;
		var maxX = Number.NEGATIVE_INFINITY;
		var minY = Number.POSITIVE_INFINITY;
		var maxY = Number.NEGATIVE_INFINITY;
		featureCollections.features.forEach(function(feature) {
			var b = path.bounds(feature);

			minX = Math.min(minX, b[0][0]);
			maxX = Math.max(maxX, b[1][0]);
			minY = Math.min(minY, b[0][1]);
			maxY = Math.max(maxY, b[1][1]);
		});

		var b = path.bounds(featureCollections.features);
		var	s = 0.95 / Math.max((maxX - minX) / width, (maxY - minY) / height);
		var	t = [(width - s * (maxX + minX)) / 2, (height - s * (maxY + minY)) / 2];

		projection
		.scale(s)
		.translate(t);

		svg.selectAll(".city")
		.data(featureCollections.features)
		.enter().append("path")
		.attr("class", function(d) { return "city " + d.properties.NAME_2; })
		.attr("d", path);

		svg.append("path")
		.datum(topojson.mesh(kor, kor.objects["skorea-municipalities-geo"], function(a, b) { return a !== b && (a.properties.ENGTYPE_2 !== "District" || b.properties.ENGTYPE_2 !== "District"); }))
		.attr("d", path)
		.attr("class", "city-boundary");

		svg.selectAll(".city-label")
		.data(featureCollections.features)
		.enter().append("text")
		.attr("class", function(d) { return "city-label " + d.properties.NAME_2; })
		.attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
		.attr("dy", ".35em")
		.text(function(d) { return d.properties.ENGTYPE_2 === "District" ? "" : d.properties.NAME_2; });


	});


	d3.json("/datas/skorea-municipalities-topo.json", function(err, kor) {
		console.log(kor);
	});
});
