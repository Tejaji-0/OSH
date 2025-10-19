import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import './SnowflakeExport.css';

function SnowflakeExport({ moodHistory, conversations }) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState(null);
  const { user, getAccessTokenSilently } = useAuth0();
  const enableSnowflake = import.meta.env.VITE_ENABLE_SNOWFLAKE_EXPORT === 'true';
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const exportToSnowflake = async () => {
    setIsExporting(true);
    setExportStatus(null);

    try {
      // Get Auth0 token if authentication is enabled
      let token = null;
      try {
        token = await getAccessTokenSilently();
      } catch (err) {
        console.log('Auth not enabled, exporting anonymously');
      }

      const exportData = {
        userId: user?.sub || 'anonymous',
        timestamp: new Date().toISOString(),
        moodHistory: moodHistory.map(entry => ({
          mood: entry.mood,
          timestamp: entry.timestamp,
          message: entry.message
        })),
        conversationCount: conversations.length,
        exportedAt: new Date().toISOString()
      };

      const response = await fetch(`${apiUrl}/api/export/snowflake`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(exportData)
      });

      if (response.ok) {
        const result = await response.json();
        setExportStatus({
          success: true,
          message: `✅ Successfully exported ${moodHistory.length} mood entries to Snowflake!`,
          details: result
        });
      } else {
        throw new Error('Export failed');
      }
    } catch (error) {
      console.error('Export error:', error);
      setExportStatus({
        success: false,
        message: '❌ Export failed. Please try again or check your connection.',
        error: error.message
      });
    } finally {
      setIsExporting(false);
    }
  };

  const downloadLocalBackup = () => {
    const backup = {
      exportDate: new Date().toISOString(),
      moodHistory,
      conversationCount: conversations.length,
      version: '1.0.0'
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clearmind-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setExportStatus({
      success: true,
      message: '✅ Local backup downloaded successfully!'
    });
  };

  return (
    <div className="snowflake-export">
      <h3>📊 Data Export</h3>
      
      <div className="export-info">
        <p>
          <strong>Mood Entries:</strong> {moodHistory.length}
        </p>
        <p>
          <strong>Conversations:</strong> {conversations.length}
        </p>
      </div>

      <div className="export-actions">
        {enableSnowflake ? (
          <button
            className="export-btn snowflake-btn"
            onClick={exportToSnowflake}
            disabled={isExporting || moodHistory.length === 0}
          >
            {isExporting ? (
              <>
                <span className="spinner"></span>
                Exporting to Snowflake...
              </>
            ) : (
              <>
                ❄️ Export to Snowflake
              </>
            )}
          </button>
        ) : (
          <div className="info-box">
            <p>💡 <strong>Snowflake Export</strong> is available in production mode.</p>
            <p className="small-text">Enable VITE_ENABLE_SNOWFLAKE_EXPORT in .env</p>
          </div>
        )}

        <button
          className="export-btn local-btn"
          onClick={downloadLocalBackup}
          disabled={moodHistory.length === 0}
        >
          💾 Download Local Backup
        </button>
      </div>

      {exportStatus && (
        <div className={`export-status ${exportStatus.success ? 'success' : 'error'}`}>
          <p>{exportStatus.message}</p>
          {exportStatus.details && (
            <pre className="export-details">
              {JSON.stringify(exportStatus.details, null, 2)}
            </pre>
          )}
        </div>
      )}

      <div className="export-description">
        <h4>🔒 Privacy & Security</h4>
        <ul>
          <li>All data is anonymized before export</li>
          <li>Timestamps are preserved for analytics</li>
          <li>No message content is stored (only metadata)</li>
          <li>You can delete your data anytime</li>
        </ul>
      </div>
    </div>
  );
}

export default SnowflakeExport;
