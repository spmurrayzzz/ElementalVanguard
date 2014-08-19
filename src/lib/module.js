/**
 * module.js
 *
 * The purpsoe of this script is to offer a lite-version of a shim
 * for the AMD-style `define` functionality. The API is the same, but
 * thats where the similarity ends. This does not load anything
 * asynchronously and as such requires all scripts to be loaded on the page
 * at some point.
 *
 * Usage:
 *
 *      define('someModule', ['dependency1', 'dependency2'], function( dep1, dep2 ){
 *          // Your module code here
 *      });
 *
 *      // Alternatively, without depdendencies
 *
 *      define('someModule', function(){
 *          // Your module code here
 *      });
 *
 *
 * @author Stephen Murray
 * @license MIT
 * @copyright 2014
 */

;(function(){

    'use strict';

    var moduleCache = this._moduleCache = {},
        queue = [];


    /**
     * Check whether `obj` is an array
     * @param  {any}  obj
     * @return {Boolean}
     */
    function isArray( obj ){
        return Object.prototype.toString.call(obj) === '[object Array]';
    }


    /**
     * Execute module and add to module cache
     * @param  {String} moduleName
     * @param  {Array} deps
     * @param  {Function} module
     * @return {void}
     */
    function cacheModule( moduleName, deps, module ){
        var depModules = [];

        deps = deps || [];
        for (var i = deps.length - 1; i >= 0; i--) {
            depModules[i] = moduleCache[deps[i]];
        }
        moduleCache[moduleName] = module.apply(null, depModules);
    }


    /**
     * Loop through the module queue to see if any are eligible
     * to be loaded. If loaded successfully, remove from queue.
     *
     * @return {void}
     */
    function checkQueue(){
        var item,
            deps,
            canLoad,
            i,
            j,
            loadedCount = 0;

        for (i = queue.length - 1; i >= 0; i--) {
            item = queue[i];
            deps = item.deps;
            canLoad = true;
            for (j = deps.length - 1; j >= 0; j--) {
                if ( typeof moduleCache[deps[j]] === 'undefined' ) {
                    canLoad = false;
                }
            }
            if ( canLoad ) {
                cacheModule(item.moduleName, item.deps, item.module);
                queue.splice(i, 1);
                loadedCount++;
            }
        }

        return loadedCount;
    }


    /**
     * AMD-ish module definition method
     *
     * @param  {String} moduleName
     * @param  {Array} deps
     * @param  {Function} module
     * @return {void}
     */
    this.define = function( moduleName, deps, module ){

        var depsType = typeof deps,
            canLoad = true,
            loadedCount = 1;


        // Check if dependencies were passed, if note make sure
        // we have the right semantic variable assignments
        if ( !isArray(deps) && depsType === 'function' ) {
            module = deps;
            deps = null;
        // If we have dependencies, lets make sure they're cached, otherwise
        // let's punt on loading this module for now
        } else if ( isArray(deps) ) {
            for (var i = deps.length - 1; i >= 0; i--) {
                if ( typeof moduleCache[deps[i]] === 'undefined' ) {
                    canLoad = false;
                }
            }
        }


        if ( canLoad ) {
            cacheModule(moduleName, deps, module);
            while ( loadedCount > 0 ) {
                loadedCount = checkQueue();
            }
        } else {
            queue.push({
                moduleName: moduleName,
                module: module,
                deps: deps || []
            });
        }

    };


}).call(window || {});
