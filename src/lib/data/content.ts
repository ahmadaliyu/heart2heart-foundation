import type { Article, MaterialResource, VideoResource } from "@/lib/types";
import { daysFromNow } from "@/lib/data/helpers";

/**
 * Editorial fixtures. Written in the Foundation's voice — plain language, no
 * clinical jargon — so the layouts are reviewed against realistic copy length
 * rather than lorem ipsum.
 */
export const articles: Article[] = [
  {
    slug: "when-you-cannot-name-what-you-feel",
    image: "/images/reflection.jpg",
    title: "When you can't name what you feel",
    excerpt:
      "Not every difficult feeling arrives with a label. Here is how to start describing it, to yourself first and then to someone else.",
    body: [
      "Some days you know exactly what is wrong. Other days there is only a weight you can't point at — you are tired without having done much, irritable with people you love, flat about things that used to matter. Being unable to name it does not mean it isn't real.",
      "Start smaller than the whole feeling. Instead of asking \"what is wrong with me\", try asking what changed. When did you last feel like yourself? What was different then — sleep, people around you, how much was being asked of you?",
      "Notice where you feel it in your body. Tightness in the chest, a knot in the stomach, a heaviness in the shoulders. Physical language is often available when emotional language isn't, and it is a perfectly good place to begin a conversation.",
      "Write three lines at the end of the day. Not a diary — three lines. What happened, what you felt, what you needed. After a week you will usually see a pattern that was invisible day to day.",
      "Then tell one person. It does not have to be the full picture and it does not have to be someone in your family. Saying \"I have not felt right for a while and I don't know why\" is a complete sentence, and it is enough to start with a counsellor.",
    ],
    category: "EMOTIONAL_WELLBEING",
    author: "Heart2Heart Foundation",
    readingMinutes: 4,
    status: "PUBLISHED",
    featured: true,
    publishedAt: daysFromNow(-12, 10),
    updatedAt: daysFromNow(-12, 10),
  },
  {
    slug: "talking-to-your-husband-when-conversations-keep-going-wrong",
    image: "/images/couple.jpg",
    title: "When the same conversation keeps going wrong",
    excerpt:
      "Most couples do not argue about many things. They argue about the same few things, in the same way. Changing the shape of the conversation often matters more than winning it.",
    body: [
      "If you can predict how a conversation will end before it starts, the topic is probably not the real problem. The pattern is.",
      "Watch for the moment it turns. In most repeating arguments there is a specific point — a tone, a phrase, a comparison to someone's family — after which nobody is listening any more. Both people usually know where it is.",
      "Choose the time deliberately. A serious conversation started when one of you is exhausted, hungry or already upset is not a conversation, it is a collision. \"Can we talk about this tomorrow after the children have eaten?\" is not avoidance.",
      "Say the need, not the accusation. \"You never help\" invites a defence. \"I am overwhelmed by the evenings and I need us to divide them\" invites an answer.",
      "Some patterns do not shift on their own, and that is not a failure. A counsellor is not there to judge a marriage. They are there to help two people hear each other, which is much harder to do alone than most of us expect.",
    ],
    category: "MARRIAGE",
    author: "Heart2Heart Foundation",
    readingMinutes: 5,
    status: "PUBLISHED",
    featured: true,
    publishedAt: daysFromNow(-25, 11),
    updatedAt: daysFromNow(-20, 9),
  },
  {
    slug: "school-pressure-and-what-actually-helps",
    image: "/images/school.jpg",
    title: "School pressure, and what actually helps",
    excerpt:
      "Exams, expectations and everyone seeming to cope better than you. A practical look at what is really going on and what makes it lighter.",
    body: [
      "Almost every student believes that everyone else is managing better. Almost none of them are — you are comparing how you feel on the inside with how other people look on the outside.",
      "Pressure becomes heavier when it is vague. \"I have so much to do\" is unbearable; a written list of eleven specific things is finite. Write it down, even if the list is long. Finite is survivable.",
      "Protect sleep before you protect study hours. A tired brain re-reads the same page four times. Three focused hours after rest beat six exhausted ones, and the exhausted six cost you the next day too.",
      "Tell one adult. A teacher, an aunt, an older cousin, a counsellor. Not so they can fix it — often they can't — but because carrying it silently is what turns pressure into something worse.",
      "If the pressure comes with feeling worthless, or you have stopped caring about things you used to enjoy, that is worth talking to someone qualified about. It is common, it is treatable, and asking is not dramatic.",
    ],
    category: "SUPPORTING_YOUNG_PEOPLE",
    author: "Heart2Heart Foundation",
    readingMinutes: 4,
    status: "PUBLISHED",
    featured: true,
    publishedAt: daysFromNow(-6, 14),
    updatedAt: daysFromNow(-6, 14),
  },
  {
    slug: "what-a-healthy-relationship-actually-looks-like",
    image: "/images/connection.jpg",
    title: "What a healthy relationship actually looks like",
    excerpt:
      "Beyond \"he doesn't hit me\". The everyday signs that a relationship is good for you — and the ones that say it isn't.",
    body: [
      "Healthy is not the same as never disagreeing. Two people who never disagree are usually not both saying what they think.",
      "The clearest sign is what happens after a disagreement. Do you come back to each other? Is there repair, or only silence until it is forgotten?",
      "You should be able to say no — to a plan, to money, to intimacy — without paying for it afterwards in coldness or punishment.",
      "Your world should not be shrinking. If you see your friends and family less than you used to, and it wasn't your choice, that matters.",
      "Watch how they speak about you to others, and how they speak about their previous partners. Both tell you something.",
      "If reading this made you uneasy, that is information. Talking it through with someone outside the situation is not disloyal.",
    ],
    category: "HEALTHY_RELATIONSHIPS",
    author: "Heart2Heart Foundation",
    readingMinutes: 5,
    status: "PUBLISHED",
    featured: false,
    publishedAt: daysFromNow(-40, 9),
    updatedAt: daysFromNow(-40, 9),
  },
  {
    slug: "how-to-support-a-girl-who-is-struggling",
    image: "/images/support.jpg",
    title: "How to support a girl who is struggling",
    excerpt:
      "For parents, teachers and older sisters: what to say, what not to say, and what to do when she won't talk to you.",
    body: [
      "Lead with noticing, not questioning. \"You've seemed quiet this week\" gets further than \"what's wrong with you\".",
      "Resist solving it in the first two minutes. Most young people stop talking the moment advice starts, because advice sounds like the conversation is over.",
      "Do not promise total secrecy. Promise that you will not tell anyone without talking to her first. That is a promise you can keep, and it is the one that builds trust.",
      "If she won't talk to you, help her talk to someone else. Being the person who found her a counsellor is as useful as being the person she confides in.",
      "Take any mention of not wanting to be here seriously, calmly, and immediately. Ask directly, stay with her, and get qualified help involved.",
    ],
    category: "SUPPORTING_YOUNG_PEOPLE",
    author: "Heart2Heart Foundation",
    readingMinutes: 4,
    status: "PUBLISHED",
    featured: false,
    publishedAt: daysFromNow(-55, 12),
    updatedAt: daysFromNow(-50, 12),
  },
  {
    slug: "saying-what-you-mean",
    image: "/images/conversation.jpg",
    title: "Saying what you mean without starting a fight",
    excerpt: "Four sentence patterns that make hard conversations easier to start and easier to finish.",
    body: [
      "Hard conversations mostly fail at the opening line. If the first sentence sounds like an accusation, everything after it is a defence.",
      "Start with the situation, not the person: \"When plans change at the last minute\" rather than \"You always change plans\".",
      "Name the effect on you, not their character: \"I end up rushing and I feel disrespected\" rather than \"You are inconsiderate\".",
      "Make one specific request: \"Could you tell me by the morning?\" A request can be answered. A complaint can only be argued with.",
      "Then stop talking. The silence after a clear request is uncomfortable, and it is where the other person actually thinks.",
    ],
    category: "COMMUNICATION",
    author: "Heart2Heart Foundation",
    readingMinutes: 3,
    status: "PUBLISHED",
    featured: false,
    publishedAt: daysFromNow(-70, 10),
    updatedAt: daysFromNow(-70, 10),
  },
  {
    slug: "rebuilding-confidence-after-a-hard-year",
    image: "/images/confidence.jpg",
    title: "Rebuilding confidence after a hard year",
    excerpt: "Confidence is not a personality trait you were born with or without. It is rebuilt in small, specific pieces.",
    body: [
      "After a difficult year, most people wait to feel confident before acting. It works the other way round: the acting comes first and the feeling follows it.",
      "Choose evidence, not affirmations. Telling yourself you are capable rarely works. Doing one small thing you said you would do, and noticing that you did it, works.",
      "Keep the promises small enough to keep. A ten-minute walk you actually take rebuilds more than an hour you skip.",
      "Be careful whose voice you have internalised. Some of the harshest things we say to ourselves are quotations.",
      "If the flatness does not lift over weeks, or you find yourself avoiding people entirely, please talk to someone qualified. That is not weakness — it is the same as seeing a doctor about a pain that won't go.",
    ],
    category: "SELF_ESTEEM",
    author: "Heart2Heart Foundation",
    readingMinutes: 4,
    status: "PUBLISHED",
    featured: false,
    publishedAt: daysFromNow(-90, 9),
    updatedAt: daysFromNow(-88, 9),
  },
  {
    slug: "when-family-pressure-becomes-too-much",
    image: "/images/family.jpg",
    title: "When family pressure becomes too much",
    excerpt: "Expectations from parents and in-laws are real, and so are your limits. Holding both is possible.",
    body: [
      "Family pressure is rarely delivered as a demand. It comes as concern, comparison and repetition, which makes it much harder to answer.",
      "Separate the relationship from the request. You can love someone, respect their position, and still say no to a specific thing they want.",
      "Decide your answer before the conversation, not during it. Pressure works best on people who are still deciding.",
      "A short, kind, repeated sentence is more effective than a long justification. Justifications invite negotiation.",
      "If the pressure is affecting your sleep, your health or your marriage, that is a good reason to talk to a counsellor — not because you cannot cope, but because you should not have to work it out alone.",
    ],
    category: "FAMILY",
    author: "Heart2Heart Foundation",
    readingMinutes: 4,
    status: "REVIEW",
    featured: false,
    publishedAt: daysFromNow(-2, 15),
    updatedAt: daysFromNow(-1, 11),
  },
  {
    slug: "understanding-anxiety",
    image: "/images/calm.jpg",
    title: "Understanding anxiety in everyday language",
    excerpt: "What anxiety is, what it is not, and why it makes ordinary tasks feel enormous.",
    body: [
      "Anxiety is the body preparing for a threat. That system is useful when the threat is real and exhausting when it will not switch off.",
      "It explains a lot of otherwise confusing symptoms: a racing heart with nothing happening, difficulty finishing simple tasks, sleep that will not come.",
      "Avoidance is what makes it grow. Every time we avoid the thing we fear, relief follows immediately — and the fear gets slightly larger.",
      "Small, repeated exposure with support is what shrinks it. Not force, and not doing it alone.",
      "Anxiety responds well to treatment. If it is shaping your decisions, it is worth talking to a qualified professional.",
    ],
    category: "MENTAL_HEALTH_AWARENESS",
    author: "Heart2Heart Foundation",
    readingMinutes: 5,
    status: "DRAFT",
    featured: false,
    publishedAt: daysFromNow(-1, 16),
    updatedAt: daysFromNow(0, 8),
  },
];

