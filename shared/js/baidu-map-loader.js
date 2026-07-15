/**
 * shared/js/baidu-map-loader.js
 * 共享百度地图异步加载器（单例 Promise + 回调队列 + 超时 + 重试）
 *
 * 修复：旧定时器泄漏、重复轮询、并发回调问题。
 * 保证失败后稳定降级且可以手动重试。
 *
 * Edge 兼容性修复：
 * - 设置 referrerPolicy 确保 Referer 正确发送，避免 AK 校验失败
 * - 增加超时时间到 15 秒，适应 Edge 跟踪防护的额外检查延迟
 * - 增加重试间隔到 1.5 秒，给 Edge 更多时间释放阻止状态
 * - 添加 failReason 供调用方判断失败原因
 */
(function (window) {
  'use strict';

  var AK = 'VeydduHr00O5f7G5GOzxlkZ6jOIaSFsH';
  var CALLBACK_NAME = '__scBaiduMapReady__';
  var SCRIPT_URL = 'https://api.map.baidu.com/api?v=3.0&ak=' + AK + '&callback=' + CALLBACK_NAME;
  var TIMEOUT_MS = 15000;     // 增加到 15 秒，Edge 跟踪防护可能导致加载变慢
  var MAX_RETRIES = 3;        // 增加到 3 次重试
  var RETRY_DELAY_MS = 1500;  // 重试间隔增加到 1.5 秒
  var READY_CHECK_INTERVAL = 100;
  var READY_CHECK_MAX = 50;   // 增加到 5 秒轮询，Edge 中 BMap 初始化可能更慢

  var state = 'idle'; // idle | loading | loaded | failed
  var promise = null;
  var resolveFn = null;
  var rejectFn = null;
  var scriptEl = null;
  var timeoutTimer = null;
  var pollTimer = null;
  var retryCount = 0;
  var settled = false; // ensures resolve/reject called exactly once
  var failReason = '';  // 记录失败原因供调用方使用

  function isReady() {
    return typeof window.BMap !== 'undefined' &&
      typeof window.BMap === 'object' &&
      typeof window.BMap.Map === 'function';
  }

  function cleanupScript() {
    if (scriptEl && scriptEl.parentNode) {
      try { scriptEl.parentNode.removeChild(scriptEl); } catch (e) {}
    }
    scriptEl = null;
  }

  function cleanupTimers() {
    if (timeoutTimer) { clearTimeout(timeoutTimer); timeoutTimer = null; }
    if (pollTimer) { clearTimeout(pollTimer); pollTimer = null; }
  }

  function fail(reason) {
    if (settled) return;
    settled = true;
    state = 'failed';
    failReason = reason || 'Baidu Map load failed';
    cleanupTimers();
    cleanupScript();
    if (rejectFn) {
      rejectFn(new Error(failReason));
    }
  }

  function succeed() {
    if (settled) return;
    settled = true;
    state = 'loaded';
    cleanupTimers();
    if (resolveFn) {
      resolveFn();
    }
  }

  function pollForReady() {
    // Prevent concurrent polling
    if (pollTimer) clearTimeout(pollTimer);
    var tries = 0;
    function check() {
      if (settled) return;
      if (isReady()) {
        succeed();
        return;
      }
      tries++;
      if (tries < READY_CHECK_MAX) {
        pollTimer = setTimeout(check, READY_CHECK_INTERVAL);
      } else {
        // Script loaded but BMap not available
        if (retryCount < MAX_RETRIES) {
          retryCount++;
          cleanupScript();
          cleanupTimers();
          startLoad();
        } else {
          fail('BMap not available after retries (possible AK domain restriction or browser privacy settings)');
        }
      }
    }
    check();
  }

  function startLoad() {
    // Clean up any previous attempt's resources
    cleanupTimers();
    cleanupScript();

    // Set up the global callback
    window[CALLBACK_NAME] = function () {
      if (settled) return;
      pollForReady();
    };

    scriptEl = document.createElement('script');
    scriptEl.type = 'text/javascript';
    scriptEl.async = true;
    scriptEl.src = SCRIPT_URL;

    // 关键修复：设置 referrerPolicy 确保 Referer 正确发送
    // Edge 默认的 strict-origin-when-cross-origin 可能导致百度地图 AK 校验失败
    // no-referrer-when-downgrade 确保同源和 HTTPS→HTTPS 跨域请求发送完整 Referer
    try { scriptEl.referrerPolicy = 'no-referrer-when-downgrade'; } catch (e) {}

    scriptEl.onload = function () {
      // Script downloaded. If callback hasn't fired yet, start polling as fallback.
      // The callback itself also calls pollForReady, but pollForReady
      // guards against concurrent polling.
      if (!settled && state === 'loading') {
        setTimeout(function () {
          if (!settled && state === 'loading') {
            pollForReady();
          }
        }, 50);
      }
    };

    scriptEl.onerror = function () {
      if (settled) return;
      if (retryCount < MAX_RETRIES) {
        retryCount++;
        cleanupScript();
        cleanupTimers();
        setTimeout(startLoad, RETRY_DELAY_MS);
      } else {
        fail('Script load error (possibly blocked by browser tracking prevention or network issue)');
      }
    };

    // Timeout protection — single timer per attempt
    timeoutTimer = setTimeout(function () {
      if (settled) return;
      if (state === 'loading') {
        if (retryCount < MAX_RETRIES) {
          retryCount++;
          cleanupScript();
          cleanupTimers();
          startLoad();
        } else {
          fail('Load timeout');
        }
      }
    }, TIMEOUT_MS);

    document.head.appendChild(scriptEl);
  }

  function load() {
    if (state === 'loaded' && isReady()) {
      return Promise.resolve();
    }
    if (promise && (state === 'loading' || state === 'loaded')) {
      return promise;
    }

    // Start fresh (idle or failed)
    state = 'loading';
    retryCount = 0;
    settled = false;
    failReason = '';
    promise = new Promise(function (resolve, reject) {
      resolveFn = resolve;
      rejectFn = reject;
      startLoad();
    });
    return promise;
  }

  function reset() {
    state = 'idle';
    promise = null;
    resolveFn = null;
    rejectFn = null;
    settled = false;
    retryCount = 0;
    failReason = '';
    cleanupTimers();
    cleanupScript();
  }

  function getState() {
    return state;
  }

  function getFailReason() {
    return failReason;
  }

  window.ScBaiduMapLoader = {
    load: load,
    reset: reset,
    isReady: isReady,
    getState: getState,
    getFailReason: getFailReason,
    AK: AK
  };
})(window);
