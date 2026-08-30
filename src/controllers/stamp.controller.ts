import {
    Request,
    Response
} from "express";


import {
    StampService
} from "../services/stamp.service";


import {
    asyncHandler
} from "../utils/async-handler";


import {
    ApiResponse
} from "../utils/api-response";


import {

    createStampSchema,

    updateStampSchema

} from "../validations/stamp.validation";



const service =
    new StampService();





export const createStamp =
    asyncHandler(

        async (req, res) => {


            const data =
                createStampSchema.parse(
                    req.body
                );



            const stamp =
                await service.create(data);



            res.status(201).json(

                new ApiResponse(

                    true,

                    "Stamp created",

                    stamp

                )

            );


        });







export const getStamps =
    asyncHandler(

        async (req, res) => {


            const stamps =
                await service.findAll();



            res.json(

                new ApiResponse(

                    true,

                    "Stamps",

                    stamps

                )

            );


        });







export const getStampById =
    asyncHandler(

        async (req, res) => {


            const stamp =
                await service.findById(

                    Number(req.params.id)

                );



            res.json(

                new ApiResponse(

                    true,

                    "Stamp",

                    stamp

                )

            );


        });







export const updateStamp =
    asyncHandler(

        async (req, res) => {


            const data =
                updateStampSchema.parse(
                    req.body
                );



            const stamp =
                await service.update(

                    Number(req.params.id),

                    data

                );



            res.json(

                new ApiResponse(

                    true,

                    "Stamp updated",

                    stamp

                )

            );


        });







export const deleteStamp =
    asyncHandler(

        async (req, res) => {


            await service.delete(

                Number(req.params.id)

            );



            res.json(

                new ApiResponse(

                    true,

                    "Stamp deleted"

                )

            );


        });