import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../state/auth';
import { Button } from '../components/ui/button';

export function CliAuthPage() {
  const navigate = useNavigate();
  const { code = '' } = useParams();
  const { token, isReady } = useAuth();
  const [error, setError] = useState('');
  const [approved, setApproved] = useState(false);

  useEffect(() => {
    if (!isReady) {
      return;
    }
    if (!token) {
      navigate(`/login?redirect=${encodeURIComponent(`/cli-auth/${code}`)}`, {
        replace: true,
      });
    }
  }, [code, isReady, navigate, token]);

  const onApprove = async () => {
    if (!token) {
      return;
    }
    try {
      await api.approveCliAuthSession(token, code);
      setApproved(true);
      setError('');
    } catch (nextError) {
      setError(
        nextError instanceof Error ? nextError.message : String(nextError),
      );
    }
  };

  return (
    <div className="auth-shell">
      <div className="panel auth-panel">
        <h1>Authorize Nebula CLI</h1>
        <p>
          Approve this request to let the CLI access your Nebula Console
          account.
        </p>
        <p className="text-sm text-muted-foreground">Session code: {code}</p>
        {error ? <div className="error-box">{error}</div> : null}
        {approved ? (
          <>
            <div className="hint-box">
              CLI login approved. You can return to your terminal now.
            </div>
            <div className="auth-footer">
              <Link to="/">Go back to dashboard</Link>
            </div>
          </>
        ) : (
          <Button onClick={onApprove}>Approve CLI access</Button>
        )}
      </div>
    </div>
  );
}
