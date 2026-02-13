(async () => {
  const id = 'mtg-overlay-root';
  const existing = document.getElementById(id);
  if (existing) existing.remove();

  /* Proxy helper to bypass Reddit/Safari Content Security Policy (CSP) */
  const proxyFetch = async (url) => {
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);
    if (!response.ok) throw new Error("Network proxy error.");
    const data = await response.json();
    return JSON.parse(data.contents);
  };

  /* Helper for name normalization (handles // cards like Fable) */
  const normalize = (name) => {
    if (!name) return "";
    return name.toLowerCase().split(' // ')[0].replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
  };

  let cardName = window.getSelection().toString().trim();
  if (!cardName) {
    cardName = prompt("Enter MTG Card Name:");
    if (!cardName) return;
  }

  /* Create UI Frame */
  const overlay = document.createElement('div');
  overlay.id = id;
  overlay.style = `
    position: fixed; top: 10px; right: 10px; width: 92vw; max-width: 335px; 
    max-height: 96vh; background: rgba(18, 18, 18, 0.98); color: #fff; 
    border-radius: 24px; z-index: 2147483647; padding: 18px; 
    border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 20px 50px rgba(0,0,0,0.8);
    font-family: -apple-system, system-ui, sans-serif;
    backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px);
    display: flex; flex-direction: column; overflow-y: auto;
  `;
  overlay.innerHTML = `<div style="text-align:center; padding:20px; color:#00ff88; font-weight:bold; font-size:0.9em; letter-spacing:1px;">✨ SUMMONING...</div>`;
  document.body.appendChild(overlay);

  try {
    /* Fetch Scryfall via Proxy */
    const card = await proxyFetch(`https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(cardName)}`);
    
    /* Fetch EDHREC via Proxy */
    const edhName = normalize(card.name);
    let edhData = null;
    try {
        edhData = await proxyFetch(`https://json.edhrec.com/pages/cards/${edhName}.json`);
    } catch(e) { /* Fallback if EDHREC fails */ }

    /* Reliability Check for Decks & Synergy Stats */
    const numDecks = edhData?.card?.num_decks || edhData?.container?.json_dict?.card?.num_decks || 0;
    const topCmdr = edhData?.container?.json_dict?.cardlists?.find(l => l.tag === 'commanders')?.cardlist?.[0];
    
    let usageInsight = "Niche Tech";
    if (numDecks > 40000) usageInsight = "Global Staple";
    else if (numDecks > 10000) usageInsight = "Format Staple";
    if (topCmdr && topCmdr.synergy > 10) usageInsight = `+${topCmdr.synergy}% synergy with ${topCmdr.name}`;

    /* Explicit Legality Mapping (Scryfall Keys) */
    const getL = (key, label) => {
      const status = card.legalities?.[key];
      let icon = '·', color = '#444';
      if (status === 'legal') { icon = '✓'; color = '#4CAF50'; }
      else if (status === 'banned' || status === 'restricted') { icon = '✕'; color = '#ff4444'; }
      return `<div style="color:${color}; display:flex; align-items:center; gap:5px; font-size:0.75em; font-weight:700;">
        <span>${icon}</span> <span>${label}</span>
      </div>`;
    };

    const imgUrl = card.image_uris?.normal || 
                   card.card_faces?.[0]?.image_uris?.normal || "";
    
    const rarityCol = { common: '#fff', uncommon: '#95a5a6', rare: '#d4af37', mythic: '#e67e22' }[card.rarity] || '#fff';

    overlay.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:12px;">
        <div style="max-width:240px; overflow:hidden;">
            <b style="font-size:1.1em; display:block; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${card.name}</b>
            <span style="font-size:0.65em; color:#888; text-transform:uppercase; letter-spacing:0.5px;">${card.set_name} • <span style="color:${rarityCol}">${card.rarity}</span></span>
        </div>
        <button onclick="document.getElementById('${id}').remove()" style="background:rgba(255,255,255,0.15); border:none; color:#fff; border-radius:50%; width:26px; height:26px; cursor:pointer; font-weight:bold;">✕</button>
      </div>
      
      ${imgUrl ? `<img src="${imgUrl}" style="width:100%; border-radius:14px; margin-bottom:14px; border: 1px solid rgba(255,255,255,0.05); box-shadow: 0 4px 15px rgba(0,0,0,0.4);">` : ''}
      
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:14px;">
        <div style="background:rgba(255,255,255,0.04); padding:10px; border-radius:16px; text-align:center; border: 1px solid rgba(255,255,255,0.08);">
          <div style="font-size:0.58em; color:#888; text-transform:uppercase; letter-spacing:1px; margin-bottom:2px;">Value</div>
          <div style="color:#00ff88; font-weight:900; font-size:1.25em;">$${card.prices?.usd || 'N/A'}</div>
        </div>
        <div style="background:rgba(255,255,255,0.04); padding:10px; border-radius:16px; text-align:center; border: 1px solid rgba(255,255,255,0.08);">
          <div style="font-size:0.58em; color:#888; text-transform:uppercase; letter-spacing:1px; margin-bottom:2px;">Decks</div>
          <div style="color:#3498db; font-weight:900; font-size:1.25em;">${numDecks > 0 ? numDecks.toLocaleString() : 'N/A'}</div>
        </div>
      </div>

      <div style="background:rgba(255,255,255,0.02); padding:14px; border-radius:18px; border: 1px solid rgba(255,255,255,0.05); margin-bottom:12px;">
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:6px;">
          ${getL('commander', 'EDH')}
          ${getL('historicbrawl', 'Brawl (H)')}
          ${getL('brawl', 'Brawl (S)')}
          ${getL('modern', 'Modern')}
          ${getL('standard', 'Standard')}
          ${getL('pioneer', 'Pioneer')}
          ${getL('pauper', 'Pauper')}
          ${getL('historic', 'Arena')}
        </div>
      </div>

      <div style="font-size:0.68em; color:#bbb; text-align:center; margin-bottom:14px; padding: 0 5px;">
        <b>${usageInsight}</b>
      </div>

      <div style="display:flex; gap:10px;">
        <a href="https://www.mtggoldfish.com/price/${card.set_name.replace(/ /g, '+')}/${card.name.replace(/ /g, '+')}#paper" target="_blank" style="flex:1; background:#007AFF; color:white; text-align:center; padding:12px; border-radius:14px; text-decoration:none; font-size:0.85em; font-weight:bold;">Trend Chart</a>
        <a href="https://edhrec.com/cards/${edhName}" target="_blank" style="flex:1; background:rgba(255,255,255,0.1); color:white; text-align:center; padding:12px; border-radius:14px; text-decoration:none; font-size:0.85em; font-weight:bold;">EDHREC</a>
      </div>
    `;
  } catch (err) {
    overlay.innerHTML = `<div style="padding:20px; text-align:center; color:#ff4444;"><b>Lookup Failed</b><br><small>${err.message}</small></div>`;
  }
})();
