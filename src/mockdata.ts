import { ExamAnalysisResponse } from "./types";

export const mockExamData: ExamAnalysisResponse = {
  examId: "1",
  examName: "CPC 2025 Mock 4",
  questions:[
  {
    _id: "4",
    question: "Which keyword is used to declare a variable in JavaScript?",
    option_1: "var",
    option_2: "int",
    option_3: "string",
    option_4: "define",
    answer: "option_1",
    explanation: "The 'var' keyword can be used to declare variables in JavaScript.",
    status: "wrong"
  },
  {
    _id: "5",
    question: "Which company developed React?",
    option_1: "Google",
    option_2: "Facebook",
    option_3: "Microsoft",
    option_4: "Amazon",
    answer: "option_2",
    explanation: "React was developed by Facebook (now Meta).",
    status: "notSubmitted"
  },
  {
    _id: "6",
    question: "Which HTML tag is used to create a hyperlink?",
    option_1: "<link>",
    option_2: "<a>",
    option_3: "<href>",
    option_4: "<url>",
    answer: "option_2",
    explanation: "The anchor tag <a> is used to create hyperlinks.",
    status: "notSubmitted"
  },
  {
    _id: "7",
    question: "Which CSS property changes text color?",
    option_1: "font-color",
    option_2: "background",
    option_3: "color",
    option_4: "text-style",
    answer: "option_3",
    explanation: "The color property changes the color of text.",
    status: "notSubmitted"
  },
  {
    _id: "8",
    question: "Which method converts JSON text into a JavaScript object?",
    option_1: "JSON.parse()",
    option_2: "JSON.stringify()",
    option_3: "JSON.convert()",
    option_4: "JSON.object()",
    answer: "option_1",
    explanation: "JSON.parse() converts JSON strings into JavaScript objects.",
    status: "notSubmitted"
  },
  {
    _id: "9",
    question: "Which symbol is used for comments in JavaScript?",
    option_1: "#",
    option_2: "//",
    option_3: "<!-- -->",
    option_4: "**",
    answer: "option_2",
    explanation: "Single-line comments use // in JavaScript.",
    status: "notSubmitted"
  },
  {
    _id: "10",
    question: "Which hook is used for state management in React?",
    option_1: "useFetch",
    option_2: "useData",
    option_3: "useState",
    option_4: "useStore",
    answer: "option_3",
    explanation: "useState is the React hook used to manage component state.",
    status: "notSubmitted"
  },
  {
    _id: "11",
    question: "Which operator is used for strict equality in JavaScript?",
    option_1: "=",
    option_2: "==",
    option_3: "===",
    option_4: "!==",
    answer: "option_3",
    explanation: "=== checks both value and type equality.",
    status: "notSubmitted"
  },
  {
    _id: "12",
    question: "What does CSS stand for?",
    option_1: "Creative Style Sheets",
    option_2: "Cascading Style Sheets",
    option_3: "Computer Style Sheets",
    option_4: "Colorful Style Sheets",
    answer: "option_2",
    explanation: "CSS stands for Cascading Style Sheets.",
    status: "notSubmitted"
  },
  {
    _id: "13",
    question: "Which HTML element is used for the largest heading?",
    option_1: "<h6>",
    option_2: "<heading>",
    option_3: "<head>",
    option_4: "<h1>",
    answer: "option_4",
    explanation: "The <h1> tag represents the largest heading.",
    status: "notSubmitted"
  },
  {
    _id: "14",
    question: "Which JavaScript method adds an element to the end of an array?",
    option_1: "push()",
    option_2: "pop()",
    option_3: "shift()",
    option_4: "unshift()",
    answer: "option_1",
    explanation: "push() adds one or more elements to the end of an array.",
    status: "right"
  },
  {
    _id: "15",
    question: "Which React hook is used for side effects?",
    option_1: "useState",
    option_2: "useEffect",
    option_3: "useReducer",
    option_4: "useMemo",
    answer: "option_2",
    explanation: "useEffect handles side effects in React components.",
    status: "notSubmitted"
  },
  {
    _id: "16",
    question: "What is the default port for HTTP?",
    option_1: "8080",
    option_2: "21",
    option_3: "80",
    option_4: "443",
    answer: "option_3",
    explanation: "HTTP uses port 80 by default.",
    status: "notSubmitted"
  },
  {
    _id: "17",
    question: "Which protocol is secure HTTP?",
    option_1: "FTP",
    option_2: "HTTPS",
    option_3: "SMTP",
    option_4: "TCP",
    answer: "option_2",
    explanation: "HTTPS is the secure version of HTTP.",
    status: "notSubmitted"
  },
  {
    _id: "18",
    question: "Which database is NoSQL?",
    option_1: "MySQL",
    option_2: "PostgreSQL",
    option_3: "MongoDB",
    option_4: "Oracle",
    answer: "option_3",
    explanation: "MongoDB is a popular NoSQL database.",
    status: "notSubmitted"
  },
  {
    _id: "19",
    question: "Which method removes the last element from an array?",
    option_1: "push()",
    option_2: "shift()",
    option_3: "splice()",
    option_4: "pop()",
    answer: "option_4",
    explanation: "pop() removes the last array element.",
    status: "notSubmitted"
  },
  {
    _id: "20",
    question: "Which company created Java?",
    option_1: "Sun Microsystems",
    option_2: "Google",
    option_3: "IBM",
    option_4: "Apple",
    answer: "option_1",
    explanation: "Java was originally developed by Sun Microsystems.",
    status: "notSubmitted"
  },
  {
    _id: "21",
    question: "What is JSX in React?",
    option_1: "Java Syntax Extension",
    option_2: "JavaScript XML",
    option_3: "JSON XML",
    option_4: "Java Extended Syntax",
    answer: "option_2",
    explanation: "JSX stands for JavaScript XML.",
    status: "notSubmitted"
  },
  {
    _id: "22",
    question: "Which keyword creates a constant in JavaScript?",
    option_1: "const",
    option_2: "let",
    option_3: "var",
    option_4: "static",
    answer: "option_1",
    explanation: "const creates variables that cannot be reassigned.",
    status: "notSubmitted"
  },
  {
    _id: "23",
    question: "Which HTML tag is used to insert an image?",
    option_1: "<picture>",
    option_2: "<src>",
    option_3: "<img>",
    option_4: "<image>",
    answer: "option_3",
    explanation: "The <img> tag is used to display images.",
    status: "notSubmitted"
  },
  {
    _id: "24",
    question: "What does API stand for?",
    option_1: "Application Programming Interface",
    option_2: "Advanced Programming Interface",
    option_3: "Application Process Integration",
    option_4: "Automated Program Interface",
    answer: "option_1",
    explanation: "API stands for Application Programming Interface.",
    status: "notSubmitted"
  },
  {
    _id: "25",
    question: "Which array method creates a new array by transforming elements?",
    option_1: "forEach()",
    option_2: "map()",
    option_3: "filter()",
    option_4: "find()",
    answer: "option_2",
    explanation: "map() returns a new array with transformed values.",
    status: "notSubmitted"
  },
  {
    _id: "26",
    question: "Which CSS property controls element spacing inside the border?",
    option_1: "margin",
    option_2: "spacing",
    option_3: "padding",
    option_4: "border-spacing",
    answer: "option_3",
    explanation: "Padding defines space between content and border.",
    status: "notSubmitted"
  },
  {
    _id: "27",
    question: "Which React hook optimizes expensive calculations?",
    option_1: "useMemo",
    option_2: "useEffect",
    option_3: "useState",
    option_4: "useRef",
    answer: "option_1",
    explanation: "useMemo memoizes expensive calculations.",
    status: "notSubmitted"
  },
  {
    _id: "28",
    question: "What does SQL stand for?",
    option_1: "Structured Query Language",
    option_2: "Simple Query Language",
    option_3: "System Query Language",
    option_4: "Standard Question Language",
    answer: "option_1",
    explanation: "SQL stands for Structured Query Language.",
    status: "notSubmitted"
  },
  {
    _id: "29",
    question: "Which HTTP method is used to retrieve data?",
    option_1: "POST",
    option_2: "PUT",
    option_3: "GET",
    option_4: "DELETE",
    answer: "option_3",
    explanation: "GET requests are used to fetch data.",
    status: "notSubmitted"
  },
  {
    _id: "30",
    question: "Which keyword is used to define a class in Java?",
    option_1: "object",
    option_2: "class",
    option_3: "struct",
    option_4: "define",
    answer: "option_2",
    explanation: "The class keyword defines a class in Java.",
    status: "notSubmitted"
  },
  {
    _id: "31",
    question: "Which lifecycle replacement hook is commonly used in React functional components?",
    option_1: "useEffect",
    option_2: "useState",
    option_3: "useRef",
    option_4: "useMemo",
    answer: "option_1",
    explanation: "useEffect replaces many lifecycle methods in functional components.",
    status: "notSubmitted"
  },
  {
    _id: "32",
    question: "Which data type represents true or false values?",
    option_1: "String",
    option_2: "Number",
    option_3: "Boolean",
    option_4: "Object",
    answer: "option_3",
    explanation: "Boolean values can only be true or false.",
    status: "notSubmitted"
  },
  {
    _id: "33",
    question: "Which operator is used to spread array elements?",
    option_1: "...",
    option_2: "=>",
    option_3: "::",
    option_4: "??",
    answer: "option_1",
    explanation: "The spread operator (...) expands iterable elements.",
    status: "notSubmitted"
  }
]
};


