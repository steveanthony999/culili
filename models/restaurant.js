const mongoose = require('mongoose');

const { supportedCountries } = require('../config/countries');

const countryCodes = supportedCountries.map((country) => country.code);

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    country: {
      type: String,
      required: true,
      enum: countryCodes,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    suiteOrUnit: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    stateOrProvinceOrCounty: {
      // Name can be changed based on preference
      type: String,
      required: true,
      trim: true,
    },
    zipOrPostcode: {
      // Name can be changed based on preference
      type: String,
      required: true,
      trim: true,
    },
  },

  contact: {
    type: String,
    trim: true,
  },
  menus: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Menu',
    },
  ],
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;
