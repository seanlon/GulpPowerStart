_ = require "lodash"

# split array into chunks
# see https://gist.github.com/timruffles/3377784

module.exports = (array, chunkSize) ->
  return _.reduce(array, ((reducer, item, index) ->
    reducer.current.push item
    if reducer.current.length == chunkSize or index + 1 == array.length
      reducer.chunks.push reducer.current
      reducer.current = []
    reducer
  ), {current: [], chunks: []}).chunks
