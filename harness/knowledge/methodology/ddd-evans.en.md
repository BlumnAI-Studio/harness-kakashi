---
title: Domain-Driven Design — Evans's Doctrine
domain: methodology
status: canonical
language: en
sources_verified: 2026-06-03
---

# Domain-Driven Design — Evans's Doctrine

> **This document is the canonical English reference for Domain-Driven Design (DDD) as defined by Eric Evans. It is the foundation of the harness *planning-phase* evaluation system. Do not paraphrase Evans's distinction between modeling and coding — quote it. Do not paraphrase Bounded Context — quote it.**

---

## 1. Definition

**Domain-Driven Design (DDD)** is — in the words of Eric Evans's own consultancy, Domain Language, Inc., and the DDD Community —

> *"An approach to developing software for complex needs by deeply connecting the implementation to an evolving model of the core business concepts."*
> — [DDD Community, *What is DDD?*](https://www.dddcommunity.org/learning-ddd/what_is_ddd/)

The same page is emphatic about what DDD is **not**:

> *"Domain-driven design is not a technology or a methodology."*
> — [DDD Community, *What is DDD?*](https://www.dddcommunity.org/learning-ddd/what_is_ddd/)

It is, instead, *a structure of practices and terminology* for making design decisions that focus and accelerate work on complicated domains. Evans's own thesis, given in his 2015 InfoQ interview:

> *"Fundamentally, DDD is the principle that we should be focusing on the deep issues of the domain our users are engaged in, that the best part of our minds should be devoted to understanding that domain, and collaborating with experts in that domain to wrestle it into a conceptual form that we can use to build powerful, flexible software."*
> — [Eric Evans, *DDD Matters Today*, InfoQ (2015)](https://www.infoq.com/articles/eric-evans-ddd-matters-today/)

---

## 2. The Blue Book

| Field | Value |
|------|-------|
| **Title** | *Domain-Driven Design: Tackling Complexity in the Heart of Software* |
| **Author** | Eric Evans |
| **Publisher** | Addison-Wesley Professional |
| **Year** | August 20, 2003 |
| **Pages** | 560 |
| **ISBN-13** | 978-0-321-12521-7 |
| **Foreword** | Martin Fowler |

Source (publisher): [InformIT — *Domain-Driven Design* (Pearson)](https://www.informit.com/store/domain-driven-design-tackling-complexity-in-the-heart-9780321125217).

The book's central thesis statement, quoted widely from the text itself:

> *"The heart of software is its ability to solve domain-related problems for its user. All other features, vital though they may be, support this basic purpose."*
> — Eric Evans, *Domain-Driven Design* (2003). Source: [Goodreads — Eric Evans Quotes](https://www.goodreads.com/author/quotes/104368.Eric_Evans)

The Blue Book is **the** primary source. The harness treats the 2003 text plus the 2015 *DDD Reference* (see §6) as joint canon.

---

## 3. The DDD Reference — Evans's open summary

In 2015, Evans released a free, openly-licensed summary of every pattern from the Blue Book, plus three patterns added later that did not appear in the original.

- **Landing page:** [domainlanguage.com/ddd/reference](https://www.domainlanguage.com/ddd/reference/)
- **Canonical PDF:** [`DDD_Reference_2015-03.pdf`](https://www.domainlanguage.com/wp-content/uploads/2016/05/DDD_Reference_2015-03.pdf)
- **License:** Creative Commons Attribution 4.0 International

When citing a DDD pattern definition, prefer the DDD Reference PDF as the short-form source and the Blue Book as the long-form source. Do not paraphrase from secondary blog posts when the Reference is one click away.

---

## 4. Strategic Design — the big patterns

Strategic Design is the part of DDD that **product/planning people must own**. It is about *where to draw the lines*, not about classes or tables.

### 4.1 Ubiquitous Language

A shared, rigorous language between developers and domain experts, used in speech, writing, requirements, tests, and code — without translation. Evans:

> *"By using the model-based language pervasively and not being satisfied until it flows, we approach a model that is complete and comprehensible, made up of simple elements that combine to express complex ideas."*
> — Eric Evans, paraphrased and quoted in [Martin Fowler, *UbiquitousLanguage*](https://martinfowler.com/bliki/UbiquitousLanguage.html)

Operational test (Evans, Blue Book):

> *"Listen to the language the domain experts use. Are there terms that succinctly state something complicated? Are they correcting your word choice (perhaps diplomatically)? Do the puzzled looks on their faces go away when you use a particular phrase?"*
> — [Goodreads — Eric Evans Quotes](https://www.goodreads.com/author/quotes/104368.Eric_Evans)

### 4.2 Bounded Context

The single most important — and most misunderstood — pattern in DDD.

> *"A Bounded Context defines the range of applicability of each model. […] Total unification of the domain model for a large system will not be feasible or cost-effective."*
> — Eric Evans, quoted in [Martin Fowler, *BoundedContext*](https://martinfowler.com/bliki/BoundedContext.html)

A Bounded Context is *the* explicit boundary — linguistic, conceptual, and often organizational — within which a particular model is internally consistent and applicable. The same word ("customer", "order", "shipment") can mean different things in different Bounded Contexts, and that is **acceptable** as long as the boundary is explicit.

### 4.3 Context Map

A diagram or document that names every Bounded Context in the system and the relationship between each pair. Without a Context Map, integrations silently corrupt models across boundaries.

Relationship patterns between Bounded Contexts (from the DDD Reference):

| Pattern | Meaning |
|---|---|
| **Shared Kernel** | Two teams agree to share a designated subset of model + code; changes require coordination. |
| **Customer / Supplier** | Downstream's needs influence upstream's plan; upstream still leads. |
| **Conformist** | Downstream adopts upstream model wholesale, foregoing translation. |
| **Anticorruption Layer (ACL)** | Isolating translation layer that protects one model from a foreign or legacy model. |
| **Open Host Service** | Upstream publishes a protocol/API for many downstreams to consume. |
| **Published Language** | A well-documented shared format (often a schema) used between contexts — usually paired with Open Host Service. |
| **Separate Ways** | Declare no integration; let each context evolve independently. |
| **Partnership** | Two teams succeed or fail together; coordinate planning and development jointly. |
| **Big Ball of Mud** | Recognize and isolate areas with no clear boundaries so they don't pollute clean contexts. |

Source: [DDD Reference (PDF, 2015)](https://www.domainlanguage.com/wp-content/uploads/2016/05/DDD_Reference_2015-03.pdf).

### 4.4 Core / Supporting / Generic Subdomains

Not all parts of the business deserve equal modeling investment. Evans's distillation:

- **Core Domain** — the part of the business that is the primary source of competitive advantage. Invest the best modelers here.
- **Supporting Subdomain** — necessary to the business but not differentiating. Build or model adequately, not lavishly.
- **Generic Subdomain** — a solved problem available off-the-shelf. Buy, adopt a standard, or use a generic library.

> *"In strategy, the goal is to focus our limited resources where they will most contribute to the success of the business."*
> — paraphrased from the DDD Reference, [domainlanguage.com/ddd/reference](https://www.domainlanguage.com/ddd/reference/)

---

## 5. Tactical Design — the building blocks

These belong primarily to developers, but planners benefit from recognizing the vocabulary because **decisions about Aggregates encode transactional and consistency boundaries that have product consequences**.

| Building block | One-line definition |
|---|---|
| **Entity** | An object defined not by its attributes but by its identity that persists over time. |
| **Value Object** | An immutable object characterized by its attributes; no conceptual identity. |
| **Aggregate** | A cluster of associated objects treated as a single unit for data changes, bounded by invariants. |
| **Aggregate Root** | The single Entity that is the sole entry point into the Aggregate and enforces its invariants. |
| **Domain Event** | A thing that happened in the domain that domain experts care about. |
| **Repository** | An abstraction for retrieving and persisting Aggregates as if they lived in memory. |
| **Factory** | An object that encapsulates creation of complex Aggregates or Value Objects. |
| **Domain Service** | A stateless operation that belongs to the domain model but doesn't naturally live on an Entity or Value Object. |
| **Module** | A named grouping of related domain concepts that reduces cognitive load and reflects the Ubiquitous Language. |
| **Layered Architecture** | Segregate domain logic from UI, application, and infrastructure so the domain model can evolve independently. |

Sources: [DDD Reference (PDF, 2015)](https://www.domainlanguage.com/wp-content/uploads/2016/05/DDD_Reference_2015-03.pdf) and [Wikipedia — *Domain-driven design*](https://en.wikipedia.org/wiki/Domain-driven_design).

---

## 6. Why DDD Matters at the Planning Phase

This section is the **most important** for this harness, because the Korean planner (한국의 기획자) is Evans's primary collaborator at this phase.

### 6.1 Modeling is not a developer-only activity

> *"Knowledge crunching is not a solitary activity. A team of developers and domain experts collaborate, typically led by developers. Together they draw in information and crunch it into a useful form."*
> — Eric Evans, Blue Book, Chapter 1 *Crunching Knowledge*. Source: [Dev.to — *Knowledge Extraction in DDD*](https://dev.to/dima853/knowledge-extraction-in-domain-driven-design-ddd-eric-evans-1ml8)

If the planner stays out of the modeling conversation, the model will be **shallow**. Evans, paraphrased from the Blue Book:

> *"When modeling happens only in a technical setting, without collaboration with domain experts, the concepts are naive. That shallowness of knowledge produces software that does a basic job but lacks a deep connection to the domain expert's way of thinking."*
> — paraphrased in [Dev.to — *Knowledge Extraction in DDD*](https://dev.to/dima853/knowledge-extraction-in-domain-driven-design-ddd-eric-evans-1ml8)

### 6.2 The planner's tools are language and boundaries

Fowler, summarizing what domain experts contribute:

> *"Domain experts should object to terms or structures that are awkward or inadequate to convey domain understanding; developers should watch for ambiguity or inconsistency that will trip up design."*
> — [Martin Fowler, *UbiquitousLanguage*](https://martinfowler.com/bliki/UbiquitousLanguage.html)

The two things a planner can *uniquely* produce in this phase:

1. **A first draft of the Ubiquitous Language** — the actual terms business stakeholders use, recorded verbatim, not translated into "tech terms."
2. **A first sketch of the Bounded Contexts** — where the business actually has different rules, different audiences, different lifecycles. These often map to product surfaces, not to existing services.

### 6.3 The leverage point

> *"the best part of our minds should be devoted to understanding that domain, and collaborating with experts in that domain to wrestle it into a conceptual form…"*
> — [Eric Evans, InfoQ (2015)](https://www.infoq.com/articles/eric-evans-ddd-matters-today/)

The harness reads this as: **the highest-leverage hour in the entire delivery cycle is the planning hour where language and context boundaries are set.** Code can be refactored; a wrong Bounded Context drawn early metastasizes for years.

---

## 7. Evans's Anti-Patterns and Common Misunderstandings

Evans has spoken repeatedly about DDD being misapplied. The harness inherits his cautions verbatim.

### 7.1 "A microservice = a Bounded Context" — wrong

> *"DDD hasn't stood still over all those years… I think it's time for another big shakeup."*
> — Eric Evans, Explore DDD 2018 keynote, [InfoQ (2018)](https://www.infoq.com/news/2018/09/ddd-not-done/)

> Evans warned against cookbook prescriptions such as "each microservice is a bounded context"; in 2019 he explicitly rejected that equation and proposed multiple distinct context types within microservice systems.
> — Synthesized from [InfoQ (2019)](https://www.infoq.com/news/2019/09/evans-improve-language-ddd/) and [InfoQ (2016)](https://www.infoq.com/news/2016/04/ddd-microservices-evans/)

Carving a monolith into microservices on the assumption that each new service is its own Bounded Context **displaces contextual complexity from the code into the space between services**, often producing what Evans calls a "large ball of mud." Source: [InfoQ (2016)](https://www.infoq.com/news/2016/04/ddd-microservices-evans/).

### 7.2 "Model everything in detail" — wrong

The whole point of separating Core / Supporting / Generic subdomains is to **not** model everything equally. Generic subdomains should be bought, adopted, or stubbed.

### 7.3 "DDD is for perfectionists" — wrong

> *"DDD is not for perfectionists."*
> — Eric Evans, DDD Europe 2017, [InfoQ (2017)](https://www.infoq.com/news/2017/02/ddd-perfectionists/)

The model is always *useful*, not *true*. Evans: it is "rigorously simplified and consciously chosen."

### 7.4 "We'll add Ubiquitous Language later, after we ship" — wrong

Language work is the *first* deliverable, not a documentation backlog item. Without it, every meeting after the first re-litigates what "customer" means.

---

## 8. DDD in 2026 — Current State

| Year | Event |
|------|-------|
| **2003** | Blue Book published. |
| **2004–2010** | DDD vocabulary spreads through enterprise software via Fowler, InfoQ, and DDD Community. |
| **2013** | Alberto Brandolini publicly introduces **EventStorming**, a workshop method to discover domain events with stakeholders. Source: [Wikipedia — *Event storming*](https://en.wikipedia.org/wiki/Event_storming), [eventstorming.com](https://www.eventstorming.com/). |
| **2013** | Vaughn Vernon publishes *Implementing Domain-Driven Design* ("Red Book"). |
| **2015** | Evans releases the *DDD Reference* under Creative Commons. |
| **2017** | Evans at DDD Europe: *"DDD is not for perfectionists."* |
| **2018–2019** | Evans publicly rejects the "microservice = Bounded Context" equation. |
| **2023** | Korean translation of the Blue Book — *도메인 주도 설계* — published by Wikibooks (위키북스), translator Lee Dae-yeop (이대엽). Source: [wikibook.co.kr](https://wikibook.co.kr/domain-driven-design-ebook/). |
| **2024** | Evans at Explore DDD (Denver, March 14): *"a trained language model is a bounded context."* Advocates fine-tuned, domain-scoped LLMs over generic ones. Source: [InfoQ (2024)](https://www.infoq.com/news/2024/03/Evans-ddd-experiment-llm/). |

### 8.1 EventStorming — the de facto planning workshop format

> *"EventStorming is a workshop-based method to quickly find out what is happening in the domain of a software program."*
> — Alberto Brandolini, quoted in [Wikipedia — *Event storming*](https://en.wikipedia.org/wiki/Event_storming).

The official spelling is one word, **EventStorming**. Site: [eventstorming.com](https://www.eventstorming.com/).

When a planner says "let's run EventStorming," they mean: gather stakeholders, write every domain event on orange stickies along a timeline, then layer in commands, actors, policies, read models, and external systems — discovering Bounded Contexts visually rather than top-down.

---

## 9. The Harness Adoption Rule

The harness adopts DDD as its **planning-phase evaluation system** under the following non-negotiable rules:

1. **Planning work runs DDD as its follow-up evaluation** — after `sage-deming`'s PDSA base, planning/product/domain-modeling work invokes `sage-evans` for a strategic check: *Is the Ubiquitous Language explicit? Are the Bounded Contexts named? Is the Core Domain identified?*

2. **Language is a first-class deliverable.** Any spec, PRD, or planning doc that does not include a glossary of domain terms (or links to one) is marked `ubiquitous-language: missing`. This is the planning-phase equivalent of `prediction: missing` in PDSA.

3. **Context boundaries are explicit or absent.** Any system design that lacks a Context Map — even a hand-drawn one — is marked `context-map: implicit`. Implicit contexts decay into Big Balls of Mud.

4. **Strategic over tactical.** When planners and Evans collide on tactical patterns (Aggregates, Repositories, etc.), strategic patterns win attention. Tactical decisions are dev concerns; strategic decisions are organization concerns.

5. **Translate, do not paraphrase.** When the harness logs DDD evaluations in Korean, key terms are translated as: **유비쿼터스 언어**(Ubiquitous Language) / **경계된 컨텍스트**(Bounded Context) / **컨텍스트 맵**(Context Map) / **핵심 도메인**(Core Domain). Do not invent new Korean coinages — defer to the Wikibooks Korean translation when in doubt.

---

## 10. Key Evans Quotes (citable)

For use in logs, PRDs, and architectural decision records:

1. *"The heart of software is its ability to solve domain-related problems for its user."* — Blue Book.
2. *"To communicate effectively, the code must be based on the same language used to write the requirements — the same language that the developers speak with each other and with domain experts."* — Blue Book.
3. *"Knowledge crunching is an exploration, and you can't know where you will end up."* — Blue Book.
4. *"It takes fastidiousness to write code that doesn't just do the right thing but also says the right thing."* — Blue Book.
5. *"Effective domain modelers are knowledge crunchers."* — Blue Book.
6. *"One of the best ways to refine a model is to explore with speech."* — Blue Book.
7. *"This is a principle that will not go out of style. It applies whenever we are operating in a complex, intricate domain."* — Evans, [InfoQ (2015)](https://www.infoq.com/articles/eric-evans-ddd-matters-today/).
8. *"Modelers need to code. Focus on concrete scenarios. Abstract thinking has to be anchored in concrete cases."* — Evans, [InfoQ (2015)](https://www.infoq.com/articles/eric-evans-ddd-matters-today/).
9. *"DDD is not for perfectionists."* — Evans, DDD Europe 2017, [InfoQ (2017)](https://www.infoq.com/news/2017/02/ddd-perfectionists/).

Sources for quotes 1–6: [Goodreads — Eric Evans Quotes](https://www.goodreads.com/author/quotes/104368.Eric_Evans).

---

## 11. Primary Sources

These are the canonical references the harness cites. Do not replace them with secondary summaries without checking these first.

- **Blue Book (publisher page):** [InformIT — *Domain-Driven Design*](https://www.informit.com/store/domain-driven-design-tackling-complexity-in-the-heart-9780321125217)
- **DDD Reference PDF (2015, CC-BY 4.0):** [domainlanguage.com](https://www.domainlanguage.com/wp-content/uploads/2016/05/DDD_Reference_2015-03.pdf)
- **DDD Reference landing page:** [domainlanguage.com/ddd/reference](https://www.domainlanguage.com/ddd/reference/)
- **DDD Community — What is DDD?:** [dddcommunity.org](https://www.dddcommunity.org/learning-ddd/what_is_ddd/)
- **DDD Community — Blue Book entry:** [dddcommunity.org/book/evans_2003](https://www.dddcommunity.org/book/evans_2003/)
- **Wikipedia — Domain-driven design:** [en.wikipedia.org](https://en.wikipedia.org/wiki/Domain-driven_design)
- **Wikipedia — Eric Evans (disambiguation):** [en.wikipedia.org](https://en.wikipedia.org/wiki/Eric_Evans)
- **Wikipedia — Event storming:** [en.wikipedia.org](https://en.wikipedia.org/wiki/Event_storming)
- **Martin Fowler — BoundedContext:** [martinfowler.com](https://martinfowler.com/bliki/BoundedContext.html)
- **Martin Fowler — UbiquitousLanguage:** [martinfowler.com](https://martinfowler.com/bliki/UbiquitousLanguage.html)
- **InfoQ — DDD Matters Today (Evans, 2015):** [infoq.com](https://www.infoq.com/articles/eric-evans-ddd-matters-today/)
- **InfoQ — DDD and Microservices (Evans, 2016):** [infoq.com](https://www.infoq.com/news/2016/04/ddd-microservices-evans/)
- **InfoQ — DDD is Not for Perfectionists (Evans, 2017):** [infoq.com](https://www.infoq.com/news/2017/02/ddd-perfectionists/)
- **InfoQ — DDD is Not Done (Evans, 2018):** [infoq.com](https://www.infoq.com/news/2018/09/ddd-not-done/)
- **InfoQ — Improve the Language of DDD (Evans, 2019):** [infoq.com](https://www.infoq.com/news/2019/09/evans-improve-language-ddd/)
- **InfoQ — Evans on DDD + LLMs (2024):** [infoq.com](https://www.infoq.com/news/2024/03/Evans-ddd-experiment-llm/)
- **Domain Language, Inc. (Evans's consultancy):** [domainlanguage.com](https://www.domainlanguage.com/)
- **Avanscoperta — Eric Evans bio:** [avanscoperta.it](https://www.avanscoperta.it/en/trainer/eric-evans/)
- **eventstorming.com (Brandolini):** [eventstorming.com](https://www.eventstorming.com/)
- **Korean translation of the Blue Book (Wikibooks):** [wikibook.co.kr/domain-driven-design-ebook](https://wikibook.co.kr/domain-driven-design-ebook/)
- **Lee Sungwon — DDD for PMs (Korean):** [ssowonny.medium.com](https://ssowonny.medium.com/프로덕트-매니저-pm-를-위한-도메인-주도-설계-domain-driven-design-ddd-4b2a06d952f2)

---

## 12. Document Provenance

- **Sources verified:** 2026-06-03
- **Maintained by:** tamer (정원지기 카카시) on behalf of sage-evans
- **Status:** canonical — changes require re-verification against domainlanguage.com and the Blue Book
- **Cross-references:**
  - `harness/knowledge/lore/naruto-worldview.md` (worldview registration)
  - `harness/knowledge/methodology/ddd-planning-playbook.ko.md` (Korean operational playbook)
  - `harness/knowledge/methodology/evaluation-base-pdsa.md` (base evaluation → follow-up mapping)
  - `harness/agents/sage-evans.md` (agent definition)

---

## 🌟 Constellation

- [[sage-evans|🐉 Sage Evans]] — Agent embodying this doctrine
- [[ddd-planning-playbook.ko|📋 DDD Planning Playbook (Korean operational rules)]]
- [[evaluation-base-pdsa|⚙️ Base Evaluation Operating Rules]]
- [[pdsa-deming.en|📘 PDSA — Deming's Doctrine]] — DDD layers on top of PDSA
- [[sage-deming|🐸 Sage Deming]] — DDD's base-evaluation partner
- [[naruto-worldview|🥷 Worldview Mapping]]
- [[toad-summoning|🐸 Toad Summoning Engine]]
- [[tamer|🧑‍🌾 Gardener Kakashi]]
