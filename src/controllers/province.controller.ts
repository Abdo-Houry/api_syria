import {
    Request,
    Response
} from "express";


import {
    ProvinceService
} from "../services/province.service";


import {
    asyncHandler
} from "../utils/async-handler";


import {
    ApiResponse
} from "../utils/api-response";


import {
    createProvinceSchema,
    updateProvinceSchema
} from "../validations/province.validation";



const service =
    new ProvinceService();



// CREATE

export const createProvince =

    asyncHandler(

        async (
            req: Request,
            res: Response
        ) => {


            const data =
                createProvinceSchema.parse(
                    req.body
                );



            const province =
                await service.create(data);



            res.status(201).json(

                new ApiResponse(

                    true,

                    "Province created successfully",

                    province

                )

            );


        });





// GET ALL

export const getProvinces =

    asyncHandler(

        async (
            req,
            res
        ) => {


            const provinces =
                await service.findAll();



            res.json(

                new ApiResponse(

                    true,

                    "Provinces",

                    provinces

                )

            );


        });





// GET ONE

export const getProvinceById =

    asyncHandler(

        async (
            req,
            res
        ) => {


            const province =
                await service.findById(

                    Number(req.params.id)

                );


            res.json(

                new ApiResponse(

                    true,

                    "Province",

                    province

                )

            );


        });






// UPDATE



export const updateProvince =

    asyncHandler(

        async (
            req,
            res
        ) => {


            const data =
                updateProvinceSchema.parse(
                    req.body
                );



            const province =
                await service.update(

                    Number(req.params.id),

                    data

                );



            res.json(

                new ApiResponse(

                    true,

                    "Province updated",

                    province

                )

            );


        });






// DELETE


export const deleteProvince =

    asyncHandler(

        async (
            req,
            res
        ) => {


            await service.delete(

                Number(req.params.id)

            );



            res.json(

                new ApiResponse(

                    true,

                    "Province deleted"

                )

            );


        });