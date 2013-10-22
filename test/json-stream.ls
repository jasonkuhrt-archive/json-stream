test = require('tape')
json_stream = require('../')



test 'json_stream.Parse', (t)->
  t.plan(1)
  parse_stream = new json_stream.Parse('\n')
  parse_stream.write('{"a":1}\n')
  parse_stream.on 'data', t.same(_, {a:1})

  t.test 'json_stream.Parse "warn" events', (st)->
    st.plan(1)
    parse_stream = new json_stream.Parse('\n')
    parse_stream.write('{a:1}\n')
    parse_stream.on 'warn', (err)->
      st.notEqual(void, err)


test 'json_stream.Stringify', (t)->
  t.plan(1)
  stringify_stream = new json_stream.Stringify('\n')
  stringify_stream.write({a:1})
  stringify_stream.on 'data', (buffer)-> t.equal(buffer.toString(), '{"a":1}\n')