const roleMiddleware = (requiredRole) => {
  return (req, res, next) => {
    if (req.user?.role !== requiredRole) {
      return res.status(403).json({ msg: "Access denied: only " + requiredRole });
    }
    next();
  };
};

module.exports = roleMiddleware;
