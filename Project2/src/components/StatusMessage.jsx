function StatusMessage({ type, message }) {
  return (
    <div className={`status-message ${type}`}>
      {message}
    </div>
  );
}

export default StatusMessage;