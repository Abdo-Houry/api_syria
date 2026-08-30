import {
    z
} from "zod";



export const createQRCodeSchema =

    z.object({


        bookCopyId:
            z.number(),



        target_type:
            z.enum([
                "PROVINCE",
                "PLACE"
            ]),



        target_id:
            z.number()


    });