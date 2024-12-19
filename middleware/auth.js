// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// const auth = async (req, res, next) => {
//   try {
//     const token = req.header('Authorization').replace('Bearer ', '');
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.id);

//     if (!user) {
//       throw new Error();
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     res.status(401).send({ error: 'Please authenticate.' });
//   }
// };

// const adminAuth = async (req, res, next) => {
//   try {
//     await auth(req, res, () => {});
//     if (req.user.role !== 'admin') {
//       throw new Error();
//     }
//     next();
//   } catch (error) {
//     res.status(403).send({ error: 'Admin access required.' });
//   }
// };

// module.exports = { auth, adminAuth };

// console.log('Auth middleware created.');

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new Error();
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {});
    if (req.user.role !== 'admin') {
      throw new Error();
    }
    next();
  } catch (error) {
    res.status(403).send({ error: 'Admin access required.' });
  }
};

module.exports = { auth, adminAuth };
