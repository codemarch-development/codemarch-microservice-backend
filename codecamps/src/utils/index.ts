import { config } from '../configs/envConfiguration'
import { genSalt , hash , compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connect, Connection, Channel } from 'amqplib';

let amqplibConnection: Connection | null = null;

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
    return await jwt.sign({ userId: id }, config.APP_JWT_KEY as string, { expiresIn: '2d' });
}

// Utility function to compare password
export async function passwordCompare(  password:string, existingPassword:string) {
    return await compare( password, existingPassword);
}

export const getPayload = (data: any, event: string, userId: object = {}) => {
    const payload = {
        event: event,
        userId: userId,
        data: data,
    }
    return payload;
}


//=================================== Message Brocker Implementation ===================================//

const getChannel = async (): Promise<Channel> => {
    if (amqplibConnection === null) {
        amqplibConnection = await connect(config.MESSAGE_BROKER_URL as string);
    }

    const channel = await amqplibConnection.createChannel();
    return channel;
};

//Create Channel
export const CreateChannel = async (): Promise<Channel> => {
    try {
      
        // const connection = await amqplib.connect(config.MESSAGE_BROKER_URL as string);
        const channel = await getChannel();
        await channel.assertExchange(config.EXCHANGE_NAME, 'direct', { durable: false });
        return channel;
  
    } catch (err) {
        throw err;
    }
}
  
  
//Publish Message
export const PublishMessage = async (channel:Channel, binding_key:string, message:string): Promise<void> => {
    try {
        await channel.publish(config.EXCHANGE_NAME,binding_key, Buffer.from(message));
    } catch (err) {
        throw err
    }
}




