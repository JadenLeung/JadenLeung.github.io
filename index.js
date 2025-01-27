(function() {
    // Define the routes with and without hash
    const hashed = ["aichess", "lazychess", "matrix"];
    const nonhash = ["unblocked"];

    const currentPath = window.location.pathname.slice(1); // Remove leading "/"

    // Handle hash-based routes
    if (hashed.includes(currentPath)) {
      if (!window.location.hash) {
        // If no hash is present, redirect to the hash route
        window.location.replace('/#/' + currentPath);
      }
    }

    // Handle non-hash routes (like /unblocked)
    if (nonhash.includes(currentPath) && window.location.hash !== '#/' + currentPath) {
      // If it's a non-hash route and not already at the correct path, redirect to it
      window.location.replace('/' + currentPath);
    }

    // Handle specific redirect for /unblocked if it's visited with the hash route
    if (window.location.hash === '#/unblocked' && window.location.pathname !== '/unblocked') {
      window.location.replace('/unblocked'); // Redirect to static unblocked.html
    }
  })();