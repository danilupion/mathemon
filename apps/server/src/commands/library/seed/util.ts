import { Document, FilterQuery, Model } from 'mongoose';

export const createOrUpdate = async <T extends Document>(
  M: Model<T>,
  query: FilterQuery<T>,
  data: Partial<T>,
  { validateBeforeSave = true }: { validateBeforeSave?: boolean } = {},
): Promise<[T, boolean]> => {
  const existingModel = await M.findOne(query);
  if (!existingModel) {
    const newModel = new M(data);
    await newModel.save({ validateBeforeSave });
    return [newModel, true];
  } else {
    for (const [key, value] of Object.entries(data)) {
      existingModel.set(key, value);
    }
    await existingModel.save();
  }

  return [existingModel, false];
};
