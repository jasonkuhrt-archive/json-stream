# json-stream [![Build Status](https://travis-ci.org/jasonkuhrt/json-stream.png)](https://travis-ci.org/jasonkuhrt/json-stream) [![Dependency Status](https://gemnasium.com/jasonkuhrt/json-stream.png)](https://gemnasium.com/jasonkuhrt/json-stream)
JSON.parse and JSON.stringify wrapped in a node.js stream

## Install
    npm install jasonkuhrt/json-stream

## Example
```js
var net = require('net');
var jsonStream = require('json-stream');


net.createServer(function(socket){
  // Create in/out json streams
  var parseStream = jsonStream.Parse('\r\n');
  var stringifyStream = jsonStream.Stringify('\r\n');

  // re-wire socket write
  socket.write_ = socket.write;
  socket.write = stringifyStream.write.bind(stringifyStream);
  stringifyStream.pipe(socket);

  // read json, yay!
  socket
  .pipe(parseStream)
  .on('data', function(json){
    console.log('From socket: %j', json);
  });

  // write json, yay!
  socket.write({ Hello: 'Socket!' });
});
```

## API
### .Stringify(delimiter)
```
@param delimiter
  The character(s) that will be appended to the end of each json string to deliniate messages.
```
```
@return
  Stream instance (that inherits from stream.Transform)
```

### .Parse(delimiter)
```
@param delimiter
  What character(s) deliniate messages. The stream is split on this delimiter, the resulting message is put through JSON.parse.
```
```
@return
  Stream instance (that inherits from stream.Transform)
  The stream's objectMode is set to true, thus readers will get javascript objects from this stream.
  @event 'warn'
    When a JSON.parse error occurs it is emitted as a 'warn' event.
    The event handler receives the err object.
```

## Notes
#### Why a `warn` event on `json_stream.Parse`?
If `error` is emitted on a stream it kills the stream. This is too harsh. A server might pipe a socket connection through json_stream.parse. One bad message does not indicate all will be bad. Instead we silently drop messages that fail JSON parsing, and we emit that JSON error as a 'warn' event which won't kill the stream but might let the app handle the problem in some useful way (notifying the peer, logging, etc.).
