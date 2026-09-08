---
use-when: "deciding which resume formats and data schema the portfolio must produce for machine and human readers"
---

# Question

What do applicant tracking systems (ATS) and other automated resume consumers reliably parse from a CV/resume, and which open machine-readable resume schema, if any, do such systems or third-party tools actually accept as input?

All sources were read on 2026-09-08. Web search was used only to locate the pages below; SEO articles from resume-optimisation vendors that the searches surfaced are not cited anywhere in this file.

# Sources

## JSON Resume

- S1. Schema file, `schema.json` on the archived repository. https://raw.githubusercontent.com/jsonresume/resume-schema/master/schema.json. Primary (the thing itself).
- S2. Repository landing page. https://github.com/jsonresume/resume-schema. Primary. Archived, read-only.
- S3. Schema documentation page. https://jsonresume.org/schema. Primary.
- S4. Projects page. https://jsonresume.org/projects. Primary (the project's own list of tools).
- S5. Homepage. https://jsonresume.org/. Primary.
- S6. Getting started page. https://jsonresume.org/getting-started. Primary.
- S7. npm registry metadata for `@jsonresume/schema`. https://registry.npmjs.org/@jsonresume/schema. Primary.
- S8. Monorepo package README and changelog. https://github.com/jsonresume/jsonresume.org/tree/master/packages/schema and https://github.com/jsonresume/jsonresume.org/blob/master/packages/schema/CHANGELOG.md. Primary.
- S9. Issue 58, "Have you heard of HR-XML?". https://github.com/jsonresume/resume-schema/issues/58. Primary (project tracker); only the opening post was rendered.

## schema.org and Google

- S10. https://schema.org/Person. Primary.
- S11. https://schema.org/EducationalOccupationalCredential. Primary.
- S12. https://schema.org/Occupation. Primary.
- S13. https://schema.org/Resume. Returned HTTP 404.
- S14. Google Search Central, JobPosting structured data. https://developers.google.com/search/docs/appearance/structured-data/job-posting. Primary.
- S15. Google Search Central, ProfilePage structured data. https://developers.google.com/search/docs/appearance/structured-data/profile-page. Primary.

## HR Open Standards

- S16. Homepage. https://www.hropenstandards.org/. Primary.
- S17. Standards page. https://www.hropenstandards.org/standards. Primary.
- S18. Standards downloads page. https://www.hropenstandards.org/standards-downloads. Primary.
- S19. Recruiting standards project page. https://www.hropenstandards.org/recruiting-standards-project. Primary.
- S20. LER-RS page. https://www.hropenstandards.org/ler-rs. Primary.
- S21. News, 4.4 release. https://www.hropenstandards.org/news/hr-open-standards-announces-release-of-44-standards. Primary.
- S22. News, 4.5RC1 candidate release. https://www.hropenstandards.org/news/standards-candidate-release---45rci-. Primary.
- S23. Documentation information page. https://www.hropenstandards.org/documentationinformation. Primary.
- S24. GitHub organisation. https://github.com/HROpen. Primary.
- S25. GitHub repository APISpecifications. https://github.com/HROpen/APISpecifications. Primary.
- S26. Learn and Work Ecosystem Library entry on the HR Open Resume/CV project. https://learnworkecosystemlibrary.com/initiatives/the-hr-open-standards-resume-cv-project/. Secondary write-up.

## ATS vendors

