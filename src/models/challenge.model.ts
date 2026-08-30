import { Translations } from "../types/translations";

export interface CreateChallengeDTO {


    placeId: number;


    title: string;


    description?: string;


    type?: string;
    options?: string[];
    correct_option?: number;
    translations?: Translations;
}

export interface UpdateChallengeDTO {


    title?: string;


    description?: string;


    type?: string;


    status?: boolean;
    options?: string[];
    correct_option?: number;
    translations?: Translations;

}