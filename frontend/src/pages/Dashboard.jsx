import { useState, useEffect } from 'react';
import { dashboardAPI } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';

function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const response = await dashboardAPI.getStats();
            setStats(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to load dashboard data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner message="Loading dashboard..." />;

    if (error) {
        return (
            <div className="error-state">
                <span>⚠️</span>
                <span>{error}</span>
                <button className="btn btn-secondary btn-sm" onClick={fetchStats}>Retry</button>
            </div>
        );
    }

    return (
        <div>
            <div className="page-header">
                <h2>Dashboard</h2>
                <p>Overview of your HR management system</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon primary">👥</div>
                    <div className="stat-content">
                        <h3>{stats?.total_employees || 0}</h3>
                        <p>Total Employees</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon success">✓</div>
                    <div className="stat-content">
                        <h3>{stats?.present_today || 0}</h3>
                        <p>Present Today</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon danger">✕</div>
                    <div className="stat-content">
                        <h3>{stats?.absent_today || 0}</h3>
                        <p>Absent Today</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon secondary">⏳</div>
                    <div className="stat-content">
                        <h3>{stats?.unmarked_today || 0}</h3>
                        <p>Unmarked Today</p>
                    </div>
                </div>
            </div>

            <div className="card">
                <h3 style={{ marginBottom: '1.5rem' }}>Departments</h3>
                {stats?.departments?.length > 0 ? (
                    <div className="table-container" style={{ background: 'transparent', border: 'none' }}>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Department</th>
                                    <th>Employees</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.departments.map((dept, index) => (
                                    <tr key={index}>
                                        <td>
                                            <span className="badge badge-primary">{dept.name}</span>
                                        </td>
                                        <td>{dept.count}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p style={{ color: 'var(--text-muted)' }}>No departments yet</p>
                )}
            </div>

            <div className="card recent-activity" style={{ marginTop: '1.5rem' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>Recent Attendance</h3>
                {stats?.recent_attendance?.length > 0 ? (
                    <div className="activity-list">
                        {stats.recent_attendance.map((record, index) => (
                            <div key={index} className="activity-item">
                                <div className="avatar">
                                    {record.employee_name?.charAt(0) || 'E'}
                                </div>
                                <div className="activity-details">
                                    <h5>{record.employee_name}</h5>
                                    <p>{record.date}</p>
                                </div>
                                <span className={`badge ${record.status === 'Present' ? 'badge-success' : 'badge-danger'}`}>
                                    {record.status}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p style={{ color: 'var(--text-muted)' }}>No attendance records yet</p>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
