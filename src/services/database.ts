import mongoose from 'mongoose';

const connect: string = `mongodb://${process.env.DB_PORT}/${process.env.DB_NAME}`;
console.log({ connect });
const database = async () => {
  try {
    await mongoose.connect(connect);
  } catch (error) {
    console.log('=-------', error);
  }
};

export { mongoose };
export default database;
