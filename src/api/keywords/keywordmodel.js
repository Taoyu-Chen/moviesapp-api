import mongoose from 'mongoose';

const Schema = mongoose.Schema;


const KeywordSchema = new Schema({
  adult: { type: Boolean },
  id: { type: Number, required: true, unique: true },

});

KeywordSchema.statics.findByKeywordDBId = function (id) {
  return this.findOne({ id: id });
};

export default mongoose.model('Keywords', KeywordSchema);


