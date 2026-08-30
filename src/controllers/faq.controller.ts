import {
    Request,
    Response
} from "express";


import {
    FAQService
} from "../services/faq.service";


import {
    asyncHandler
} from "../utils/async-handler";


import {
    ApiResponse
} from "../utils/api-response";


import {

    createFAQSchema,

    updateFAQSchema

} from "../validations/faq.validation";



const service =
    new FAQService();







export const createFAQ =

    asyncHandler(

        async (req, res) => {


            const data =
                createFAQSchema.parse(
                    req.body
                );



            const faq =
                await service.create(data);



            res.status(201).json(

                new ApiResponse(

                    true,

                    "FAQ created",

                    faq

                )

            );


        });








export const getFAQs =

    asyncHandler(

        async (req, res) => {


            const faqs =
                await service.findAll();



            res.json(

                new ApiResponse(

                    true,

                    "FAQs",

                    faqs

                )

            );


        });








export const getFAQById =

    asyncHandler(

        async (req, res) => {


            const faq =
                await service.findById(

                    Number(req.params.id)

                );



            res.json(

                new ApiResponse(

                    true,

                    "FAQ",

                    faq

                )

            );


        });








export const updateFAQ =

    asyncHandler(

        async (req, res) => {


            const data =
                updateFAQSchema.parse(
                    req.body
                );



            const faq =
                await service.update(

                    Number(req.params.id),

                    data

                );



            res.json(

                new ApiResponse(

                    true,

                    "FAQ updated",

                    faq

                )

            );


        });








export const deleteFAQ =

    asyncHandler(

        async (req, res) => {


            await service.delete(

                Number(req.params.id)

            );



            res.json(

                new ApiResponse(

                    true,

                    "FAQ deleted"

                )

            );


        });