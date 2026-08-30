import { Translations } from "../types/translations";

export interface CreateBookDTO {


    name: string;


    description?: string;


    provinceId: number;



    placeIds: number[];


    challengeIds: number[];


    stampIds: number[];


    partnerIds: number[];


    translations?: Translations;

}



export interface UpdateBookDTO {


    name?: string;


    description?: string;


    status?: boolean;



    translations?: Translations;

}