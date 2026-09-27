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


    /*
       مزامنة بنية القاعدة من الكيانات.

       غير محدَّدة ⇒ مفعّلة في التطوير ومطفأة في الإنتاج. تُضبط صراحةً
       بـ DB_SYNCHRONIZE=true لأول نشر فقط (لإنشاء الجداول) ثم تُعاد إلى false.
    */

    DB_SYNCHRONIZE:
        process.env.DB_SYNCHRONIZE
            ? process.env.DB_SYNCHRONIZE === "true"
            : (process.env.NODE_ENV || "development") !== "production",


    JWT_SECRET:
        process.env.JWT_SECRET || "",


    JWT_EXPIRES_IN:
        process.env.JWT_EXPIRES_IN || "7d",


    /*
       حساب المشرف الأول.

       لا قيمة افتراضية لكلمة المرور عمداً: سكربت التهيئة يرفض العمل بدونها،
       فلا يمكن أن ينتهي في الإنتاج حساب بكلمة مرور معروفة من الكود.
    */

    ADMIN_USERNAME:
        process.env.ADMIN_USERNAME || "admin",


    ADMIN_PASSWORD:
        process.env.ADMIN_PASSWORD || "",


    APP_URL:
        process.env.APP_URL || "",


    /*
       أصل الواجهة — يُبنى عليه رابط الـ QR المطبوع.
       كان غير معرّف فتُطبع الروابط بالبادئة "undefined".
    */

    FRONTEND_URL:
        process.env.FRONTEND_URL || "http://localhost:5173",


    /*
       الأصول المسموح لها بمناداة الـ API من المتصفّح.

       غير محدَّدة ⇒ أصل الواجهة وحده. تُكتب مفصولة بفاصلة عند الحاجة
       إلى أكثر من عنوان (مثل النطاق مع www ومن دونها).
    */

    CORS_ORIGINS:
        (process.env.CORS_ORIGINS || process.env.FRONTEND_URL || "http://localhost:5173")
            .split(",")
            .map((origin) => origin.trim().replace(/\/$/, ""))
            .filter(Boolean),




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