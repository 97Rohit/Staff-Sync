from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date

from database import get_db
from models import Employee, Attendance

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


@router.get("/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    """Get dashboard statistics"""
    today = date.today().isoformat()
    
    # Total employees
    total_employees = db.query(Employee).count()
    
    # Today's attendance
    present_today = db.query(Attendance).filter(
        Attendance.date == today,
        Attendance.status == "Present"
    ).count()
    
    absent_today = db.query(Attendance).filter(
        Attendance.date == today,
        Attendance.status == "Absent"
    ).count()
    
    # Department breakdown
    departments = db.query(
        Employee.department,
        func.count(Employee.id).label('count')
    ).group_by(Employee.department).all()
    
    department_list = [{"name": d[0], "count": d[1]} for d in departments]
    
    # Recent attendance (last 5)
    recent_attendance = db.query(Attendance, Employee.full_name).join(
        Employee, Attendance.employee_id == Employee.employee_id
    ).order_by(Attendance.marked_at.desc()).limit(5).all()
    
    recent_list = [{
        "employee_name": emp_name,
        "date": att.date,
        "status": att.status
    } for att, emp_name in recent_attendance]
    
    return {
        "total_employees": total_employees,
        "present_today": present_today,
        "absent_today": absent_today,
        "unmarked_today": total_employees - present_today - absent_today,
        "departments": department_list,
        "recent_attendance": recent_list
    }
