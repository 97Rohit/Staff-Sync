import { useState, useEffect } from 'react';
import { employeeAPI } from '../api';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Toast from '../components/Toast';

function Employees() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const [formData, setFormData] = useState({
        employee_id: '',
        full_name: '',
        email: '',
        department: ''
    });
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const response = await employeeAPI.getAll();
            setEmployees(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to load employees');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.employee_id.trim()) errors.employee_id = 'Employee ID is required';
        if (!formData.full_name.trim()) errors.full_name = 'Full name is required';
        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = 'Invalid email format';
        }
        if (!formData.department.trim()) errors.department = 'Department is required';
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            setIsSubmitting(true);
            await employeeAPI.create(formData);
            showToast('Employee added successfully!');
            setIsModalOpen(false);
            setFormData({ employee_id: '', full_name: '', email: '', department: '' });
            fetchEmployees();
        } catch (err) {
            const errorMessage = err.response?.data?.detail || 'Failed to add employee';
            showToast(errorMessage, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (employeeId) => {
        try {
            await employeeAPI.delete(employeeId);
            showToast('Employee deleted successfully!');
            setDeleteConfirm(null);
            fetchEmployees();
        } catch (err) {
            const errorMessage = err.response?.data?.detail || 'Failed to delete employee';
            showToast(errorMessage, 'error');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    if (loading) return <LoadingSpinner message="Loading employees..." />;

    return (
        <div>
            <div className="header-actions">
                <div className="page-header" style={{ marginBottom: 0 }}>
                    <h2>Employees</h2>
                    <p>Manage your organization's employees</p>
                </div>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    ➕ Add Employee
                </button>
            </div>

            {error && (
                <div className="error-state" style={{ marginBottom: '1.5rem' }}>
                    <span>⚠️</span>
                    <span>{error}</span>
                    <button className="btn btn-secondary btn-sm" onClick={fetchEmployees}>Retry</button>
                </div>
            )}

            {employees.length === 0 ? (
                <EmptyState
                    icon="👥"
                    title="No employees yet"
                    message="Add your first employee to get started"
                    action={
                        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                            ➕ Add Employee
                        </button>
                    }
                />
            ) : (
                <div className="employee-grid">
                    {employees.map(employee => (
                        <div key={employee.employee_id} className="employee-card">
                            <div className="employee-card-header">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div className="employee-avatar">
                                        {employee.full_name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="employee-info">
                                        <h4>{employee.full_name}</h4>
                                        <p>{employee.employee_id}</p>
                                    </div>
                                </div>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => setDeleteConfirm(employee)}
                                >
                                    🗑️
                                </button>
                            </div>
                            <div className="employee-meta">
                                <span>📧 {employee.email}</span>
                                <span>🏢 {employee.department}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Employee Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setFormData({ employee_id: '', full_name: '', email: '', department: '' });
                    setFormErrors({});
                }}
                title="Add New Employee"
            >
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Employee ID *</label>
                        <input
                            type="text"
                            name="employee_id"
                            className="form-control"
                            placeholder="e.g., EMP001"
                            value={formData.employee_id}
                            onChange={handleInputChange}
                        />
                        {formErrors.employee_id && <small style={{ color: '#f45c43' }}>{formErrors.employee_id}</small>}
                    </div>

                    <div className="form-group">
                        <label>Full Name *</label>
                        <input
                            type="text"
                            name="full_name"
                            className="form-control"
                            placeholder="Enter full name"
                            value={formData.full_name}
                            onChange={handleInputChange}
                        />
                        {formErrors.full_name && <small style={{ color: '#f45c43' }}>{formErrors.full_name}</small>}
                    </div>

                    <div className="form-group">
                        <label>Email Address *</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            placeholder="employee@company.com"
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                        {formErrors.email && <small style={{ color: '#f45c43' }}>{formErrors.email}</small>}
                    </div>

                    <div className="form-group">
                        <label>Department *</label>
                        <select
                            name="department"
                            className="form-control"
                            value={formData.department}
                            onChange={handleInputChange}
                        >
                            <option value="">Select Department</option>
                            <option value="Engineering">Engineering</option>
                            <option value="Human Resources">Human Resources</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Sales">Sales</option>
                            <option value="Finance">Finance</option>
                            <option value="Operations">Operations</option>
                            <option value="Design">Design</option>
                            <option value="Product">Product</option>
                        </select>
                        {formErrors.department && <small style={{ color: '#f45c43' }}>{formErrors.department}</small>}
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? 'Adding...' : 'Add Employee'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={!!deleteConfirm}
                onClose={() => setDeleteConfirm(null)}
                title="Delete Employee"
            >
                <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                    Are you sure you want to delete <strong>{deleteConfirm?.full_name}</strong>?
                    This action cannot be undone and will also delete all attendance records.
                </p>
                <div className="modal-actions">
                    <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>
                        Cancel
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm?.employee_id)}>
                        Delete
                    </button>
                </div>
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

export default Employees;
