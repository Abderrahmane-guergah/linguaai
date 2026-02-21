import { useState, useEffect, useRef } from "react";

// ── DATA ──────────────────────────────────────────────────────
const LANGUAGES = [
  { code:"es", name:"Spanish",    flag:"🇪🇸", region:"Europe / Latin America" },
  { code:"fr", name:"French",     flag:"🇫🇷", region:"Europe / Africa" },
  { code:"de", name:"German",     flag:"🇩🇪", region:"Central Europe" },
  { code:"ja", name:"Japanese",   flag:"🇯🇵", region:"East Asia" },
  { code:"zh", name:"Mandarin",   flag:"🇨🇳", region:"East Asia" },
  { code:"ar", name:"Arabic",     flag:"🇸🇦", region:"Middle East / Africa" },
  { code:"it", name:"Italian",    flag:"🇮🇹", region:"Southern Europe" },
  { code:"pt", name:"Portuguese", flag:"🇧🇷", region:"South America" },
  { code:"ko", name:"Korean",     flag:"🇰🇷", region:"East Asia" },
  { code:"ru", name:"Russian",    flag:"🇷🇺", region:"Eastern Europe" },
  { code:"hi", name:"Hindi",      flag:"🇮🇳", region:"South Asia" },
  { code:"nl", name:"Dutch",      flag:"🇳🇱", region:"Western Europe" },
  { code:"tr", name:"Turkish",    flag:"🇹🇷", region:"Europe / Asia" },
  { code:"pl", name:"Polish",     flag:"🇵🇱", region:"Central Europe" },
  { code:"el", name:"Greek",      flag:"🇬🇷", region:"Southern Europe" },
  { code:"sv", name:"Swedish",    flag:"🇸🇪", region:"Northern Europe" },
];

const GOALS = [
  { id:"travel",   icon:"✈️",  label:"Travel & Tourism",   desc:"Airports, hotels, restaurants" },
  { id:"career",   icon:"💼",  label:"Work & Career",       desc:"Meetings, emails, networking" },
  { id:"romance",  icon:"❤️",  label:"Romance & Family",    desc:"Connect with loved ones" },
  { id:"culture",  icon:"🎬",  label:"Culture & Media",     desc:"Films, music, books" },
  { id:"academic", icon:"📚",  label:"Academic Study",      desc:"University & research" },
  { id:"moving",   icon:"🏡",  label:"Moving Abroad",       desc:"Daily life & admin" },
];

const LEVELS = {
  0:{ name:"Absolute Beginner", color:"#7f8c8d", emoji:"🌱", desc:"Every expert started here. We'll build from zero!" },
  1:{ name:"Beginner",          color:"#27ae60", emoji:"🌿", desc:"You know the basics. Let's grow from there!" },
  2:{ name:"Elementary",        color:"#2980b9", emoji:"📘", desc:"Good foundations. Time to expand!" },
  3:{ name:"Intermediate",      color:"#8e44ad", emoji:"⚡", desc:"Solid grasp! Let's sharpen your fluency." },
  4:{ name:"Advanced",          color:"#e67e22", emoji:"🔥", desc:"Impressive! We'll tackle the nuances." },
  5:{ name:"Upper Advanced",    color:"#c0392b", emoji:"💎", desc:"Near-fluent! Let's polish the edge." },
  6:{ name:"Fluent",            color:"#d4ac0d", emoji:"🏆", desc:"Outstanding! Mastery-level practice awaits." },
};

