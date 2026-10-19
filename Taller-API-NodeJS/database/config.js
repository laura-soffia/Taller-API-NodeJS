import mongoose from 'mongoose';

export const dbConnection = async () => {
    const mongoUrl = process.env.MONGO_URL;
    if (!mongoUrl || !/^mongodb(?:\+srv)?:\/\//.test(mongoUrl)) {
        throw new Error("MONGO_URL no está configurada o no es una URI MongoDB válida; revisa tu archivo .env.");
    }

    try {
        await mongoose.connect(mongoUrl);
        console.log("Base de datos online");
    } catch (error) {
        throw new Error("No se pudo conectar con MongoDB.", { cause: error });
    }
}