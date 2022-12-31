import { Schema, SchemaDefinition } from 'mongoose';

type GoogleProfile = {
  id: string;
  displayName: string;
  emails: string[];
  photos: string[];
};

export type WithGoogle<
  Field extends string = 'google',
  Parent extends string = 'profiles',
> = Parent extends never
  ? {
      [key in Field]?: GoogleProfile;
    }
  : {
      [key in Parent]: { [key in Field]?: GoogleProfile };
    };

interface GoogleMiddlewareOptions {
  field?: string;
  parent?: string;
}

const googleMiddleware = (
  schema: Schema,
  { field = 'google', parent }: GoogleMiddlewareOptions = {},
): void => {
  const fieldDescription: SchemaDefinition = {
    [field]: {
      type: {
        id: { type: String, required: true },
        displayName: { type: String, required: true },
        emails: [String],
        photos: [String],
      },
    },
  };

  if (parent) {
    const parentDefinition = schema.path(parent);
    if (!parentDefinition) {
      schema.add({
        [parent]: { type: fieldDescription, default: {}, _id: false },
      });
    } else {
      parentDefinition.schema.add(fieldDescription);
    }
  } else {
    schema.add(fieldDescription);
  }
};

export default googleMiddleware;