const QUESTIONS = {
  es:[
    {q:"What does 'Buenos días' mean?",o:["Good night","Good morning","Goodbye","Thank you"],a:1,d:1},
    {q:"'Water' in Spanish?",o:["Leche","Jugo","Agua","Vino"],a:2,d:1},
    {q:"Spanish for 'house'?",o:["Casa","Calle","Ciudad","Campo"],a:0,d:1},
    {q:"'I want water' in Spanish?",o:["Quiero agua","Me llamo agua","Tengo agua","Soy agua"],a:0,d:2},
    {q:"Plural of 'el libro'?",o:["los libros","las libras","el libros","los libro"],a:0,d:2},
    {q:"'She is pretty' in Spanish?",o:["Él es bonita","Ella es bonito","Ella es bonita","El es bonito"],a:2,d:2},
    {q:"Translate: 'She speaks Spanish very well'",o:["Ella habla muy bien español","Ella escucha español","Ella come español","Ella corre español"],a:0,d:3},
    {q:"Tense of 'Estaba comiendo'?",o:["Present","Future","Past continuous","Subjunctive"],a:2,d:3},
    {q:"Correct subjunctive usage?",o:["Quiero que ella viene","Espero que ella venga","Pienso que ella venga","Sé que ella venga"],a:1,d:4},
    {q:"'Se me olvidó' best means:",o:["I forgot it","It forgot me","I forgot myself","It slipped my mind"],a:3,d:4},
  ],
  fr:[
    {q:"'Bonjour' means?",o:["Goodbye","Thank you","Hello/Good day","Please"],a:2,d:1},
    {q:"'Chat' in English?",o:["Dog","Cat","Bird","Fish"],a:1,d:1},
    {q:"'Yes' in French?",o:["Non","Si","Oui","Ja"],a:2,d:1},
    {q:"'I am hungry' in French?",o:["J'ai faim","Je suis faim","J'ai froid","Je mange"],a:0,d:2},
    {q:"'Maison' in English?",o:["Mouse","House","Table","Street"],a:1,d:2},
    {q:"'She is beautiful' in French?",o:["Il est belle","Elle est beau","Elle est belle","Il est beau"],a:2,d:2},
    {q:"'We went to Paris yesterday'?",o:["Nous allons à Paris hier","Nous sommes allés à Paris hier","Nous irons à Paris hier","Nous allions Paris"],a:1,d:3},
    {q:"Irregular verb in passé composé?",o:["Manger","Aller","Parler","Finir"],a:1,d:3},
    {q:"'Il faut que tu viennes' means?",o:["You should come","You must come","You want to come","You came"],a:1,d:4},
    {q:"Correct subjunctive of 'être'?",o:["Je suis","Je serai","Je sois","Je serais"],a:2,d:4},
  ],
  de:[
    {q:"'Guten Morgen' means?",o:["Good evening","Good morning","Good night","Good luck"],a:1,d:1},
    {q:"'Hund' in English?",o:["Cat","Bird","Dog","Fish"],a:2,d:1},
    {q:"'Thank you' in German?",o:["Bitte","Danke","Ja","Nein"],a:1,d:1},
    {q:"Article for 'Frau'?",o:["der","das","die","ein"],a:2,d:2},
    {q:"'I am learning German'?",o:["Ich lerne Deutsch","Ich spreche Deutsch","Ich habe Deutsch","Ich bin Deutsch"],a:0,d:2},
    {q:"'Ich habe Hunger' means?",o:["I am thirsty","I am tired","I am hungry","I am happy"],a:2,d:2},
    {q:"Case after 'mit'?",o:["Nominativ","Akkusativ","Dativ","Genitiv"],a:2,d:3},
    {q:"Perfekt of 'gehen'?",o:["Ich habe gegangen","Ich bin gegangen","Ich habe gegangt","Ich war gegangen"],a:1,d:3},
    {q:"Grammatically correct?",o:["Ich kaufe ein neues Auto","Ich kaufe ein neuer Auto","Ich kaufe einen neues Auto","Ich kaufe einem neuen Auto"],a:0,d:4},
    {q:"'Es sei denn' means?",o:["Therefore","Unless","However","Although"],a:1,d:4},
  ],
  ja:[
    {q:"'こんにちは' means?",o:["Goodbye","Thank you","Hello","Sorry"],a:2,d:1},
    {q:"'Cat' in Japanese?",o:["犬 inu","猫 neko","鳥 tori","魚 sakana"],a:1,d:1},
    {q:"'ありがとう' means?",o:["Please","Sorry","Excuse me","Thank you"],a:3,d:1},
    {q:"Subject marker particle?",o:["を wo","に ni","が ga","で de"],a:2,d:2},
    {q:"'I eat sushi'?",o:["寿司を食べます","寿司が飲みます","寿司に行きます","寿司で見ます"],a:0,d:2},
    {q:"'どこ' means?",o:["Who","What","Where","When"],a:2,d:2},
    {q:"Polite negative of 'tabemasu'?",o:["Tabemasen","Tabenai","Tabemasendeshita","Tabejanai"],a:0,d:3},
    {q:"て-form indicates?",o:["Past tense","Negative","Connecting actions","Future"],a:2,d:3},
    {q:"Honorific for someone else's action?",o:["します","なさいます","いたします","やります"],a:1,d:4},
    {q:"'If it rains I won't go'?",o:["雨が降れば行きません","雨が降ると行きません","雨が降ったら行きません","All are acceptable"],a:3,d:4},
  ],
  zh:[
    {q:"'你好' means?",o:["Thank you","Hello","Goodbye","Sorry"],a:1,d:1},
    {q:"'水' in English?",o:["Fire","Earth","Water","Wind"],a:2,d:1},
    {q:"'Thank you' in Mandarin?",o:["对不起","谢谢","你好","再见"],a:1,d:1},
    {q:"'我爱你' means?",o:["I miss you","I love you","I need you","I see you"],a:1,d:2},
    {q:"Tone of '妈' (mā)?",o:["2nd rising","3rd dipping","4th falling","1st flat"],a:3,d:2},
    {q:"'I want to eat'?",o:["我想吃","我吃想","想我吃","吃我想"],a:0,d:2},
    {q:"Measure word for books?",o:["条 tiáo","本 běn","张 zhāng","个 gè"],a:1,d:3},
    {q:"Correct past-tense negation?",o:["我不去了","我没去","我不去过","我没有不去"],a:1,d:3},
    {q:"Particle '了' indicates?",o:["Future action","Completed / change of state","Ongoing action","Possibility"],a:1,d:4},
    {q:"'把' sentences emphasise?",o:["Questions","Object before verb","Possibility","Appearance"],a:1,d:4},
  ],
  ar:[
    {q:"'مرحبا' means?",o:["Goodbye","Hello","Thank you","Please"],a:1,d:1},
    {q:"Arabic is written…",o:["Left to right","Right to left","Top to bottom","Either"],a:1,d:1},
    {q:"'Yes' in Arabic?",o:["لا","نعم","ربما","شكرا"],a:1,d:1},
    {q:"'Thank you' in Arabic?",o:["من فضلك","شكرا","مع السلامة","نعم"],a:1,d:2},
    {q:"Letters in Arabic alphabet?",o:["22","26","28","30"],a:2,d:2},
    {q:"'كتاب' means?",o:["School","Pen","Book","Desk"],a:2,d:2},
    {q:"Root pattern of 'كاتب' (writer)?",o:["ك-ت-ب","ك-ب-ت","ت-ك-ب","ب-ك-ت"],a:0,d:3},
    {q:"Dual suffix '-ان' means?",o:["Plural","Feminine","Exactly two","Definite"],a:2,d:3},
    {q:"Imperative verb form?",o:["فَعَلَ","يَفْعَلُ","اِفْعَلْ","مَفْعُول"],a:2,d:4},
    {q:"Broken plural of 'كتاب'?",o:["كتابات","أكتب","كُتُب","كتابون"],a:2,d:4},
  ],
  it:[
    {q:"'Ciao' means?",o:["Please","Hello/Goodbye","Thank you","Sorry"],a:1,d:1},
    {q:"'Casa' in English?",o:["Street","House","Car","Food"],a:1,d:1},
    {q:"'Yes' in Italian?",o:["No","Si","Sì","Ja"],a:2,d:1},
    {q:"'I love pizza' in Italian?",o:["Io mangio pizza","Io amo la pizza","Io ho pizza","Io sono pizza"],a:1,d:2},
    {q:"'Grazie mille' means?",o:["Good morning","You're welcome","A thousand thanks","See you later"],a:2,d:2},
    {q:"Plural of 'ragazzo'?",o:["ragazzi","ragazze","ragazzos","ragazzia"],a:0,d:2},
    {q:"Passato prossimo of 'andare'?",o:["Ho andato","Sono andato","Ero andato","Avevo andato"],a:1,d:3},
    {q:"Verb taking 'essere' in passato?",o:["Mangiare","Parlare","Venire","Scrivere"],a:2,d:3},
    {q:"'Magari' means?",o:["Obviously","Maybe / I wish","Never","Always"],a:1,d:4},
    {q:"'If I had known, I would have come'?",o:["Se sapessi vengo","Se sapevo venivo","Se avessi saputo sarei venuto","Se so vengo"],a:2,d:4},
  ],
  pt:[
    {q:"'Olá' means?",o:["Goodbye","Hello","Please","Sorry"],a:1,d:1},
    {q:"'Água' in English?",o:["Fire","Water","Earth","Air"],a:1,d:1},
    {q:"'Thank you' (masc.) in Portuguese?",o:["Obrigada","Obrigado","Desculpe","Por favor"],a:1,d:1},
    {q:"'I speak Portuguese'?",o:["Eu como português","Eu falo português","Eu tenho português","Eu sou português"],a:1,d:2},
    {q:"Country of Brazilian Portuguese?",o:["Portugal","Spain","Brazil","Argentina"],a:2,d:2},
    {q:"Ser vs estar?",o:["Ser=permanent estar=temporary","Ser=formal estar=informal","Completely different","Only ser in Brazil"],a:0,d:2},
    {q:"Future of 'falar' (I)?",o:["Falei","Falo","Falarei","Falava"],a:2,d:3},
    {q:"'I went' (ir) past?",o:["Eu ia","Eu fui","Eu vá","Eu irei"],a:1,d:3},
    {q:"Personal infinitive used for?",o:["Different-subject clauses","Formal writing","Replacing subjunctive","Past actions"],a:0,d:4},
    {q:"'Embora' followed by?",o:["Indicative","Infinitive","Subjunctive","Conditional"],a:2,d:4},
  ],
  ko:[
    {q:"'안녕하세요' means?",o:["Goodbye","Thank you","Hello","Sorry"],a:2,d:1},
    {q:"'Thank you' in Korean?",o:["미안합니다","감사합니다","안녕","네"],a:1,d:1},
    {q:"'물' in English?",o:["Fire","Water","Wind","Earth"],a:1,d:1},
    {q:"Particle '은/는' marks?",o:["Object","Topic","Location","Direction"],a:1,d:2},
    {q:"'I eat rice' in Korean?",o:["나는 밥을 먹어요","나는 밥이 먹어요","나는 밥에 먹어요","나는 밥으로 먹어요"],a:0,d:2},
    {q:"Korean writing system?",o:["Kanji","Hiragana","Hangul","Cyrillic"],a:2,d:2},
    {q:"Polite present tense ending?",o:["-다","-아/어요","-았/었다","-겠다"],a:1,d:3},
    {q:"'-고 싶다' expresses?",o:["Obligation","Desire","Ability","Permission"],a:1,d:3},
    {q:"Honorific subject suffix?",o:["-아/어요","-시-","-겠-","-았/었-"],a:1,d:4},
    {q:"'Although hard, I study'?",o:["어려워서 공부해요","어려우면 공부해요","어렵지만 공부해요","어렵고 공부해요"],a:2,d:4},
  ],
  ru:[
    {q:"'Привет' means?",o:["Goodbye","Hi/Hello","Thank you","Please"],a:1,d:1},
    {q:"'Yes' in Russian?",o:["Нет","Да","Может быть","Хорошо"],a:1,d:1},
    {q:"'вода' in English?",o:["Wine","Vodka","Water","Milk"],a:2,d:1},
    {q:"Russian grammatical cases?",o:["4","5","6","7"],a:2,d:2},
    {q:"'Меня зовут' means?",o:["I want","My name is","I am from","I like"],a:1,d:2},
    {q:"Case after 'в' (location)?",o:["Nominative","Accusative","Prepositional","Genitive"],a:2,d:2},
    {q:"Perfective vs imperfective?",o:["Past vs present","Completed vs ongoing","Formal vs informal","Singular vs plural"],a:1,d:3},
    {q:"'I have a book' in Russian?",o:["Я имею книгу","У меня есть книга","Я есть книга","Моя книга есть"],a:1,d:3},
    {q:"'хотя' means?",o:["Because","Therefore","Although","Unless"],a:2,d:4},
    {q:"Genitive plural of 'книга'?",o:["книги","книгов","книг","книгам"],a:2,d:4},
  ],
  hi:[
    {q:"'नमस्ते' means?",o:["Goodbye","Hello/Greetings","Thank you","Please"],a:1,d:1},
    {q:"'Yes' in Hindi?",o:["नहीं","हाँ","शायद","ठीक है"],a:1,d:1},
    {q:"'पानी' in English?",o:["Fire","Sky","Water","Earth"],a:2,d:1},
    {q:"Hindi script?",o:["Latin","Arabic","Devanagari","Cyrillic"],a:2,d:2},
    {q:"'My name is' in Hindi?",o:["मेरा नाम है","आपका नाम है","तुम्हारा नाम","नाम मेरा"],a:0,d:2},
    {q:"'धन्यवाद' means?",o:["Please","Sorry","Thank you","Excuse me"],a:2,d:2},
    {q:"Hindi noun genders?",o:["3 genders","No gender","Masculine or feminine only","Only pronouns have gender"],a:2,d:3},
    {q:"Word order in Hindi?",o:["S+V+O","V+S+O","S+O+V","O+S+V"],a:2,d:3},
    {q:"'ने' (ne) indicates?",o:["Future","Ergative past transitive marker","Plural","Negation"],a:1,d:4},
    {q:"'She would have come if she had known'?",o:["अगर उसे पता होता तो वो आती","वो आई क्योंकि पता था","उसे पता है वो आएगी","वो आएगी अगर पता होगा"],a:0,d:4},
  ],
  nl:[
    {q:"'Hallo' means?",o:["Goodbye","Hello","Thank you","Please"],a:1,d:1},
    {q:"'Water' in Dutch?",o:["Vuur","Water","Lucht","Aarde"],a:1,d:1},
    {q:"'Thank you' in Dutch?",o:["Alsjeblieft","Dankjewel","Sorry","Hoi"],a:1,d:1},
    {q:"Two Dutch articles?",o:["der/das","de/het","le/la","el/la"],a:1,d:2},
    {q:"'I speak Dutch'?",o:["Ik spreek Nederlands","Ik ben Nederlands","Ik heb Nederlands","Ik ga Nederlands"],a:0,d:2},
    {q:"'Huis' in English?",o:["Horse","House","Hat","Hand"],a:1,d:2},
    {q:"Past tense of 'gaan'?",o:["Ik ginde","Ik ging","Ik ben gegaan","Ik gaande"],a:1,d:3},
    {q:"Verb in subordinate clause goes?",o:["First","Second","At the end","Anywhere"],a:2,d:3},
    {q:"'Toch' expresses?",o:["Certainly not","Emphasis / contradiction","Only","Already"],a:1,d:4},
    {q:"Diminutive of 'boek'?",o:["Boekje","Boekken","Boekkie","Boekie"],a:0,d:4},
  ],
  tr:[
    {q:"'Merhaba' means?",o:["Goodbye","Hello","Thank you","Please"],a:1,d:1},
    {q:"'Yes' in Turkish?",o:["Hayır","Evet","Belki","Tamam"],a:1,d:1},
    {q:"'Su' in English?",o:["Fire","Sun","Water","Sky"],a:2,d:1},
    {q:"Turkish language type?",o:["Fusional","Isolating","Agglutinative","Tonal"],a:2,d:2},
    {q:"'I eat bread' in Turkish?",o:["Ekmek yiyorum","Ben ekmek","Yiyorum ekmek","Ekmek ben"],a:0,d:2},
    {q:"'Teşekkür ederim' means?",o:["Please","Thank you","Sorry","Goodbye"],a:1,d:2},
    {q:"Suffix for 'at / in a place'?",o:["-den/-dan","-e/-a","-de/-da","-in/-ın"],a:2,d:3},
    {q:"Vowel harmony means?",o:["Matching pitch","Suffixes match root vowels","Equal syllables","Consonants adapt"],a:1,d:3},
    {q:"Conditional suffix?",o:["-iyor","-di","-se/-sa","-ecek"],a:2,d:4},
    {q:"'I couldn't come because I was busy'?",o:["Meşgul olduğum için gelemedim","Gelmek istedim ama meşguldüm","Gelmeyeceğim çünkü meşgulüm","Meşgul değilim geldim"],a:0,d:4},
  ],
  pl:[
    {q:"'Cześć' means?",o:["Goodbye","Thank you","Hi/Hello","Please"],a:2,d:1},
    {q:"'Yes' in Polish?",o:["Nie","Tak","Może","Dobrze"],a:1,d:1},
    {q:"'Woda' in English?",o:["Wind","Water","Vodka","Wool"],a:1,d:1},
    {q:"Polish grammatical cases?",o:["5","6","7","8"],a:2,d:2},
    {q:"'Thank you' in Polish?",o:["Proszę","Dziękuję","Przepraszam","Cześć"],a:1,d:2},
    {q:"Polish past verbs agree in?",o:["Number only","Gender only","Number & gender","Neither"],a:2,d:2},
    {q:"Case after 'do' (to/of)?",o:["Nominative","Accusative","Genitive","Dative"],a:2,d:3},
    {q:"'To write' aspect pair?",o:["pisać / napisać","pisać / napisywać","napisać / pisać","piszę / napisuję"],a:0,d:3},
    {q:"'I've lived in Warsaw for 3 years'?",o:["Mieszkałem w Warszawie 3 lata","Mieszkam w Warszawie od 3 lat","Będę mieszkać w Warszawie 3 lata","Mieszkałbym w Warszawie 3 lat"],a:1,d:4},
    {q:"Genitive plural of 'książka'?",o:["książki","książkę","książek","książkom"],a:2,d:4},
  ],
  el:[
    {q:"'Γεια σας' means?",o:["Goodbye","Thank you","Hello (formal)","Please"],a:2,d:1},
    {q:"'Yes' in Greek?",o:["Όχι","Ναι","Ίσως","Εντάξει"],a:1,d:1},
    {q:"'Νερό' in English?",o:["Fire","Sea","Water","Night"],a:2,d:1},
    {q:"Greek alphabet?",o:["Latin","Cyrillic","Greek (its own)","Arabic"],a:2,d:2},
    {q:"'Thank you' in Greek?",o:["Παρακαλώ","Ευχαριστώ","Συγγνώμη","Γεια"],a:1,d:2},
    {q:"'Τι κάνεις;' means?",o:["Where are you?","What's your name?","How are you?","What do you want?"],a:2,d:2},
    {q:"Case for direct object?",o:["Nominative","Genitive","Accusative","Vocative"],a:2,d:3},
    {q:"'Έφαγα' tense?",o:["Present","Imperfect","Simple past (aorist)","Future"],a:2,d:3},
    {q:"Particle 'να' indicates?",o:["Past tense","Subjunctive / wish","Question","Negation"],a:1,d:4},
    {q:"'I wish I could come'?",o:["Μπορώ να έρθω","Ήθελα να έρθω","Μακάρι να μπορούσα να έρθω","Θα έρθω αν μπορώ"],a:2,d:4},
  ],
  sv:[
    {q:"'Hej' means?",o:["Goodbye","Hello/Hi","Thank you","Please"],a:1,d:1},
    {q:"'Yes' in Swedish?",o:["Nej","Ja","Kanske","Okej"],a:1,d:1},
    {q:"'Vatten' in English?",o:["Wine","Winter","Water","Wind"],a:2,d:1},
    {q:"Swedish noun genders?",o:["Masculine/Feminine","Common/Neuter","Animate/Inanimate","Strong/Weak"],a:1,d:2},
    {q:"'Thank you' in Swedish?",o:["Förlåt","Tack","Snälla","Varsågod"],a:1,d:2},
    {q:"'Hur mår du?' means?",o:["Where are you?","What do you do?","How are you?","Who are you?"],a:2,d:2},
    {q:"Definite form of 'en bil'?",o:["bilen","bils","bilet","bilt"],a:0,d:3},
    {q:"V2 word order means?",o:["Always start with verb","Verb always second in main clause","Two verbs per sentence","Verbs at end"],a:1,d:3},
    {q:"'Lagom' means?",o:["Very much","Not at all","Just the right amount","Too much"],a:2,d:4},
    {q:"Past tense of 'skriva'?",o:["Skrivade","Skrev","Skriven","Skrivit"],a:1,d:4},
  ],
};

