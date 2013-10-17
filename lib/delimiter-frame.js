var tstream = require('tstream');
var Delimit_Stream = require('delimit-stream');



exports.Send = function(delimiter, options){
  return (new (tstream(_transform))(options))
  function _transform(chunk, encoding, done){
    this.push(chunk.toString() + delimiter);
    done();
  }
};

exports.Receive = Delimit_Stream;