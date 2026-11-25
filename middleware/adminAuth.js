function adminAuth(req, res, next) {
  if (!process.env.ADMIN_PASSWORD) {
    return next(new Error('ADMIN_PASSWORD is not configured'));
  }

  if (req.body.adminPassword !== process.env.ADMIN_PASSWORD) {
    const confirmationUrl = `${req.baseUrl}${req.path}?error=invalid-password`;
    return res.redirect(303, confirmationUrl);
  }

  next();
}

module.exports = adminAuth;