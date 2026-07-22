app.enableCors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      'https://exam-heyama.vercel.app',
      'https://exam-heyama-git-1x-landry-liga-bell.vercel.app',
      'https://exam-heyama-933ay94ru-landry-liga-bell.vercel.app',
      'http://localhost:3000',
      'http://localhost:3001',
    ];

    // Regex pour accepter n'importe quel futur sous-domaine Vercel lié à ton projet
    const isVercelApp = /^https:\/\/exam-heyama.*\.vercel\.app$/.test(origin);

    if (allowedOrigins.includes(origin) || isVercelApp) {
      callback(null, true);
    } else {
      callback(new Error(`Origine non autorisée par CORS: ${origin}`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
  allowedHeaders: [ 
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
  ],
  credentials: true,
});