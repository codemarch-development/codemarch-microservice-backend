import { genSalt , hash , compare } from 'bcryptjs'
import jwt from 'jsonwebtoken';
import amqplib, { Channel } from 'amqplib';
import { config } from '../configs/envConfiguration';
import { SubscribeEvents } from '../controller/profileController';
import { UserDocument, UserProfile } from '../Types/types';

// Utility function to generate a salt
export async function generateSalt() {
    return await genSalt(10);
}
  
// Utility function to generate a password hash
export async function generatePasswordHash(password: string , salt: string) {
    return await hash(password, salt);
}

// Utility function to generate a token
export async function generateToken(id: string,expire:string){
    return await jwt.sign({ userId: id }, config.APP_JWT_KEY as string, { expiresIn: expire });
}

// Utility function to compare password
export async function passwordCompare(  password:string, existingPassword:string) {
    return await compare( password, existingPassword);
}

// Define a utility function to pick only the required fields
export const pickCodecampsData = (data: any) => {
    return {
        codecampId: data._id,
        thumbnail: data.thumbnail,
        title: data.title,
        description: data.description,
    };
}

// Function to remove the password field from the user data
export const removePasswordField = (user: UserDocument): Partial<UserDocument> => {
    // Create a new object to avoid modifying the original object
    console.log(user,'09009990099099')
    const userWithoutPassword: Partial<UserDocument> = { ...user };

    // Remove the password field from the new object
    delete userWithoutPassword.password;

    return userWithoutPassword;
};

//=================================== Message Brocker Implementation ===================================//

//Create Channel
export const createChannel = async (): Promise<Channel> => {
    try {
      
        const connection = await amqplib.connect(config.MESSAGE_BROKER_URL as string);
        const channel = await connection.createChannel();
        await channel.assertExchange(config.EXCHANGE_NAME, 'direct', { durable: false });
        console.log('channel created')
        return channel;
  
    } catch (err) {
        throw err;
    }
}
  
  
//Publish Message
// export const PublishMessage = async (channel:Channel, binding_key:string, message:string): Promise<void> => {
//     try {
//         await channel.publish(config.EXCHANGE_NAME,binding_key, Buffer.from(message));
//     } catch (err) {
//         throw err
//     }
// }
  
  
//Subscribe Message
export const subscribeMessage = async (channel: Channel): Promise<void> => {
    const appQueue = await channel.assertQueue(config.CODECAMP_QUEUE);
    await channel.bindQueue(appQueue.queue, config.EXCHANGE_NAME,config.CUSTOMER_BINDING_KEY);
  
    channel.consume(appQueue.queue, (data) => {
        if (data) { // Check if data is not null
            console.log('Received data:');
            console.log(data.content.toString());
            SubscribeEvents(data.content.toString())
            channel.ack(data);
        } else {
            // Handle the case when data is null
            console.log('No message received, or message was null.');
        }
    });
}