- S27. Greenhouse Support, "Supported formats for resumes, cover letters and other candidate uploads". https://support.greenhouse.io/hc/en-us/articles/360052218132. Primary. Last updated 2026-08-19.
- S28. Greenhouse Support, "Unsuccessful resume parse". https://support.greenhouse.io/hc/en-us/articles/200989175-Unsuccessful-resume-parse. Primary. Last updated 2026-03-02.
- S29. Greenhouse Support, "Talent Matching - Data Processing FAQ". https://support.greenhouse.io/hc/en-us/articles/41131616864283. Primary. Last updated 2026-02-02.
- S30. Greenhouse Support, "Resume parsing with non-English languages". https://support.greenhouse.io/hc/en-us/articles/205019689. Primary. Last updated 2026-05-06.
- S31. Greenhouse Job Board API. https://docs.greenhouse.io/job-board.html (developers.greenhouse.io redirects here). Primary.
- S32. Greenhouse Harvest API. https://docs.greenhouse.io/harvest.html. Primary.
- S33. Lever developer documentation. https://hire.lever.co/developer/documentation. Primary.
- S34. Lever Postings API README. https://github.com/lever/postings-api. Primary.
- S35. Lever Help Center, "Understanding Resume Parsing". https://help.lever.co/s/article/Understanding-Resume-Parsing. Not readable: the fetch returned only a JavaScript shell with a "CSS Error" message.
- S36. Lever Help Center legacy article on adding a resume. https://help.lever.co/hc/en-us/articles/209735523. Returned HTTP 401.
- S37. Workday Administrator Guide, "Concept: Resume Parsing". https://doc.workday.com/admin-guide/en-us/human-capital-management/recruiting/candidates/set-up-prospects-and-candidates/hdc1552497830785.html. Primary. Page states last updated 2023-06-23.
- S38. Workday HiredScore, "Concept: Candidate Profiles". https://doc.workday.com/hiredscore/en-us/workday-hiredscore/recruiter-productivity-/concept--candidate-profiles.html. Primary. Page states last updated 2023-06-23.
- S39. iCIMS Developer Resources, "Binary Files". https://developer-community.icims.com/applications/applicant-tracking/binary-files. Primary.
- S40. iCIMS Community knowledge article on bulk resume migration. https://community.icims.com/articles/Knowledge/Creating-New-Candidates-via-Bulk-File-Transfer-Migrating-Legacy-Resumes-during-Implementation. Returned HTTP 401.

## Parser vendors

- S41. Textkernel TK Platform, "Supported File Formats". https://developer.textkernel.com/TKPlatform/master/file-formats/. Primary.
- S42. Textkernel, "CV/Resume and Job Parser Documentation". https://developer.textkernel.com/Parser/master/. Primary.
- S43. Textkernel Tx Platform v10 FAQ. https://developer.textkernel.com/tx-platform/v10/faq/. Primary.
- S44. Textkernel Tx Platform v9 Parse API. https://developer.textkernel.com/tx-platform/v9/resume-parser/api/. Primary.
- S45. Textkernel Sovren marketing page. https://www.textkernel.com/sovren/. Primary but marketing; no technical claims found.
- S46. Bullhorn Invenias knowledge base, "Parsing - Technical Specifications and Sovren FAQ". https://kb.bullhorn.com/invenias/Content/Invenias/Topics/parsingTechnicalSpecificationsAndSovrenFAQ.htm. Secondary (a customer of Sovren describing it); undated.
- S47. Affinda API reference, "Upload a resume for parsing". https://docs.affinda.com/api-reference/resume-parser/upload-a-resume-for-parsing.md. Primary.
- S48. Affinda, "Limits". https://docs.affinda.com/reference/limits.md. Primary.
- S49. Affinda API reference, "Get parse results for a specific resume". https://docs.affinda.com/api-reference/resume-parser/get-parse-results-for-a-specific-resume.md. Primary.
- S50. Affinda, docs.affinda.com/docs/supported-file-types. Returned HTTP 404.
- S51. DaXtra Parser integration resource. https://cvxdemo.daxtra.com/cvx/ (api-doc.daxtra.com redirects here). Primary.
- S52. Mercury customer portal, "Do's and Don'ts of Resume/CV formatting in Daxtra". https://portal.wearemercury.com/knowledgebase/article/KA-01555/en-us. Secondary (a Daxtra reseller's support analyst, undated).
- S53. RChilli Knowledge Center, "Resume Parser". https://docs.rchilli.com/kc/c_RChilli_resume_parser. Primary.

# Findings

Labels used below: source = what the page says; observation = what I saw about the page itself; interpretation = what I take it to mean; conclusion = what follows.

## A. JSON Resume

