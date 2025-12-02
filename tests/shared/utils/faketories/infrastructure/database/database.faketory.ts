import { Types } from "mongoose";

function createFakeObjectId(id?: string): Types.ObjectId {
  return new Types.ObjectId(id);
}

export { createFakeObjectId };