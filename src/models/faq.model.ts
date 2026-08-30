import { Translations } from "../types/translations";

export interface CreateFAQDTO {


    question: string;


    answer: string;



    translations?: Translations;

}



export interface UpdateFAQDTO {


    question?: string;


    answer?: string;


    status?: boolean;



    translations?: Translations;

}