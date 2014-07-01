(function() {
  var fs, querystring, request;

  request = require('request');

  fs = require('fs');

  querystring = require('querystring');

  module.exports = {
    search: function(query, options) {
      var baseUrl, callback, key, queryParams, url, val, _ref;
      if (typeof query === 'object') {
        options = query;
        query = options["for"];
        if (options.callback != null) callback = options.callback;
      }
      if (typeof query === 'string' && typeof options === 'function') {
        callback = options;
        options = {};
      }
      if (typeof query === 'string' && typeof options === 'object') {
        if (options.callback != null) callback = options.callback;
      }
      if (!(options.page != null)) options.page = 0;
      baseUrl = "http://ajax.googleapis.com/ajax/services/search/images";
      queryParams = {
        v: '1.0',
        q: query,
        start: options.page
      };
      _ref = options.params;
      for (key in _ref) {
        val = _ref[key];
        queryParams[key] = val;
      }
      url = [baseUrl, querystring.stringify(queryParams)].join('?');
      return request(url, function(err, res, body) {
        var images, item, items, jsonBody, _i, _len;
        if (err) return callback(err);
        jsonBody = JSON.parse(body);
        if (jsonBody.responseData === null) return callback('responseData null');
        items = jsonBody.responseData.results;
        images = [];
        for (_i = 0, _len = items.length; _i < _len; _i++) {
          item = items[_i];
          images.push({
            width: item.width,
            height: item.height,
            unescapedUrl: item.unescapedUrl,
            url: item.url,
            writeTo: function(path, callback) {
              var stream;
              stream = fs.createWriteStream(path);
              stream.on('close', function() {
                return callback();
              });
              return request(item.url).pipe(stream);
            }
          });
        }
        if (callback) return callback(false, images);
      });
    }
  };

}).call(this);
