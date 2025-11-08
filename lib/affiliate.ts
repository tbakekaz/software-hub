type Params = { source?: string; campaign?: string; slug?: string; extraParams?: Record<string, string | number | boolean> };

export function getAffiliateUrl(base: string, params: Params = {}) {
  try {
    const u = new URL(base);
    const entries: [string, string][] = [];
    if (params.source) entries.push(['source', params.source]);
    if (params.campaign) entries.push(['campaign', params.campaign]);
    if (params.slug) entries.push(['slug', params.slug]);
    if (params.extraParams) {
      for (const [k, v] of Object.entries(params.extraParams)) entries.push([k, String(v)]);
    }
    for (const [k, v] of entries) u.searchParams.set(k, v);
    return u.toString();
  } catch {
    // fallback: naive append
    const qs = new URLSearchParams();
    if (params.source) qs.set('source', params.source);
    if (params.campaign) qs.set('campaign', params.campaign);
    if (params.slug) qs.set('slug', params.slug);
    if (params.extraParams) for (const [k, v] of Object.entries(params.extraParams)) qs.set(k, String(v));
    return base + (base.includes('?') ? '&' : '?') + qs.toString();
  }
}




