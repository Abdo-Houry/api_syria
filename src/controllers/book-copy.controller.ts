import {
    Request,
    Response
} from "express";


import {
    BookCopyService
} from "../services/book-copy.service";


import {
    asyncHandler
} from "../utils/async-handler";


import {
    ApiResponse
} from "../utils/api-response";


import {
    createBookCopySchema,
    updateBookCopySchema
} from "../validations/book-copy.validation";




const service =
    new BookCopyService();









export const createBookCopy =

    asyncHandler(

        async (

            req: Request,

            res: Response

        ) => {



            const data =

                createBookCopySchema.parse(

                    req.body

                );





            const copy =

                await service.create(data);





            res.status(201).json(

                new ApiResponse(

                    true,

                    "Book copy created",

                    copy

                )

            );



        });











export const getBookCopies =

    asyncHandler(

        async (

            req: Request,

            res: Response

        ) => {


            const copies =

                await service.findAll();




            res.json(

                new ApiResponse(

                    true,

                    "Book copies",

                    copies

                )

            );



        });











export const getCopiesByBook =

    asyncHandler(

        async (

            req: Request,

            res: Response

        ) => {



            const copies =

                await service.findByBook(

                    Number(req.params.bookId)

                );





            res.json(

                new ApiResponse(

                    true,

                    "Book copies",

                    copies

                )

            );



        });









export const getBookCopy =

    asyncHandler(

        async (

            req: Request,

            res: Response

        ) => {


            const copy =

                await service.findById(

                    Number(req.params.id)

                );



            res.json(

                new ApiResponse(

                    true,

                    "Book copy",

                    copy

                )

            );


        });









export const updateBookCopy =

    asyncHandler(

        async (

            req: Request,

            res: Response

        ) => {


            const data =

                updateBookCopySchema.parse(

                    req.body

                );




            const copy =

                await service.update(

                    Number(req.params.id),

                    data

                );



            res.json(

                new ApiResponse(

                    true,

                    "Book copy updated",

                    copy

                )

            );



        });









export const deleteBookCopy =

    asyncHandler(

        async (

            req: Request,

            res: Response

        ) => {



            await service.delete(

                Number(req.params.id)

            );



            res.json(

                new ApiResponse(

                    true,

                    "Book copy deleted"

                )

            );



        });