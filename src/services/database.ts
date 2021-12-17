import mongoose from 'mongoose';

const connect: string = `mongodb://${process.env.DB_PORT}/${process.env.DB_NAME}`;
console.log({ connect });

export class Database {
  private connection: typeof mongoose | undefined = undefined;
  async connect() {
    this.connection = await mongoose.connect(connect);
  }

  async disconnect() {
    this.connection?.disconnect();
  }
}

export { mongoose };
