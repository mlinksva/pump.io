// .well-known/host-meta
//
// Copyright 2012 StatusNet Inc.
//
// "I never met a host I didn't like"
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var assert = require("assert"),
    vows = require("vows"),
    Step = require("step"),
    _ = require("underscore"),
    querystring = require("querystring"),
    http = require("http"),
    httputil = require("./lib/http"),
    oauthutil = require("./lib/oauth"),
    actutil = require("./lib/activity"),
    setupApp = oauthutil.setupApp;

var suite = vows.describe("follow person activity test");

// A batch to test following/unfollowing users

suite.addBatch({
    "When we set up the app": {
        topic: function() {
            setupApp(this.callback);
        },
        teardown: function(app) {
            if (app && app.close) {
                app.close();
            }
        },
        "it works": function(err, app) {
            assert.ifError(err);
        },
        "and we check the client registration endpoint": 
        httputil.endpoint("/.well-known/host-meta", ["GET"]),
        "and we GET the host-meta file": {
            topic: function() {
                var callback = this.callback;
                http.get("http://localhost:4815/.well-known/host-meta", function(res) {
                    var body = "";
                    if (res.statusCode !== 200) {
                        callback(new Error("Bad status code"), null, null);
                    } else {
                        res.setEncoding("utf8");
                        res.on("data", function(chunk) {
                            body = body + chunk;
                        });
                        res.on("error", function(err) {
                            callback(err, null, null);
                        });
                        res.on("end", function() {
                            callback(null, body, res);
                        });
                    }
                });
            },
            "it works": function(err, body, res) {
                assert.ifError(err);
            },
            "it has an XRD content type": function(err, body, res) {
                assert.ifError(err);
                assert.include(res, "headers");
                assert.include(res.headers, "content-type");
                assert.equal(res.headers["content-type"], "application/xrd+xml");
            }
        }
    }
});

suite["export"](module);