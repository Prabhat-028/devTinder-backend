const adminAuth = (req, res, next) => {
  console.log("adminAuth is called");
  const token = "xyz";
  const adminAuthorized = token === "xyz";
  if (!adminAuthorized) {
    res.status(401).send("admin is unathorised");
  } else {
    next();
  }
};

const testAuth = (req, res, next) => {
  console.log("testAuth is called");
  const token = "xyz";
  const adminAuthorized = token === "xyzdd";
  if (!adminAuthorized) {
    res.status(401).send("admin is unathorised");
  } else {
    next();
  }
};

module.exports = {
    adminAuth,
    testAuth,
};
