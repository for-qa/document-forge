const app = require('./app');

const PORT = process.env.PORT || 3000;

/**
 * Entry Point Execution strictly scoped to starting the http server.
 */
app.listen(PORT, () => {
  console.log(`Server strictly established using Clean Architecture on http://localhost:${PORT}`);
});
