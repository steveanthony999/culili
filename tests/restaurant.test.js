const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const Restaurant = require('../models/restaurant');

let server;

beforeAll(() => {
  server = app.listen(0);
});

describe('Update Restaurant Endpoint', () => {
  let restaurant;

  beforeEach(async () => {
    restaurant = new Restaurant({
      name: 'Test Restaurant',
      location: {
        country: 'US',
        address: '123 Main St',
        city: 'Anytown',
        stateOrProvinceOrCounty: 'CA',
        zipOrPostcode: '12345',
      },
      contact: '1234567890',
    });
    await restaurant.save();
  });

  afterEach(async () => {
    await restaurant.deleteOne({ _id: restaurant._id });
  });

  it('should update a restaurant', async () => {
    const res = await request(app)
      .put(`/api/restaurants/${restaurant._id}`)
      .send({
        name: 'Updated Restaurant',
      });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Updated Restaurant');
  });
});

describe('Delete Restaurant Endpoint', () => {
  let restaurant;

  beforeEach(async () => {
    restaurant = new Restaurant({
      name: 'Test Restaurant',
      location: {
        country: 'US',
        address: '123 Main St',
        city: 'Anytown',
        stateOrProvinceOrCounty: 'CA',
        zipOrPostcode: '12345',
      },
      contact: '1234567890',
    });
    await restaurant.save();
  });

  it('should delete a restaurant', async () => {
    const res = await request(app).delete(`/api/restaurants/${restaurant._id}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Restaurant deleted successfully');

    const foundRestaurant = await Restaurant.findById(restaurant._id);
    expect(foundRestaurant).toBeNull();
  });
});

describe('Edge Cases for Restaurant Endpoints', () => {
  it('should return 404 when updating a non-existent restaurant', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .put(`/api/restaurants/${nonExistentId}`)
      .send({
        name: 'Updated Restaurant',
      });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Restaurant not found');
  });

  it('should return 404 when deleting a non-existent restaurant', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const res = await request(app).delete(`/api/restaurants/${nonExistentId}`);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Restaurant not found');
  });

  it('should return 400 when updating a restaurant with invalid data', async () => {
    const restaurant = new Restaurant({
      name: 'Test Restaurant',
      location: {
        country: 'US',
        address: '123 Main St',
        city: 'Anytown',
        stateOrProvinceOrCounty: 'CA',
        zipOrPostcode: '12345',
      },
      contact: '1234567890',
    });
    await restaurant.save();

    const res = await request(app)
      .put(`/api/restaurants/${restaurant._id}`)
      .send({
        name: '',
      });

    await restaurant.deleteOne({ _id: restaurant._id });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Path `name` is required.');
  });
});

afterAll(async () => {
  server.close();
  await mongoose.connection.close();
});
