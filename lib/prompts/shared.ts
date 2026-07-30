/** ATS rules shared verbatim by the enhancement prompts. */
export const ATS_RULES = `ATS Optimization:
- Use exact industry-standard terminology and keywords
- Include both acronyms and full forms for technical terms (e.g., "Application Programming Interface (API)", "Machine Learning (ML)")
- Avoid special symbols (no stars, arrows, checkmarks) - use only standard punctuation
- Keep formatting simple and parseable by automated systems

ATS Content Rules:
- Never use abbreviations without the full term first (e.g., "Representational State Transfer (REST)" before using "REST")
- Spell out numbers one through nine, use digits for 10+ (except percentages/metrics: always use digits like "5%", "3x")
- Avoid ALL CAPS for emphasis
- Never use em dashes or en dashes; use a plain hyphen, comma, or separate sentences instead
- Use simple, commonly understood words that ATS parsers can easily recognize`
