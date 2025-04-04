(function() {
  const routes = {
    hashed: ["aichess", "lazychess", "matrix"],
    nonhash: ["unblocked", "unblocked2"]
  };

  const currentPath = window.location.pathname.slice(1);
  const isHashRoute = window.location.hash.startsWith('#/');

  if (routes.hashed.includes(currentPath) && !isHashRoute) {
    window.location.replace('/#/' + currentPath);
  }
  
  if (routes.nonhash.includes(currentPath)) {
    if (isHashRoute && window.location.hash !== '#/' + currentPath) {
      window.location.replace('/' + currentPath);
    } else if (!isHashRoute && window.location.pathname !== '/' + currentPath) {
      window.location.replace('/' + currentPath);
    }
  }
})();
