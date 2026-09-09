---
use-when: "populating or checking the portfolio's content against what actually exists in Saud's GitHub account and the studies folder on Google Drive"
---

# Question

What work and study material exists today that the portfolio and the derived CV can be populated from, and what is missing?

# Sources

- GitHub, `gh repo list saud-alnasser` and `gh api repos/<name>/readme` for the main repositories, authenticated as the owner, read on 2026-09-08. Covers public and private repositories.
- GitHub profile, `gh api users/saud-alnasser`, read on 2026-09-08.
- Google Drive, mounted at `G:\My Drive\studies` on this machine, listed with `find` on 2026-09-08. Text taken from `university/plan/description.pdf`, `university/plan/new-description.pdf`, the Senior Project 2 report, the practical training report, and the SoloLearn and typing certificates with `pdftotext`.

Identifiers found in these documents (national ID, student IDs, phone numbers) were deliberately not copied here or anywhere in this repository.

# Findings

## GitHub account

source: the account was created 2023-01-23 and has no bio, location, blog, company, or public email set. The profile repository `saud-alnasser/saud-alnasser` still holds GitHub's unedited README template.

source: 22 repositories, 13 public and 9 private, on 2026-09-08:

| Repository | Visibility | Language | Created | Last update | Description or README summary |
| --- | --- | --- | --- | --- | --- |
| portfolio | public | JavaScript | 2026-09 | 2026-09 | this repository |
| rentable | public | TypeScript | 2025-08 | 2026-08 | offline-first desktop rent tracker: Tauri 2 shell in Rust around SvelteKit 2 and Svelte 5, local replica synced to Turso, a control plane for accounts and tokens |
| mudaraj | private | Svelte | 2025-09 | 2026-04 | senior project: centralised e-ticketing and fan loyalty platform for Saudi football, SvelteKit and Supabase, bilingual, QR ticket validation |
| nexuscord | private | Rust | 2025-01 | 2026-08 | modular Discord bot framework: TypeScript bot code beside a Rust host process that owns the gateway session and REST client |
| screeps | private | Rust | 2024-05 | 2026-07 | a Screeps colony, no README |
| etg | private | Lua | 2026-08 | 2026-08 | no description |
| nova-lang | private | Rust | 2026-06 | 2026-08 | Nova: a statically typed, garbage-collected language with generics, traits, sum types; bytecode and JIT; status draft |
| skills | public | JavaScript | 2026-07 | 2026-08 | AEP, the Agentic Engineering Protocol: an agent-agnostic filesystem protocol for AI-assisted software work |
| CS475-CourseViewer | public | Java | 2026-05 | 2026-05 | mobile computing course project |
| discord-trengo-integration | private | Rust | 2026-03 | 2026-03 | no description |
| monkey-lang | public | Rust | 2024-02 | 2025-12 | interpreter for the Monkey language following "Writing an Interpreter in Go" |
| pl-0 | public | Rust | 2025-12 | 2025-12 | built for the compiler design course |
| advent-of-code | public | Rust | 2024-06 | 2025-07 | Advent of Code solutions |
| bevy-pong | public | Rust | 2024-03 | 2024-11 | Pong clone with Bevy |
| knowledge | private | none | 2023-07 | 2025-04 | personal notes ("my extended brain") |
| leetcode | public | Rust | 2024-12 | 2025-01 | LeetCode solutions |
| course-simple-personal-information-form | private | PHP | 2024-12 | 2025-01 | web programming course project |
| course-cpu-scheduling-simulator | private | Java | 2024-11 | 2025-01 | operating systems course project (CS351) |
| godot-brackeys-simple-platformer | public | GDScript | 2024-11 | 2024-11 | tutorial platformer |
| cachescribe | public, archived | TypeScript | 2023-09 | 2025-05 | npm package: a cache that persists to the file system across runs |
| learning-rust | public | Rust | 2024-01 | 2024-02 | Rust learning journey |
| saud-alnasser | public | none | 2023-02 | 2023-02 | profile README, unedited template |

observation: Rust dominates by repository count; TypeScript and Svelte carry the two largest applications (rentable, mudaraj). Several private repositories (nexuscord, nova-lang, mudaraj) are more substantial than most public ones.

interpretation: the strongest portfolio material is partly private. Whether it is shown, and how, is the owner's decision (see the spec's open questions).

## Studies folder

source: `G:\My Drive\studies` holds four top-level folders and two loose files:

| Folder | Files | Contents |
| --- | --- | --- |
| `high school/` | 0 | empty |
| `king saud university/` | 6 | academic transcripts (Arabic and English) and course descriptions. The owner said to ignore this period. |
| `online courses/` | 32 | 27 certificates under `certificates/`, 5 cheat sheets |
| `university/` | 496 | per-term folders 2023-2024 through 2025-2026, plus `plan/` |
| loose | 2 | Qiyas GAT and SAAT (Saudi national aptitude and achievement tests) result printouts from 2022 |

