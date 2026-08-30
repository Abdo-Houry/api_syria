import {
    AppDataSource
} from "../config/database";


import {
    UserStamp
} from "../entities/user-stamp.entity";


import {
    Stamp
} from "../entities/stamp.entity";


import {
    ApiError
} from "../utils/api-error";


import {
    UserBookService
} from "./user-book.service";




export class UserStampService {



    private repository =
        AppDataSource.getRepository(UserStamp);



    private stampRepository =
        AppDataSource.getRepository(Stamp);



    private userBookService =
        new UserBookService();






    async collect(

        userId: number,

        stampId: number,

        userBookId?: number

    ) {



        const stamp =

            await this.stampRepository.findOne({

                where: {
                    id: stampId
                }

            });



        if (!stamp) {

            throw new ApiError(
                404,
                "Stamp not found"
            );

        }




        /*
            كما في التحديات: العمود user_book_id إلزامي،
            فنحدّد نسخة الكتيّب صراحةً أو نستنتجها.
        */

        const userBook =

            userBookId !== undefined

                ? await this.userBookService.getOwnedUserBook(
                    userId,
                    userBookId
                )

                : await this.userBookService.findUserBookContaining(
                    userId,
                    "stamps",
                    stampId
                );



        if (!userBook) {

            throw new ApiError(
                403,
                "This stamp does not belong to any of your booklets"
            );

        }




        const belongsToBook =

            (userBook.book_copy?.book?.stamps ?? []).some(

                (item) => item.id === stampId

            );



        if (!belongsToBook) {

            throw new ApiError(
                403,
                "This stamp does not belong to the selected booklet"
            );

        }




        const exists =

            await this.repository.findOne({

                where: {

                    user: {
                        id: userId
                    },

                    stamp: {
                        id: stampId
                    },

                    userBook: {
                        id: userBook.id
                    }

                },

                relations: {
                    stamp: true
                }

            });



        if (exists) {

            return exists;

        }




        const userStamp =

            this.repository.create({

                user: {
                    id: userId
                },

                stamp: {
                    id: stampId
                },

                userBook: {
                    id: userBook.id
                }

            });




        return await this.repository.save(
            userStamp
        );


    }









    async getMyStamps(

        userId: number,

        userBookId?: number

    ) {


        return await this.repository.find({

            where: {

                user: {
                    id: userId
                },

                ...(userBookId !== undefined
                    ? {
                        userBook: {
                            id: userBookId
                        }
                    }
                    : {})

            },


            relations: {

                stamp: true

            },


            order: {

                collected_at: "DESC"

            }


        });


    }



}
