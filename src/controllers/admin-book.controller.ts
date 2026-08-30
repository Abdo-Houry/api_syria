import {
    Request,
    Response
} from "express";


import {
    AdminBookService
} from "../services/admin-book.service";


import {
    asyncHandler
} from "../utils/async-handler";


import {
    ApiResponse
} from "../utils/api-response";


import {
    createBookSchema,
    updateBookSchema
} from "../validations/admin-book.validation";



const service =
    new AdminBookService();





export const createBook =

    asyncHandler(

        async (
            req: Request,
            res: Response
        ) => {


            const data =

                createBookSchema.parse(
                    req.body
                );



            const book =

                await service.create(data);




            res.status(201).json(

                new ApiResponse(

                    true,

                    "Book created successfully",

                    book

                )

            );


        });








export const getBooks =

    asyncHandler(

        async (
            req: Request,
            res: Response
        ) => {


            const books =

                await service.findAll();



            res.json(

                new ApiResponse(

                    true,

                    "Books",

                    books

                )

            );


        });









export const getBook =

    asyncHandler(

        async (
            req: Request,
            res: Response
        ) => {


            const book =

                await service.findById(

                    Number(req.params.id)

                );



            res.json(

                new ApiResponse(

                    true,

                    "Book",

                    book

                )

            );


        });








export const updateBook =

    asyncHandler(

        async (
            req: Request,
            res: Response
        ) => {


            const data =

                updateBookSchema.parse(
                    req.body
                );



            const book =

                await service.update(

                    Number(req.params.id),

                    data

                );



            res.json(

                new ApiResponse(

                    true,

                    "Book updated",

                    book

                )

            );


        });








export const deleteBook =

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

                    "Book deleted"

                )

            );


        });