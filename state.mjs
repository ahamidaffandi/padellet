import { getStore } from '@netlify/blobs';

const KEY = 'state';

function defaultState() {
  return { groupScores: { A: {}, B: {}, C: {}, D: {}, W: {} }, koScores: {} };
}

function json(body, status) {
  return new Response(JSON.stringify(body), {
    status: status || 200,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}

function validScoreState(s) {
  if (!s || typeof s !== 'object') return false;
  if (!s.groupScores || typeof s.groupScores !== 'object') return false;
  if (!s.koScores || typeof s.koScores !== 'object') return false;
  for (const g of ['A', 'B', 'C', 'D', 'W']) {
    if (!(g in s.groupScores)) return false;
  }
  return true;
}

export default async (req) => {
  const store = getStore('tournament');

  if (req.method === 'GET') {
    const data = await store.get(KEY, { type: 'json' });
    return json(data || defaultState());
  }

  if (req.method === 'POST') {
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return json({ error: 'bad_request' }, 400);
    }

    if (!validScoreState(body.state)) {
      return json({ error: 'bad_state' }, 400);
    }

    await store.set(KEY, JSON.stringify(body.state));
    return json(body.state);
  }

  return json({ error: 'method_not_allowed' }, 405);
};
