# California HSR Data Story: UX Review

## Executive Summary

**The Good:** Solid foundation. 538-style aesthetic is on point. Data is well-sourced. Structure is logical.

**The Problem:** You're telling a scandal like it's a quarterly report. This is a $128 BILLION story about broken promises, and it reads like a Wikipedia article. The design is clean but emotionally flat.

**The Fix:** Lead with outrage, cut the fat, make numbers impossible to ignore.

---

## 🎯 THE HOOK: Your Hero Section Undersells the Story

### Current:
```
California's $128 Billion Train to Somewhere

The most expensive infrastructure project in American history was supposed 
to cost $33 billion and be done by 2020. It's 2026, and zero passengers 
have ridden it. Here's where the money went.
```

### Problems:
- "Train to Somewhere" is clever but soft. Where's the anger?
- The subtitle buries the lede in a compound sentence
- "Here's where the money went" is passive. Sounds like a budget report.

### Rewrite:
```html
<p class="label">DATA INVESTIGATION</p>
<div class="hero-stat">$13.8 BILLION SPENT</div>
<h1>Zero Passengers.</h1>
<p class="subtitle">California's bullet train was promised in 2008. It's 2026. 
The cost has quadrupled. Not a single person has ridden it.</p>
```

**Why this works:** 
- Giant number + "Zero Passengers" creates cognitive whiplash
- Shorter sentences hit harder
- The contrast IS the story

---

## 📊 STATS BANNER: Make the Scandal Undeniable

### Current Order:
1. $13.8B Spent
2. 0 Passengers  
3. 70 mi Track
4. 287% Cost Increase

### Problems:
- All four stats have equal visual weight
- The most damning stat (0 passengers) isn't emphasized
- "Cost Increase" is abstract — give it human scale

### Rewrite Structure:

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│          $13.8 BILLION                                   │
│          spent on a train with                           │
│                                                          │
│          0                                               │
│          PASSENGERS                                      │
│          (in 17 years)                                   │
│                                                          │
└──────────────────────────────────────────────────────────┘

       70 miles          287%            2033?
       track laid        over budget     maybe done
