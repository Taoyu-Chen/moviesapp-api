import mongoose from 'mongoose';

const Schema = mongoose.Schema;


const KeywordSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true}
});

KeywordSchema.statics.findByKeywordDBId = function (id) {
  return this.findOne({ id: id });
};

export default mongoose.model('Keywords', KeywordSchema);


