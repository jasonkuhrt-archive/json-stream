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
      this.emit('warn', err);
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
    var frame_receive = new delimiter_frame.Receive(deliminiter, {objectMode:true});
    var json_parse = new json_stream.Parse({objectMode:true});
    var pipeline = bun([frame_receive, json_parse]);
    event_forward('warn', json_parse, pipeline);
    return pipeline;
  },
  Stringify: function(deliminiter) {
    return bun([
      new json_stream.Stringify({objectMode:true}),
      new delimiter_frame.Send(deliminiter)
    ]);
  }
};

function event_forward(event, ee_from, ee_to){
  ee_from.on(event, function(){
    var args = Array.prototype.slice.call(arguments, 0);
    args.unshift(event);
    ee_to.emit.apply(ee_to, args);
  });
}