A1. Schema contents. Source (S1): the schema declares `$schema: http://json-schema.org/draft-07/schema#` and has the top-level properties `$schema, basics, work, volunteer, education, awards, certificates, publications, skills, languages, interests, references, projects, meta`, with `additionalProperties: true` at the root and on `basics` and `meta`. `basics` holds `name, label, image, email, phone, url, summary, location, profiles`; `work` items hold `name, location, description, position, url, startDate, endDate, summary, highlights`; `education` items hold `institution, url, area, studyType, startDate, endDate, score, courses`; `skills` items hold `name, level, keywords`; `projects` items hold `name, startDate, endDate, description, highlights, url`; `meta` holds `canonical, version, lastModified`. S3 documents the same sections and lists `location` sub-fields `address, postalCode, city, countryCode, region` and `profiles` sub-fields `network, username, url`. True of the `master` branch of the archived repository and of jsonresume.org/schema as read on 2026-09-08.

A2. Version. Source (S7): npm `@jsonresume/schema` dist-tag `latest` is 1.3.1, published 2026-07-22; 1.3.0 was published 2026-06-13; 1.2.1 on 2024-08-06. Source (S8, changelog): 1.3.0 "Ship three diverse, realistic example resumes under `examples/`"; 1.3.1 "remove `additionalItems: false` everywhere it sat next to a non-array `items`" and bumps `job-schema.json` from draft-04 to draft-07, with "identical validation behavior". Source (S3): the schema page shows "Version: 1.0.0". Observation: the documentation page and the npm package disagree on the version string. Interpretation: the schema page's "1.0.0" is stale relative to npm, and the 1.x line has had no breaking change (the README says major bumps will be "few and far between", S8).

A3. Repository status. Source (S2): the `jsonresume/resume-schema` repository is archived and read-only as of 2026-06-12 and points to `jsonresume/jsonresume.org` (`packages/schema`); "npm @jsonresume/schema unchanged". Licence MIT (S2, S3). Stars 2.4k, forks 292 (S2).

A4. Who consumes it. Source (S4): the project's own projects page lists builders (Reactive Resume, Resumake, Standard Resume, ResumeSet, Resumeio, Friggeri Resume), CLIs (resume-cli, resumed, goresume, resume-pycli, pysira), frameworks and site generators (Hugo modules, Gatsby, Astro, LitElement component), validators in PHP, Python, Java, Go, exporters to DOCX, LaTeX, PDF, HTML, LinkedIn-to-JSON-Resume importers, GitHub Actions, and the official registry. Source (S6): publishing means a GitHub Gist named `resume.json`, rendered at `registry.jsonresume.org/<github_username>` in JSON, YAML and text. Source (S5): the homepage describes it as "The open-source initiative to create a JSON-based standard for resumes. For developers, by developers." Observation: neither S3, S4 nor S5 names any ATS, job board, or hiring platform as a consumer. Source (S9): the 2014 issue asking whether the project had heard of HR-XML shows no visible reply, no labels, no assignees. Conclusion: as of 2026-09-08, JSON Resume's documented consumers are rendering, validation and conversion tools and its own registry. No hiring-side consumer is documented by the project.

A5. Search for ATS acceptance. Observation: two web searches for JSON Resume import support in Greenhouse, Lever, Workday, iCIMS, Ashby, Workable, Recruitee and Teamtailor returned no vendor documentation of such a feature; the results were job-scraping tools and SEO articles. This is an absence, not proof; see "Not checked".

## B. schema.org and search engines

B1. Person. Source (S10): schema.org V30.0 (2026-03-19) `Person` has core (not pending) properties `hasCredential`, `hasOccupation` (Occupation), `jobTitle` (DefinedTerm or Text), `worksFor` (Organization), `alumniOf` (EducationalOrganization or Organization), `knowsAbout` (Text, Thing, URL), `knowsLanguage` (Language or Text), `award` (Text), `affiliation` (Organization), `sameAs` (URL), `url`, `email`. Observation: the fetched summary rendered the expected type of `hasCredential` as "Credential"; the Occupation page (S12) likewise lists both "Credential" and "EducationalOccupationalCredential" among expected types. I did not open a `schema.org/Credential` page to confirm whether V30.0 introduced a `Credential` supertype; treat that detail as unverified.

