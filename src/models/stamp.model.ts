import { Translations } from "../types/translations";

export interface CreateStampDTO {


    placeId: number;


    name: string;


    description?: string;


    image_url: string;



    translations?: Translations;

}



export interface UpdateStampDTO {


    name?: string;


    description?: string;


    image_url?: string;


    status?: boolean;



    translations?: Translations;

}