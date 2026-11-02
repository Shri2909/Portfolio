#!/usr/bin/env python3
"""Render docs/FLOW_SCRIPTS.md (what Shriniwas speaks with Wispr Flow) from content/draft.json."""
import json, pathlib

root = pathlib.Path(__file__).resolve().parent.parent
d = json.loads((root / "content" / "draft.json").read_text())
out = []
add = out.append

add("# Flow scripts: what to speak with Wispr Flow\n")
add("Generated from `content/draft.json`. Dictate each segment with Flow into a plain text editor, save Flow's text untouched under the file name shown, then paste it into the matching field of `content/content.json` (see `docs/CLAUDE_CODE_PROMPTS.md`, Stage 15). Change any sentence that is not true for you; keep every number exactly. Check `docs/TRUTH_CHECK.md` first.\n")
add("S01 (Exhibit 0) is done. S05 and S15 are written, not spoken. Do the first five first: S02, S03, S04, S06, S14.\n")

def seg(title, fname, body):
    add(f"\n## {title}\n\nSave as `{fname}`\n")
    add(body.strip() + "\n")

seg("S02: The brief (1:00)", "S02_brief.txt", d["brief"]["summary"])

parts = []
for i, r in enumerate(d["against"]["reasons"], 1):
    parts.append(f"**Reason {i}.** Card title (written on the page, do not speak): *{r['title']}*\n\n{r['text']}")
seg("S03: Fair warning (1:30, about 30 seconds per reason)", "S03_against.txt", "\n\n".join(parts))

def exhibit(title, fname, ex):
    b = ex["beats"]
    txt = (f"**What I did.**\n\n{b['did']}\n\n**What didn't work.**\n\n{b['didnt']}\n\n"
           f"**What I learned.**\n\n{b['learned']}\n\n**What I did next.**\n\n{b['next']}\n\n"
           "**Cross-examine: three fixed questions.**\n\n")
    txt += "\n\n".join(f"*{c['q']}*\n\n{c['a']}" for c in ex["crossExam"])
    seg(title, fname, txt)

exhibit("S04: Exhibit A, certgen (2:30 story, then three answers of about 30 seconds)", "S04_certgen.txt", d["exhibitA"])
exhibit("S06: Exhibit B, TipIndex (2:30 story, then three answers of about 30 seconds)", "S06_tipindex.txt", d["exhibitB"])
seg("S07: PitDB (0:30)", "S07_pitdb.txt", d["pitdb"]["text"])
seg("S08: Setbacks (1:30)", "S08_setbacks.txt", d["effects"]["setbacks"])

parts = []
titles = {"f1": "Fork 1: how certgen queues its jobs.", "f2": "Fork 2: the optional QR verification route in certgen.", "f3": "Fork 3: TipIndex scope."}
for f in d["decisions"]["forks"]:
    parts.append(f"**{titles[f['id']]}**\n\n{f['narration']}\n\nWhat would change my mind: {f['changeMyMind']}")
seg("S09: Forks in the road (3 forks, about 45 seconds each)", "S09_decisions.txt", "\n\n".join(parts))

seg("S10: Philosophy (0:45)", "S10_philosophy.txt", d["effects"]["philosophy"]["text"])
seg("S11: Debate and writing (0:30)", "S11_debate.txt", d["effects"]["debate"])

lab = d["lab"]
body = ("Speak this before you run the Lab, so the prediction is on record first.\n\n"
        f"Before I run this, here is my prediction, written down in advance. {lab['hypothesis']}\n\n"
        f"{lab['usableDefinition']}\n\n"
        "I'll do five paired tasks, typing against voice, and I'll alternate which goes first so practice doesn't favor one side. I'll report all five, including the ones where voice loses.\n\n"
        "This is one person and five tasks. It's not a study.\n\n"
        "**The five tasks (not spoken; you do them, alternating which side goes first):**\n\n"
        + "\n".join(f"{i}. {t}" for i, t in enumerate(lab["taskNames"], 1))
        + "\n\nS12b (your results) is recorded after you run the Lab. Send the five timings and Claude writes that script from your numbers.")
seg("S12: Lab pre-registration (1:00)", "S12_lab.txt", body)

w = d["wispr"]["moments"]
titles = {"w1": "Observation 1: India.", "w2": "Observation 2: Hinglish.", "w3": "Observation 3: testing intuition.", "w4": "Observation 4: awareness.", "w5": "Observation 5: the cap."}
c = json.loads((root / "content" / "content.json").read_text())["wispr"]["moments"]
parts = []
for m in c:
    k = m["id"]
    parts.append(f"**{titles[k]}**\n\n{w[k]['spoken']}")
parts.append(f"**My point of view (a hypothesis, not a result).**\n\n{d['wispr']['pov']['text']}")
seg("S13: What I know about Wispr (five observations of about 30 seconds, then a 45-second point of view)", "S13_wispr.txt", "\n\n".join(parts))

cl = d["closing"]
parts = ["**Three findings (about 25 seconds each).**"]
for n, f in zip(["First", "Second", "Third"], cl["findings"]):
    parts.append(f"{n}: {f['text']}")
parts.append("**The closing line (about 20 seconds).**\n\n" + cl["line"])
parts.append("**Three open questions, dated (about 20 seconds each).**")
for q in cl["openQuestions"]:
    parts.append(f"*{q['q']}*\n\n{q['a']} As of {q['date']}.")
seg("S14: Closing argument (3:00)", "S14_close.txt", "\n\n".join(parts))

(root / "docs" / "FLOW_SCRIPTS.md").write_text("\n".join(out) + "\n")
print("wrote docs/FLOW_SCRIPTS.md")
