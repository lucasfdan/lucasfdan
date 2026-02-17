import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';

function Login() {
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    const redirectUrl = window.location.origin + '/admin';
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #F8FAFC 0%, #FFFFFF 100%)' }}>
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-xl p-8 md:p-12 border border-slate-100">
          <div className="text-center mb-8">
            <h1
              className="text-4xl md:text-5xl font-bold mb-3"
              style={{ fontFamily: 'Playfair Display, serif', color: '#1e3a8a' }}
            >
              Giovanna Depollo
            </h1>
            <p className="text-slate-600 text-lg">Painel Administrativo</p>
          </div>

          <div className="space-y-6">
            <button
              onClick={handleGoogleLogin}
              className="w-full bg-white border-2 border-slate-300 hover:border-[#1e3a8a] text-slate-700 py-4 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-3 text-lg font-medium"
              data-testid="google-login-button"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Entrar com Google
            </button>

            <div className="text-center">
              <button
                onClick={() => navigate('/')}
                className="text-slate-600 hover:text-[#1e3a8a] text-sm underline transition-colors"
                data-testid="back-to-catalog-button"
              >
                Voltar para o catálogo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;