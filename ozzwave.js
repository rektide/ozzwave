"use strict"
var
  events= require( "events"),
  eventMap= require( "./eventMap"),
  fs= require( "fs"),
  memoizee= require( "memoizee"),
  OpenZwave= require( "openzwave-shared"),
  ozwCommandClasses

try{
	// if available, ozw-command-classes will create a human readable "command class" when describing nodes & values
	ozwCommandClasses= require( "ozw-command-classes")
}catch(ex){
}

/**
 * Ozzwave wraps OpenZwave, providing friender to use interfaces than the raw data OpenZwave exposes.
 * @extends OpenZwave
 */
class Ozzwave extends OpenZwave{
	constructor( options){
		super( options)
		Object.setPrototypeOf( this, Ozzwave.prototype)
		this.path= this.path|| (options&& options.path)|| "/dev/ttyACM0"
	}
	/**
	 * Patch emit to generate synthetic Ozz events from raw OpenZwave events
	 * @override {@link Openzwave#emit}
	 */
	emit( eventName, ...args){
		// lookup what kind of raw event this is
		var decode= eventMap[ eventName]
		if( decode=== undefined){
			// failed to detect a raw OpenZwave event, pass this through
			return OpenZwave.prototype.emit.call( this, args[0])
		}

		// lookup
		var
		  o,
		  become= decode.become,
		  timestamp= Date.now()
		if( become){
			o= args[ become]
			o.eventName= decode.name
			o.eventCategory= o.eventCategory
			o.timestamp= timestamp
		}else{
			o= {
				eventName: decode.name,
				eventCategory: decode.category,
				timestamp
			}
		}

		var
		  id,
		  info
		for( var i=0; i< decode.args.length; ++i){
			if( i== become){
				// o *is* the become arg, no need to add it again.
				continue
			}
			var
			  key= decode.args[ i],
			  val= args[ i]
			o[ key]= val
		}

		// emit event
		OpenZwave.prototype.emit.call( this, decode.eventName, o)
	}
	/**
	 * Override of {@link OpenZwave#connect} to default to `this.path` if no path parameter is given.
	 * @param {string} [path] - a path to an openzwave compatible tty device.
	 * @override
	 */
	connect( path){
		OpenZwave.prototype.connect.call( this, path|| this.path)
	}
	/**
	 * Generate logs of all synthesied event activity
	 * @param {stream|string} [to=process.stdout] - the file name or output stream to write logs to
	 */
	debugLog( to){
		if( !to|| to=== "-"){
			to= process.stdout
		}
		if( typeof(to)=== "string"){
			to= fs.createWriteStream( to, {flags: "a+"})
		}
		function jsonLog( o){
			to.write( JSON.stringify(o))
			to.write( "\n")
		}
		for( var i in eventMap){
			var eventName= eventMap[ i].eventName
			this.on( eventName, jsonLog)
		}
		// clean up listeners but do not close the output stream
		return ()=> {
			for( var i in eventMap){
				eventMap[ i].removeListener( eventMap[ i].eventName, jsonLog)
			}
			return to
		}
	}
}

if( require.main=== module){
	require( "./main")()
}

module.exports= Ozzwave
