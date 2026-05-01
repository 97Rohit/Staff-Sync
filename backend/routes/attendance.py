from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from datetime import datetime, date

from database import get_db
from models import Attendance, Employee
from schemas import AttendanceCreate, AttendanceResponse, AttendanceWithEmployee

router = APIRouter(prefix="/api/attendance", tags=["Attendance"])


@router.post("/", response_model=AttendanceResponse, status_code=status.HTTP_201_CREATED)
def mark_attendance(attendance: AttendanceCreate, db: Session = Depends(get_db)):
    """Mark attendance for an employee"""
    # Check if employee exists
    employee = db.query(Employee).filter(Employee.employee_id == attendance.employee_id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID '{attendance.employee_id}' not found"
        )
    
    # Check if attendance already marked for this date
    existing = db.query(Attendance).filter(
        Attendance.employee_id == attendance.employee_id,
        Attendance.date == attendance.date
    ).first()
    
    if existing:
        # Update existing attendance
        existing.status = attendance.status.value
        existing.marked_at = datetime.utcnow()
        db.commit()
        db.refresh(existing)
        return existing
    
    # Create new attendance record
    db_attendance = Attendance(
        employee_id=attendance.employee_id,
        date=attendance.date,
        status=attendance.status.value
    )
    db.add(db_attendance)
    db.commit()
    db.refresh(db_attendance)
    return db_attendance


@router.get("/", response_model=List[AttendanceWithEmployee])
def get_all_attendance(
    start_date: Optional[str] = Query(None, pattern=r"^\d{4}-\d{2}-\d{2}$"),
    end_date: Optional[str] = Query(None, pattern=r"^\d{4}-\d{2}-\d{2}$"),
    db: Session = Depends(get_db)
):
    """Get all attendance records with optional date filtering"""
    query = db.query(Attendance, Employee.full_name).join(
        Employee, Attendance.employee_id == Employee.employee_id
    )
    
    if start_date:
        query = query.filter(Attendance.date >= start_date)
    if end_date:
        query = query.filter(Attendance.date <= end_date)
    
    results = query.order_by(Attendance.date.desc(), Attendance.marked_at.desc()).all()
    
    attendance_list = []
    for attendance, employee_name in results:
        att_dict = {
            "id": attendance.id,
            "employee_id": attendance.employee_id,
            "date": attendance.date,
            "status": attendance.status,
            "marked_at": attendance.marked_at,
            "employee_name": employee_name
        }
        attendance_list.append(att_dict)
    
    return attendance_list


@router.get("/employee/{employee_id}", response_model=List[AttendanceResponse])
def get_employee_attendance(
    employee_id: str,
    start_date: Optional[str] = Query(None, pattern=r"^\d{4}-\d{2}-\d{2}$"),
    end_date: Optional[str] = Query(None, pattern=r"^\d{4}-\d{2}-\d{2}$"),
    db: Session = Depends(get_db)
):
    """Get attendance records for a specific employee"""
    # Check if employee exists
    employee = db.query(Employee).filter(Employee.employee_id == employee_id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID '{employee_id}' not found"
        )
    
    query = db.query(Attendance).filter(Attendance.employee_id == employee_id)
    
    if start_date:
        query = query.filter(Attendance.date >= start_date)
    if end_date:
        query = query.filter(Attendance.date <= end_date)
    
    attendance = query.order_by(Attendance.date.desc()).all()
    return attendance


@router.get("/stats/employee/{employee_id}")
def get_employee_attendance_stats(employee_id: str, db: Session = Depends(get_db)):
    """Get attendance statistics for a specific employee"""
    # Check if employee exists
    employee = db.query(Employee).filter(Employee.employee_id == employee_id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID '{employee_id}' not found"
        )
    
    total_present = db.query(Attendance).filter(
        Attendance.employee_id == employee_id,
        Attendance.status == "Present"
    ).count()
    
    total_absent = db.query(Attendance).filter(
        Attendance.employee_id == employee_id,
        Attendance.status == "Absent"
    ).count()
    
    return {
        "employee_id": employee_id,
        "employee_name": employee.full_name,
        "total_present": total_present,
        "total_absent": total_absent,
        "total_records": total_present + total_absent
    }
