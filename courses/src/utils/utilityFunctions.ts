import { genSalt , hash , compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import amqplib from 'amqplib';

// Utility function to generate a salt
export async function generateSalt() {
    return await genSalt(10);
}
  
// Utility function to generate a password hash
export async function generatePasswordHash(password: string, salt: string) {
    return await hash(password, salt);
}

// Utility function to generate a token
export async function generateToken(id: string){
    return await jwt.sign({ userId: id }, process.env.JWT_KEY as string, { expiresIn: '2d' });
}

// Utility function to compare password
export async function passwordCompare(  password:string, existingPassword:string) {
    return await compare( password, existingPassword);
}

export const CreateChannel = async () => {
    const EXCHANGE_NAME = process.env.EXCHANGE_NAME ||  ''
    const MSG_QUEUE_URL = process.env.MSG_QUEUE_URL || ''
    try {
      const connection = await amqplib.connect(MSG_QUEUE_URL);
      const channel = await connection.createChannel();
      await channel.assertQueue(EXCHANGE_NAME , { durable: true });
      return channel;
    } catch (err) {
      throw err;
    }
};


// module.exports.PublishMessage = (channel, service, msg) => {
//     channel.publish(EXCHANGE_NAME, service, Buffer.from(msg));
//     console.log("Sent: ", msg);
// };