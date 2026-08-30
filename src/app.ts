import express from "express";

import path from "path";

import fs from "fs";

import cors from "cors";

import compression from "compression";

import helmet from "helmet";

import morgan from "morgan";

import adminRoutes from "./routes/admin.routes";

import { errorMiddleware } from "./middleware/error.middleware";
import { sanitizeResponse } from "./middleware/sanitize-response.middleware";
import provinceRoutes from "./routes/province.routes";
import provinceMediaRoutes from "./routes/province-media.routes";
import placeRoutes from "./routes/place.routes";
import placeMediaRoutes from "./routes/place-media.routes";
import challengeRoutes from "./routes/challenge.routes";
import stampRoutes from "./routes/stamp.routes";
import partnerRoutes from "./routes/partner.routes";
import faqRoutes from "./routes/faq.routes";
import qrCodeRoutes from "./routes/qr-code.routes";
import bookRoutes from "./routes/book.routes";
import bookCopyRoutes from "./routes/book-copy.routes";
import publicQRRoutes from "./routes/public-qr.routes";
import userAuthRoutes from "./routes/user-auth.routes";
import userProfileRoutes from "./routes/user-profile.routes";
import userBookRoutes from "./routes/user-book.routes";
import userVisitRoutes from "./routes/user-visit.routes";
import userChallengeRoutes from "./routes/user-challenge.routes";
import userStampRoutes from "./routes/user-stamp.routes";
import userDashboardRoutes from "./routes/user-dashboard.routes";
import adminBookRoutes from "./routes/admin-book.routes";
import adminDashboardRoutes from "./routes/admin-dashboard.routes";
import adminUserRoutes from "./routes/admin-user.routes";
import authRoutes from "./routes/auth.routes";
import uploadRoutes from "./routes/upload.routes";
import areaRoutes from "./routes/area.routes";

const app = express();


app.use(cors());

app.use(
    helmet({

        /*
            الواجهة تعمل على أصل مختلف (5173) وتعرض صور
            ومقاطع من /uploads، والسياسة الافتراضية same-origin تمنعها.
        */
        crossOriginResourcePolicy: {
            policy: "cross-origin"
        }

    })
);

app.use(compression());

app.use(morgan("dev"));

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));


/*
    إخفاء الحقول السرّية (مثل الإجابة الصحيحة للتحدي) عن غير المشرفين.
*/
app.use(sanitizeResponse);


/*
    تقديم الوسائط المرفوعة.

    multer يكتب داخل uploads/places و uploads/provinces،
    والخدمات تخزّن المسار كـ /uploads/... لذلك يجب تقديمه ثابتاً.
*/

const uploadsRoot =
    path.join(process.cwd(), "uploads");


[
    uploadsRoot,
    path.join(uploadsRoot, "places"),
    path.join(uploadsRoot, "provinces")

].forEach((directory) => {

    if (!fs.existsSync(directory)) {

        fs.mkdirSync(directory, {
            recursive: true
        });

    }

});


app.use(
    "/uploads",
    express.static(uploadsRoot, {
        maxAge: "7d"
    })
);


/*
    دخول موحّد — الدور يُحدَّد من الحساب نفسه.
*/

app.use(
    "/api/auth",
    authRoutes
);


/*
    رفع الصور العامة (طوابع، شركاء، صور المستخدمين).
*/

app.use(
    "/api/uploads",
    uploadRoutes
);


app.use(
    "/api/admin",
    adminRoutes
);


app.use(
    "/api/provinces",
    provinceRoutes
);

app.use(
    "/api/provinces/media",
    provinceMediaRoutes
);

app.use(
    "/api/areas",
    areaRoutes
);

app.use(
    "/api/places",
    placeRoutes
);

app.use(
    "/api/places/media",
    placeMediaRoutes
);

app.use(
    "/api/challenges",
    challengeRoutes
);

app.use(
    "/api/stamps",
    stampRoutes
);

app.use(
    "/api/partners",
    partnerRoutes
);

app.use(
    "/api/faqs",
    faqRoutes
);

app.use(
    "/api/qr-codes",
    qrCodeRoutes
);

app.use(
    "/api/books",
    bookRoutes
);

app.use(
    "/api/book-copies",
    bookCopyRoutes
);

app.use(
    "/api/public/qr",
    publicQRRoutes
);

app.use(
    "/api/users",
    userAuthRoutes
);

app.use(
    "/api/users/profile",
    userProfileRoutes
);

app.use(
    "/api/users/books",
    userBookRoutes
);

app.use(
    "/api/users/visits",
    userVisitRoutes
);

app.use(
    "/api/users/challenges",
    userChallengeRoutes
);

app.use(
    "/api/users/stamps",
    userStampRoutes
);

app.use(
    "/api/users/dashboard",
    userDashboardRoutes
);

app.use(
    "/api/admin/books",
    adminBookRoutes
);

app.use(
    "/api/admin/dashboard",
    adminDashboardRoutes
);

app.use(
    "/api/admin/users",
    adminUserRoutes
);

app.use(errorMiddleware);


export default app;