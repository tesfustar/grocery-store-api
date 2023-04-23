import { Document} from "mongoose";
export interface ISearchHistory extends Document {
    query:string;
    count:number;
}