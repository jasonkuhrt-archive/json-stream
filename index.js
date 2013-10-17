var bun = require('bun');
var tstream = require('tstream');
var delimiter_frame = require('./lib/delimiter-frame');



var json_stream = {
  Parse: tstream(function(chunk, encoding, done){
    var data;
    try {
      data = JSON.parse(chunk.toString());
      this.push(data);
    } catch(err) {
      // Silently drop parse errors
      return;
    }
    done();
  }),
  Stringify: tstream(function(obj, encoding, done){
    this.push(JSON.stringify(obj));
    done();
  })
};



module.exports = {
  Parse: function(deliminiter){
    return bun([
      new delimiter_frame.Receive(deliminiter, {objectMode:true}),
      new json_stream.Parse({objectMode:true})
    ]);
  },
  Stringify: function(deliminiter) {
    return bun([
      new json_stream.Stringify({objectMode:true}),
      new delimiter_frame.Send(deliminiter)
    ]);
  }
};