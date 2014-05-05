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

  var connect = function(options, cb) {
    _client = net.connect(options, function() {
      cb();
    });

    _client.on('data', function(data) {
      var str = data.toString('utf8');
      var lines;
      var callback;
      var json;

      lines = str.split('\n');
      _.each(lines, function(line) {
        if (line.length > 0) {
          json = JSON.parse(line);

          if (json.responseType === 'stdout') {
            if (_stdoutCb) {
              _stdoutCb(json.stdout);
            }
          }
          else if (json.responseType === 'stderr') {
            if (_stderrCb) {
              _stderrCb(json.stderr);
            }
          }
          else if (json.responseType === 'response') {
            callback = cbt.fetch(json.request);
            callback(json.response);
          }
        }
      });
    });


    _client.on('end', function() {
      var callback = cbt.fetch('quit');
      if (callback) {
        callback();
      }
    });
  };



  var listSystems = function(cb) {
    cbt.trackById('list systems', cb);
    _client.write('list systems\n');
  };



  var listContainers = function(systemId, cb) {
    cbt.trackById('list containers', cb);
    _client.write('list containers ' + systemId + '\n');
  };



  var buildContainer = function(systemId, containerId, cb) {
    cbt.trackById('build container', cb);
    _client.write('build container ' + systemId + ' ' + containerId + '\n');
  };



  var ioHandlers = function(stdoutCb, stderrCb) {
    _stdoutCb = stdoutCb;
    _stderrCb = stderrCb;
  };



  var quit = function(cb) {
    cbt.trackById('quit', cb);
    _client.write('quit\n');
  };



  return {
    connect: connect,
    quit: quit,
    listSystems: listSystems,
    listContainers: listContainers,
    buildContainer: buildContainer,
    ioHandlers: ioHandlers
  };
};