export const videos: VideoResource[] = [
  {
    "id": "vid_1",
    "youtubeId": "BvpmZktlBFs",
    "title": "There is no shame in taking care of your mental health",
    "description": "Sangu Delle shares his experience of confronting mental health stigma in Ghana. A TED talk.",
    "durationMinutes": 9,
    "kind": "AWARENESS",
    "image": "https://i.ytimg.com/vi/BvpmZktlBFs/hqdefault.jpg",
    "status": "PUBLISHED",
    "publishedAt": "2017-03-31"
  },
  {
    "id": "vid_2",
    "youtubeId": "1qq7lDL-bzY",
    "title": "Why students should have mental health days",
    "description": "Hailey Hardcastle discusses school pressure and making space for student wellbeing. A TED talk.",
    "durationMinutes": 8,
    "kind": "EDUCATIONAL",
    "image": "https://i.ytimg.com/vi/1qq7lDL-bzY/hqdefault.jpg",
    "status": "PUBLISHED",
    "publishedAt": "2020-05-11"
  },
  {
    "id": "vid_3",
    "youtubeId": "ON4iy8hq2hM",
    "title": "The difference between healthy and unhealthy love",
    "description": "Katie Hood explores how to recognise healthier patterns in relationships. A TED talk.",
    "durationMinutes": 12,
    "kind": "EXPERT",
    "image": "https://i.ytimg.com/vi/ON4iy8hq2hM/hqdefault.jpg",
    "status": "PUBLISHED",
    "publishedAt": "2019-06-11"
  }
];

