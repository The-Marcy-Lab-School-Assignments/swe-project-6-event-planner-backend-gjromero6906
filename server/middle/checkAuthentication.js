
const checkAuthentication = (req, res, next) => {
  const { userId } = req.session;

  if (!userId) {
    return res.status(401).send({ message: 'You must be logged in to do that.' });
  }

  next();
};

module.exports = checkAuthentication;