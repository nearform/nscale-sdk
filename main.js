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



/**
 * nfd client sdk
 */
module.exports = function() {
  var _client;

  var connect = function(options, cb) {
    _client = net.connect(options, function() {
      cb();
    });

    _client.on('data', function(data) {
      var str = data.toString('utf8');
      var callback;
      var json;

      json = JSON.parse(str);
      callback = cbt.fetch(json.request);
      callback(json);
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


  var quit = function(cb) {
    cbt.trackById('quit', cb);
    _client.write('quit\n');
  };


  return {
    connect: connect,
    quit: quit,
    listSystems: listSystems,
    listContainers: listContainers
  };
};

