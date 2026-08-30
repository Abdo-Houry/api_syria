import {
    Request,
    Response,
    NextFunction
} from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

/*
    يحذف الحقول السرّية من أي استجابة تُرسل لغير المشرف.

    `correct_option` هو دليل الإجابة الصحيحة للتحدي، ويصل إلى المستخدم عبر
    أكثر من مسار (قائمة التحديات، محتوى الكتيّب، تفاصيل المكان عبر الـ QR)،
    فالتنظيف في مكان واحد أضمن من تتبّع كل مسار على حدة.
*/
const SECRET_FIELDS = new Set(["correct_option"]);

const isAdminRequest = (req: Request): boolean => {

    if (req.user?.role === "ADMIN") return true;

    const header = req.headers.authorization;
    const token = header?.split(" ")[1];

    if (!token) return false;

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET) as { role?: string };
        return decoded.role === "ADMIN";
    } catch {
        return false;
    }
};

const strip = (value: unknown, seen = new WeakSet<object>()): unknown => {

    if (Array.isArray(value)) {
        return value.map((item) => strip(item, seen));
    }

    if (value && typeof value === "object") {

        if (value instanceof Date) return value;

        if (seen.has(value)) return value;
        seen.add(value);

        const out: Record<string, unknown> = {};

        for (const [key, item] of Object.entries(value)) {
            if (SECRET_FIELDS.has(key)) continue;
            out[key] = strip(item, seen);
        }

        return out;
    }

    return value;
};

export const sanitizeResponse = (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    const original = res.json.bind(res);

    res.json = ((body: unknown) => {
        return original(isAdminRequest(req) ? body : strip(body));
    }) as Response["json"];

    next();
};
