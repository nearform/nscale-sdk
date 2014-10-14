/*
 * THIS SOFTWARE IS PROVIDED ``AS IS'' AND ANY EXPRESSED OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED.  IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT,
 * INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
 * STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING
 * IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

'use strict';

var net = require('net');
var EventEmitter = require('events').EventEmitter;
var Cbt = require('pelger-cbt');
var _ = require('underscore');
var JSONStream = require('json-stream');
var quote = require('shell-quote').quote;



/**
 * nfd client sdk
 */
module.exports = function() {
  var _client;
  var _stdoutCb;
  var _stderrCb;
  var cbt = new Cbt();
  var ee = new EventEmitter();

  function write() {
    _client.write(quote(_.toArray(arguments)) + '\n');
  }



  var parseResponse = function(response, cb) {
    if (response && response.err) {
      var err = new Error(response.err.message || 'Uknown error');
      Object.keys(response.err).forEach(function(key) {
        err[key] = response.err[key];
      });
      return cb(err);
    }

    return cb(null, response);
  };



  var token = function(token, cb) {
    cbt.trackById('token', cb);
    write('token', token);
  };



  var connect = function(options, cb) {
    _client = net.connect(options, function() {
      ee.connected = true;
      if (options.token) {
        token(options.token, function() {
          cb();
        });
      }
      else {
        cb();
      }
    });

    var jsonStream = new JSONStream();
    _client.pipe(jsonStream);
    jsonStream.on('readable', function() {
      var json;
      while((json = jsonStream.read()) !== null) {
        if (json.responseType === 'stdout') {
          if (_stdoutCb) {
            _stdoutCb(json);
          }
        }
        else if (json.responseType === 'stderr') {
          if (_stderrCb) {
            _stderrCb(json);
          }
        }
        else if (json.responseType === 'response') {
          parseResponse(json.response, cbt.fetch(json.request));
        }
      }
    });

    _client.on('end', function() {
      ee.connected = false;
      ee.emit('end');
    });

    _client.on('error', function(err) {
      ee.connected = false;
      ee.emit('error', err);
    });
  };



  var login = function(username, password, cb) {
    cbt.trackById('login', cb);
    write('login', username, password);
  };


  var githublogin = function(accessToken, cb) {
    cbt.trackById('githublogin', cb);
    write('githublogin', accessToken);
  };


  var listSystems = function(cb) {
    cbt.trackById('system list', cb);
    write('system', 'list');
  };



  var createSystem = function(name, namespace, cwd, cb) {
    cbt.trackById('system create', cb);
    write('system', 'create', name, namespace, cwd);
  };



  var cloneSystem = function(url, cwd, cb) {
    cbt.trackById('system clone', cb);
    write('system', 'clone', url, cwd);
  };



  var addRemote = function(systemId, url, cb) {
    cbt.trackById('remote add', cb);
    write('remote', 'add', systemId, url);
  };



  var getSystem = function(systemId, cb) {
    cbt.trackById('system get', cb);
    write('system', 'get', systemId);
  };



  var syncSystem = function(systemId, cb) {
    cbt.trackById('system sync', cb);
    write('system', 'sync', systemId);
  };



  var getDeployed = function(systemId, cb) {
    cbt.trackById('system deployed', cb);
    write('system', 'deployed', systemId);
  };


  var putSystem = function(systemJson, cb) {
    cbt.trackById('system put', cb);
    write('system', 'put');
    _client.write(systemJson +'\n');
    _client.write('END\n');
  };



  var listContainers = function(systemId, cb) {
    cbt.trackById('container list', cb);
    write('container', 'list', systemId);
  };



  var addContainer = function(systemId, containerJson, cb) {
    cbt.trackById('container', cb);
    write('container', 'add', systemId);
    _client.write(containerJson +'\n');
    _client.write('END\n');
  };



  var putContainer = function(systemId, containerJson, cb) {
    cbt.trackById('container put', cb);
    write('container', 'put', systemId);
    _client.write(containerJson +'\n');
    _client.write('END\n');
  };



  var deleteContainer = function(systemId, containerId, cb) {
    cbt.trackById('container delete', cb);
    write('container', 'delete', systemId, containerId);
  };



  var buildContainer = function(systemId, containerId, cb) {
    cbt.trackById('container build', cb);
    write('container', 'build', systemId, containerId);
  };



  var deployRevision = function(systemId, revisionId, cb) {
    cbt.trackById('revision deploy', cb);
    write('revision', 'deploy', systemId, revisionId);
  };



  var previewRevision = function(systemId, revisionId, cb) {
    cbt.trackById('revision preview', cb);
    write('revision', 'preview', systemId, revisionId);
  };




  var listRevisions = function(systemId, cb) {
    cbt.trackById('revision list', cb);
    write('revision', 'list', systemId);
  };



  var getRevision = function(systemId, revisionId, cb) {
    cbt.trackById('revision get', cb);
    write('revision', 'get', systemId, revisionId);
  };



  var markRevision = function(systemId, revisionId, cb) {
    cbt.trackById('revision mark', cb);
    write('revision', 'mark', systemId, revisionId);
  };



  var timeline = function(systemId, cb) {
    cbt.trackById('timeline list', cb);
    write('timeline', 'list', systemId);
  };




  var analyzeSystem = function(systemId, cb) {
    cbt.trackById('system analyze', cb);
    write('system', 'analyze', systemId);
  };



  var checkSystem = function(systemId, cb) {
    cbt.trackById('system check', cb);
    write('system', 'check', systemId);
  };



  var fixSystem = function(systemId, cb) {
    cbt.trackById('system fix', cb);
    write('system', 'fix', systemId);
  };



  var compileSystem = function(systemId, platform, cb) {
    cbt.trackById('system compile', cb);
    write('system', 'compile', systemId, platform);
  };



  var quit = function(cb) {
    function onquit(err, result) {
      ee.connected = false;
      cb(err, result);
    }

    cbt.trackById('quit', onquit);
    write('quit');
  };



  var ioHandlers = function(stdoutCb, stderrCb) {
    _stdoutCb = stdoutCb;
    _stderrCb = stderrCb;
  };



  _.each({
    connect: connect,
    login: login,
    githublogin: githublogin,
    token: token,
    quit: quit,
    createSystem: createSystem,
    cloneSystem: cloneSystem,
    addRemote: addRemote,
    listSystems: listSystems,
    getSystem: getSystem,
    syncSystem: syncSystem,
    getDeployed: getDeployed,
    putSystem: putSystem,
    fixSystem: fixSystem,
    compileSystem: compileSystem,

    // disabled by @mcollina
    //deleteSystem: deleteSystem,

    putContainer: putContainer,
    deleteContainer: deleteContainer,
    addContainer: addContainer,
    listContainers: listContainers,
    buildContainer: buildContainer,
    deployRevision: deployRevision,
    previewRevision: previewRevision,
    ioHandlers: ioHandlers,

    listRevisions: listRevisions,
    getRevision: getRevision,
    markRevision: markRevision,

    timeline: timeline,

    analyzeSystem: analyzeSystem,
    checkSystem: checkSystem,

    connected: false
  }, function(value, key) {
    ee[key] = value;
  });

  return ee;
};

