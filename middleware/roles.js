const staffOrAdmin = (req, res, next) => {
  const role = req.user?.role;
  if (role !== 'Admin' && role !== 'Staff') {
    return res.status(403).json({ error: 'Staff access required' });
  }
  return next();
};

module.exports = { staffOrAdmin };