export const materials: MaterialResource[] = [
  {
    id: "mat_1",
    title: "A parent's guide to difficult conversations",
    description:
      "Twelve pages on starting, holding and ending a hard conversation with a teenage daughter. Printable, plain language.",
    format: "GUIDE",
    sizeKb: 840,
    status: "PUBLISHED",
    publishedAt: daysFromNow(-22, 10),
  },
  {
    id: "mat_2",
    title: "Feelings and needs worksheet",
    description: "A one-page worksheet for naming what you feel and what you need. Useful before a first session.",
    format: "WORKSHEET",
    sizeKb: 210,
    status: "PUBLISHED",
    publishedAt: daysFromNow(-28, 10),
  },
  {
    id: "mat_3",
    title: "Signs of an unhealthy relationship",
    description: "A single-sheet infographic designed to be printed and put on a noticeboard.",
    format: "INFOGRAPHIC",
    sizeKb: 1_400,
    status: "PUBLISHED",
    publishedAt: daysFromNow(-35, 10),
  },
  {
    id: "mat_4",
    title: "Managing exam pressure",
    description: "A short guide for secondary-school students, with a realistic weekly planner.",
    format: "PDF",
    sizeKb: 620,
    status: "PUBLISHED",
    publishedAt: daysFromNow(-15, 10),
  },
  {
    id: "mat_5",
    title: "Where to turn: emergency and support contacts",
    description: "A printable card of verified helplines and support organisations. Reviewed quarterly.",
    format: "AWARENESS",
    sizeKb: 320,
    status: "PUBLISHED",
    publishedAt: daysFromNow(-8, 10),
  },
  {
    id: "mat_6",
    title: "Facilitator pack: school outreach",
    description: "Internal pack for trained facilitators running a school session.",
    format: "GUIDE",
    sizeKb: 2_100,
    status: "DRAFT",
    publishedAt: daysFromNow(-4, 10),
  },
];

/* ------------------------------- selectors -------------------------------- */

export function publishedArticles() {
  return articles
    .filter((a) => a.status === "PUBLISHED")
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
}

export function featuredArticles(limit = 3) {
  return publishedArticles().filter((a) => a.featured).slice(0, limit);
}

export function getArticle(slug: string) {
  return articles.find((a) => a.slug === slug && a.status === "PUBLISHED");
}

export function relatedArticles(slug: string, limit = 3) {
  const article = getArticle(slug);
  if (!article) return [];
  return publishedArticles()
    .filter((a) => a.slug !== slug)
    .sort((a, b) => Number(b.category === article.category) - Number(a.category === article.category))
    .slice(0, limit);
}

export function publishedVideos() {
  return videos
    .filter((v) => v.status === "PUBLISHED")
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
}

export function publishedMaterials() {
  return materials
    .filter((m) => m.status === "PUBLISHED")
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
}

