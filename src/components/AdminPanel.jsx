import { useState, useEffect } from 'react'
import { Check, X, Clock, User, Calendar, MapPin, Users, MessageSquare, Filter, Loader2, Building2, Mail, Phone, BookOpen } from 'lucide-react'
import { bookingAPI } from '../services/api.js'
import Toast from './Toast.jsx'
import { useToast } from '../hooks/useToast.js'

const AdminPanel = () => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [updating, setUpdating] = useState(null)
  const { toasts, removeToast, success, error: showError } = useToast()

  // Load requests on component mount
  useEffect(() => {
    loadRequests()
  }, [])

  const loadRequests = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await bookingAPI.getAll()
      
      if (response.success) {
        setRequests(response.data)
      } else {
        throw new Error('Failed to load booking requests')
      }
    } catch (err) {
      console.error('Error loading requests:', err)
      setError('Failed to load booking requests. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const filteredRequests = requests.filter(request => {
    if (filterStatus === 'all') return true
    return request.status === filterStatus
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'status-pending'
      case 'approved': return 'status-approved' 
      case 'rejected': return 'status-rejected'
      default: return 'status-pending'
    }
  }

  const handleApprove = async (requestId) => {
    try {
      setUpdating(requestId)
      const reviewData = {
        status: 'approved',
        reviewNotes: 'Approved by administrator'
      }
      
      const response = await bookingAPI.updateStatus(requestId, reviewData)
      
      if (response.success) {
        // Update local state
        setRequests(prev => 
          prev.map(req => 
            req._id === requestId ? response.data : req
          )
        )
        setSelectedRequest(null)
        
        // Show success toast
        const request = requests.find(r => r._id === requestId)
        success(
          'Booking Approved!', 
          `Room ${request?.building} - ${request?.room} booking has been approved successfully.`
        )
      }
    } catch (err) {
      console.error('Error approving request:', err)
      showError('Approval Failed', 'Failed to approve the booking request. Please try again.')
    } finally {
      setUpdating(null)
    }
  }

  const handleReject = async (requestId) => {
    try {
      setUpdating(requestId)
      const reviewData = {
        status: 'rejected',
        reviewNotes: 'Rejected by administrator'
      }
      
      const response = await bookingAPI.updateStatus(requestId, reviewData)
      
      if (response.success) {
        // Update local state
        setRequests(prev => 
          prev.map(req => 
            req._id === requestId ? response.data : req
          )
        )
        setSelectedRequest(null)
        
        // Show warning toast
        const request = requests.find(r => r._id === requestId)
        showError(
          'Booking Rejected', 
          `Room ${request?.building} - ${request?.room} booking has been rejected.`
        )
      }
    } catch (err) {
      console.error('Error rejecting request:', err)
      showError('Rejection Failed', 'Failed to reject the booking request. Please try again.')
    } finally {
      setUpdating(null)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }

  const getStats = () => {
    const total = requests.length
    const pending = requests.filter(r => r.status === 'pending').length
    const approved = requests.filter(r => r.status === 'approved').length
    const rejected = requests.filter(r => r.status === 'rejected').length
    
    return { total, pending, approved, rejected }
  }

  if (loading) {
    return (
      <div className="admin-panel">
        <div className="loading-container">
          <Loader2 className="loading-spinner" size={48} />
          <p>Loading booking requests...</p>
        </div>
        <style>{`
          .admin-panel {
            padding: 2rem;
            max-width: 1200px;
            margin: 0 auto;
          }
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 400px;
            text-align: center;
          }
          .loading-spinner {
            animation: spin 1s linear infinite;
            color: var(--primary-color);
            margin-bottom: 1rem;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  if (error) {
    return (
      <div className="admin-panel">
        <div className="error-container">
          <h2>Error Loading Requests</h2>
          <p>{error}</p>
          <button onClick={loadRequests} className="retry-button">
            Try Again
          </button>
        </div>
        <style>{`
          .admin-panel {
            padding: 2rem;
            max-width: 1200px;
            margin: 0 auto;
          }
          .error-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 400px;
            text-align: center;
          }
          .retry-button {
            padding: 0.75rem 1.5rem;
            background: var(--primary-color);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: background-color 0.3s;
          }
          .retry-button:hover {
            background: var(--primary-dark);
          }
        `}</style>
      </div>
    )
  }

  const stats = getStats()

  return (
    <div className="admin-panel">
      {/* Toast Notifications */}
      <Toast toasts={toasts} removeToast={removeToast} />
      
      <div className="section-header">
        <h2>Admin Panel</h2>
        <p>Manage room booking requests</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid grid grid-cols-4">
        <div className="stat-card card">
          <div className="stat-content">
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Total Requests</div>
          </div>
          <div className="stat-icon total">
            <Calendar size={24} />
          </div>
        </div>
        
        <div className="stat-card card">
          <div className="stat-content">
            <div className="stat-number">{stats.pending}</div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-icon pending">
            <Clock size={24} />
          </div>
        </div>
        
        <div className="stat-card card">
          <div className="stat-content">
            <div className="stat-number">{stats.approved}</div>
            <div className="stat-label">Approved</div>
          </div>
          <div className="stat-icon approved">
            <Check size={24} />
          </div>
        </div>
        
        <div className="stat-card card">
          <div className="stat-content">
            <div className="stat-number">{stats.rejected}</div>
            <div className="stat-label">Rejected</div>
          </div>
          <div className="stat-icon rejected">
            <X size={24} />
          </div>
        </div>
      </div>

      {/* Filter and Requests */}
      <div className="requests-section">
        <div className="requests-header">
          <h3>Booking Requests</h3>
          <div className="filter-controls">
            <Filter size={16} />
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="form-select"
            >
              <option value="all">All Requests</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {filteredRequests.length === 0 ? (
          <div className="empty-state card">
            <Calendar size={48} />
            <h4>No requests found</h4>
            <p>There are no booking requests matching your current filter.</p>
          </div>
        ) : (
          <div className="requests-list">
            {filteredRequests.map(request => (
              <div key={request._id} className="request-card card">
                <div className="request-header">
                  <div className="request-info">
                    <h4>
                      <Building2 size={20} />
                      {request.building} - Room {request.room}
                    </h4>
                    <div className="request-meta">
                      <span className={`status-badge ${getStatusColor(request.status)}`}>
                        {request.status.toUpperCase()}
                      </span>
                      <span className="request-date">
                        Requested {formatDate(request.createdAt)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="request-actions">
                    {request.status === 'pending' && (
                      <>
                        <button 
                          className="btn btn-success"
                          onClick={() => handleApprove(request._id)}
                          disabled={updating === request._id}
                        >
                          {updating === request._id ? (
                            <>
                              <Loader2 size={16} className="loading-spinner" />
                              Approving...
                            </>
                          ) : (
                            <>
                              <Check size={16} />
                              Approve
                            </>
                          )}
                        </button>
                        <button 
                          className="btn btn-danger"
                          onClick={() => handleReject(request._id)}
                          disabled={updating === request._id}
                        >
                          {updating === request._id ? (
                            <>
                              <Loader2 size={16} className="loading-spinner" />
                              Rejecting...
                            </>
                          ) : (
                            <>
                              <X size={16} />
                              Reject
                            </>
                          )}
                        </button>
                      </>
                    )}
                    <button 
                      className="btn btn-secondary"
                      onClick={() => setSelectedRequest(request)}
                    >
                      View Details
                    </button>
                  </div>
                </div>

                <div className="request-details">
                  <div className="detail-item">
                    <User size={16} />
                    <span>{request.name}</span>
                  </div>
                  <div className="detail-item">
                    <Calendar size={16} />
                    <span>{formatDate(request.date)}</span>
                  </div>
                  <div className="detail-item">
                    <Clock size={16} />
                    <span>{request.timeSlot}</span>
                  </div>
                  {request.studentId && (
                    <div className="detail-item">
                      <BookOpen size={16} />
                      <span>ID: {request.studentId}</span>
                    </div>
                  )}
                </div>

                <div className="request-purpose">
                  <MessageSquare size={16} />
                  <div>
                    <strong>Purpose:</strong> {request.purpose}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Request Details Modal */}
      {selectedRequest && (
        <div className="modal-overlay" onClick={() => setSelectedRequest(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Booking Request Details</h3>
              <span className={`status-badge ${getStatusColor(selectedRequest.status)}`}>
                {selectedRequest.status.toUpperCase()}
              </span>
            </div>

            <div className="detail-section">
              <h4>Room Information</h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <Building2 size={18} />
                  <span><strong>Building:</strong> {selectedRequest.building}</span>
                </div>
                <div className="detail-item">
                  <MapPin size={18} />
                  <span><strong>Room:</strong> {selectedRequest.room}</span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h4>Booking Details</h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <Calendar size={18} />
                  <span><strong>Date:</strong> {formatDate(selectedRequest.date)}</span>
                </div>
                <div className="detail-item">
                  <Clock size={18} />
                  <span><strong>Time:</strong> {selectedRequest.timeSlot}</span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h4>Requester Information</h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <User size={18} />
                  <span><strong>Name:</strong> {selectedRequest.name}</span>
                </div>
                {selectedRequest.studentId && (
                  <div className="detail-item">
                    <BookOpen size={18} />
                    <span><strong>Student/Staff ID:</strong> {selectedRequest.studentId}</span>
                  </div>
                )}
                {selectedRequest.department && (
                  <div className="detail-item">
                    <Building2 size={18} />
                    <span><strong>Department:</strong> {selectedRequest.department}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="detail-section">
              <h4>Purpose</h4>
              <div className="purpose-content">
                <MessageSquare size={18} />
                <p>{selectedRequest.purpose}</p>
              </div>
            </div>

            <div className="detail-section">
              <h4>Request Information</h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <Calendar size={18} />
                  <span><strong>Requested:</strong> {formatDate(selectedRequest.createdAt)}</span>
                </div>
                {selectedRequest.reviewedAt && (
                  <div className="detail-item">
                    <Clock size={18} />
                    <span><strong>Reviewed:</strong> {formatDate(selectedRequest.reviewedAt)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="modal-actions">
              <button 
                className="btn btn-secondary" 
                onClick={() => setSelectedRequest(null)}
              >
                Close
              </button>
              {selectedRequest.status === 'pending' && (
                <>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleReject(selectedRequest._id)}
                    disabled={updating === selectedRequest._id}
                  >
                    {updating === selectedRequest._id ? (
                      <>
                        <Loader2 size={16} className="loading-spinner" />
                        Rejecting...
                      </>
                    ) : (
                      <>
                        <X size={16} />
                        Reject
                      </>
                    )}
                  </button>
                  <button 
                    className="btn btn-success"
                    onClick={() => handleApprove(selectedRequest._id)}
                    disabled={updating === selectedRequest._id}
                  >
                    {updating === selectedRequest._id ? (
                      <>
                        <Loader2 size={16} className="loading-spinner" />
                        Approving...
                      </>
                    ) : (
                      <>
                        <Check size={16} />
                        Approve
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .admin-panel {
          padding: 2rem 0;
        }
        
        .section-header {
          text-align: center;
          margin-bottom: 3rem;
        }
        
        .section-header h2 {
          font-size: 2.25rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }
        
        .section-header p {
          color: var(--text-secondary);
          font-size: 1.125rem;
        }
        
        .stats-grid {
          margin-bottom: 3rem;
        }
        
        .stat-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem;
        }
        
        .stat-content {
          text-align: left;
        }
        
        .stat-number {
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        
        .stat-label {
          color: var(--text-secondary);
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }
        
        .stat-icon {
          padding: 1rem;
          border-radius: 0.75rem;
        }
        
        .stat-icon.total {
          background: #dbeafe;
          color: var(--primary-color);
        }
        
        .stat-icon.pending {
          background: #fef3c7;
          color: var(--warning-color);
        }
        
        .stat-icon.approved {
          background: #d1fae5;
          color: var(--success-color);
        }
        
        .stat-icon.rejected {
          background: #fee2e2;
          color: var(--danger-color);
        }
        
        .requests-section {
          margin-top: 2rem;
        }
        
        .requests-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        
        .requests-header h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        
        .filter-controls {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .filter-controls select {
          width: auto;
          min-width: 150px;
        }
        
        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
        }
        
        .empty-state svg {
          color: var(--text-secondary);
          margin-bottom: 1rem;
        }
        
        .empty-state h4 {
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }
        
        .empty-state p {
          color: var(--text-secondary);
        }
        
        .requests-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .request-card {
          padding: 1.5rem;
        }
        
        .request-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }
        
        .request-info h4 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }
        
        .request-meta {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .request-date {
          color: var(--text-secondary);
          font-size: 0.875rem;
        }
        
        .request-actions {
          display: flex;
          gap: 0.5rem;
        }
        
        .request-actions .btn {
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
        }
        
        .request-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 1rem;
          padding: 1rem;
          background: var(--background);
          border-radius: 0.5rem;
        }
        
        .detail-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-secondary);
          font-size: 0.875rem;
        }
        
        .request-purpose {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          color: var(--text-secondary);
          font-size: 0.875rem;
        }
        
        .request-purpose div {
          flex: 1;
        }
        
        .request-purpose strong {
          color: var(--text-primary);
        }

        .purpose-content {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
        }

        .purpose-content p {
          flex: 1;
          margin: 0;
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border-color);
        }
        
        .modal-header h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        
        .detail-section {
          margin-bottom: 1.5rem;
        }
        
        .detail-section h4 {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 0.75rem;
        }
        
        .detail-grid {
          display: grid;
          gap: 0.75rem;
        }
        
        .detail-section .detail-item {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        
        .detail-section p {
          color: var(--text-secondary);
          line-height: 1.6;
        }
        
        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .requests-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          
          .request-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          
          .request-actions {
            width: 100%;
            justify-content: flex-end;
          }
          
          .request-details {
            grid-template-columns: 1fr;
          }
        }
        
        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
          
          .request-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
}

export default AdminPanel
