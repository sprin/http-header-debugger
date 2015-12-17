# Request Debugger

A simple app that allows the client to craft HTTP requests and send them to the
server. Uses jQuery.ajax for request construction. The server returns the
request headers it received.

Useful for testing proxies which may modify request headers.

TODO: Allow client to request (via POST body) that the server *return* certain
headers, allowing testing of proxies which modify response headers.
