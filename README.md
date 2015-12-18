# HTTP Header Debugger

A simple web app that allows the client to craft HTTP requests with custom
headers via a form and send them to the server. The server returns the request
headers it received. Uses jQuery.ajax for request construction. 

Useful for testing proxies which may modify request headers.

TODO: Allow client to request (via POST body) that the server *return* certain
headers, allowing testing of proxies which modify response headers.

Intended use case: Debug
[Sandstorm](https://github.com/sandstorm-io/sandstorm/) proxy.js and
sandstorm-http-bridge.c++.

Source on [github](https://github.com/sprin/http-header-debugger)
