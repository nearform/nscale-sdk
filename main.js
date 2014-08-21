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
    cbt.trackById('system list', cb);
    _client.write('system list\n');
  };



  var createSystem = function(name, namespace, cb) {
    cbt.trackById('system create', cb);
    _client.write('system create ' + name + ' ' + namespace + '\n');
  };



  var cloneSystem = function(url, cb) {
    cbt.trackById('system clone', cb);
    _client.write('system clone ' + url + '\n');
  };



  var addRemote = function(systemId, url, cb) {
    cbt.trackById('remote add', cb);
    _client.write('remote add ' + systemId + ' ' + url + '\n');
  };



  var getSystem = function(systemId, cb) {
    cbt.trackById('system get', cb);
    _client.write('system get ' + systemId + '\n');
  };



  var syncSystem = function(systemId, cb) {
    cbt.trackById('sync system', cb);
    _client.write('sync system ' + systemId + '\n');
  };



  var getDeployed = function(systemId, cb) {
    cbt.trackById('system deployed', cb);
    _client.write('system deployed ' + systemId + '\n');
  };


  // disabled - @mcollina
  //var deleteSystem = function(systemId, cb) {
  //  cbt.trackById('system delete', cb);
  //  _client.write('system delete ' + systemId + '\n');
  //};



  var putSystem = function(systemJson, cb) {
    cbt.trackById('system put', cb);
    _client.write('system put' + '\n');
    _client.write(systemJson + '\n');
    _client.write('END\n');
  };



  var listContainers = function(systemId, cb) {
    cbt.trackById('container list', cb);
    _client.write('container list ' + systemId + '\n');
  };



  var addContainer = function(systemId, containerJson, cb) {
    cbt.trackById('container', cb);
    _client.write('container add ' + systemId + '\n');
    _client.write(containerJson + '\n');
    _client.write('END\n');
  };



  var putContainer = function(systemId, containerJson, cb) {
    cbt.trackById('container put', cb);
    _client.write('container put ' + systemId + '\n');
    _client.write(containerJson + '\n');
    _client.write('END\n');
  };



  var deleteContainer = function(systemId, containerId, cb) {
    cbt.trackById('container delete', cb);
    _client.write('container delete ' + systemId + ' ' + containerId + '\n');
  };



  var buildContainer = function(systemId, containerId, cb) {
    cbt.trackById('container build', cb);
    _client.write('container build ' + systemId + ' ' + containerId + '\n');
  };



  var deploySystem = function(systemId, revisionId, cb) {
    cbt.trackById('deploy system', cb);
    _client.write('deploy system ' + systemId + ' ' + revisionId + '\n');
  };



  var previewSystemDeploy = function(systemId, revisionId, cb) {
    cbt.trackById('revision preview', cb);
    _client.write('revision preview ' + systemId + ' ' + revisionId + '\n');
  };




  var listRevisions = function(systemId, cb) {
    cbt.trackById('revision list', cb);
    _client.write('revision list ' + systemId + '\n');
  };



  var getRevision = function(systemId, revisionId, cb) {
    cbt.trackById('revision get', cb);
    _client.write('revision get ' + systemId + ' ' + revisionId + '\n');
  };



  var markRevision = function(systemId, revisionId, cb) {
    cbt.trackById('revision mark', cb);
    _client.write('revision mark ' + systemId + ' ' + revisionId + '\n');
  };



  var timeline = function(systemId, cb) {
    cbt.trackById('timeline list', cb);
    _client.write('timeline list ' + systemId + '\n');
  };




  var analyzeSystem = function(systemId, cb) {
    cbt.trackById('system analyze', cb);
    _client.write('system analyze ' + systemId + '\n');
  };



  var checkSystem = function(systemId, cb) {
    cbt.trackById('system check', cb);
    _client.write('system check ' + systemId + '\n');
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

    // disabled by @mcollina
    //deleteSystem: deleteSystem,

    putContainer: putContainer,
    deleteContainer: deleteContainer,
    addContainer: addContainer,
    listContainers: listContainers,
    buildContainer: buildContainer,
    deploySystem: deploySystem,
    previewSystemDeploy: previewSystemDeploy,
    ioHandlers: ioHandlers,

    listRevisions: listRevisions,
    getRevision: getRevision,
    markRevision: markRevision,

    timeline: timeline,

    analyzeSystem: analyzeSystem,
    checkSystem: checkSystem
  };
};

