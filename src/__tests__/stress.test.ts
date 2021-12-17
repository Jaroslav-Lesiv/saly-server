import OptionModel from '../modules/options/options.model';
import BranchModel from '../modules/branches/branches.model';
import IngredientModel from '../modules/ingredients/ingredients.model';
import TaxModel from '../modules/taxes/taxes.model';
import { Database } from '../services/database';

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const database = new Database();

const ingredient = {
  name: `Ingredient `,
  active: true,
  price: 20,
  calories: {
    protein: 90,
    fat: 0,
    carbohydrate: '10',
  },
};

const tax = {
  name: 'Tax',
  active: true,
  amount: 5,
};

const branch = {
  active: true,
  name: 'Branch',
  description: 'Lorem ipsum dolor sit amet',
  image: '',
  phone: '+380676358005',
  address: {
    lat: 10,
    lng: 10,
    label: "Here, it's here",
  },
};

const option = {
  name: 'Option',
  active: true,
  image: '',
  price: {
    regular_price: 120,
    sale_price: 100,
    calculated: false,
  },
  tax: '618cab565611bb7bb8e14dc4',
  cost: {
    regular_cost: 80,
    calculated: false,
  },
  ingredients: [],
  branches: { all: true, list: ['618cb52b8fa80b647d20a02e'] },
};

describe('Test taxes api', () => {
  beforeEach(async () => {
    await database.connect();
  }, 10000);

  afterEach(async () => {
    await database.disconnect();
  });

  //   afterAll(async () => {
  //     await database.disconnect();
  //   });

  test('Mocl', async () => {
    try {
      for (let client = 0; client < 100; client++) {
        // ingredients
        let _ingredients = [];
        for (let i = 0; i < 1000; i++) {
          _ingredients.push({ ...ingredient, price: i, name: `Ingredient ${i}` });
        }
        console.time(`${client} ---- insert ingredients`);
        const ingredients = await IngredientModel.insertMany(_ingredients);
        console.time(`${client} ---- insert ingredients`);

        console.time(`${client} ---- insert taxes`);
        // tax
        let _taxes = [];
        for (let i = 0; i < 5; i++) {
          _taxes.push({ ...tax, name: `Tax ${i}` });
        }
        const taxes = await TaxModel.insertMany(_taxes);
        console.timeEnd(`${client} ---- insert taxes`);

        console.time(`${client} ---- insert branches`);
        // branches
        let _branches = [];
        for (let i = 0; i < 100; i++) {
          _branches.push({ ...branch, name: `Branch ${i}` });
        }
        const branches = await BranchModel.insertMany(_branches);
        console.timeEnd(`${client} ---- insert branches`);

        // options
        let _options = [];
        for (let i = 0; i < 1000; i++) {
          _options.push(
            new OptionModel({
              ...option,
              name: `Option ${i}`,
              price: {
                regular_price: i + 30,
                sale_price: i + 20,
                calculated: Boolean(i % 2),
              },
              tax: taxes[i % 5],
              cost: {
                regular_cost: i,
                calculated: Boolean(i % 2),
              },
              ingredients: [
                ingredients[0],
                ingredients[getRandomInt(1, ingredients.length - 1)],
                ingredients[getRandomInt(1, ingredients.length - 1)],
                ingredients[getRandomInt(1, ingredients.length - 1)],
                ingredients[getRandomInt(1, ingredients.length - 1)],
                ingredients[getRandomInt(1, ingredients.length - 1)],
                ingredients[getRandomInt(1, ingredients.length - 1)],
              ],
              branches: {
                all: true,
                list: [
                  branches[0],
                  branches[4],
                  branches[getRandomInt(1, branches.length - 1)],
                  branches[getRandomInt(1, branches.length - 1)],
                  branches[getRandomInt(1, branches.length - 1)],
                ],
              },
            }),
          );
        }

        console.time(`${client} ---- insert options`);
        await OptionModel.collection.insertMany(_options);
        console.timeEnd(`${client} ---- insert options`);
        // console.log(options?.length)
        // products
        // let _products = [];
        // for (let i = 0; i < 500; i++) {
        //   _products.push({
        //     ...option,
        //     name: `product ${i}`,
        //     price: {
        //       regular_price: i + 30,
        //       sale_price: i + 20,
        //       calculated: Boolean(i % 2),
        //     },
        //     tax: taxes[i % 5],
        //     cost: {
        //       regular_cost: i,
        //       calculated: Boolean(i % 2),
        //     },
        //     ingredients: [
        //       ingredients[0],
        //       ingredients[getRandomInt(1, ingredients.length - 1)],
        //       ingredients[getRandomInt(1, ingredients.length - 1)],
        //       ingredients[getRandomInt(1, ingredients.length - 1)],
        //       ingredients[getRandomInt(1, ingredients.length - 1)],
        //       ingredients[getRandomInt(1, ingredients.length - 1)],
        //       ingredients[getRandomInt(1, ingredients.length - 1)],
        //       ingredients[getRandomInt(1, ingredients.length - 1)],
        //       ingredients[getRandomInt(1, ingredients.length - 1)],
        //     ],
        //     branches: {
        //       all: true,
        //       list: [
        //         branches[0],
        //         branches[4],
        //         branches[getRandomInt(1, branches.length - 1)],
        //         branches[getRandomInt(1, branches.length - 1)],
        //         branches[getRandomInt(1, branches.length - 1)],
        //       ],
        //     },
        //   });
        // }
        // const products = await OptionModel.insertMany(_products);

        // console.log('products = ', products.length);

        // console.time(`${client} ---- update branch name`);
        // const __branch = branches[0];
        // __branch.name = `Branch name is ${client}`;
        // __branch.active = false;
        // __branch.deleted = true;
        // await __branch.save();
        // console.timeEnd(`${client} ---- update branch name`);

        expect(true).toBe(true);
      }
    } catch (error) {
      throw error;
    }
  }, 600000);
});
