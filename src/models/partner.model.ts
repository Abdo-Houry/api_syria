import { Translations } from "../types/translations";

export interface CreatePartnerDTO {


    name: string;


    description?: string;


    image_url: string;


    discount_percentage: number;



    translations?: Translations;

}




export interface UpdatePartnerDTO {


    name?: string;


    description?: string;


    image_url?: string;


    discount_percentage?: number;


    status?: boolean;



    translations?: Translations;

}