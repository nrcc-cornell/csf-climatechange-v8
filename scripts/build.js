const rewire = require('rewire');
const path = require('path');

// Pointing to file which we want to re-wire — this is original build script
const defaults = rewire('custom-react-scripts/scripts/build.js');

// Getting configuration from original build script
let config = defaults.__get__('config');

// Rename bundle path and filename, to what CSF site expects
config.output.filename = 'js/toolinit.js';

// Rename css path and filename, to what CSF load-dependencies.js expects.
// 'load-dependencies.js' is placed in public/js, and loaded by CSF site.
// It loads this specified css file, so path/filename needs to be correct.
config.plugins[4].filename = 'style/csf-climatechange-v8.css';