B2. EducationalOccupationalCredential. Source (S11): "An educational or occupational credential. A diploma, academic degree, certification, qualification, badge, etc." Properties include `credentialCategory`, `educationalLevel`, `competencyRequired`, `recognizedBy`, `validFor`, `validIn`. The page marks the type as "in the new area" needing feedback, originating from schema.org GitHub issue 1779. True of V30.0.

B3. Occupation. Source (S12): "A profession, may involve prolonged training and/or a formal qualification." Properties `occupationLocation`, `estimatedSalary`, `skills`, `qualifications`, `responsibilities`, `educationRequirements`, `experienceRequirements`, `occupationalCategory` (taxonomies such as BLS O*NET-SOC or ISCO-08). True of V30.0.

B4. No Resume type. Observation (S13): https://schema.org/Resume returns 404. Conclusion: schema.org has no `Resume` or `CV` type as of V30.0; a resume can only be expressed as a `Person` with the properties above.

B5. Google's documented consumption. Source (S14): the JobPosting structured-data page is scoped to "job posting web pages" published by employers and job content sites; it does not mention Person, candidates or resumes. Source (S15): ProfilePage markup "is designed for any site where creators (either people or organizations) share first-hand perspectives"; the Person properties Google reads there are `name`, `alternateName`, `description`, `image`, `identifier`, `interactionStatistic`, `agentInteractionStatistic`, `sameAs`; no mention of resumes, hiring, recruiters or job applications. Conclusion: Google documents reading Person JSON-LD for search features, not for hiring; I found no hiring platform that documents consuming JSON-LD from a personal site (see Not checked for what was not searched).

## C. HR Open Standards (formerly HR-XML)

C1. What it is and openness. Source (S16): "The HR Open Standards Consortium is the only independent, non-profit, volunteer-led organization dedicated to the development and promotion of a standard suite of specifications to enable human resource related data exchanges." and "Our voluntary consensus standards are free." Source (S18): "The versions of HR Open Standards linked below are available for free public download."; "If you're not already an HR Open Standards member, you can register for a free Community membership account."; "By downloading the HR Open Standards you are agreeing to the HR Open Standards IP Agreement" (a PDF). Work-in-progress standards require paid membership (S18). Observation: I did not obtain the IP Agreement text; S23 has no licence statement. Interpretation: the schemas are free of charge and publicly downloadable behind a registration wall under a consortium IP agreement, which is not the same thing as an OSI-style open licence. Whether implementers may redistribute the schemas is unverified.

C2. Versions and resume coverage. Source (S17): listed releases include 4.6 (2026), 4.5 (2026), LER-RS V2 release candidate (2025), JEDx API (2024), 4.4 (2024), 4.3 (2024), 4.2, 4.1.1; 4.4 "includes the newly developed Learning Employment Record - Resume Standard (LER-RS)". Source (S21): 4.4 announced 2024-02-26; Recruiting area introduces LER-RS "focused on skills-based formatting and digital credential verification". Source (S22): 4.5RC1 dated 2025-05-09, "incorporates advancements aligned with the ongoing development of LER-RS v2, which incorporates open API to support plug-in solutions for HRIS vendors". Source (S20): LER-RS is "a free and open standard designed to enhance the traditional resume in hiring and advancement"; V2 "currently under development" with the U.S. Chamber of Commerce Foundation's T3 Innovation Network; "LER-RS JSON standards" are "within the latest 4.5RC"; JSON objects are "transformed into JSON-LD LER-Verifiable Credentials or VCs". Source (S26, secondary): the standard supports "JSON Schema and XSD, and incorporating JSON-LD for enhanced discoverability". Observation: I found no 4.6 release announcement on the news site (search on 2026-09-08), only the row on S17.

