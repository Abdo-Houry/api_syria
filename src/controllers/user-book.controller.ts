import {
    Request,
    Response
} from "express";


import {
    UserBookService
} from "../services/user-book.service";


import {
    asyncHandler
} from "../utils/async-handler";


import {
    ApiResponse
} from "../utils/api-response";


import {
    assignBookSchema
} from "../validations/user-book.validation";



const service =
    new UserBookService();





export const assignBook =

    asyncHandler(

        async (
            req: Request,
            res: Response
        ) => {


            const userId =
                req.user!.id;



            const data =
                assignBookSchema.parse(
                    req.body
                );




            const result =

                await service.assignBook(

                    userId,

                    data

                );



            res.status(201).json(

                new ApiResponse(

                    true,

                    "Book assigned",

                    result

                )

            );



        });







export const getMyBooks =

    asyncHandler(

        async (
            req: Request,
            res: Response
        ) => {


            const userId =
                req.user!.id;



            const books =

                await service.getUserBooks(
                    userId
                );



            res.json(

                new ApiResponse(

                    true,

                    "My books",

                    books

                )

            );


        });