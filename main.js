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
var cbt = require('pelger-cbt')();
var _ = require('underscore');



/**
 * nfd client sdk
 */
module.exports = function() {
  var _client;
  var _stdoutCb;
  var _stderrCb;
  var doc = '';

  var token = function(token, cb) {
    cbt.trackById('token ' + token, cb);
    _client.write('token ' + token + '\n');
  }

  var connect = function(options, cb) {
    _client = net.connect(options, function() {
      if (options.token) {
        token(options.token, function() {
          cb();
        })
      } else {
        cb();
      }
    });

    _client.on('data', function(data) {
      var str = data.toString('utf8');
      var lines;
      var callback;
      var json;

      doc += str;
      lines = doc.split('\n');
      _.each(lines, function(line) {
        if (line.length > 0) {
          try {
            json = JSON.parse(line);
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
              callback = cbt.fetch(json.request);
              callback(json.response);
            }
            doc = '';
          }
          catch (e) {
            // parse failed doc incomplete swallow exception 
          }
        }
      });
    });

    _client.on('end', function() {
    });
  };

  var login = function(username, password, cb) {
    cbt.trackById('login ' + username, cb);
    _client.write('login ' + username + ' ' + password + '\n');
  }



  var listSystems = function(cb) {
    cbt.trackById('list systems', cb);
    _client.write('list systems\n');
  };



  var createSystem = function(name, namespace, cb) {
    cbt.trackById('create system', cb);
    _client.write('create system ' + name + ' ' + namespace + '\n');
  };



  var getSystem = function(systemId, cb) {
    cbt.trackById('get system', cb);
    _client.write('get system ' + systemId + '\n');
  };



  var getDeployed = function(systemId, cb) {
    cbt.trackById('get deployed', cb);
    _client.write('get deployed ' + systemId + '\n');
  };



  var deleteSystem = function(user, systemId, cb) {
    cbt.trackById('delete system', cb);
    _client.write('delete system ' + user + ' ' + systemId + '\n');
  };



  var putSystem = function(user, systemJson, cb) {
    cbt.trackById('put system', cb);
    _client.write('put system ' + user + '\n');
    _client.write(systemJson + '\n');
    _client.write('END\n');
  };



  var listContainers = function(systemId, cb) {
    cbt.trackById('list containers', cb);
    _client.write('list containers ' + systemId + '\n');
  };



  var addContainer = function(user, systemId, containerJson, cb) {
    cbt.trackById('add container', cb);
    _client.write('add container ' + user + ' ' + systemId + '\n');
    _client.write(containerJson + '\n');
    _client.write('END\n');
  };



  var putContainer = function(user, systemId, containerJson, cb) {
    cbt.trackById('put container', cb);
    _client.write('put container ' + user + ' ' + systemId + '\n');
    _client.write(containerJson + '\n');
    _client.write('END\n');
  };



  var deleteContainer = function(user, systemId, containerId, cb) {
    cbt.trackById('delete container', cb);
    _client.write('delete container ' + user + ' ' + systemId + ' ' + containerId + '\n');
  };



  var buildContainer = function(user, systemId, containerId, cb) {
    cbt.trackById('build container', cb);
    _client.write('build container ' + user + ' ' + systemId + ' ' + containerId + '\n');
  };



  var deploySystem = function(user, systemId, revisionId, cb) {
    cbt.trackById('deploy system', cb);
    _client.write('deploy system ' + user + ' ' + systemId + ' ' + revisionId + '\n');
  };



  var deployAll = function(systemId, revisionId, cb) {
    cbt.trackById('deploy all', cb);
    _client.write('deploy all ' + systemId + ' ' + revisionId + '\n');
  };



  var listRevisions = function(systemId, cb) {
    cbt.trackById('list revisions', cb);
    _client.write('list revisions ' + systemId + '\n');
  };



  var getRevision = function(systemId, revisionId, cb) {
    cbt.trackById('get revision ', cb);
    _client.write('get revision ' + systemId + ' ' + revisionId + '\n');
  };



  var timeline = function(systemId, containerId, user, cb) {
    cbt.trackById('list timeline', cb);
    _client.write('list timeline ' + systemId + ' ' + containerId + ' ' + user + '\n');
  };



  var addToTimeline = function(timelineJson, cb) {
    cbt.trackById('add timeline', cb);
    _client.write('add timeline\n');
    _client.write(timelineJson + '\n');
    _client.write('END\n');
  };



  var quit = function(cb) {
    cbt.trackById('quit', cb);
    _client.write('quit\n');
  };



  var ioHandlers = function(stdoutCb, stderrCb) {
    _stdoutCb = stdoutCb;
    _stderrCb = stderrCb;
  };



  return {
    connect: connect,
    login: login,
    token: token,
    quit: quit,
    createSystem: createSystem,
    listSystems: listSystems,
    getSystem: getSystem,
    getDeployed: getDeployed,
    putSystem: putSystem,
    deleteSystem: deleteSystem,

    putContainer: putContainer,
    deleteContainer: deleteContainer,
    addContainer: addContainer,
    listContainers: listContainers,
    buildContainer: buildContainer,
    deploySystem: deploySystem,
    deployAll: deployAll,
    ioHandlers: ioHandlers,

    listRevisions: listRevisions,
    getRevision: getRevision,

    timeline: timeline,
    addToTimeline: addToTimeline
  };
};

