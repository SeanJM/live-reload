/**
* A Script to automatically reload tracked files.
* Copyright (C) 2015 Sean J. MacIsaac
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
*
* Contact: seanjmacisaac@gmail.com
*/
function liveReload() {
  var timestamp = new Date().getTime();
  var settings  = {};
  var interval;
  function forEach (array, callback) {
    var stop;
    for (var i = 0, n = array.length; i < n; i++) {
      stop = callback(array[i], i);
      if (stop === false) {
        return false;
      }
    }
  }
  function isUndefined (value) {
    return typeof value === 'undefined';
  }
  function refresh (fileOpt) {
    var isAddress = new RegExp(fileOpt.file + '$').test(window.location.pathname);
    var oldNode;
    var newNode;
    if (fileOpt.type === 'css') {
      oldNode      = document.querySelector(fileOpt.selector);
      newNode      = document.createElement('link');
      newNode.rel  = 'stylesheet';
      newNode.href = fileOpt.file;
      oldNode.parentNode.replaceChild(newNode, oldNode);
    } else if (fileOpt.type === 'js') {
      window.location.reload();
    } else if (fileOpt.type === 'json' && /liveReload/.test(fileOpt.file)) {
      init();
    } else if (fileOpt.type === 'template') {
      window.location.reload();
    } else if (fileOpt.type === 'html' && isAddress) {
      window.location.reload();
    } else {
      window.location.reload();
    }
  }
  function getSettings (file) {
    var ext      = file.match(/\.([a-z]+)$/)[1];
    var settings = {
      file : file,
      type : ext
    };
    var node;
    if (ext === 'js') {
      settings.selector = 'script[src="' + file + '"]';
    } else if (ext === 'css') {
      settings.selector = 'link[href="' + file + '"]';
    } else if (ext === 'html' && /template/.test(file)) {
      settings.type = 'template';
    }
    return settings;
  }
  function get (file) {
    var request = new XMLHttpRequest();
    var success;
    var fail;
    var self = {
      success: function (callback) {
        success = callback;
        return self;
      },
      fail   : function (callback) {
        fail = callback;
        return self;
      }
    };
    function responseValue(response) {
      var value = {
        value  : response.currentTarget.response,
        string : response.currentTarget.response,
        type   : response.currentTarget.responseURL.match(/\.([a-z]+)$/)[1],
        url    : response.currentTarget.responseURL,
        file   : file
      };
      if (value.type === 'json') {
        value.value = JSON.parse(response.currentTarget.response);
      }
      return value;
    }
    request.open('get', file, true);
    request.send();
    request.onreadystatechange = function (response) {
      if (response.currentTarget.readyState === 4) {
        if (response.currentTarget.status === 200 && typeof success === 'function') {
          success.call(this, responseValue(response));
        } else if (response.currentTarget.status !== 200 && typeof fail === 'function') {
          fail.call(this, response);
        }
      }
    };
    return self;
  }
  function check (now) {
    if (now - timestamp > 1000) {
      for (var file in settings) {
        get(file).success(function (response) {
          var opt = settings[response.file];
          if (!isUndefined(opt.string) && opt.string !== response.string) {
            refresh(opt, response);
            opt.string = response.string;
          } else if (isUndefined(opt.string)) {
            opt.string = response.string;
          }
        });
      }
      timestamp = now;
    }
    interval = setTimeout(function () {
      check(new Date().getTime());
    }, 100);
  }
  function init() {
    forEach(document.querySelectorAll('script'), function (node) {
      var jsonFile = node.getAttribute('src').replace(/js$/, 'json');
      if (/liveReload\.js$/.test(node.src)) {
        get(jsonFile)
        .success(function (response) {
          var files = response.value;
          files.push(jsonFile); // Track the JSON file
          console.log('LiveReload started for: ' + files.join(', '));
          for (var i = 0, n = files.length; i < n; i++) {
            settings[files[i]] = getSettings(files[i]);
          }
          check(new Date().getTime());
        })
        .fail(function () {
          throw 'You must include a file named \'liveReload.json\' in the same' +
          ' directory as \'liveReload.js\', \'liveReload.json\' should contain ' +
          'an array with all the files you want to reload.';
        });
        return false;
      }
    });
  }
  init();
}

liveReload();
