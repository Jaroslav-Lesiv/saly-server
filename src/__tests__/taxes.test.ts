import TaxModel from '../modules/taxes/taxes.model';
import request from 'supertest';

import app from '../app';
import { Database } from '../services/database';

const database = new Database();

describe('Test taxes api', () => {
  beforeAll(async () => {
    await database.connect();
  }, 10000);

  afterAll(async () => {
    await database.disconnect();
  });

  test('Get list of taxes', async () => {
    try {
      const response = await request(app).get('/api/v1/taxes');
      expect(response.statusCode).toBe(200);
    } catch (error) {
      throw error;
    }
  });

  // test('Create tax', async () => {
  //   try {
  //     const response = await request(app).post('/api/v1/taxes').send({});
  //     expect(response.statusCode).toBe(400);
  //   } catch (error) {
  //     throw error;
  //   }
  // });
});

describe('Create tax testing', () => {
  beforeAll(async () => {
    await database.connect();
  }, 10000);

  afterAll(async () => {
    await database.disconnect();
  });

  test('Should return error if req body is empty ', async () => {
    try {
      const response = await request(app).post('/api/v1/taxes').send({});
      expect(response.statusCode).toBe(400);
    } catch (error) {
      throw error;
    }
  });

  test('Should create tax successfully ', async () => {
    try {
      const response = await request(app).post('/api/v1/taxes').send({
        name: 'Tax1',
        active: true,
        amount: 10,
      });
      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject({
        name: 'Tax1',
        active: true,
        amount: 10,
      });
    } catch (error) {
      throw error;
    }
  });

  test('Should create inactive tax successfully ', async () => {
    try {
      const response = await request(app).post('/api/v1/taxes').send({
        name: 'Tax1',
        active: false,
        amount: 10,
      });
      expect(response.body.active).toBe(false);
    } catch (error) {
      throw error;
    }
  });

  test('Should create tax with external ', async () => {
    try {
      const response = await request(app).post('/api/v1/taxes').send({
        name: 'Tax1',
        active: false,
        amount: 10,
        external: 'id',
      });
      expect(response.body.external).toBe('id');
    } catch (error) {
      throw error;
    }
  });

  test('Should not create tax with negative amount', async () => {
    try {
      const response = await request(app).post('/api/v1/taxes').send({
        name: 'Tax1',
        active: false,
        amount: -1,
      });
      expect(response.statusCode).toBe(400);
    } catch (error) {
      throw error;
    }
  });

  test('Should not create tax with amount more than 100', async () => {
    try {
      const response = await request(app).post('/api/v1/taxes').send({
        name: 'Tax1',
        active: false,
        amount: 101,
      });
      expect(response.statusCode).toBe(400);
    } catch (error) {
      throw error;
    }
  });

  test('Should not create tax with empty name', async () => {
    try {
      const response = await request(app).post('/api/v1/taxes').send({
        name: '',
        active: false,
        amount: 99,
      });
      expect(response.statusCode).toBe(400);
    } catch (error) {
      throw error;
    }
  });

  test('Should not create tax with deleted status', async () => {
    try {
      const response = await request(app).post('/api/v1/taxes').send({
        name: '',
        active: false,
        deleted: true,
        amount: 99,
      });
      expect(response.statusCode).toBe(400);
    } catch (error) {
      throw error;
    }
  });
});

describe('Update tax testing', () => {
  let tax: any = null;
  beforeEach(async () => {
    const response = await request(app).post('/api/v1/taxes').send({
      name: 'Tax',
      active: true,
      amount: 10,
    });
    tax = response.body;
  });
  afterEach(async () => {
    await TaxModel.findByIdAndRemove(tax._id);
  });

  beforeAll(async () => {
    await database.connect();
  }, 10000);

  afterAll(async () => {
    await database.disconnect();
  });

  test('Should be updated successfully', async () => {
    try {
      const response = await request(app).put(`/api/v1/taxes/${tax._id}`).send({
        name: 'Tax 8%',
        amount: 8,
        active: false,
      });
      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject({
        name: 'Tax 8%',
        amount: 8,
        active: false,
      });
    } catch (error) {
      throw error;
    }
  });

  test('Should update external', async () => {
    try {
      const response = await request(app).put(`/api/v1/taxes/${tax._id}`).send({
        name: 'Tax 8%',
        amount: 8,
        active: false,
        external: 'external_id',
      });
      expect(response.body.external).toBe('external_id');
    } catch (error) {
      throw error;
    }
  });

  test('Should not update tax with negative amount', async () => {
    try {
      const response = await request(app).put(`/api/v1/taxes/${tax._id}`).send({
        name: 'Tax -8%',
        amount: -8,
        active: false,
        external: 'external_id',
      });
      expect(response.statusCode).toBe(400);
    } catch (error) {
      throw error;
    }
  });

  test('Should not update tax with amount more than 100', async () => {
    try {
      try {
        const response = await request(app).put(`/api/v1/taxes/${tax._id}`).send({
          name: 'Tax 101%',
          amount: 101,
          active: false,
          external: 'external_id',
        });
        expect(response.statusCode).toBe(400);
      } catch (error) {
        throw error;
      }
    } catch (error) {
      throw error;
    }
  });

  test('Should not update tax with empty name', async () => {
    try {
      try {
        const response = await request(app).put(`/api/v1/taxes/${tax._id}`).send({
          name: '',
          amount: 8,
          active: false,
          external: 'external_id',
        });
        expect(response.statusCode).toBe(400);
      } catch (error) {
        throw error;
      }
    } catch (error) {
      throw error;
    }
  });

  test('Should not update tax with deleted status', async () => {
    try {
      const response = await request(app).put(`/api/v1/taxes/${tax._id}`).send({
        name: '',
        active: false,
        deleted: true,
        amount: 99,
      });
      expect(response.statusCode).toBe(400);
    } catch (error) {
      throw error;
    }
  });
});

describe('Removing tax', () => {
  let tax: any = null;
  beforeEach(async () => {
    const response = await request(app).post('/api/v1/taxes').send({
      name: 'Tax',
      active: true,
      amount: 10,
    });
    tax = response.body;
  });
  afterEach(async () => {
    await TaxModel.findByIdAndRemove(tax._id);
  });

  beforeAll(async () => {
    await database.connect();
  }, 10000);

  afterAll(async () => {
    await database.disconnect();
  });

  test('Should be deleted successfully (Soft delete)', async () => {
    try {
      const response = await request(app).delete(`/api/v1/taxes/${tax._id}`).send({});
      expect(response.body.deleted).toBe(true);
    } catch (error) {
      throw error;
    }
  });

  test('Should not show in the list deleted taxes', async () => {
    try {
      const response = await request(app).delete(`/api/v1/taxes/${tax._id}`).send({});
      expect(response.body.deleted).toBe(true);
    } catch (error) {
      throw error;
    }
  });
});
