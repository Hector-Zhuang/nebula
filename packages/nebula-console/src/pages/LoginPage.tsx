import { Link } from 'react-router-dom';
import { LoginForm } from '../components/login-form';
import { NebulaLogo } from '../components/nebula-logo';

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          to="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <NebulaLogo withWordmark={false} />
        </Link>
        <LoginForm />
      </div>
    </div>
  );
}
