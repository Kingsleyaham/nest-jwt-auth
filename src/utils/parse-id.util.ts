import { isValidObjectId, Types } from 'mongoose';
import { MESSAGES } from 'src/constants';

const throwError = (msg: string) => {
  throw new Error(msg);
};

/** Parse an id to ObjectId if valid. Return an ObjectId or throw an error if id is invalid */

export const parseId = (id: any) => {
  return isValidObjectId(id)
    ? new Types.ObjectId(id)
    : throwError(MESSAGES.INVALID_ID);
};
