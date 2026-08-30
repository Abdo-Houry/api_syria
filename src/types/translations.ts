/*
    الترجمات على مستوى البيانات.

    اللغة الأساسية هي العربية وتُخزَّن في الأعمدة الأصلية (name, summary, …).
    باقي اللغات تُخزَّن في عمود `translations` من نوع jsonb بالشكل:

    {
      "en": { "name": "Aleppo", "summary": "..." },
      "de": { "name": "Aleppo", "summary": "..." },
      "tr": { "name": "Halep",  "summary": "..." }
    }

    أي حقل غير مترجَم يعود إلى العربية تلقائياً في الواجهة.
*/

export const SUPPORTED_LOCALES = ["ar", "en", "de", "tr"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

/** لغة واحدة: حقل → نص. */
export type TranslationFields = Record<string, string>;

/** كل الترجمات لكيان واحد: لغة → حقولها. */
export type Translations = Partial<Record<Locale, TranslationFields>>;
