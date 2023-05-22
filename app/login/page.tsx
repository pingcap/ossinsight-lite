export default function Page ({ searchParams }: any) {
  const redirectUri = searchParams.redirect_uri ?? '/';
  const error = searchParams.error;

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className='p-2 bg-white flex flex-col items-center'>
        <h2 className='mb-2'>Login to continue</h2>
        {error && <div className="bg-red-200 text-red-600">{error}</div>}
        <form action={`/api/login?redirect_uri=${encodeURIComponent(redirectUri)}`} method="post">
          <input name="username" value="admin" readOnly autoCorrect="no" hidden />
          <div>
            <input name="password" type="password" autoCorrect="no" placeholder="password" />
          </div>
          <div>
            <button>Login</button>
          </div>
        </form>
      </div>
    </div>
  );
}