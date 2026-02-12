import { model, models, Model, Schema } from 'mongoose';
import { Collection } from "./constants";

export const getModel = <T>(collectionName: Collection, schema: Schema): Model<T> => {
    return (models[collectionName] as Model<T>) || model<T>(collectionName, schema);
}