import {
    Router
} from "express";


import {

    solveChallenge,

    myChallenges

}
    from "../controllers/user-challenge.controller";


import {
    userAuthMiddleware
} from "../middleware/user-auth.middleware";



const router =
    Router();



router.post(

    "/solve",

    userAuthMiddleware,

    solveChallenge

);




router.get(

    "/",

    userAuthMiddleware,

    myChallenges

);



export default router;