export const passingYears = [
    1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999,
    2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009,
    2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019,
    2020, 2021, 2022, 2023, 2024, 2025, 2026,
];

export const genderOptions = [
    "MALE",
    "FEMALE",
    "OTHER"
]

export const yesNoOption = [
    "Yes",
    "No",
];


export const preferredProfiles = [
    "Medical Coder",
    "Medical Coding Executive",
    "Certified Medical Coder (CPC)",
    "Medical Billing Executive",
    "Medical Biller",
    "AR Calling Executive",
    "Revenue Cycle Management (RCM) Executive",
    "Medical Coding Trainee",
    "Trainee Medical Coder",
    "Coding Auditor",
    "Coding Specialist",
    "Medical Records Reviewer (MRR)",
    "Clinical Documentation Specialist",
    "Healthcare Process Associate (Non-Voice)",
    "Healthcare Operations Executive",
    "Medical Transcriptionist",
    "Healthcare Data Entry Operator",
    "Medical Data Analyst",
    "Clinical Data Coordinator",
    "Clinical Data Management Executive",
    "Clinical Research Coordinator",
    "Clinical Research Associate (CRA)",
    "Clinical Trial Assistant (CTA)",
    "Pharmacovigilance Associate",
    "Drug Safety Associate",
    "Regulatory Affairs Executive",
    "Medical Writer",
    "Clinical Operations Executive",
    "Quality Analyst (Healthcare)",
    "Medical QA Analyst",
    "Process Specialist (Healthcare)",
    "Insurance Verification Executive",
    "Denial Management Executive",
    "Charge Entry Executive",
];

export const preferredLocations = [
    "Bengaluru",
    "Hyderabad",
    "Chennai",
    "Pune",
    "Mumbai",
    "Navi Mumbai",
    "Noida",
    "Gurugram",
    "Pan India",


]