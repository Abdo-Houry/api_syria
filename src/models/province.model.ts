import { Translations } from "../types/translations";

export interface CreateProvinceDTO {

    name:string;

    summary?:string;

    description?:string;

    latitude?:number;

    longitude?:number;


    translations?: Translations;

}


export interface UpdateProvinceDTO {

    name?:string;

    summary?:string;

    description?:string;

    latitude?:number;

    longitude?:number;

    status?:boolean;


    translations?: Translations;

}