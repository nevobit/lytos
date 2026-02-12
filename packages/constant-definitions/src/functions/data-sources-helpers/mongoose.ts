import { model, models, Model, Schema } from 'mongoose';
import { Collection } from "./constants";

export const getModel = <T>(collectionName: Collection, schema: Schema): Model<T> => {
    const existing = models[collectionName] as Model<T> | undefined;
    return existing ?? model<T>(collectionName, schema, collectionName);
}