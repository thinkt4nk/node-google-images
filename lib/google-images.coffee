request = require 'request'
fs = require 'fs'
querystring = require 'querystring'

module.exports=
	search: (query, options) ->
		if typeof query is 'object'
			options = query
			query = options.for
			callback = options.callback if options.callback?
		if typeof query is 'string' and typeof options is 'function'
			callback = options
			options = {}
		if typeof query is 'string' and typeof options is 'object'
			callback = options.callback if options.callback?
		
		options.page = 0 if not options.page?
		
		baseUrl = "http://ajax.googleapis.com/ajax/services/search/images"
		queryParams =
			v: '1.0'
			q: query
			start: options.page
		for key, val of options.params
			queryParams[key] = val
		url = [baseUrl, querystring.stringify(queryParams)].join '?'
		request url, (err, res, body) ->
			if err
				return callback err
			jsonBody = JSON.parse body
			if jsonBody.responseData is null
				return callback 'responseData null'
			items = jsonBody.responseData.results
			images = []
			for item in items
				images.push
					width: item.width
					height: item.height
					unescapedUrl: item.unescapedUrl
					url: item.url
					writeTo: (path, callback) ->
						stream = fs.createWriteStream path
						stream.on 'close', ->
							callback()
						request(item.url).pipe stream
			
			callback no, images if callback
