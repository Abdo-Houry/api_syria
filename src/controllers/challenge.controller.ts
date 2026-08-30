import {
    Request,
    Response
} from "express";


import {
    ChallengeService
} from "../services/challenge.service";


import {
    asyncHandler
} from "../utils/async-handler";


import {
    ApiResponse
} from "../utils/api-response";


import {

    createChallengeSchema,

    updateChallengeSchema

} from "../validations/challenge.validation";



const service =
    new ChallengeService();





export const createChallenge =

    asyncHandler(

        async (req, res) => {


            const data =
                createChallengeSchema.parse(
                    req.body
                );



            const challenge =
                await service.create(data);



            res.status(201).json(

                new ApiResponse(

                    true,

                    "Challenge created",

                    challenge

                )

            );


        });







export const getChallenges =

    asyncHandler(

        async (req, res) => {


            const challenges =
                await service.findAll();



            res.json(

                new ApiResponse(

                    true,

                    "Challenges",

                    challenges

                )

            );


        });







export const getChallengeById =

    asyncHandler(

        async (req, res) => {


            const challenge =
                await service.findById(

                    Number(req.params.id)

                );



            res.json(

                new ApiResponse(

                    true,

                    "Challenge",

                    challenge

                )

            );


        });








export const updateChallenge =

    asyncHandler(

        async (req, res) => {


            const data =
                updateChallengeSchema.parse(
                    req.body
                );



            const challenge =
                await service.update(

                    Number(req.params.id),

                    data

                );



            res.json(

                new ApiResponse(

                    true,

                    "Challenge updated",

                    challenge

                )

            );


        });








export const deleteChallenge =

    asyncHandler(

        async (req, res) => {


            await service.delete(

                Number(req.params.id)

            );



            res.json(

                new ApiResponse(

                    true,

                    "Challenge deleted"

                )

            );


        });