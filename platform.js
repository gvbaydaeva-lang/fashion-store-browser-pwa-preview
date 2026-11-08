(function attachBrowserStorePlatform(global) {
  function normaliseRoute(hash) {
    const route = String(hash || '').replace(/^#\//, '');
    return route || 'home';
  }

  function createPlatform(windowLike) {
    function write(method, route) {
      const hash = `#/${route}`;
      windowLike.location.hash = hash;
      windowLike.history[method]({}, '', hash);
    }

    function push(route) { write('pushState', route); }
    function replace(route) { write('replaceState', route); }
    function onPopState(callback) {
      windowLike.addEventListener('popstate', () => callback(normaliseRoute(windowLike.location.hash)));
    }

    async function share({ title, text, url }) {
      if (typeof windowLike.navigator.share === 'function') {
        await windowLike.navigator.share({ title, text, url });
        return 'shared';
      }
      if (windowLike.navigator.clipboard?.writeText) {
        await windowLike.navigator.clipboard.writeText(url);
        return 'copied';
      }
      return 'manual';
    }

    return { push, replace, onPopState, share };
  }

  const api = { createPlatform, normaliseRoute };
  if (typeof module !== 'undefined') module.exports = api;
  if (global) global.BrowserStorePlatform = api;
}(typeof window === 'undefined' ? null : window));
