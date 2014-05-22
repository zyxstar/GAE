(function(){

  'use strict';

  // Defer Qunit so RequireJS can work its magic and resolve all modules.
  QUnit.config.autostart = false;

  // Configure RequireJS so it resolves relative module paths from the `src`
  // folder.
  require.config({
    baseUrl: '../',
    paths: {
        jquery: 'vendor/jquery2.0.3'
    }
  });


  require(['test/testCommCase'], QUnit.start);

}());
