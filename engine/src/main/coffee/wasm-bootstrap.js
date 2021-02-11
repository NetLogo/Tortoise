import("./webpack-bootstrap").catch((e) =>
  console.error("Error importing `index.js`:", e)
);
// export default import("./webpack-bootstrap");