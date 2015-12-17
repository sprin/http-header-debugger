Router.route('/api/', function () {
  // NodeJS request object
  var request = this.request;
  var headers = request.headers;
  console.log(headers);

  // NodeJS  response object
  var response = this.response;

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

      // Get value from form element
      var method = event.target.method.value;
      var url = event.target.url.value;
      var header1_name = event.target.header1_name.value;
      var header1_value = event.target.header1_value.value;
      var header2_name = event.target.header2_name.value;
      var header2_value = event.target.header2_value.value;
      var header3_name = event.target.header3_name.value;
      var header3_value = event.target.header3_value.value;
      var headers = {};
      if (header1_name) {
        headers[header1_name] = header1_value;
      }
      if (header2_name) {
        headers[header2_name] = header2_value;
      }
      if (header3_name) {
        headers[header3_name] = header3_value;
      }
      var ajaxSettings = {
        method: method,
        headers: headers,
        success: function (data) {
          var results = JSON.parse(data);
          headers = [];
          _.each(results, function(val, key) {
             headers.push({name: key, value: val});
          });
          context = {headers: headers};
          $('#results').empty();
          Blaze.renderWithData(Template.results, context, $('#results')[0]);
          console.log(results);
        }
      };
      jQuery.ajax(url, ajaxSettings);
    }
  });
}

