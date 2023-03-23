export const employeePostBodySchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "id": "/EmployeeSchema",
    "type": "object",
    "properties": {
        "full_name": {
            "type": "string",
            "minLength": 2
        },
        "date_of_birth": {
            "type": "string",
            "format": "date"
        },
        "contact_information": {
            "id": "/ContactInformation",
            "type": "object",
            "properties": {
                "phone": {
                    "type": "string",
                    "format": "phone"
                },
                "personal_email": {
                    "type": "string",
                    "format": "email"
                },
                "work_email": {
                    "type": "string",
                    "format": "email"
                },
                "street": {
                    "type": "string"
                }
            },
            "required": ["phone", "work_email", "personal_email"]
        },
        "hire_date": {
            "type":"string",
            "format": "date"
        },
        "department": {
            "type": "string",
            "minLength": 1
        },
        "job_title": {
            "type": "string",
            "minLength": 2
        }
    },
    "required": ["full_name", "contact_information", "job_title", "department", "date_of_birth", "hire_date"]
}