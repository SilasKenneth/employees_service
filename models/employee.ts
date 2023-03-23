import {UUID} from "crypto";
import {Contact} from "./contact";

export interface Employee {
    emp_id: string | undefined;
    full_name: string | undefined;
    gender: Gender | undefined;

    department: Department | undefined;
    hire_date: Date | undefined;

    contact_information: Contact | undefined;
    job_title: JobTitle | undefined;

    date_of_birth: Date | undefined;
}

let emp: Employee = {
    contact_information: {
        phone: "+254791350402",
        personal_email: "silaskenn@gmail.com",
        street: "Tom Mboya Street",
        work_email: "komondi@microsoft.com"
    },
    date_of_birth: new Date('1995-12-12'),
    department: "Engineering",
    emp_id: crypto.randomUUID().toString(),
    full_name: "Kenneth Omondi",
    gender: "Male",
    hire_date: new Date("2022-12-12"),
    job_title: "Software Engineer"
}
emp.gender = "Male";

export type Gender = "Male" | "Female" | "Unknown";
export type Department = 'Engineering' | 'Sales' | 'Marketing' | 'Design' | 'HR';
export type JobTitle = 'Software Engineer' | 'UX Designer' | 'CEO' | 'CTO' | 'CFO';