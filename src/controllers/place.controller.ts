import {
    Request,
    Response
} from "express";


import {
    PlaceService
} from "../services/place.service";


import {
    asyncHandler
} from "../utils/async-handler";


import {
    ApiResponse
} from "../utils/api-response";


import {
    createPlaceSchema,
    updatePlaceSchema
} from "../validations/place.validation";



const service =
    new PlaceService();




export const createPlace =
    asyncHandler(

        async (req, res) => {


            const data =
                createPlaceSchema.parse(
                    req.body
                );



            const place =
                await service.create(data);



            res.status(201).json(

                new ApiResponse(
                    true,
                    "Place created",
                    place
                )

            );


        });





export const getPlaces =
    asyncHandler(

        async (req, res) => {


            const places =
                await service.findAll();


            res.json(

                new ApiResponse(
                    true,
                    "Places",
                    places
                )

            );


        });





export const getPlaceById =
    asyncHandler(

        async (req, res) => {


            const place =
                await service.findById(
                    Number(req.params.id)
                );



            res.json(

                new ApiResponse(
                    true,
                    "Place",
                    place
                )

            );


        });





export const updatePlace =
    asyncHandler(

        async (req, res) => {


            const data =
                updatePlaceSchema.parse(
                    req.body
                );



            const place =
                await service.update(
                    Number(req.params.id),
                    data
                );



            res.json(

                new ApiResponse(
                    true,
                    "Place updated",
                    place
                )

            );


        });






export const deletePlace =
    asyncHandler(

        async (req, res) => {


            await service.delete(
                Number(req.params.id)
            );



            res.json(

                new ApiResponse(
                    true,
                    "Place deleted"
                )

            );


        });