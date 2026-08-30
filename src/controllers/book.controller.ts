import {
    Request,
    Response
} from "express";


import {
    BookService
} from "../services/book.service";


import {
    asyncHandler
} from "../utils/async-handler";


import {
    ApiResponse
} from "../utils/api-response";


import {
    createBookSchema
} from "../validations/book.validation";



const service =
    new BookService();





export const createBook =

    asyncHandler(

        async (req, res) => {


            const data =
                createBookSchema.parse(
                    req.body
                );



            const book =
                await service.create(data);



            res.status(201).json(

                new ApiResponse(

                    true,

                    "Book created",

                    book

                )

            );


        });







export const getBooks =

    asyncHandler(

        async (req, res) => {


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








export const getBookById =

    asyncHandler(

        async (req, res) => {


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
