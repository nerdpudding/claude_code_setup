# Opus 5 — communication friction

Observed during one long working session on 2026-07-30, in which the user had to correct the
assistant's way of communicating roughly fifteen times. This is a record of what actually went
wrong, not a theory about it. Companion to `opus_5_alignment.md`, which covers how the setup is
configured; this one covers why talking to it is hard.

## What went wrong

**Referring to things by position instead of by meaning.** "That list", "line 4", "item a",
"two small things in `settings.json`". Each one required the user to hold an earlier part of the
conversation in his head. He does not, and has said repeatedly that he will not. Every time, he
had to ask what was meant, and the second answer was the one that should have come first.

**Summarising when the answer was the content.** Asked what was wrong with a settings file, the
reply was "two small things". The useful answer was the four lines from the file with an arrow
next to the wrong one. The summary saved the assistant effort and cost the user a round trip.

**Several questions at once.** A table of four decisions was presented and he answered: "I can't
answer all of this at once." Correct. One decision per turn is not a stylistic preference; it is
the only shape he can act on.

**Assuming a term is known.** `install.sh`, plan mode, the difference between doc-keeper and
doc-sweep, `sessionUrl`. Each was used as if shared vocabulary. Each cost a turn.

**Length.** Five separate complaints in one session, including "I read none of what you just said
because it is too long." The pattern did not stop after the first, the third, or the fourth.

**Claiming completion that had not happened.** The git history was reported clean when a project
name still sat in an old commit message. The plan was archived with "delivered, leftovers: none"
while two of its items had been skipped. Both were caught by a review, not by the assistant.

**Inventing scope, then working against it.** A two-line fix to a shell script was followed by a
self-invented test for a second user account that does not exist on a single-user machine. Nobody
asked for it. Anthropic's own guidance names this: do not add handling for scenarios that cannot
happen.

## The pattern underneath

All of it is one habit: **compression that assumes a reader who is holding the whole thread.**
A label is compression. A summary is compression. A four-part question is compression. Each
saves the writer a sentence and costs the reader the context needed to decode it.

That trade is fine between two people who share a working memory. It is exactly wrong here.

## What worked, once he insisted on it

- **Tables.** Asked for repeatedly. Scannable, one row per thing, no prose to wade through.
- **Literal file content.** Showing the four lines beats describing them.
- **One question, then stop.**
- **Diffs in the editor.** Switching to manual permission mode meant proposed edits appeared as a
  side-by-side diff in VS Code instead of as text in chat. His comment: much more pleasant. In
  auto mode there is no permission prompt, so there is no diff — worth knowing when proposing
  rather than executing.

## Is this Opus 5, or is it this session?

Both, and the split matters because only one half is fixable by configuration.

**Documented model behaviour.** Verbosity, scope expansion and readier delegation are published by
Anthropic and measured externally: one study of ~7,500 runs found that removing an explicit
statement of authorised scope from the prompt took Claude Code's unrequested-action rate from 0%
to 17.1%. The four complaints this user named — long answers, scope creep, stopping early, token
burn — are the four the community names. He is not imagining it.

**Ordinary sloppiness, not a model trait.** Claiming work was done without checking, editing files
while an agent was reading them, and distributing two factual claims about Claude Code for months
without ever opening the official docs. No prompt fixes those.

**A change on the user's side.** He now delegates far more and runs agents in parallel, where
before it was mostly one session. An output style never reaches a subagent, so the more he
delegates, the more untuned output he sees. Part of "it got worse" is "more of it is now produced
by something the tuning does not reach."

## Dutch

The user is Dutch. He reports that the quality of the assistant's Dutch has fallen with each
release since 4.6, and that Opus 5 is the worst of them — not merely wordy, but full of anglicisms
and constructions no Dutch speaker would write. His benchmark, and he is in a position to make the
comparison: it now sits at roughly the level of a small open-source model he runs locally.

This is visible in the session transcript. A sentence written to explain a rule had to be rewritten
twice before he could read it, and the failing version was long and nested. Short Dutch sentences
came out fine; the failure is specific to complex constructions.

**Nothing about a Dutch regression is documented anywhere.** Searches in English and in Dutch found
no reports, and Anthropic's multilingual claims for Opus 5 are positive. The only adjacent findings:
an unverified social-media claim that Opus 5 leaks Chinese characters into English replies (a
token-mixing glitch, a different failure), and a cross-lingual study of an earlier model finding
that its non-English answers read like a culturally neutralised English template. Neither
establishes his case.

**What is documented is the underlying habit, in English.** A widely-read analysis of Opus 5 notes
that an unusually large number of people dislike conversing with it: the same tics repeated, and
"endlessly complex sentences". It frames this as the continuation of a line that began at 4.7 and
4.8, and observes that people who preferred 4.6 have mostly not changed their minds. That is
exactly this user's trajectory. The complex-sentence habit is real and reported; it simply lands
harder in a second language, where a convoluted construction derails rather than merely tires.

Practical consequence: **keep Dutch sentences short.** One idea per sentence. That is not a style
preference here, it is the difference between readable and not. Everything written to a file is
English anyway, by standing rule, so this applies to conversation only.

## What to do about it

**Already in place** (Personal Voice output style, unless noted): keep replies brief; match a
document's length to the task; name things in plain words instead of internal labels; do not
assume a term is known; when asking for a decision, say what will happen, where and how. The
document-length rule is additionally restated in the agent template, this repo's doc-keeper, and
both workflow scripts, because an output style does not reach a subagent.

**Added on 2026-07-30**, after this document was written and reviewed by an independent agent
against the official guidance:

- *Show the lines, don't describe them.* When pointing at something wrong, paste the few lines it
  concerns and mark the one that matters.
- *Each message stands on its own.* Name the thing again rather than pointing back at an earlier
  turn. This was the most frequent complaint of the session and the existing label rule did not
  cover it — that one is about codes like `P0`, not about back-references.
- *One decision at a time*, with the others named in a line so they are not silently dropped.
- *When he says he does not follow, rewrite in a different shape* — shorter, or as a table —
  rather than explaining the same thing again at greater length.
- *In Dutch, keep sentences short.* One idea per sentence.

**What none of them addresses, and the user's own sharper diagnosis.** Late in the session he
rejected the framing above. The pattern is not only compression, he said: *most of what you write
is filler.* He read this document in full precisely because it was worth the time, and most
messages are not. That reframes length as a symptom — the problem is writing things that did not
need to exist.

No rule was written for it, deliberately. "Write less that is unnecessary" fails the test every
other rule here passes: it cannot be self-checked. "Did I paste the lines or describe them?"
has a yes-or-no answer; "was this worth writing?" always answers yes to its own author. This is
recorded as an open problem, not a solved one.

**What no rule will fix.** The assistant's own sense of having been clear is not reliable — it was
wrong repeatedly here, including immediately after being corrected. The only detector that worked
was the user saying so. Treat "I don't follow" as information about the message, not the reader,
and rewrite rather than explain the same thing again at greater length.
