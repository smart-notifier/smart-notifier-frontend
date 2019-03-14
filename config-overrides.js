const addDecoratorsLegacy = require('customize-cra').addDecoratorsLegacy;
const override = require("customize-cra").override;

/* config-overrides.js */
module.exports = override(addDecoratorsLegacy());