C3. Named users. Source (S16): member organisations listed include ADP, iCIMS, Jobvite, Finch and roughly 25 others, not labelled as adopters of any specific standard. Source (S20): "targeted early adopters" are categories (credential wallets, job boards, resume parsers, employers/HRIS/ATS, academic institutions, talent marketplaces), with no product named. Source (S22): the only named company quoted is iDatafy (a quote, not a stated implementation). Source (S19): the Recruiting workgroup page names no implementers. Observation: a search-result summary stated "The resume-like elements are in the Person Profile type, which resides in the Candidate type", but I could not open the schema package itself (registration wall), so the Candidate/PersonProfile structure is unverified here.

C4. GitHub. Source (S24, S25): the HROpen organisation has one public repository, `APISpecifications` (last updated 2026-02-12, 6 stars), whose directories are `common`, `organizations/v1`, `transport-objects`, `worker-compensation-reports/v1`, `worker-paid-hours-reports/v1`, `workers/v1`; no Candidate, Resume, LER-RS, Recruiting or TCP directory; no licence file seen. Conclusion: the Candidate and LER-RS schemas are not published on the public GitHub organisation; they live behind the downloads page.

C5. Vendor support for HR-XML output. Source (S51): DaXtra offers "the latest and previous versions of DaxJson, DaxML and HR-XML Candidate schemas" as output. Source (S49): Affinda's get-results endpoint has an optional parameter, "Set this to \"hr-xml\" to get the response in HR-XML format." Source (S46, secondary, undated): Sovren's output "may be used in HR-XML or JSON format". Source (S44): Textkernel's current Tx Platform v9 Parse API documents `ParsedDocument` as a JSON string with optional HTML, RTF and PDF conversions and does not mention HR-XML or HROpen; S43 says "The REST API returns results in JSON format following the schema found in our documentation." Source (S53): RChilli documents JSON output only. Interpretation: HR-XML persists as an output format of some parsers (DaXtra, Affinda), which is the parser-to-ATS direction. None of the pages read documents HR-XML, HR-JSON or LER-RS as an accepted input from a candidate.

## D. ATS vendors: accepted files and what is parsed

D1. Greenhouse, file formats. Source (S27): "candidates can upload the following file types: .doc, .docx, .pdf, .rtf, .txt"; "Candidate uploads can be up to 100 MB"; "Greenhouse Recruiting does not load externally linked images when converting a resume to PDF for preview. Images embedded directly in the resume file are unaffected." Source (S31): the Job Board API says the resume "Must be a supported file type (pdf, doc, docx, txt, rtf)" and "File size must be > 0 bytes". True as of last update 2026-08-19 (S27).

D2. Greenhouse, parse failures and layout. Source (S28, last updated 2026-03-02): "Greenhouse Recruiting can't parse resumes larger than 2.5MB." Parsing also fails on obviously fake data ("First Last", "Company 1"), and on formatting: "A resume with spaces between the letters"; graphics, photos or word art; image-based resumes instead of .docx or .pdf; "Complex resumes with tables, headers, and footers"; name or contact information placed in headers, footers or text boxes; columned layouts; inconsistent section formatting; incomplete job titles such as "Sr. Account Exec"; company names lacking identifiers such as Inc. or LLC. On success the parser "auto-fills appropriate fields with information it detects", and partial parses are possible. Interpretation: Greenhouse is the only ATS of the four whose own support site enumerates layout features that break its parser; the list matches the folk "ATS-friendly" advice (single column, no tables, no header/footer contact block, no images).

