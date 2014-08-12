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
  };



  var connect = function(options, cb) {
    _client = net.connect(options, function() {
      if (options.token) {
        token(options.token, function() {
          cb();
        });
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


          console.log(line);


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
  };


  var githublogin = function(accessToken, cb) {
    cbt.trackById('githublogin', cb);
    _client.write('githublogin ' + accessToken + '\n');
  };


  var listSystems = function(cb) {
    cbt.trackById('list systems', cb);
    _client.write('list systems\n');
  };



  var createSystem = function(name, namespace, cb) {
    cbt.trackById('create system', cb);
    _client.write('create system ' + name + ' ' + namespace + '\n');
  };



  var cloneSystem = function(url, cb) {
    cbt.trackById('clone system', cb);
    _client.write('clone system ' + url + '\n');
  };



  var addRemote = function(systemId, url, cb) {
    cbt.trackById('add remote', cb);
    _client.write('add remote ' + systemId + ' ' + url + '\n');
  };



  var getSystem = function(systemId, cb) {
    cbt.trackById('get system', cb);
    _client.write('get system ' + systemId + '\n');
  };



  var syncSystem = function(systemId, cb) {
    cbt.trackById('sync system', cb);
    _client.write('sync system ' + systemId + '\n');
  };



  var getDeployed = function(systemId, cb) {
    cbt.trackById('get deployed', cb);
    _client.write('get deployed ' + systemId + '\n');
  };



  var deleteSystem = function(systemId, cb) {
    cbt.trackById('delete system', cb);
    _client.write('delete system ' + systemId + '\n');
  };



  var putSystem = function(systemJson, cb) {
    cbt.trackById('put system', cb);
    _client.write('put system ' + '\n');
    _client.write(systemJson + '\n');
    _client.write('END\n');
  };



  var listContainers = function(systemId, cb) {
    cbt.trackById('list containers', cb);
    _client.write('list containers ' + systemId + '\n');
  };



  var addContainer = function(systemId, containerJson, cb) {
    cbt.trackById('add container', cb);
    _client.write('add container ' + systemId + '\n');
    _client.write(containerJson + '\n');
    _client.write('END\n');
  };



  var putContainer = function(systemId, containerJson, cb) {
    cbt.trackById('put container', cb);
    _client.write('put container ' + systemId + '\n');
    _client.write(containerJson + '\n');
    _client.write('END\n');
  };



  var deleteContainer = function(systemId, containerId, cb) {
    cbt.trackById('delete container', cb);
    _client.write('delete container ' + systemId + ' ' + containerId + '\n');
  };



  var buildContainer = function(systemId, containerId, cb) {
    cbt.trackById('build container', cb);
    _client.write('build container ' + systemId + ' ' + containerId + '\n');
  };



  var deploySystem = function(systemId, revisionId, cb) {
    cbt.trackById('deploy system', cb);
    _client.write('deploy system ' + systemId + ' ' + revisionId + '\n');
  };



  var previewSystemDeploy = function(systemId, revisionId, cb) {
    cbt.trackById('preview system', cb);
    _client.write('preview system ' + systemId + ' ' + revisionId + '\n');
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
    cbt.trackById('get revision', cb);
    _client.write('get revision ' + systemId + ' ' + revisionId + '\n');
  };



  var markRevision = function(systemId, revisionId, cb) {
    cbt.trackById('mark revision', cb);
    _client.write('mark revision ' + systemId + ' ' + revisionId + '\n');
  };



  var timeline = function(systemId, cb) {
    cbt.trackById('list timeline', cb);
    _client.write('list timeline ' + systemId + '\n');
  };



  var addToTimeline = function(timelineJson, cb) {
    cbt.trackById('add timeline', cb);
    _client.write('add timeline\n');
    _client.write(timelineJson + '\n');
    _client.write('END\n');
  };


  
  var analyzeSystem = function(systemId, cb) {
    cbt.trackById('analyze system', cb);
    _client.write('analyze system ' + systemId + '\n');
  };



  var checkSystem = function(systemId, cb) {
    cbt.trackById('check system', cb);
    _client.write('check system ' + systemId + '\n');
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
    deleteSystem: deleteSystem,

    putContainer: putContainer,
    deleteContainer: deleteContainer,
    addContainer: addContainer,
    listContainers: listContainers,
    buildContainer: buildContainer,
    deploySystem: deploySystem,
    previewSystemDeploy: previewSystemDeploy,
    deployAll: deployAll,
    ioHandlers: ioHandlers,

    listRevisions: listRevisions,
    getRevision: getRevision,
    markRevision: markRevision,

    timeline: timeline,
    addToTimeline: addToTimeline,

    analyzeSystem: analyzeSystem,
    checkSystem: checkSystem
  };
};

