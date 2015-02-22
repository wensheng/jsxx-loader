var reactTools = require('react-tools');
var loaderUtils = require('loader-utils');

module.exports = function(source) {
  this.cacheable && this.cacheable();

  var sourceFilename = loaderUtils.getRemainingRequest(this);
  var current = loaderUtils.getCurrentRequest(this);

  var query = loaderUtils.parseQuery(this.query);

  // start additional code
  var lines = source.split("\n"),
      newlines = [],
      pat0 = /^\/\*\* +jsx/,
      pat1 = /jsx +\*\*\/$/;
  for(var i=0; i<lines.length; i++){
    if(!pat0.test(lines[i]) && !pat1.test(lines[i])){
      newlines.push(lines[i]);
    }
  }
  source = newlines.join("\n");
  // end additional code

  if (query.insertPragma) {
    source = '/** @jsx ' + query.insertPragma + ' */' + source;
  }

  var transform = reactTools.transformWithDetails(source, {
    harmony: query.harmony,
    stripTypes: query.stripTypes,
    es5: query.es5,
    sourceMap: this.sourceMap
  });
  if (transform.sourceMap) {
    transform.sourceMap.sources = [sourceFilename];
    transform.sourceMap.file = current;
    transform.sourceMap.sourcesContent = [source];
  }
  this.callback(null, transform.code, transform.sourceMap);
};
