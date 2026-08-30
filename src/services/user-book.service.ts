import {
    AppDataSource
} from "../config/database";


import {
    UserBook
} from "../entities/user-book.entity";


import {
    BookCopy
} from "../entities/book-copy.entity";


import {
    User
} from "../entities/user.entity";


import {
    ApiError
} from "../utils/api-error";



export interface AssignBookInput {

    bookCopyId?: number;

    serial?: string;

    version?: string;

}



export class UserBookService {



    private repository =
        AppDataSource.getRepository(UserBook);



    private bookCopyRepository =
        AppDataSource.getRepository(BookCopy);



    private userRepository =
        AppDataSource.getRepository(User);





    async assignBook(

        userId: number,

        input: AssignBookInput

    ) {



        const user =

            await this.userRepository.findOne({

                where: {
                    id: userId
                }

            });



        if (!user) {

            throw new ApiError(
                404,
                "User not found"
            );

        }




        /*
            تحديد النسخة إمّا بالمعرّف الرقمي
            أو بالسيريال والإصدار القادمين من رمز الـ QR.
        */

        const bookCopy =

            await this.bookCopyRepository.findOne({

                where:
                    input.bookCopyId !== undefined
                        ? {
                            id: input.bookCopyId
                        }
                        : {
                            serial_number: input.serial,
                            version: input.version
                        },

                relations: {
                    book: true
                }

            });



        if (!bookCopy) {

            throw new ApiError(
                404,
                "Book copy not found"
            );

        }




        /*
            إذا كانت النسخة مرتبطة بهذا المستخدم أصلاً
            نعيدها بدل رفض الطلب — المسح المتكرّر لا يجب أن يبدو خطأً.
        */

        const existing =

            await this.repository.findOne({

                where: {

                    user: {
                        id: userId
                    },

                    book_copy: {
                        id: bookCopy.id
                    }

                },

                relations: {
                    book_copy: {
                        book: true
                    }
                }

            });



        if (existing) {

            return existing;

        }




        if (bookCopy.is_sold) {

            throw new ApiError(
                400,
                "Book copy already sold"
            );

        }




        const userBook =

            this.repository.create({

                user,

                book_copy: bookCopy

            });



        await this.repository.save(userBook);



        bookCopy.is_sold = true;


        await this.bookCopyRepository.save(bookCopy);



        return userBook;


    }







    async getUserBooks(
        userId: number
    ) {
        /*
            النسخة المحذوفة (حذف ناعم) تبقى ظاهرة مع deleted_at
            حتى تعرضها الواجهة بلون رمادي بدل اختفائها فجأة.
        */
        return await this.repository.find({
            where: {
                user: {
                    id: userId
                }
            },
            relations: {
                book_copy: {
                    book: true
                }
            },
            withDeleted: true
        });
    }




    /*
        نسخة الكتيّب التي يملكها المستخدم لسيريال وإصدار محدّدين.
        تُستخدم لتحديد ما إذا كان رمز الـ QR يخصّ كتيّبه.
    */

    async getUserBookByQR(

        userId: number,

        serial: string,

        version: string

    ) {


        const userBook =

            await this.repository.findOne({

                where: {

                    user: {
                        id: userId
                    },

                    book_copy: {

                        serial_number: serial,

                        version: version

                    }

                },


                relations: {

                    book_copy: true

                }

            });



        return userBook;


    }




    /*
        التحقّق من أن نسخة الكتيّب تعود للمستخدم،
        مع إحضار محتوى الكتيّب للتأكّد من انتماء التحدي أو الطابع إليه.
    */

    async getOwnedUserBook(

        userId: number,

        userBookId: number

    ) {


        const userBook =

            await this.repository.findOne({

                where: {

                    id: userBookId,

                    user: {
                        id: userId
                    }

                },

                relations: {

                    book_copy: {

                        book: {
                            challenges: true,
                            stamps: true,
                            places: true
                        }

                    }

                }

            });



        if (!userBook) {

            throw new ApiError(
                404,
                "Book not found for this user"
            );

        }



        return userBook;


    }




    /*
        إيجاد نسخة الكتيّب التي ينتمي إليها تحدٍّ أو طابع،
        عندما لا يرسل العميل userBookId صراحةً.
    */

    async findUserBookContaining(

        userId: number,

        relation: "challenges" | "stamps",

        entityId: number

    ) {


        const userBooks =

            await this.repository.find({

                where: {

                    user: {
                        id: userId
                    }

                },

                relations: {

                    book_copy: {

                        book: {
                            challenges: true,
                            stamps: true
                        }

                    }

                }

            });



        return (

            userBooks.find((item) => {


                const collection =
                    item.book_copy?.book?.[relation];


                return (collection ?? []).some(
                    (entry: { id: number }) =>
                        entry.id === entityId
                );


            }) ?? null

        );


    }



}
