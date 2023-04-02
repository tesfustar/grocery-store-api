import mongoose from "mongoose";
import { ISearchHistory } from "../types/Search";

const searchHistorySchema = new mongoose.Schema<ISearchHistory>(
  {
    query: { type: String,required:true},
    count: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const SearchHistory = mongoose.model<ISearchHistory>(
  "SearchHistory",
  searchHistorySchema
);

export default SearchHistory;
