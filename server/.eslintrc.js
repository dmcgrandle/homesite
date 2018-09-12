module.exports = {
  "extends": "airbnb-base",
  "rules": {
    "prefer-template": 0,
    "prefer-destructuring": 0,
    "no-console": 0,
    "no-underscore-dangle": ["error", { "allow": ["_id"] }], // We need _id for mongodb client
  },
};
