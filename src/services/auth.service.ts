import bcrypt from "bcrypt";


import {
    ILike,
    In,
    Like
} from "typeorm";
import {
    phoneCandidates,
    phoneNationalDigits
} from "../utils/phone";


import {
    AppDataSource
} from "../config/database";


import {
    Admin
} from "../entities/admin.entity";


import {
    User
} from "../entities/user.entity";


import {
    ApiError
} from "../utils/api-error";


import {
    generateToken
} from "../utils/jwt";




/*
    دخول موحّد.

    المستخدم يدخل برقم هاتفه أو باسمه، والمشرف باسم المستخدم — والنظام هو من
    يحدّد الدور من الحساب نفسه، فلا حاجة لصفحتَي دخول منفصلتين.

    نجرّب المشرفين أولاً لأن `username` لا يتقاطع عادةً مع أرقام الهواتف.
*/

export class AuthService {


    private adminRepository =
        AppDataSource.getRepository(Admin);


    private userRepository =
        AppDataSource.getRepository(User);




    async login(
        identifier: string,
        password: string
    ) {


        const trimmed = identifier.trim();




        /* ---------------------- مشرف ---------------------- */

        const admin =

            await this.adminRepository.findOne({

                where: {
                    username: trimmed
                }

            });



        if (admin) {


            const match =
                await bcrypt.compare(
                    password,
                    admin.password
                );


            if (!match) {

                throw new ApiError(
                    401,
                    "Invalid credentials"
                );

            }


            return {

                role: "ADMIN" as const,

                admin: {
                    id: admin.id,
                    username: admin.username
                },

                token: generateToken({
                    id: admin.id,
                    username: admin.username,
                    role: "ADMIN"
                })

            };


        }




        /* ---------------------- مستخدم ---------------------- */

        /*
            المستخدم يدخل برقم هاتفه أو باسمه.

            الاسم غير فريد في قاعدة البيانات، لذلك نجمع كل المطابقات ثم
            نختار من تطابق كلمةُ مروره — الاسم وحده لا يكفي للدخول، وبهذا
            لا يمنع تشابهُ الأسماء أحداً من الوصول إلى حسابه.
        */

        /*
            الدخول برقم بلا صفر ولا رمز دولة (997980231) بينما الحساب
            مخزَّن بالصيغة الدولية (+963997980231): نضيف مطابقة باللاحقة
            حتى لا يحتاج المستخدم إلى تذكّر الصيغة التي سجّل بها.

            اللاحقة قد تطابق أكثر من حساب، وهذا مقبول هنا لأن كلمة المرور
            هي ما يفتح الحساب فعلاً — كما هو الحال مع مطابقة الاسم.
        */

        const national =
            phoneNationalDigits(trimmed);


        const candidates =

            await this.userRepository.find({

                where: [
                    {
                        phone: In(phoneCandidates(trimmed))
                    },
                    ...(national.length >= 6
                        ? [
                            {
                                phone: Like("%" + national)
                            }
                        ]
                        : []),
                    {
                        name: ILike(trimmed)
                    }
                ],

                order: {
                    id: "ASC"
                }

            });



        if (!candidates.length) {

            throw new ApiError(
                401,
                "Invalid credentials"
            );

        }



        let user: User | null = null;


        for (const candidate of candidates) {

            const match =
                await bcrypt.compare(
                    password,
                    candidate.password
                );


            if (match) {

                user = candidate;

                break;

            }

        }



        if (!user) {

            throw new ApiError(
                401,
                "Invalid credentials"
            );

        }



        if (user.status === "BLOCKED") {

            throw new ApiError(
                403,
                "User blocked"
            );

        }



        /*
            حساب أُنشئ ولم يُؤكَّد بريده بعد: لا جلسة قبل الرمز.
            الواجهة تلتقط هذه الرسالة وتنقل المستخدم إلى شاشة التحقّق.
        */

        if (user.email_verified === false) {

            throw new ApiError(
                403,
                "Email not verified"
            );

        }




        return {

            role: "USER" as const,

            user: {
                id: user.id,
                name: user.name,
                phone: user.phone
            },

            token: generateToken({
                id: user.id,
                role: "USER"
            })

        };


    }


}