// ── CLAUDE ────────────────────────────────────────────────────
async function callClaude(messages, system) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({ model:"claude-sonnet-4-6", max_tokens:1000, system, messages }),
  });
  const data = await res.json();
  return data.content?.[0]?.text || "Sorry, I couldn't respond right now.";
}

// ── STORAGE ───────────────────────────────────────────────────
const sGet = async (k) => { try { const r = await window.storage.get(k); return r ? JSON.parse(r.value) : null; } catch { return null; } };
const sSet = async (k,v) => { try { await window.storage.set(k, JSON.stringify(v)); } catch {} };
const sList = async (p) => { try { const r = await window.storage.list(p); return r?.keys||[]; } catch { return []; } };
const uid = () => Math.random().toString(36).slice(2,10);
const AB = ["A","B","C","D"];

// ── STYLES ────────────────────────────────────────────────────
const G = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;700&family=Lato:ital,wght@0,300;0,400;0,700;1,400&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(196,168,130,.25);border-radius:2px}
  @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
  @keyframes bounce{0%,60%,100%{transform:translateY(0);opacity:.4}30%{transform:translateY(-7px);opacity:1}}
  .fadeUp{animation:fadeUp .4s ease both}
  .lc{transition:all .22s!important}.lc:hover{transform:translateY(-5px)!important;background:rgba(255,255,255,.075)!important;border-color:rgba(196,168,130,.35)!important;box-shadow:0 18px 40px rgba(0,0,0,.45)!important}
  .ob:hover{background:rgba(196,168,130,.11)!important;border-color:rgba(196,168,130,.38)!important}
  .gc{transition:all .2s!important}.gc:hover{border-color:rgba(196,168,130,.4)!important;background:rgba(196,168,130,.07)!important}
  .pb{transition:all .2s!important}.pb:hover{transform:translateY(-2px)!important;box-shadow:0 10px 32px rgba(196,168,130,.38)!important}
  .gb{transition:all .2s!important}.gb:hover{background:rgba(255,255,255,.08)!important;border-color:rgba(255,255,255,.22)!important}
  .nl:hover{color:#c4a882!important}
  .hi:hover{background:rgba(255,255,255,.055)!important;border-color:rgba(196,168,130,.25)!important}
  .fi:focus{border-color:rgba(196,168,130,.5)!important;outline:none}
`;

// ── ROOT ──────────────────────────────────────────────────────
export default function LinguaAI() {
  const [screen, setScreen] = useState("home");
  const [user, setUser] = useState(null);
  const [lang, setLang] = useState(null);
  const [goals, setGoals] = useState([]);
  const [exam, setExam] = useState({ qi:0, score:0, pool:[] });
  const [level, setLevel] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");
  const chatEnd = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { chatEnd.current?.scrollIntoView({behavior:"smooth"}); }, [msgs]);

  const login = (u) => { setUser(u); setScreen("home"); };
  const logout = () => { setUser(null); setScreen("home"); setMsgs([]); };
  const pickLang = (l) => { setLang(l); setGoals([]); setScreen("questionnaire"); };

  const startExam = () => {
    const pool = [...(QUESTIONS[lang.code]||[])].sort((a,b)=>a.d-b.d);
    setExam({qi:0,score:0,pool});
    setScreen("exam");
  };

  const answer = (idx) => {
    const {qi,score,pool} = exam;
    const q = pool[qi];
    const correct = q.a === idx;
    const ns = correct ? score+1 : score;
    if (qi+1 >= 10) {
      const li = Math.min(6, Math.round((ns/10)*6));
      setLevel({score:ns,li,...LEVELS[li]});
      setExam(e=>({...e,score:ns}));
      setScreen("results");
    } else {
      let np=[...pool];
      if (correct) {
        const rem=pool.slice(qi+1), harder=rem.filter(r=>r.d>q.d);
        if (harder.length){const pi=np.indexOf(harder[0]);[np[qi+1],np[pi]]=[np[pi],np[qi+1]];}
      }
      setExam({qi:qi+1,score:ns,pool:np});
    }
  };

  const buildSys = () => {
    const gl = goals.map(g=>GOALS.find(x=>x.id===g)?.label).filter(Boolean).join(", ")||"General learning";
    return `You are LinguaAI, an expert ${lang?.name} tutor powered by deep linguistic expertise.
Student: Level=${level?.name} (${exam.score}/10 adaptive placement), Goals=${gl}, Language=${lang?.name} ${lang?.flag}
Rules: Match difficulty to ${level?.name} level. Respond English first then ${lang?.name} examples. Personalise to goals: ${gl}. Correct gently with explanations. Give short exercises. Keep replies 3-4 paragraphs max. Use emojis sparingly.
First message: greet them, acknowledge level & goals, then start lesson 1.`;
  };

  const startChat = async () => {
    if (!user) { setScreen("auth"); return; }
    setScreen("chat"); setMsgs([]); setLoading(true);
    const intro = await callClaude([{role:"user",content:"Begin my personalised lesson now."}], buildSys());
    const init = [{role:"assistant",content:intro}];
    setMsgs(init); setLoading(false);
    const id = uid(); setChatId(id);
    await sSet(`chat:${user.id}:${id}`,{id,langName:lang.name,langCode:lang.code,flag:lang.flag,levelName:level.name,li:level.li,goals,messages:init,updatedAt:Date.now()});
  };

  const send = async () => {
    if (!input.trim()||loading) return;
    const txt=input.trim(); setInput("");
    const next=[...msgs,{role:"user",content:txt}];
    setMsgs(next); setLoading(true);
    const reply = await callClaude(next, buildSys());
    const final=[...next,{role:"assistant",content:reply}];
    setMsgs(final); setLoading(false);
    setTimeout(()=>inputRef.current?.focus(),80);
    if (user&&chatId){const ex=await sGet(`chat:${user.id}:${chatId}`);if(ex)await sSet(`chat:${user.id}:${chatId}`,{...ex,messages:final,updatedAt:Date.now()});}
  };

  const loadHistory = async () => {
    if (!user) return;
    const keys = await sList(`chat:${user.id}:`);
    const chats = await Promise.all(keys.map(k=>sGet(k)));
    setHistory(chats.filter(Boolean).sort((a,b)=>b.updatedAt-a.updatedAt));
    setScreen("history");
  };

  const openChat = (c) => {
    setLang(LANGUAGES.find(l=>l.code===c.langCode));
    setLevel({name:c.levelName,li:c.li,...LEVELS[c.li]});
    setGoals(c.goals||[]); setMsgs(c.messages||[]); setChatId(c.id);
    setScreen("chat");
  };

  const filtered = LANGUAGES.filter(l=>l.name.toLowerCase().includes(search.toLowerCase())||l.region.toLowerCase().includes(search.toLowerCase()));

  const F = {
    page:{ minHeight:"100vh", background:"#080810", fontFamily:"'Lato',Georgia,serif", color:"#e8dcc8", position:"relative", overflow:"hidden" },
    card:{ background:"rgba(255,255,255,.035)", border:"1px solid rgba(255,255,255,.08)", borderRadius:20 },
    inp:{ width:"100%", background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.11)", borderRadius:12, padding:"13px 17px", color:"#e8dcc8", fontSize:14, fontFamily:"'Lato',sans-serif", transition:"border-color .2s" },
  };

  const PBtn = ({onClick,children,style={}}) => (
    <button className="pb" onClick={onClick} style={{background:"linear-gradient(135deg,#c4a882,#8b6a3a)",border:"none",borderRadius:12,padding:"14px 34px",color:"#080810",fontSize:15,cursor:"pointer",fontFamily:"'Playfair Display',serif",fontWeight:700,boxShadow:"0 6px 24px rgba(196,168,130,.25)",...style}}>{children}</button>
  );
  const Bk = ({onClick}) => (
    <button onClick={onClick} style={{background:"none",border:"none",color:"#6a5a40",cursor:"pointer",fontSize:13,letterSpacing:2,textTransform:"uppercase",marginBottom:36,padding:0}}>← Back</button>
  );
  const Lbl = ({children}) => <label style={{fontSize:11,letterSpacing:2,color:"#8b6a3a",textTransform:"uppercase",marginBottom:7,display:"block"}}>{children}</label>;

  return (
    <div style={F.page}>
      <style>{G}</style>
      <div style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none",background:`radial-gradient(ellipse at 15% 50%,rgba(120,80,30,.14) 0%,transparent 55%),radial-gradient(ellipse at 85% 20%,rgba(40,70,130,.1) 0%,transparent 55%),radial-gradient(ellipse at 55% 85%,rgba(70,120,50,.08) 0%,transparent 55%)`}}/>

      {/* NAV */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,padding:"13px 28px",display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(8,8,16,.9)",backdropFilter:"blur(22px)",borderBottom:"1px solid rgba(255,255,255,.06)"}}>
        <button onClick={()=>setScreen("home")} style={{background:"none",border:"none",cursor:"pointer",padding:0}}>
          <span style={{fontSize:20,fontFamily:"'Playfair Display',serif",color:"#e8dcc8",letterSpacing:-.5}}>Lingua<span style={{color:"#c4a882"}}>AI</span></span>
        </button>
        <div style={{display:"flex",alignItems:"center",gap:20}}>
          {user ? <>
            <button className="nl" onClick={loadHistory} style={{background:"none",border:"none",color:"#8a8070",cursor:"pointer",fontSize:13,letterSpacing:.5,transition:"color .18s"}}>My Chats</button>
            <button className="nl" onClick={()=>setScreen("home")} style={{background:"none",border:"none",color:"#8a8070",cursor:"pointer",fontSize:13,letterSpacing:.5,transition:"color .18s"}}>Languages</button>
            <div style={{display:"flex",alignItems:"center",gap:10,paddingLeft:16,borderLeft:"1px solid rgba(255,255,255,.08)"}}>
              <div style={{width:30,height:30,borderRadius:"50%",background:"linear-gradient(135deg,#c4a882,#8b6a3a)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:"#080810",fontWeight:700}}>{(user.name||user.email||"?")[0].toUpperCase()}</div>
              <button className="nl" onClick={logout} style={{background:"none",border:"none",color:"#5a4a30",cursor:"pointer",fontSize:12,transition:"color .18s"}}>Sign Out</button>
            </div>
          </> : (
            <button className="gb" onClick={()=>setScreen("auth")} style={{background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.12)",borderRadius:10,padding:"9px 22px",color:"#c4a882",fontSize:13,cursor:"pointer",letterSpacing:.5}}>Sign In</button>
          )}
        </div>
      </nav>

      <div style={{paddingTop:60,position:"relative",zIndex:1}}>

        {/* HOME */}
        {screen==="home"&&(
          <div className="fadeUp" style={{maxWidth:1020,margin:"0 auto",padding:"58px 24px"}}>
            <div style={{textAlign:"center",marginBottom:54}}>
              <div style={{fontSize:11,letterSpacing:6,color:"#8b6a3a",textTransform:"uppercase",marginBottom:18}}>Powered by Claude AI</div>
              <h1 style={{fontSize:"clamp(58px,9vw,108px)",fontFamily:"'Playfair Display',serif",fontWeight:700,margin:0,lineHeight:1,background:"linear-gradient(135deg,#f0ead6 0%,#c4a882 50%,#8b6a3a 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",letterSpacing:-3}}>LinguaAI</h1>
              <p style={{fontSize:17,color:"#7a7060",margin:"22px auto 0",maxWidth:480,lineHeight:1.85}}>Adaptive placement exam · Personal goal questionnaire · AI tutor built around you.</p>
              <div style={{display:"flex",justifyContent:"center",gap:36,marginTop:30,flexWrap:"wrap"}}>
                {["16 Languages","Adaptive 10-Q Exam","Goal-Personalised AI","Saved Chat History"].map(f=>(
                  <span key={f} style={{fontSize:11,letterSpacing:2,color:"#5a4a30",textTransform:"uppercase"}}>{f}</span>
                ))}
              </div>
            </div>
            <div style={{maxWidth:360,margin:"0 auto 26px"}}>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search languages or regions…" className="fi"
                style={{...F.inp,width:"100%"}}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(155px,1fr))",gap:13}}>
              {filtered.map(l=>(
                <button key={l.code} className="lc" onClick={()=>pickLang(l)}
                  style={{background:"rgba(255,255,255,.035)",border:"1px solid rgba(255,255,255,.07)",borderRadius:18,padding:"24px 14px",cursor:"pointer",color:"#e8dcc8",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:7}}>
                  <div style={{fontSize:34}}>{l.flag}</div>
                  <div style={{fontSize:14,fontWeight:600,fontFamily:"'Playfair Display',serif"}}>{l.name}</div>
                  <div style={{fontSize:10,color:"#5a4a30",letterSpacing:1,textTransform:"uppercase"}}>{l.region}</div>
                  <div style={{fontSize:11,color:"#8b6a3a",marginTop:4}}>Start →</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* AUTH */}
        {screen==="auth"&&<AuthScreen onLogin={login} onBack={()=>setScreen("home")} inp={F.inp}/>}

        {/* QUESTIONNAIRE */}
        {screen==="questionnaire"&&lang&&(
          <div className="fadeUp" style={{maxWidth:640,margin:"0 auto",padding:"48px 24px"}}>
            <Bk onClick={()=>setScreen("home")}/>
            <div style={{marginBottom:32}}>
              <div style={{fontSize:11,letterSpacing:4,color:"#8b6a3a",textTransform:"uppercase",marginBottom:10}}>{lang.flag} {lang.name}</div>
              <h2 style={{fontSize:34,fontFamily:"'Playfair Display',serif",fontWeight:500,marginBottom:10}}>Why are you learning?</h2>
              <p style={{color:"#7a7060",fontSize:15,lineHeight:1.75}}>Select all that apply — your AI tutor will tailor every lesson to your goals.</p>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:30}}>
              {GOALS.map(g=>{
                const sel=goals.includes(g.id);
                return(
                  <button key={g.id} className="gc" onClick={()=>setGoals(p=>p.includes(g.id)?p.filter(x=>x!==g.id):[...p,g.id])}
                    style={{background:sel?"rgba(196,168,130,.1)":"rgba(255,255,255,.035)",border:sel?"1px solid rgba(196,168,130,.5)":"1px solid rgba(255,255,255,.08)",borderRadius:16,padding:"20px 18px",cursor:"pointer",textAlign:"left"}}>
                    <div style={{fontSize:24,marginBottom:8}}>{g.icon}</div>
                    <div style={{fontSize:14,fontWeight:600,color:sel?"#c4a882":"#e8dcc8",marginBottom:4}}>{g.label}</div>
                    <div style={{fontSize:12,color:"#6a5a40",lineHeight:1.5}}>{g.desc}</div>
                    {sel&&<div style={{marginTop:8,fontSize:10,color:"#c4a882",letterSpacing:1.5}}>✓ SELECTED</div>}
                  </button>
                );
              })}
            </div>
            <PBtn onClick={startExam} style={{width:"100%",fontSize:16}}>{goals.length>0?"Continue to Placement Exam →":"Skip & Take Exam →"}</PBtn>
          </div>
        )}

        {/* EXAM */}
        {screen==="exam"&&lang&&(()=>{
          const q=exam.pool[exam.qi]; if(!q)return null;
          const dl=["","Beginner","Elementary","Intermediate","Advanced"][q.d]||"";
          return(
            <div className="fadeUp" style={{maxWidth:640,margin:"0 auto",padding:"48px 24px"}}>
              <Bk onClick={()=>setScreen("questionnaire")}/>
              <div style={{marginBottom:28}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <div style={{fontSize:11,letterSpacing:4,color:"#8b6a3a",textTransform:"uppercase"}}>{lang.flag} Placement Exam</div>
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    <span style={{fontSize:10,padding:"3px 9px",borderRadius:20,background:"rgba(196,168,130,.13)",color:"#c4a882",letterSpacing:1,textTransform:"uppercase"}}>{dl}</span>
                    <span style={{fontSize:12,color:"#5a4a30"}}>Q {exam.qi+1} / 10</span>
                  </div>
                </div>
                <div style={{height:3,background:"rgba(255,255,255,.07)",borderRadius:2}}>
                  <div style={{height:"100%",width:`${exam.qi/10*100}%`,background:"linear-gradient(90deg,#8b6a3a,#c4a882)",borderRadius:2,transition:"width .4s ease"}}/>
                </div>
              </div>
              <div style={{...F.card,padding:"34px 30px"}}>
                <h2 style={{fontSize:21,fontFamily:"'Playfair Display',serif",fontWeight:400,marginBottom:28,lineHeight:1.55,color:"#f0ead6"}}>{q.q}</h2>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {q.o.map((opt,i)=>(
                    <button key={i} className="ob" onClick={()=>answer(i)}
                      style={{background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.09)",borderRadius:12,padding:"15px 19px",color:"#e8dcc8",cursor:"pointer",textAlign:"left",fontSize:14,display:"flex",alignItems:"center",gap:13,transition:"all .18s"}}>
                      <span style={{width:27,height:27,borderRadius:8,background:"rgba(255,255,255,.06)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#8b6a3a",flexShrink:0,fontFamily:"monospace"}}>{AB[i]}</span>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

        {/* RESULTS */}
        {screen==="results"&&level&&(
          <div className="fadeUp" style={{maxWidth:560,margin:"0 auto",padding:"68px 24px",textAlign:"center"}}>
            <div style={{fontSize:68,marginBottom:18}}>{level.emoji}</div>
            <div style={{fontSize:11,letterSpacing:4,color:"#8b6a3a",textTransform:"uppercase",marginBottom:12}}>{lang?.flag} {lang?.name} Level</div>
            <h2 style={{fontSize:50,fontFamily:"'Playfair Display',serif",fontWeight:500,margin:"0 0 10px",color:level.color}}>{level.name}</h2>
            <p style={{color:"#7a7060",fontSize:15,marginBottom:10,lineHeight:1.7}}>{level.desc}</p>
            <p style={{color:"#5a4a30",fontSize:13,marginBottom:42}}>Score: {exam.score} / 10</p>
            <div style={{...F.card,padding:"26px 28px",marginBottom:36}}>
              <div style={{display:"flex",gap:7,justifyContent:"center",marginBottom:18,flexWrap:"wrap"}}>
                {Array.from({length:10}).map((_,i)=>(
                  <div key={i} style={{width:34,height:34,borderRadius:8,background:i<exam.score?"rgba(196,168,130,.28)":"rgba(255,255,255,.05)",border:`1px solid ${i<exam.score?"rgba(196,168,130,.5)":"rgba(255,255,255,.07)"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:i<exam.score?"#c4a882":"#3a3020"}}>{i<exam.score?"✓":"·"}</div>
                ))}
              </div>
              {goals.length>0&&(
                <div style={{paddingTop:16,borderTop:"1px solid rgba(255,255,255,.06)"}}>
                  <div style={{fontSize:11,letterSpacing:2,color:"#6a5a40",textTransform:"uppercase",marginBottom:10}}>Your goals</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center"}}>
                    {goals.map(gid=>{const g=GOALS.find(x=>x.id===gid);return g?<span key={gid} style={{fontSize:11,padding:"3px 10px",borderRadius:20,background:"rgba(196,168,130,.13)",color:"#c4a882",letterSpacing:1,textTransform:"uppercase"}}>{g.icon} {g.label}</span>:null;})}
                  </div>
                </div>
              )}
            </div>
            <div style={{display:"flex",gap:13,justifyContent:"center",flexWrap:"wrap"}}>
              <button className="gb" onClick={startExam} style={{background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.12)",borderRadius:12,padding:"13px 28px",color:"#c4a882",fontSize:14,cursor:"pointer"}}>Retake Exam</button>
              <PBtn onClick={startChat}>Begin My {lang?.name} Journey →</PBtn>
            </div>
            {!user&&<p style={{color:"#5a4a30",fontSize:12,marginTop:14}}>Sign in to save your chats across sessions</p>}
          </div>
        )}

        {/* CHAT */}
        {screen==="chat"&&(
          <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 60px)"}}>
            <div style={{padding:"13px 24px",borderBottom:"1px solid rgba(255,255,255,.07)",background:"rgba(8,8,16,.9)",backdropFilter:"blur(22px)",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
              <div style={{display:"flex",alignItems:"center",gap:13}}>
                <button onClick={()=>setScreen("home")} style={{background:"none",border:"none",color:"#6a5a40",cursor:"pointer",fontSize:18}}>←</button>
                <span style={{fontSize:22}}>{lang?.flag}</span>
                <div>
                  <div style={{fontSize:15,fontFamily:"'Playfair Display',serif",fontWeight:500}}>{lang?.name} Tutor</div>
                  <div style={{fontSize:11,color:"#6a5a40",letterSpacing:1}}>{level?.emoji} {level?.name}</div>
                </div>
              </div>
              <div style={{width:8,height:8,borderRadius:"50%",background:loading?"#f39c12":"#27ae60",boxShadow:`0 0 8px ${loading?"#f39c12":"#27ae60"}`,transition:"all .3s"}}/>
            </div>
            <div style={{flex:1,overflowY:"auto",padding:"26px 22px",maxWidth:760,width:"100%",margin:"0 auto",boxSizing:"border-box"}}>
              {msgs.map((m,i)=>(
                <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",marginBottom:20,animation:"fadeUp .3s ease both"}}>
                  {m.role==="assistant"&&<div style={{width:33,height:33,borderRadius:10,flexShrink:0,background:"linear-gradient(135deg,#c4a882,#8b6a3a)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,marginRight:11,marginTop:3}}>{lang?.flag}</div>}
                  <div style={{maxWidth:"76%",background:m.role==="user"?"linear-gradient(135deg,rgba(196,168,130,.18),rgba(139,106,58,.18))":"rgba(255,255,255,.05)",border:`1px solid ${m.role==="user"?"rgba(196,168,130,.27)":"rgba(255,255,255,.07)"}`,borderRadius:m.role==="user"?"20px 20px 4px 20px":"20px 20px 20px 4px",padding:"13px 17px",fontSize:14,lineHeight:1.78,color:"#e8dcc8",whiteSpace:"pre-wrap"}}>{m.content}</div>
                </div>
              ))}
              {loading&&(
                <div style={{display:"flex",alignItems:"center",gap:11,marginBottom:20}}>
                  <div style={{width:33,height:33,borderRadius:10,background:"linear-gradient(135deg,#c4a882,#8b6a3a)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}>{lang?.flag}</div>
                  <div style={{background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.07)",borderRadius:"20px 20px 20px 4px",padding:"13px 18px",display:"flex",gap:5}}>
                    {[0,1,2].map(j=><div key={j} style={{width:6,height:6,borderRadius:"50%",background:"#c4a882",animation:`bounce 1.2s ease-in-out ${j*.2}s infinite`}}/>)}
                  </div>
                </div>
              )}
              <div ref={chatEnd}/>
            </div>
            <div style={{padding:"13px 22px 18px",borderTop:"1px solid rgba(255,255,255,.07)",background:"rgba(8,8,16,.92)",backdropFilter:"blur(22px)",flexShrink:0}}>
              <div style={{maxWidth:760,margin:"0 auto",display:"flex",gap:11}}>
                <input ref={inputRef} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send()}
                  placeholder={`Type in English or ${lang?.name}…`} disabled={loading} className="fi"
                  style={{flex:1,background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.11)",borderRadius:12,padding:"13px 18px",color:"#e8dcc8",fontSize:14,fontFamily:"'Lato',sans-serif",transition:"border-color .2s"}}/>
                <button onClick={send} disabled={loading||!input.trim()}
                  style={{background:input.trim()&&!loading?"linear-gradient(135deg,#c4a882,#8b6a3a)":"rgba(255,255,255,.05)",border:"none",borderRadius:12,padding:"13px 21px",color:input.trim()&&!loading?"#080810":"#3a3020",cursor:input.trim()&&!loading?"pointer":"not-allowed",fontSize:18,fontWeight:700,transition:"all .2s"}}>→</button>
              </div>
              <div style={{textAlign:"center",marginTop:7,fontSize:11,color:"#3a3020",letterSpacing:.5}}>Press Enter · Type in English or {lang?.name}</div>
            </div>
          </div>
        )}

        {/* HISTORY */}
        {screen==="history"&&(
          <div className="fadeUp" style={{maxWidth:720,margin:"0 auto",padding:"48px 24px"}}>
            <button onClick={()=>setScreen("home")} style={{background:"none",border:"none",color:"#6a5a40",cursor:"pointer",fontSize:13,letterSpacing:2,textTransform:"uppercase",marginBottom:36,padding:0}}>← Back</button>
            <h2 style={{fontSize:34,fontFamily:"'Playfair Display',serif",fontWeight:500,margin:"0 0 8px"}}>My Chats</h2>
            <p style={{color:"#7a7060",marginBottom:30,fontSize:15}}>Pick up exactly where you left off.</p>
            {history.length===0&&<div style={{...F.card,padding:40,textAlign:"center",color:"#5a4a30"}}>No saved chats yet. Start a lesson to begin!</div>}
            <div style={{display:"flex",flexDirection:"column",gap:13}}>
              {history.map(c=>(
                <button key={c.id} className="hi" onClick={()=>openChat(c)}
                  style={{background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.07)",borderRadius:16,padding:"20px 26px",cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",justifyContent:"space-between",transition:"all .2s"}}>
                  <div style={{display:"flex",alignItems:"center",gap:15}}>
                    <span style={{fontSize:28}}>{c.flag}</span>
                    <div>
                      <div style={{fontSize:15,fontFamily:"'Playfair Display',serif",fontWeight:500,marginBottom:4,color:"#e8dcc8"}}>{c.langName}</div>
                      <div style={{fontSize:12,color:"#6a5a40",letterSpacing:.5}}>{c.levelName} · {c.messages?.length||0} messages</div>
                    </div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:12,color:"#5a4a30"}}>{new Date(c.updatedAt).toLocaleDateString("en-US",{month:"short",day:"numeric"})}</div>
                    <div style={{fontSize:12,color:"#c4a882",marginTop:4}}>Continue →</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// ── AUTH SCREEN ───────────────────────────────────────────────
function AuthScreen({onLogin,onBack,inp}) {
  const [mode,setMode]=useState("signin");
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [pass,setPass]=useState("");
  const [err,setErr]=useState("");
  const [loading,setLoading]=useState(false);

  const submit = async () => {
    setErr(""); setLoading(true);
    try {
      const key=`user:${email.toLowerCase().trim()}`;
      if(mode==="signup"){
        const ex=await sGet(key);
        if(ex){setErr("An account with this email already exists.");setLoading(false);return;}
        if(!name.trim()){setErr("Please enter your name.");setLoading(false);return;}
        if(pass.length<6){setErr("Password must be at least 6 characters.");setLoading(false);return;}
        const u={id:uid(),name:name.trim(),email:email.trim(),pass};
        await sSet(key,u); onLogin(u);
      } else {
        const u=await sGet(key);
        if(!u){setErr("No account found with this email.");setLoading(false);return;}
        if(u.pass!==pass){setErr("Incorrect password.");setLoading(false);return;}
        onLogin(u);
      }
    } catch {setErr("Something went wrong. Please try again.");}
    setLoading(false);
  };

  const FI = ({label,value,onChange,placeholder,type="text",onEnter}) => (
    <div>
      <label style={{fontSize:11,letterSpacing:2,color:"#8b6a3a",textTransform:"uppercase",marginBottom:7,display:"block"}}>{label}</label>
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        onKeyDown={e=>e.key==="Enter"&&onEnter?.()} className="fi"
        style={{...inp,width:"100%",boxSizing:"border-box"}}/>
    </div>
  );

  return(
    <div className="fadeUp" style={{maxWidth:420,margin:"0 auto",padding:"48px 24px"}}>
      <button onClick={onBack} style={{background:"none",border:"none",color:"#6a5a40",cursor:"pointer",fontSize:13,letterSpacing:2,textTransform:"uppercase",marginBottom:36,padding:0}}>← Back</button>
      <h2 style={{fontSize:34,fontFamily:"'Playfair Display',serif",fontWeight:500,margin:"0 0 8px"}}>{mode==="signin"?"Welcome back":"Create account"}</h2>
      <p style={{color:"#7a7060",fontSize:15,marginBottom:32,lineHeight:1.75}}>{mode==="signin"?"Sign in to access your saved chats and progress.":"Join LinguaAI — it's free."}</p>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        {mode==="signup"&&<FI label="Name" value={name} onChange={setName} placeholder="Your name"/>}
        <FI label="Email" value={email} onChange={setEmail} placeholder="you@example.com" type="email"/>
        <FI label="Password" value={pass} onChange={setPass} placeholder="••••••••" type="password" onEnter={submit}/>
        {err&&<div style={{fontSize:13,color:"#e74c3c",padding:"10px 14px",background:"rgba(231,76,60,.1)",borderRadius:9,border:"1px solid rgba(231,76,60,.22)"}}>{err}</div>}
        <button className="pb" onClick={submit} disabled={loading}
          style={{background:"linear-gradient(135deg,#c4a882,#8b6a3a)",border:"none",borderRadius:12,padding:"14px",color:"#080810",fontSize:15,cursor:"pointer",fontFamily:"'Playfair Display',serif",fontWeight:700,width:"100%",opacity:loading?.6:1,transition:"all .2s"}}>
          {loading?"…":mode==="signin"?"Sign In":"Create Account"}
        </button>
      </div>
      <p style={{textAlign:"center",marginTop:22,fontSize:14,color:"#6a5a40"}}>
        {mode==="signin"?"No account? ":"Already have one? "}
        <button onClick={()=>{setMode(m=>m==="signin"?"signup":"signin");setErr("");}}
          style={{background:"none",border:"none",color:"#c4a882",cursor:"pointer",fontFamily:"'Lato',sans-serif",fontSize:14}}>
          {mode==="signin"?"Sign up":"Sign in"}
        </button>
      </p>
    </div>
  );
}