```

**Key insight:** Make "0 passengers" HUGE. Like, take up 30% of the viewport huge. That's your story.

---

## 🔥 SECTION REWRITES

### Section 1: "The Exploding Budget"

**Current headline:** "The Exploding Budget"

**Better:** 
- "How a $33 Billion Train Became a $128 Billion Train"
- "Every Estimate Was a Lie"
- "The Budget That Couldn't Stop Growing"

**Current intro (44 words):**
> When California voters approved Proposition 1A in 2008, they were promised a bullet train from San Francisco to Los Angeles for $33 billion. That number has nearly quadrupled.

**Rewrite (19 words):**
> Voters approved $33 billion in 2008. By 2024, the estimate hit $128 billion. That's not a mistake—it's a pattern.

---

### Section 2: "The Slipping Finish Line"

**Current headline:** "The Slipping Finish Line"

**Better:**
- "The Train That's Always 7 Years Away"
- "A Moving Target: 2020 → 2033 → TBD"
- "Forever Almost Done"

**Current intro (30 words):**
> Each business plan pushed the completion date further into the future. The original promise of 2020 service has slipped by at least 13 years.

**Rewrite (15 words):**
> Promised: 2020. Current estimate: 2033. Full line: "As funding becomes available." (No date.)

---

### Section 3: "What's Actually Been Built"

**Current headline:** "What's Actually Been Built"

**Better:**
- "$197 Million Per Mile. Here's What That Bought."
- "10 Years of Construction. 70 Miles of Track."
- "The Most Expensive 70 Miles in America"

**Add this callout immediately:**
```
$197 MILLION
per mile of track
(That's 4x the global average for high-speed rail)
```

---

### Section 4: "Who Got the Money"

**Current headline:** "Who Got the Money"

**Better:**
- "One Contractor Bid $985M. They've Billed $3.55B."
- "The Contractors Are Doing Fine"
- "How Contracts Tripled Without Consequences"

**Current intro is fine but bury it. Lead with this instead:**

```html
<div class="scandal-stat">
  <div class="before">$985 million</div>
  <div class="arrow">→</div>
  <div class="after">$3.55 billion</div>
  <div class="label">One contract. Same contractor. +260%.</div>
</div>
```

---

### Section 5: "The Federal Funding Rollercoaster"

**Current headline:** "The Federal Funding Rollercoaster"

**Better:**
- "$8 Billion Given. $5 Billion Clawed Back."
- "Washington's On-Again, Off-Again Billions"
- "Political Football: The $4B Fumble"

The vertical timeline format is good. Keep it.

---

### Section 6: "The Bottom Line"

**This section is your closer. It should feel like a verdict, not a summary.**

**Current:** Side-by-side cards (Promise vs Reality)

**Make it angrier:**

```html
<div class="verdict">
  <h2>The Verdict</h2>
  
  <div class="promise-reality">
    <div class="promise">
      <h3>What They Promised (2008)</h3>
      <ul>
        <li>SF → LA: 2 hours 40 minutes ❌</li>
        <li>Total cost: $33 billion ❌</li>
        <li>Done by: 2020 ❌</li>
        <li>Operating subsidies: None needed ❌</li>
      </ul>
    </div>
    
    <div class="reality">
      <h3>What We Got (2026)</h3>
      <ul>
        <li>Passengers: <strong>0</strong></li>
        <li>Current estimate: <strong>$128 billion</strong></li>
        <li>Completion: <strong>"TBD"</strong></li>
        <li>Budget gap: <strong>$10.2 billion</strong> (just for the short segment)</li>
      </ul>
    </div>
  </div>
</div>
```

Add explicit ❌ marks. Make broken promises visual.

---

## ✂️ WHAT TO CUT

### 1. Cut "Structures Status" section entirely
Currently you have:
> Structures Status (119-mile Active Construction Zone)
> 54 Complete | 32 Under Construction | 6 Not Started

**Why cut:** This granularity doesn't serve the story. Nobody outside a project manager cares about "structures." The 70 mi / 171 mi progress bar tells the story better.

### 2. Cut "Other Major Expenditures" table
The Parsons $700M and bookend investments dilute focus. If you keep it, collapse it into a footnote or accordion.

### 3. Cut this from every section intro: "Here's..."
- "Here's where the money went" 
- "Here's how those contracts have grown"
- "Here's what exists on the ground"

These are filler phrases. Just show the thing.

### 4. Reduce "Sources & Methodology" section
Currently takes up significant visual space. This should be a small footer section, not a full section. Maybe just:
> All figures linked to primary sources. See linked citations throughout.

---

## 📐 STRUCTURAL CHANGES

### 1. Reorder Sections for Maximum Impact

**Current order:**
1. Budget explosion
2. Timeline slip
3. Construction progress
4. Contractors
5. Federal funding
6. Bottom line

**Better order:**
1. **The Broken Promise** (hero + zero passengers hook)
2. **The Money Trail** (combine contractors + budget into "follow the money")
3. **The Moving Target** (timeline + progress combined)
4. **The Political Football** (federal funding drama)
5. **The Verdict** (bottom line, angrier)

### 2. Add "Scroll Hooks" Between Sections

After each section, add a teaser for the next:
```html
<div class="scroll-hook">
  Where did all that money actually go? →
</div>
```

### 3. The Map Needs a Story

Your map legend says:
- Civil construction complete (70 mi)
- Under construction (49 mi)
- In design (52 mi)
- Not yet funded (~300 mi)

**Add this annotation directly on the map:**
```
"The part that's actually funded"
↓
[small segment in Central Valley]

"Everything else: TBD"
```

---

## 🎨 VISUAL HIERARCHY FIXES

### 1. Make Numbers BIGGER

Your `stat-number` is `2.5rem`. For key numbers, this should be `4rem` or larger. The "$13.8B" and "0 passengers" should dominate.

```css
.mega-stat {
    font-size: 5rem;
    font-weight: 900;
    line-height: 1;
}
```

### 2. Add Contrast to the Promise vs Reality

The "Reality" card has a subtle red left border. Make it SCREAM:
```css
.summary-card.reality {
    background: linear-gradient(135deg, #fff5f5 0%, #ffe0e0 100%);
    border-left: 6px solid #DC3545;
    box-shadow: 0 4px 20px rgba(220, 53, 69, 0.15);
}
```

### 3. Your Cost Chart Needs Annotation

Don't just show bars going up. Put a giant annotation at the 2024 peak:
```
"$128 BILLION
That's $3,200 per Californian.
For a train none of them can ride."
```

---

## 📝 COPY POLISH

### Kill These Phrases:
| ❌ Current | ✅ Better |
|-----------|-----------|
| "The project has been a political football" | "Washington gave $8B. Then took $5B back." |
| "Here's what exists on the ground" | [Just show the map] |
| "according to recent reports" | "$10.2B gap." [cite] |
| "That number has nearly quadrupled" | "4x the promise." |
| "No projected date" | "No date. None." |

### Add These Punchlines:
At end of Budget section:
> "Every Californian could have received $3,200. Instead, they got a 70-mile track in the Central Valley."

At end of Timeline section:
> "The train was supposed to be done 6 years ago."

At end of Contractors section:
> "The contractors got paid. The train didn't get built."

---

## 🔧 SPECIFIC CSS ADDITIONS

```css
/* For the hero "0 passengers" effect */
.hero-zero {
    font-size: 8rem;
    font-weight: 900;
    color: #DC3545;
    text-shadow: 0 4px 20px rgba(220, 53, 69, 0.3);
}

/* For verdict checkmarks/X marks */
.promise-item::before {
    content: "❌";
    margin-right: 8px;
}

/* Scroll hook between sections */
.scroll-hook {
    text-align: center;
    padding: 40px;
    font-size: 1.2rem;
    color: var(--secondary-blue);
    cursor: pointer;
}
.scroll-hook:hover {
    text-decoration: underline;
}
```

---

## 📋 PRIORITY IMPLEMENTATION

### Do First (10 min, max impact):
1. Rewrite hero to lead with "$13.8B SPENT / 0 PASSENGERS"
2. Make section headlines punchier (see rewrites above)
3. Add ❌ marks to the Promise vs Reality comparison

### Do Second (30 min):
1. Resize key numbers (make $13.8B and 0 impossible to miss)
2. Add annotations to the cost chart
3. Cut the Structures Status subsection

### Do Third (1 hr):
1. Restructure into 5 sections instead of 7
2. Add scroll hooks
3. Add punchline sentences at end of each section

---

## FINAL THOUGHT

Right now this reads like a well-researched explainer. That's fine for Wikipedia.

But this is a **scandal**. $128 billion. Zero passengers. Promises broken. Contractors enriched. The story writes itself—you just need to let it be angry.

The data journalism greats (Pudding, 538 at its peak, NYT visual investigations) know: **emotion first, evidence second**. Hook them with outrage, then prove it's justified.

You have the evidence. Now make it hit.

---

*Review by: Senior UX/Data Journalism Editor*  
*Date: February 2026*
