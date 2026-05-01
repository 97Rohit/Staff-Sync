from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional, List
from datetime import datetime
from enum import Enum


class AttendanceStatusEnum(str, Enum):
    PRESENT = "Present"
    ABSENT = "Absent"


# Employee Schemas
class EmployeeBase(BaseModel):
    employee_id: str = Field(..., min_length=1, max_length=50, description="Unique employee ID")
    full_name: str = Field(..., min_length=1, max_length=100, description="Full name of employee")
    email: EmailStr = Field(..., description="Valid email address")
    department: str = Field(..., min_length=1, max_length=100, description="Department name")

    @field_validator('employee_id', 'full_name', 'department')
    @classmethod
    def not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('Field cannot be empty or whitespace')
        return v.strip()


class EmployeeCreate(EmployeeBase):
    pass


class EmployeeResponse(EmployeeBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# Attendance Schemas
class AttendanceBase(BaseModel):
    employee_id: str = Field(..., description="Employee ID")
    date: str = Field(..., pattern=r"^\d{4}-\d{2}-\d{2}$", description="Date in YYYY-MM-DD format")
    status: AttendanceStatusEnum = Field(..., description="Attendance status")

    @field_validator('date')
    @classmethod
    def validate_date(cls, v):
        try:
            datetime.strptime(v, '%Y-%m-%d')
            return v
        except ValueError:
            raise ValueError('Invalid date format. Use YYYY-MM-DD')


class AttendanceCreate(AttendanceBase):
    pass


class AttendanceResponse(AttendanceBase):
    id: int
    marked_at: datetime

    class Config:
        from_attributes = True


class AttendanceWithEmployee(AttendanceResponse):
    employee_name: Optional[str] = None


# Dashboard Schema
class DashboardStats(BaseModel):
    total_employees: int
    total_present_today: int
    total_absent_today: int
    departments: List[dict]


# Error Response Schema
class ErrorResponse(BaseModel):
    detail: str
