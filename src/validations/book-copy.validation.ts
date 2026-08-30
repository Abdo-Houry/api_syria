import {
    z
} from "zod";



export const createBookCopySchema =

    z.object({

        bookId:
            z.number(),



        serial_number:
            z.string()
                .min(1),



        version:
            z.string()
                .min(1)

    });





export const updateBookCopySchema =

    z.object({

        status:
            z.string()
                .optional()

    });