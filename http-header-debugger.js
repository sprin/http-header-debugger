Router.route('/api/', function () {
  // NodeJS request object
  var request = this.request;
  var headers = request.headers;
  var message = request.body;

  // NodeJS  response object
  var response = this.response;

  // Extract headers the client has requested to be returned from the request
  // body, and add them to the response.
  // It is assumed that duplicate headers have already been combined.
  resp_headers_raw = message.resp_headers;
  _.each(resp_headers_raw, function(val, key) {
    response.setHeader(key, val);
  });

  this.response.end(JSON.stringify(headers));
}, {where: 'server'});

// Dummy route for root. The layout template renders,
// and the events below are bound.
Router.route('/', function () {
});

if (Meteor.isClient) {
  // This code only runs on the client
  Template.body.events({
    "submit .request": function (event) {
      // Prevent default browser form submit
      event.preventDefault();

      // Get values from form elements
      var method = event.target.method.value;
      var url = event.target.url.value;
      // Request headers
      var req_header1_name = event.target.req_header1_name.value;
      var req_header1_value = event.target.req_header1_value.value;
      var req_header2_name = event.target.req_header2_name.value;
      var req_header2_value = event.target.req_header2_value.value;
      var req_header3_name = event.target.req_header3_name.value;
      var req_header3_value = event.target.req_header3_value.value;
      var req_headers = {};
      if (req_header1_name) {
        setHeader(req_headers, req_header1_name, req_header1_value);
      }
      if (req_header2_name) {
        setHeader(req_headers, req_header2_name, req_header2_value);
      }
      if (req_header3_name) {
        setHeader(req_headers, req_header3_name, req_header3_value);
      }

      // Response headers (we are asking the server to return these)
      var resp_header1_name = event.target.resp_header1_name.value;
      var resp_header1_value = event.target.resp_header1_value.value;
      var resp_header2_name = event.target.resp_header2_name.value;
      var resp_header2_value = event.target.resp_header2_value.value;
      var resp_header3_name = event.target.resp_header3_name.value;
      var resp_header3_value = event.target.resp_header3_value.value;
      var resp_headers = {};
      if (resp_header1_name) {
        setHeader(resp_headers, resp_header1_name, resp_header1_value);
      }
      if (resp_header2_name) {
        setHeader(resp_headers, resp_header2_name, resp_header2_value);
      }
      if (resp_header3_name) {
        setHeader(resp_headers, resp_header3_name, resp_header3_value);
      }

      var json_payload = "";
      if (Object.keys(resp_headers).length > 0) {
        var payload = {
          resp_headers: resp_headers,
        };
        json_payload = JSON.stringify(payload);
      }

      var ajaxSettings = {
        method: method,
        headers: req_headers,
        success: function (data, textStatus, xhr) {
          var results = JSON.parse(data);
          // Collect seen request headers
          seen_req_headers = [];
          _.each(results, function(val, key) {
             seen_req_headers.push({name: key, value: val});
          });
          // Collect seen response headers
          var seen_resp_headers_str = xhr.getAllResponseHeaders();
          seen_resp_headers = parseResponseHeaders(seen_resp_headers_str);
          context = {
            seen_req_headers: seen_req_headers,
            seen_resp_headers: seen_resp_headers
          };
          // Render results
          $('#results').empty();
          Blaze.renderWithData(Template.results, context, $('#results')[0]);
        }
      };
      if (json_payload) {
        ajaxSettings.data = json_payload;
        ajaxSettings.processData = false;
        ajaxSettings.contentType = 'application/json';
      }
      jQuery.ajax(url, ajaxSettings);
    },
    "click #show-resp-headers": function (event) {
      if( $(event.target).is(':checked')){
        $(".response-headers").show();
      } else {
        $(".response-headers").hide();
      }
    }
  });

  function parseResponseHeaders(headerStr) {
    // Headers may appear multiple times, need to use array, not object.
    var headers = [];
    if (!headerStr) {
      return headers;
    }
    var headerLines = headerStr.split('\u000d\u000a');
    for (var i = 0; i < headerLines.length; i++) {
      var headerLine = headerLines[i];
      // Can't use split() here because it does the wrong thing
      // if the header value has the string ": " in it.
      var index = headerLine.indexOf(': ');
      if (index > 0) {
        var key = headerLine.substring(0, index);
        var val = headerLine.substring(index + 2);
        headers.push({name: key, value: val});
      }
    }
    return headers;
  }
}


function setHeader(headers, name, value) {
  // Check if header already appears, and if so, append with comma.
  if (_.contains(_.keys(headers), name)) {
    headers[name] = headers[name]+ ', ' + value;
  } else {
    headers[name] = value;
  }
}