D3. Greenhouse, extracted data. Source (S29, last updated 2026-02-02): Greenhouse parses "skills, job titles, years of experience, start/end dates of employment, and company names from employment history" plus "a derived industry classification associated with candidate's past employers", using "a series of fine-tuned LLM models, each one trained for a specific extraction task" and "third-party models such as OpenAI". Source (S30, last updated 2026-05-06): full parsing is available in 27 named languages including Arabic, Chinese (Simplified), English, French, German, Japanese, Korean, Portuguese, Spanish. Observation: I found no Greenhouse article that enumerates the candidate-profile fields (name, email, phone, address, title, company) the basic parse fills; S28 says only "appropriate fields". The Resumes support section (https://support.greenhouse.io/hc/en-us/sections/360000690451-Resumes) holds four articles and none is such a list.

D4. Lever, file formats and parsing. Source (S33): "In requests that allow you to do so, the following file formats are supported: docx, doc, js, jpg, png, pdf, txt" and "In cases where the desired outcome is that an uploaded file be parsed for information (such as in the Creating an Opportunity endpoint), image files are not supported and will not be successfully parsed for information." Resumes are uploaded as `resumeFile` via multipart. Source (S34): the Postings API accepts "Resume data. Only in `multipart/form-data` mode. Should be a file." and the README lists no file types. Observation: Lever's help-centre articles on parsing (S35, S36) could not be read (JavaScript shell; 401). Conclusion: for Lever, the primary evidence is the developer documentation; DOCX, DOC, PDF and TXT are accepted and image files are explicitly not parsed. No layout guidance was reachable.

D5. Workday. Source (S37, last updated 2023-06-23): "Resume parsing populates fields from a resume"; "Workday doesn't auto-fill fields you configure as hidden or these fields: Languages, Skills"; "For best results, use resumes that don't have images or image-based styles."; "Resume parsing results can vary based on resume format and order of words." No file-type list, size limit, engine or field list on that page. Source (S38, last updated 2023-06-23): "HiredScore supports these file types for resume attachments: DOC, DOCX, PDF, RTF, and TXT." and "You can only view smart resumes when candidates attach resumes with their applications in a supported format." Interpretation: Workday's public documentation is thin and three years old; the file-type list comes from its HiredScore module, not the core candidate upload.

D6. iCIMS. Source (S39): text extraction is supported for "pdf, doc, docx, odt, wpd, wri, ods, rtf, txt, xls, xlsx, ppt, pptx, odp, zip, rar, htm, html, dot, dotx, xlt, xltx, tif, tiff, jpg, jpeg, png, gif, bmp, gz, dcx, pcx, jp2, jpc, jfif"; conversion to PDF for "html, htm, doc, docx, rtf, odt, xml, txt, png, jpg, jpeg, svg, tif, tiff"; resumes attach via multipart PATCH (`-F "resume=@<path>;type=<content type>"`); text extraction is attempted on demand with two attempts and a 90-second timeout; no size limits stated. Observation: this is the API's text-extraction capability, not a statement of which formats the parser handles well; the customer knowledge base (S40) is behind login. No layout guidance was reachable from iCIMS.

## E. Parser vendors

E1. Textkernel (owner of Sovren). Source (S41): "more than 70 document formats, including:" PDF, Word (doc, docx), HTML, RTF, TXT, ODT, Apple Pages, which "cover nearly 100% of the documents that we process in practice"; ZIP and EML archives with at most 10 files; with an optional OCR add-on, "PDF (image), BMP, JPG, GIF, PNG, TIFF"; "Images take considerably longer to parse due to the additional OCR step". Source (S42): output is "structured JSON or XML"; "over 50 extracted, normalized, or inferred fields"; 25 CV languages. Source (S44): input is `DocumentAsBase64String`. Source (S43): "Compression file formats are not supported." Observation: no layout guidance (tables, columns, headers) on S41 to S44. Source (S46, secondary): Sovren supports "any non-image resume and CV format" and attributes poor PDF results to "internally corrupted PDFs rather than parser limitations".

E2. Affinda. Source (S47): file input "Supported formats: PDF, DOC, DOCX, TXT, RTF, HTML, PNG, JPG, TIFF, ODT, XLS, XLSX"; also `url` ("URL to download the resume") and `data` ("A JSON-encoded string of the `ResumeData` object"), with "Data uploads will not impact upon parsing credits." Source (S48): 20 MB maximum upload, "5MB" for resumes, 20 pages by default. Source (S49): `ResumeData` top-level fields are `name, phoneNumbers, phoneNumberDetails, websites, emails, dateOfBirth, location, objective, languages, languageCodes, summary, totalYearsExperience, headShot, education, profession, linkedin, workExperience, skills, certifications, publications, referees, sections, isResumeProbability, rawText, redactedText`; the schema is Affinda's own and does not reference JSON Resume, HR-XML or HR Open, although HR-XML is offered as an output format. Interpretation: Affinda is the one vendor read that accepts structured data as input, and that structure is its proprietary `ResumeData`, not JSON Resume.

E3. DaXtra. Source (S51): converts "resumes and job orders (vacancies) in various file formats (DOC, DOCX, RTF, PDF, HTML, etc.)" into XML or JSON; input by Base64, multipart/form-data or direct HTTP; output schemas DaxJson, DaxML and HR-XML Candidate; extracts personal data, contact information, employment history, education and competencies; REST API v1 at `/cvx/rest/api/v1`. Source (S52, secondary, undated): do use a first and last name, a location, "at least one telephone number and/or email address", and "simple fonts like Helvetica, Arial, Times New Roman, Courier New"; do not exceed "8mb"; "Avoid the use of headers and tables, as this can diminish the parsing accuracy rates."; avoid "graphics, photos or other Word Art"; avoid "CVs being saved as a image"; avoid "unconventional or complex layouts like slanted text, text boxes or shapes".

E4. RChilli. Source (S53): input "doc, docx, pdf, rtf, txt, html, htm, odt, docm, dotm, dot, dotx, mht, png, and jpeg"; output "structured, machine-readable JSON format"; "over 200 data fields" across contact information, work experience, education and skills; 40+ languages. No layout guidance, no HR-XML mention, no version number on the page.

## F. URL or structured feed instead of a file

F1. Greenhouse. Source (S31): the Job Board API accepts `resume` (multipart file), `resume_content` plus `resume_content_filename` (Base64 in JSON), `resume_url` plus `resume_url_filename` ("External Server Path"), and `resume_text` (plaintext); the same four forms exist for cover letters. Source (S32): Harvest `POST /v1/candidates/{id}/attachments` takes `filename`, `type` (`resume`, `cover_letter`, `other`), and either `content` (Base64, with `content_type`) or `url`; the endpoint does not mention parsing. Interpretation: Greenhouse accepts a URL, but it must resolve to one of the five file types; the URL is a transport for a file, not a structured feed.

F2. Lever. Source (S33, S34): only multipart file upload is documented; no URL parameter.

F3. iCIMS. Source (S39): multipart file only.

F4. Workday. Observation: no public API documentation for candidate resume submission was reachable; S37 and S38 describe upload through the application flow only.

F5. Parsers. Source (S47): Affinda accepts `url` and structured `data` (its own schema). Source (S51): DaXtra accepts direct HTTP calls and Base64 or multipart bodies; a fetch-by-URL option was not seen. Source (S44): Textkernel accepts Base64 only on the Parse API page read.

Conclusion for F: no ATS read documents accepting a structured resume (JSON, XML, JSON-LD) from a candidate; the only structured input found anywhere is Affinda's proprietary `ResumeData`, offered to API customers, not applicants.

## G. What is reliably parsed (cross-vendor)

G1. Source, across S28, S29, S37, S49, S51, S53: every vendor that names its fields converges on contact details (name, email, phone, location), employment history (employer, title, start and end dates), education (institution, degree or area, dates), and skills. Greenhouse adds years of experience and a derived employer industry (S29); Workday excludes Languages and Skills from auto-fill (S37); Affinda adds certifications, publications, languages, websites and LinkedIn (S49).

G2. Source, across S27, S28, S33, S37, S41, S52: every vendor that comments on images says image-only or scanned resumes are not parsed without OCR (Greenhouse S28, Lever S33, Workday S37, Textkernel S41 requires an add-on, Daxtra reseller S52). Greenhouse (S28) and the Daxtra reseller (S52) additionally name tables, headers and footers, text boxes and unusual layouts; Greenhouse alone names multi-column layouts. Interpretation: "single column, no tables, contact block in the body not the header, real text not images" is corroborated by two primary vendor pages (S28, S37) and one secondary (S52); font guidance ("simple fonts") appears only in the secondary source S52; explicit guidance on standard section headings appears in none of the pages read, though Greenhouse's "inconsistent section formatting" (S28) and Workday's "order of words" (S37) point the same way.

G3. Source (S27, S31, S33, S38, S39, S41, S47, S51, S53): PDF and DOCX are accepted by every ATS and parser read. TXT is accepted by Greenhouse, Lever, Workday HiredScore, iCIMS, Textkernel, Affinda and RChilli. DOC and RTF are accepted by all but Lever (Lever lists DOC but not RTF). Size ceilings differ: Greenhouse 100 MB upload but 2.5 MB for parsing (S27, S28); Affinda 5 MB for resumes (S48); Daxtra reseller 8 MB (S52).

# Conclusion

1. What ATSs and parsers reliably parse, as documented by the vendors themselves on 2026-09-08, is a short common core: name, email, phone, location; employment entries as employer, title, start date, end date; education entries as institution, degree or area, dates; and a skills list. Anything beyond that (certifications, publications, languages, projects) is vendor-specific (present in Affinda, absent from Workday auto-fill).

2. The universally accepted input is a text-based file. PDF and DOCX are accepted by every ATS and parser read; TXT by nearly all. Image-only documents are rejected or need paid OCR everywhere it is discussed. Greenhouse (primary) and a Daxtra reseller (secondary) are the only sources that enumerate layout hazards: tables, headers and footers, text boxes, columns, graphics, contact details outside the body, abbreviated titles. Workday says only "no images or image-based styles" and warns that word order matters.

3. No open machine-readable resume schema is documented as accepted input by any ATS read. JSON Resume 1.3.1 (MIT, active, moved to a monorepo in June 2026) is consumed by rendering, validation, conversion and hosting tools, and by nothing on the hiring side that the project or any vendor documents. schema.org has no Resume type; Person, Occupation and EducationalOccupationalCredential exist in V30.0, and Google documents reading Person markup for search features only. HR Open (LER-RS, in 4.4 through 4.6) is free to download behind a registration wall under a consortium IP agreement, names no implementing product, keeps its Candidate schemas off public GitHub, and appears in vendor documentation only as an output format (DaXtra, Affinda, historically Sovren).

4. Greenhouse is the only ATS read that accepts a resume by URL (Job Board API `resume_url`, Harvest attachments `url`), and the URL must point at one of its five file types. Affinda accepts a URL and structured JSON, but the JSON is its proprietary ResumeData and the caller is the API customer, not the applicant.

# Not checked

- The HR Open IP Agreement PDF and the downloaded 4.5/4.6 schema packages: not opened, so the Candidate and PersonProfile structure, the LER-RS field list, and whether redistribution is permitted are unverified.
- Whether schema.org V30.0 introduced a `Credential` supertype distinct from `EducationalOccupationalCredential`.
- Lever's help-centre articles on parsing (JavaScript-only page, and a 401); Lever's layout guidance is therefore unknown.
- iCIMS customer knowledge base (401) and any iCIMS statement of which parser it uses; the public developer page describes text extraction, not parsing quality.
- Workday's candidate-facing "Autofill with Resume" file-type list and size limit; only the HiredScore module page and a 2023 concept page were public.
- Textkernel's field-level data model page and any Textkernel guidance on layout; only the file-format, FAQ and API pages were read.
- Whether any current Textkernel product still emits HR-XML (the only statement found is an undated Bullhorn KB page about Sovren).
- LinkedIn, Indeed, SmartRecruiters, Ashby, Workable, Taleo, SuccessFactors and other ATSs: not examined at all.
- Whether any job board or ATS crawls personal websites for Person JSON-LD; I searched for documentation and found none, but did not examine LinkedIn or Indeed developer documentation.
- The Greenhouse Job Board API's handling of `resume_text` by the parser (whether plaintext receives the same extraction as a file).
- Actual parser behaviour on any test document: this file records documentation only, not a prototype.
