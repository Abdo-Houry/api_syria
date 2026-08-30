import {
    Request,
    Response
} from "express";


import {
    PartnerService
} from "../services/partner.service";


import {
    asyncHandler
} from "../utils/async-handler";


import {
    ApiResponse
} from "../utils/api-response";


import {

    createPartnerSchema,

    updatePartnerSchema

} from "../validations/partner.validation";



const service =
    new PartnerService();






export const createPartner =

    asyncHandler(

        async (req, res) => {


            const data =
                createPartnerSchema.parse(
                    req.body
                );



            const partner =
                await service.create(data);



            res.status(201).json(

                new ApiResponse(

                    true,

                    "Partner created",

                    partner

                )

            );


        });







export const getPartners =

    asyncHandler(

        async (req, res) => {


            const partners =
                await service.findAll();



            res.json(

                new ApiResponse(

                    true,

                    "Partners",

                    partners

                )

            );


        });







export const getPartnerById =

    asyncHandler(

        async (req, res) => {


            const partner =
                await service.findById(

                    Number(req.params.id)

                );



            res.json(

                new ApiResponse(

                    true,

                    "Partner",

                    partner

                )

            );


        });







export const updatePartner =

    asyncHandler(

        async (req, res) => {


            const data =
                updatePartnerSchema.parse(
                    req.body
                );



            const partner =
                await service.update(

                    Number(req.params.id),

                    data

                );



            res.json(

                new ApiResponse(

                    true,

                    "Partner updated",

                    partner

                )

            );


        });








export const deletePartner =

    asyncHandler(

        async (req, res) => {


            await service.delete(

                Number(req.params.id)

            );



            res.json(

                new ApiResponse(

                    true,

                    "Partner deleted"

                )

            );


        });