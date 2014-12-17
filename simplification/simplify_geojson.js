var simplify = require('simplify-geojson'),
	fs = require('fs'),
	path = require('path'),
	jf = require('jsonfile'),
	topojson = require('topojson'),
	// toJSON = require('shp2json');
	Shp = require('shp');


// var inputfile = "L:/Marketing/BD/NWS_CASCADE/NWS_SiteLocations_JChamberlain_20141202/Lower48_Seismic_Zones",
var inputfile = "L:/Marketing/BD/NWS_CASCADE/NWS_SiteLocations_JChamberlain_20141202/NWS_Regions",
	outDir = "L:/Marketing/BD/NWS_CASCADE/layers/json",
	tolerance = 0.001;
	// tolerance = 0.1;
	outfile = path.join(outDir, path.basename(inputfile).replace('.shp', '') + '.json');

function propertyTransform(feature) {
  return feature.properties;
}

// topojson['property-transform'] = propertyTransform;

Shp.readFile(inputfile, function s_w(err, data){
	if(err)
		return console.log(err)
	console.log('num features:', data.features.length)
	jf.writeFile(outfile, data, function(err) {
	  if(err)
	  	return console.log(err)
	  return console.log('wrote', outfile)
	});
	var topology = topojson.topology({collection: data}, {'property-transform': propertyTransform }),
		outTopojson = outfile.replace('.json', '_topo.json');
	jf.writeFile(outTopojson, topology, function(err) {
	  if(err)
	  	return console.log(err)
	  return console.log('wrote', outTopojson)
	});
	var simplified = simplify(data, tolerance),
		simpOut = outfile.replace('.json', '-' + tolerance.toString().replace('.', '_') + '-simplified.json');
	jf.writeFile(simpOut, simplified, function(err) {
	  if(err)
	  	return console.log(err)
	  return console.log('wrote', simpOut)
	});
});