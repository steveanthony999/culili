const Restaurant = require('../models/restaurant');
const CustomError = require('../utils/CustomError');

exports.getAllRestaurants = async (req, res, next) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json(restaurants);
  } catch (error) {
    next(new CustomError(500, 'Server Error'));
  }
};

exports.createRestaurant = async (req, res, next) => {
  try {
    const newRestaurant = await Restaurant.create(req.body);
    res.status(201).json(newRestaurant);
  } catch (error) {
    next(new CustomError(500, 'Error creating restaurant'));
  }
};
