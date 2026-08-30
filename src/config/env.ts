import dotenv from "dotenv";

dotenv.config();


export const env = {

    PORT: Number(process.env.PORT) || 5000,


    NODE_ENV:
        process.env.NODE_ENV || "development",


    DB_HOST:
        process.env.DB_HOST || "localhost",


    DB_PORT:
        Number(process.env.DB_PORT) || 5432,


    DB_USERNAME:
        process.env.DB_USERNAME || "postgres",


    DB_PASSWORD:
        process.env.DB_PASSWORD || "",


    DB_NAME:
        process.env.DB_NAME || "",


    JWT_SECRET:
        process.env.JWT_SECRET || "",


    JWT_EXPIRES_IN:
        process.env.JWT_EXPIRES_IN || "7d",


    APP_URL:
        process.env.APP_URL || "",


    /*
       أصل الواجهة — يُبنى عليه رابط الـ QR المطبوع.
       كان غير معرّف فتُطبع الروابط بالبادئة "undefined".
    */

    FRONTEND_URL:
        process.env.FRONTEND_URL || "http://localhost:5173",




    /*
       البريد الصادر — حساب Gmail مع "كلمة مرور التطبيقات".

       nodemailer يتصل بـ smtp.gmail.com مباشرة، ولا حاجة إلى OAuth
       ما دامت كلمة مرور التطبيقات مفعّلة على الحساب.
    */

    MAIL_USER:
        process.env.MAIL_USER || "",


    /* تُكتب في .env بفراغات أو بدونها — نزيل الفراغات هنا. */
    MAIL_PASSWORD:
        (process.env.MAIL_PASSWORD || "").replace(/\s+/g, ""),


    MAIL_FROM:
        process.env.MAIL_FROM ||
        process.env.MAIL_USER ||
        "",




    /* صلاحية رمز التحقق بالدقائق. */

    OTP_TTL_MINUTES:
        Number(process.env.OTP_TTL_MINUTES) || 10

};