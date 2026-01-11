export interface Student {
  id: string;
  name: string;
  class: string;
  grades: {
    subject: string;
    grade: number;
    date: string;
  }[];
  attendance: {
    date: string;
    present: boolean;
  }[];
}

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  salary: number;
  attendance: {
    date: string;
    arrivalTime: string;
    present: boolean;
  }[];
}

export const students: Student[] = [
  {
    id: "1",
    name: "Kamolov Dilyor",
    class: "9-A",
    grades: [
      { subject: "Matematika", grade: 5, date: "2024-01-10" },
      { subject: "Ona tili", grade: 4, date: "2024-01-10" },
      { subject: "Ingliz tili", grade: 5, date: "2024-01-11" },
      { subject: "Fizika", grade: 4, date: "2024-01-11" },
      { subject: "Kimyo", grade: 5, date: "2024-01-12" },
    ],
    attendance: [
      { date: "2024-01-10", present: true },
      { date: "2024-01-11", present: true },
      { date: "2024-01-12", present: false },
      { date: "2024-01-13", present: true },
      { date: "2024-01-14", present: true },
    ],
  },
  {
    id: "2",
    name: "Jo'rayev Husayn",
    class: "9-A",
    grades: [
      { subject: "Matematika", grade: 4, date: "2024-01-10" },
      { subject: "Ona tili", grade: 5, date: "2024-01-10" },
      { subject: "Ingliz tili", grade: 4, date: "2024-01-11" },
      { subject: "Fizika", grade: 3, date: "2024-01-11" },
      { subject: "Kimyo", grade: 4, date: "2024-01-12" },
    ],
    attendance: [
      { date: "2024-01-10", present: true },
      { date: "2024-01-11", present: false },
      { date: "2024-01-12", present: true },
      { date: "2024-01-13", present: true },
      { date: "2024-01-14", present: true },
    ],
  },
  {
    id: "3",
    name: "Aliyeva Madina",
    class: "9-B",
    grades: [
      { subject: "Matematika", grade: 5, date: "2024-01-10" },
      { subject: "Ona tili", grade: 5, date: "2024-01-10" },
      { subject: "Ingliz tili", grade: 5, date: "2024-01-11" },
      { subject: "Fizika", grade: 5, date: "2024-01-11" },
      { subject: "Kimyo", grade: 4, date: "2024-01-12" },
    ],
    attendance: [
      { date: "2024-01-10", present: true },
      { date: "2024-01-11", present: true },
      { date: "2024-01-12", present: true },
      { date: "2024-01-13", present: true },
      { date: "2024-01-14", present: true },
    ],
  },
  {
    id: "4",
    name: "Toshmatov Sardor",
    class: "10-A",
    grades: [
      { subject: "Matematika", grade: 3, date: "2024-01-10" },
      { subject: "Ona tili", grade: 4, date: "2024-01-10" },
      { subject: "Ingliz tili", grade: 3, date: "2024-01-11" },
      { subject: "Fizika", grade: 4, date: "2024-01-11" },
      { subject: "Kimyo", grade: 3, date: "2024-01-12" },
    ],
    attendance: [
      { date: "2024-01-10", present: false },
      { date: "2024-01-11", present: true },
      { date: "2024-01-12", present: true },
      { date: "2024-01-13", present: false },
      { date: "2024-01-14", present: true },
    ],
  },
  {
    id: "5",
    name: "Rahimova Gulnora",
    class: "10-A",
    grades: [
      { subject: "Matematika", grade: 4, date: "2024-01-10" },
      { subject: "Ona tili", grade: 5, date: "2024-01-10" },
      { subject: "Ingliz tili", grade: 4, date: "2024-01-11" },
      { subject: "Fizika", grade: 4, date: "2024-01-11" },
      { subject: "Kimyo", grade: 5, date: "2024-01-12" },
    ],
    attendance: [
      { date: "2024-01-10", present: true },
      { date: "2024-01-11", present: true },
      { date: "2024-01-12", present: true },
      { date: "2024-01-13", present: true },
      { date: "2024-01-14", present: false },
    ],
  },
];

export const teachers: Teacher[] = [
  {
    id: "1",
    name: "Dilnoza Pirmatova",
    subject: "Matematika",
    salary: 4500000,
    attendance: [
      { date: "2024-01-10", arrivalTime: "08:00", present: true },
      { date: "2024-01-11", arrivalTime: "08:15", present: true },
      { date: "2024-01-12", arrivalTime: "08:05", present: true },
      { date: "2024-01-13", arrivalTime: "08:00", present: true },
      { date: "2024-01-14", arrivalTime: "-", present: false },
    ],
  },
  {
    id: "2",
    name: "Rashida Nursaidova",
    subject: "Ona tili",
    salary: 4200000,
    attendance: [
      { date: "2024-01-10", arrivalTime: "07:55", present: true },
      { date: "2024-01-11", arrivalTime: "08:00", present: true },
      { date: "2024-01-12", arrivalTime: "08:10", present: true },
      { date: "2024-01-13", arrivalTime: "08:00", present: true },
      { date: "2024-01-14", arrivalTime: "08:05", present: true },
    ],
  },
  {
    id: "3",
    name: "Go'zal Husanova",
    subject: "Ingliz tili",
    salary: 4800000,
    attendance: [
      { date: "2024-01-10", arrivalTime: "08:00", present: true },
      { date: "2024-01-11", arrivalTime: "-", present: false },
      { date: "2024-01-12", arrivalTime: "08:20", present: true },
      { date: "2024-01-13", arrivalTime: "08:00", present: true },
      { date: "2024-01-14", arrivalTime: "08:00", present: true },
    ],
  },
  {
    id: "4",
    name: "Anvar Karimov",
    subject: "Fizika",
    salary: 4300000,
    attendance: [
      { date: "2024-01-10", arrivalTime: "08:00", present: true },
      { date: "2024-01-11", arrivalTime: "08:00", present: true },
      { date: "2024-01-12", arrivalTime: "08:00", present: true },
      { date: "2024-01-13", arrivalTime: "08:25", present: true },
      { date: "2024-01-14", arrivalTime: "08:00", present: true },
    ],
  },
  {
    id: "5",
    name: "Shirin Abdullayeva",
    subject: "Kimyo",
    salary: 4100000,
    attendance: [
      { date: "2024-01-10", arrivalTime: "08:00", present: true },
      { date: "2024-01-11", arrivalTime: "08:00", present: true },
      { date: "2024-01-12", arrivalTime: "-", present: false },
      { date: "2024-01-13", arrivalTime: "08:00", present: true },
      { date: "2024-01-14", arrivalTime: "08:15", present: true },
    ],
  },
];

export const subjects = [
  "Matematika",
  "Ona tili",
  "Ingliz tili",
  "Fizika",
  "Kimyo",
  "Biologiya",
  "Tarix",
  "Geografiya",
];

export const classes = ["9-A", "9-B", "10-A", "10-B", "11-A", "11-B"];
