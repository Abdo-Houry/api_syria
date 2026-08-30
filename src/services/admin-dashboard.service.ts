import {
    AppDataSource
} from "../config/database";


import {
    User
} from "../entities/user.entity";


import {
    Province
} from "../entities/province.entity";


import {
    Place
} from "../entities/place.entity";


import {
    Book
} from "../entities/book.entity";


import {
    BookCopy
} from "../entities/book-copy.entity";


import {
    UserBook
} from "../entities/user-book.entity";


import {
    UserVisit
} from "../entities/user-visit.entity";


import {
    UserChallenge
} from "../entities/user-challenge.entity";


import {
    UserStamp
} from "../entities/user-stamp.entity";





export class AdminDashboardService {



    private userRepository =
        AppDataSource.getRepository(User);



    private provinceRepository =
        AppDataSource.getRepository(Province);



    private placeRepository =
        AppDataSource.getRepository(Place);



    private bookRepository =
        AppDataSource.getRepository(Book);



    private bookCopyRepository =
        AppDataSource.getRepository(BookCopy);



    private userBookRepository =
        AppDataSource.getRepository(UserBook);



    private visitRepository =
        AppDataSource.getRepository(UserVisit);



    private challengeRepository =
        AppDataSource.getRepository(UserChallenge);



    private stampRepository =
        AppDataSource.getRepository(UserStamp);









    async getStatistics() {



        const [

            users,

            provinces,

            places,

            books,

            bookCopies,

            soldBooks,

            visits,

            completedChallenges,

            collectedStamps


        ] = await Promise.all([



            this.userRepository.count(),



            this.provinceRepository.count(),



            this.placeRepository.count(),



            this.bookRepository.count(),



            this.bookCopyRepository.count(),



            /*
                النسخ المفعّلة فعلاً — نعدّ النسخ المباعة لا سجلات الربط.
            */
            this.bookCopyRepository.count({
                where: {
                    is_sold: true
                }
            }),

            this.visitRepository.count(),



            this.challengeRepository.count(),



            this.stampRepository.count()



        ]);







        return {


            users,


            provinces,


            places,


            books,


            bookCopies,


            soldBooks,


            visits,


            completedChallenges,


            collectedStamps



        };


    }


}