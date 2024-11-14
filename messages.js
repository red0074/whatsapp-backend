import mongoose from "mongoose";

const whatsappSchema = mongoose.Schema({
  message: String,
  name: String,
  timestamp: String,
  received: Boolean,
});
//->collection name will be small and add 's' to the last
export default mongoose.model("messagecontents", whatsappSchema);
