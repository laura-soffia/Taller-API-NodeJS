import mongoose from 'mongoose';
import dns from 'node:dns';


dns.setServers(['1.1.1.1', '8.8.8.8']); 

export const conex = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            family: 4 
        });
        console.log('Connected!');

    } catch (error) {
        console.log('Error de conexión:', error);
    }
}