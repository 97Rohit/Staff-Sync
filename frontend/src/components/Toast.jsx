function Toast({ message, type = "success", onClose }) {
    return (
        <div className={`toast toast-${type}`} onClick={onClose}>
            {type === 'success' ? '✓' : '✕'} {message}
        </div>
    );
}

export default Toast;
