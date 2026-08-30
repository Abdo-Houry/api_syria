import {
    Request,
    Response
} from "express";


import {
    UserChallengeService
} from "../services/user-challenge.service";


import {
    asyncHandler
} from "../utils/async-handler";


import {
    ApiResponse
} from "../utils/api-response";


import {
    solveChallengeSchema
} from "../validations/user-challenge.validation";



const service =
    new UserChallengeService();





export const solveChallenge =

    asyncHandler(

        async (
            req: Request,
            res: Response
        ) => {


            const data =

                solveChallengeSchema.parse(
                    req.body
                );



            const result =

                await service.solve(

                    req.user!.id,

                    data.challengeId,

                    data.answer,

                    data.userBookId

                );




            res.json(

                new ApiResponse(

                    true,

                    "Challenge completed",

                    result

                )

            );


        });








export const myChallenges =

    asyncHandler(

        async (
            req: Request,
            res: Response
        ) => {


            const userBookId =
                req.query.userBookId
                    ? Number(req.query.userBookId)
                    : undefined;



            const result =

                await service.getMyChallenges(

                    req.user!.id,

                    userBookId

                );



            res.json(

                new ApiResponse(

                    true,

                    "My challenges",

                    result

                )

            );


        });