### University

source: `university/plan/description.pdf` and `new-description.pdf` are the study plan for the Bachelor of Science in Computer Science, College of Computing and Informatics, dated August 2022 and September 2023. The Senior Project 2 report names the institution: Saudi Electronic University, Riyadh. The practical training report carries a `seu.edu.sa` student email.

source: term folders and their `courses.txt` files list the courses taken:

| Term | Courses |
| --- | --- |
| 2023-2024 first | CS231 Digital Logic Design, CS350 Introduction to Database, CS352 System Analysis and Design, STAT101 Statistics |
| 2023-2024 second | CS241 Computer Architecture and Organization, CS242 Theory of Computing, ISLM101, MATH251, SCI201 General Physics 2 |
| 2023-2024 summer | ISLM102 |
| 2024-2025 first | CS351 Operating Systems, CS353 Design and Analysis of Algorithms, CS361 Web Programming, CS364 Computing Entrepreneurship, ISLM103 |
| 2024-2025 second | CS360 Computer Networks, CS362 Artificial Intelligence, CS363 Principles of Programming Languages, CS470 Human Computer Interaction, ISLM104 |
| 2024-2025 summer | CS471 Computer Security (CS480 also listed as an option) |
| 2025-2026 first | CS477 Compiler Design, CS478 Computer Graphics, CS479 Senior Project 1, CS480 Project Management, CS481 Professional Ethics |
| 2025-2026 second | CS475 Mobile Computing, CS476 Parallel and Distributed Computing, CS489 Senior Project 2 |
| 2025-2026 summer | CS499 Practical Training (cooperative training) |

source: `university/plan/needed.txt` listed CS475, CS476, CS489, and CS499 as the remaining courses; folders for all four exist with deliverables in them.

observation: the plan's first-year courses (CS001, CS230, CS240, MATH150 and so on) have no folders under `university/`. The King Saud University transcripts are the likely origin of transferred credit, but that was not checked.

interpretation: the degree's course work is complete as of the 2025-2026 summer term. The owner states the certificate has not been issued yet.

### Senior project

source: the Senior Project 2 report, "Mudaraj: A Centralized E-Ticketing and Fan Loyalty Platform", College of Computing and Informatics, Saudi Electronic University, supervisor Dr. Mahfuzul Huda, six authors including Saud Alnasser. Abstract: SvelteKit frontend, Supabase backend, points-based loyalty programme, QR-code stadium entry, Scrum. The private `mudaraj` repository holds the source.

## Practical training

source: "Practical Training - Final Training Report", dated 2026-09-08, CS499. Trainee Saud Alnasser, Department of Computer Science. Organisation: Al Othaim Markets, IT Department at headquarters, Riyadh. Responsibilities: hardware replacement and deployment across HQ offices, equipment collection and preparation for joiners and leavers, printer and office equipment maintenance, damage reports, software troubleshooting (including an HR application blocked by Edge SmartScreen), ticket handling in Dynamics 365 with custom SDB tickets, remote support tooling (Configuration Manager, Nexthink).

observation: the report does not state the start and end dates of the placement in the pages read. The registration folder holds a request form addressed to Othaim Markets.

## Online courses and certificates

source: 27 certificate PDFs in `online courses/certificates/`:

| Issuer | Courses | Date evidence |
| --- | --- | --- |
| Code with Mosh (19) | ASP.NET MVC 5; C# basics, intermediate, advanced, unit testing; Data Structures parts 1 to 3; Design Patterns parts 1 to 3; Docker; Entity Framework 6; Git; HTML fundamentals; Python for developers; React; Refactoring; SQL Mastery | image-only PDFs; `pdftotext` returns nothing, so dates were not extracted |
| SoloLearn (7) | C#, HTML, JavaScript, Python for Beginners, Python Core, Python Data Structures, Python Intermediate | text PDFs, all issued November to December 2021 |
| typing.com (1) | Advanced Assessment, 49 WPM at 97% accuracy | 2021-11-29 |

## Other

source: the two Qiyas printouts show GAT and SAAT results from 2022. observation: they carry the national ID, so they must never be committed.

# Conclusion

There is enough material for a first version of every section the spec names except high school, which has no files at all, and the practical training dates, which the report does not state. Project material is split between public and private repositories, and the most substantial recent work is private. The academic record supports "BSc in Computer Science, Saudi Electronic University, course work completed 2026, certificate pending" and nothing stronger.

# Not checked

- The King Saud University transcripts, excluded by the owner.
- Dates on the Code with Mosh certificates (image PDFs; OCR would be needed).
- The contents of `knowledge`, `screeps`, `etg`, and `discord-trengo-integration`.
- Whether the transferred first-year courses appear on the SEU transcript; no SEU transcript is in the folder.
- Whether an English transcript or degree letter from SEU exists elsewhere.
