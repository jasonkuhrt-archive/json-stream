# json-stream
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

@return
  Stream instance that inherits from stream.Transform
```

### .Parse(delimiter)
```
@param delimiter
  What character(s) deliniate messages. The stream is split on this delimiter, the resulting message is put through JSON.parse.

@return
  Stream instance that inherits from stream.Transform
```