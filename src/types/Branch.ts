import { ObjectId, Document } from "mongoose";
export interface IBranch extends Document{
    name:string;
    address:string;
    location:{
        
    };
    
}