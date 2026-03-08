import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const clientId = 'Ov23liTnLPEPqqDWdFcE';
  const clientSecret = import.meta.env.GITHUB_CLIENT_SECRET;

  if (!clientSecret) {
    return new Response(JSON.stringify({ error: 'GITHUB_CLIENT_SECRET not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body: { code?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { code } = body;
  if (!code) {
    return new Response(JSON.stringify({ error: 'Missing code' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const payload = JSON.stringify({
    client_id: clientId,
    client_secret: clientSecret,
    code,
  });

  const req = new Request('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: payload,
  });

  const resp = await fetch(req);

  interface GitHubTokenResponse {
    access_token?: string;
    error?: string;
  }

  const ghResp: GitHubTokenResponse = await resp.json();

  if (!ghResp.access_token) {
    return new Response(JSON.stringify({ error: `GitHub OAuth error: ${ghResp.error}` }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ access_token: ghResp.access_token }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
