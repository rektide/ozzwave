"use strict"
var
  memoizee= require( "memoizee")

var _tail= /^(.+)(Type|Id)$/i
function _camel(key){
	// camel case
	var frags= key.split(/_/g)
	for( var i = 1; i < frags.length; ++i){
		var frag= frags[i]
		frags[ i]= frag[0].toUpperCase().concat(frag.slice(1))
	}
	key= frags.join("")

	// fix "id" & "type" suffix
	var tail= _tail.exec(key)
	if( tail){
		key= tail[1] + tail[2][0].toUpperCase() + tail[2].slice(1)
	}
	return key
}
var camel= memoizee(_camel)

/**
 * @
 */
module.exports= camel
