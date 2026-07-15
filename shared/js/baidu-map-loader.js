/**
 * shared/js/baidu-map-loader.js
 * 共享百度地图异步加载器（单例 Promise + 回调队列 + 超时 + 重试）
 *
 * 使用百度地图异步 callback 方式加载，避免 document.write 问题：
 *   https://api.map.baidu.com/api?v=3.0&ak=AK&callback=__scBaiduMapReady__
 *
 * 用法：
 *   ScBaiduMapLoader.load().then(function() { /* BMap 可用 *\/ }).catch(function() { /* 降级 *\/ });
 *   ScBaiduMapLoader.reset();  // 重置状态以重试
 *   ScBaiduMapLoader.isReady(); // 快速检测
 */
(function (window) {
  'use strict';

  var AK = 'VeydduHr00O5f7G5GOzxlkZ6jOIaSFsH';
  var CALLBACK_NAME = '__scBaiduMapReady__';
  var SCRIPT_URL = 'https://api.map.baidu.com/api?v=3.0&ak=' + AK + '&callback=' + CALLBACK_NAME;
  var TIMEOUT_MS = 8000;
  var MAX_RETRIES = 2;
  var READY_CHECK_INTERVAL = 100;
  var READY_CHECK_MAX = 30; // 3 seconds of polling after script load

  var state = 'idle'; // idle | loading | loaded | failed
  var promise = null;
  var resolveFn = null;
  var rejectFn = null;
  var scriptEl = null;
  var timeoutTimer = null;
  var retryCount = 0;

  function isReady() {
    return typeof window.BMap !== 'undefined' &&
      typeof window.BMap === 'object' &&
      typeof window.BMap.Map === 'function';
  }

  function cleanupScript() {
    if (scriptEl && scriptEl.parentNode) {
      scriptEl.parentNode.removeChild(scriptEl);
    }
    scriptEl = null;
  }

  function cleanupTimers() {
    if (timeoutTimer) {
      clearTimeout(timeoutTimer);
      timeoutTimer = null;
    }
  }

  function fail(reason) {
    state = 'failed';
    cleanupTimers();
    cleanupScript();
    if (rejectFn) {
      rejectFn(new Error(reason || 'Baidu Map load failed'));
    }
  }

  function succeed() {
    state = 'loaded';
    cleanupTimers();
    if (resolveFn) {
      resolveFn();
    }
  }

  function pollForReady() {
    var tries = 0;
    function check() {
      if (isReady()) {
        succeed();
        return;
      }
      tries++;
      if (tries < READY_CHECK_MAX) {
        setTimeout(check, READY_CHECK_INTERVAL);
      } else {
        // Script loaded but BMap not available - might be AK restriction
        if (retryCount < MAX_RETRIES) {
          retryCount++;
          cleanupScript();
          startLoad();
        } else {
          fail('BMap not available after retries (possible AK domain restriction)');
        }
      }
    }
    check();
  }

  function startLoad() {
    // Set up the global callback - Baidu will call this when the API is ready
    window[CALLBACK_NAME] = function () {
      // The callback is called, but BMap might still need a moment
      pollForReady();
    };

    scriptEl = document.createElement('script');
    scriptEl.type = 'text/javascript';
    scriptEl.async = true;
    scriptEl.src = SCRIPT_URL;

    scriptEl.onload = function () {
      // Script downloaded; the callback should fire, but poll as fallback
      // in case callback was already called or doesn't fire
      if (state === 'loading') {
        // Give the callback a chance, then start polling
        setTimeout(function () {
          if (state === 'loading') {
            pollForReady();
          }
        }, 50);
      }
    };

    scriptEl.onerror = function () {
      if (retryCount < MAX_RETRIES) {
        retryCount++;
        cleanupScript();
        // Brief delay before retry
        setTimeout(startLoad, 500);
      } else {
        fail('Script load error');
      }
    };

    // Timeout protection
    timeoutTimer = setTimeout(function () {
      if (state === 'loading') {
        if (retryCount < MAX_RETRIES) {
          retryCount++;
          cleanupScript();
          startLoad();
        } else {
          fail('Load timeout');
        }
      }
    }, TIMEOUT_MS);

    document.head.appendChild(scriptEl);
  }

  /**
   * Load the Baidu Map API. Returns a singleton Promise.
   * Multiple callers all receive the same Promise result.
   */
  function load() {
    if (state === 'loaded' && isReady()) {
      return Promise.resolve();
    }
    if (promise && state === 'loading') {
      return promise;
    }
    if (promise && state === 'loaded') {
      // BMap was loaded but somehow not ready now (shouldn't happen normally)
      return promise;
    }

    // Start fresh (idle or failed)
    state = 'loading';
    retryCount = 0;
    promise = new Promise(function (resolve, reject) {
      resolveFn = resolve;
      rejectFn = reject;
      startLoad();
    });
    return promise;
  }

  /**
   * Reset the loader state to allow retry from failed state.
   * Call this when user clicks "retry" on offline map.
   */
  function reset() {
    state = 'idle';
    promise = null;
    resolveFn = null;
    rejectFn = null;
    cleanupTimers();
    cleanupScript();
    retryCount = 0;
  }

  /**
   * Get current state for UI feedback.
   */
  function getState() {
    return state;
  }

  // Export
  window.ScBaiduMapLoader = {
    load: load,
    reset: reset,
    isReady: isReady,
    getState: getState,
    AK: AK
  };
})(window);
