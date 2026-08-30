import {
Router
} from "express";


import {

createChallenge,

getChallenges,

getChallengeById,

updateChallenge,

deleteChallenge

}
from "../controllers/challenge.controller";


import {
authMiddleware
} from "../middleware/auth.middleware";



const router =
Router();



router.post(
"/",
authMiddleware,
createChallenge
);



router.get(
"/",
getChallenges
);



router.get(
"/:id",
getChallengeById
);



router.put(
"/:id",
authMiddleware,
updateChallenge
);



router.delete(
"/:id",
authMiddleware,
deleteChallenge
);



export default router;