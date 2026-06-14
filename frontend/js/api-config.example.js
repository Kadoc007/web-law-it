(function () {
  const localHosts = new Set(["localhost", "127.0.0.1", ""]);
  const isLocal = localHosts.has(window.location.hostname);

  window.API_CONFIG = {
    baseUrl: isLocal ? "http://localhost:3000" : window.location.origin
  };
})();
