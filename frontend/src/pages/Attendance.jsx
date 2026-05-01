import { useState, useEffect } from 'react';
import { attendanceAPI, employeeAPI } from '../api';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Toast from '../components/Toast';

function Attendance() {
    const [attendance, setAttendance] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState(null);

    // Filters
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const [formData, setFormData] = useState({
        employee_id: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Present'
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [attendanceRes, employeesRes] = await Promise.all([
                attendanceAPI.getAll(startDate, endDate),
                employeeAPI.getAll()
            ]);
            setAttendance(attendanceRes.data);
            setEmployees(employeesRes.data);
            setError(null);
        } catch (err) {
            setError('Failed to load data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleFilter = async () => {
        try {
            setLoading(true);
            const response = await attendanceAPI.getAll(startDate, endDate);
            setAttendance(response.data);
        } catch (err) {
            setError('Failed to filter attendance');
        } finally {
            setLoading(false);
        }
    };

    const clearFilters = () => {
        setStartDate('');
        setEndDate('');
        fetchData();
    };

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.employee_id || !formData.date || !formData.status) {
            showToast('Please fill all fields', 'error');
            return;
        }

        try {
            setIsSubmitting(true);
            await attendanceAPI.mark(formData);
            showToast('Attendance marked successfully!');
            setIsModalOpen(false);
            setFormData({
                employee_id: '',
                date: new Date().toISOString().split('T')[0],
                status: 'Present'
            });
            fetchData();
        } catch (err) {
            const errorMessage = err.response?.data?.detail || 'Failed to mark attendance';
            showToast(errorMessage, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <LoadingSpinner message="Loading attendance..." />;

    return (
        <div>
            <div className="header-actions">
                <div className="page-header" style={{ marginBottom: 0 }}>
                    <h2>Attendance</h2>
                    <p>Track and manage employee attendance</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => setIsModalOpen(true)}
                    disabled={employees.length === 0}
                >
                    ➕ Mark Attendance
                </button>
            </div>

            {error && (
                <div className="error-state" style={{ marginBottom: '1.5rem' }}>
                    <span>⚠️</span>
                    <span>{error}</span>
                    <button className="btn btn-secondary btn-sm" onClick={fetchData}>Retry</button>
                </div>
            )}

            {/* Filter Section */}
            <div className="filter-section">
                <div className="form-group">
                    <label>Start Date</label>
                    <input
                        type="date"
                        className="form-control"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>End Date</label>
                    <input
                        type="date"
                        className="form-control"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-primary btn-sm" onClick={handleFilter}>
                        🔍 Filter
                    </button>
                    <button className="btn btn-secondary btn-sm" onClick={clearFilters}>
                        ✕ Clear
                    </button>
                </div>
            </div>

            {employees.length === 0 ? (
                <EmptyState
                    icon="👥"
                    title="No employees found"
                    message="Add employees first to mark their attendance"
                />
            ) : attendance.length === 0 ? (
                <EmptyState
                    icon="📅"
                    title="No attendance records"
                    message="Start marking attendance for your employees"
                    action={
                        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                            ➕ Mark Attendance
                        </button>
                    }
                />
            ) : (
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Employee</th>
                                <th>Employee ID</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Marked At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendance.map((record) => (
                                <tr key={record.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div className="employee-avatar" style={{ width: '35px', height: '35px', fontSize: '0.9rem' }}>
                                                {record.employee_name?.charAt(0) || 'E'}
                                            </div>
                                            <span>{record.employee_name}</span>
                                        </div>
                                    </td>
                                    <td>{record.employee_id}</td>
                                    <td>{record.date}</td>
                                    <td>
                                        <span className={`badge ${record.status === 'Present' ? 'badge-success' : 'badge-danger'}`}>
                                            {record.status}
                                        </span>
                                    </td>
                                    <td style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                        {new Date(record.marked_at).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Mark Attendance Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setFormData({
                        employee_id: '',
                        date: new Date().toISOString().split('T')[0],
                        status: 'Present'
                    });
                }}
                title="Mark Attendance"
            >
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Employee *</label>
                        <select
                            className="form-control"
                            value={formData.employee_id}
                            onChange={(e) => setFormData(prev => ({ ...prev, employee_id: e.target.value }))}
                        >
                            <option value="">Select Employee</option>
                            {employees.map(emp => (
                                <option key={emp.employee_id} value={emp.employee_id}>
                                    {emp.full_name} ({emp.employee_id})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Date *</label>
                        <input
                            type="date"
                            className="form-control"
                            value={formData.date}
                            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                        />
                    </div>

                    <div className="form-group">
                        <label>Status *</label>
                        <select
                            className="form-control"
                            value={formData.status}
                            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                        >
                            <option value="Present">Present</option>
                            <option value="Absent">Absent</option>
                        </select>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? 'Marking...' : 'Mark Attendance'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Toast */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}

export default Attendance;
