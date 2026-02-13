(async () => {
  const id = 'mtg-overlay-root';
  const existing = document.getElementById(id);
  if (existing) existing.remove();

  /* SMART FETCH: Direct first (fast), Proxy fallback (reliable for iPad/Reddit) */
  const smartFetch = async (url) => {
    try {
      const response = await fetch(url);
      if (response.ok) return await response.json();
    } catch (e) {
      /* Fallback to CORSProxy.io if direct fetch is blocked by browser CSP */
      const response = await fetch(`https://corsproxy.io/?${encodeURIComponent(url)}`);
      if (response.ok) return await response.json();
    }
    throw new Error("Connection blocked");
  };

  const normalize = (n) => n ? n.split(' // ')[0].trim() : "";
  const formatUrl = (s) => s.replace(/\s+/g, '+').replace(/[^\w+]/g, '');

  let cardName = window.getSelection().toString().trim();
  if (!cardName) {
    cardName = prompt("Card Name:");
    if (!cardName) return;
  }

  /* Create Adaptive Container */
  const overlay = document.createElement('div');
  overlay.id = id;
  overlay.style = `
    position: fixed; top: 10px; right: 10px; width: 310px; 
    max-height: calc(100vh - 20px); background: rgba(15, 15, 15, 0.98); color: #fff; 
    border-radius: 20px; z-index: 2147483647; padding: 0; 
    border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 10px 40px rgba(0,0,0,0.9);
    font-family: -apple-system, system-ui, sans-serif;
    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
    display: flex; flex-direction: column; overflow: hidden;
  `;
  overlay.innerHTML = `<div style="text-align:center; padding:30px; color:#00ff88; font-weight:bold; font-size:0.8em;">SUMMONING...</div>`;
  document.body.appendChild(overlay);

  try {
    const card = await smartFetch(`https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(cardName)}`);
    const baseName = normalize(card.name);
    const edhSlug = baseName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    
    /* Async non-blocking load for EDHREC stats */
    smartFetch(`https://json.edhrec.com/pages/cards/${edhSlug}.json`).then(data => {
      const p = data?.card?.num_decks || data?.container?.json_dict?.card?.num_decks || 0;
      const el = document.getElementById('decks-val');
      if(el) el.innerText = p > 0 ? p.toLocaleString() : '0';
    }).catch(()=>{});

    const getL = (key, label) => {
      const status = card.legalities?.[key] || 'not_legal';
      let icon = '·', color = '#444', textColor = '#888';
      if (status === 'legal') { icon = '✓'; color = '#00ff88'; textColor = '#fff'; }
      else if (status === 'banned' || status === 'restricted') { icon = '✕'; color = '#ff4b4b'; textColor = '#ff4b4b'; }
      return `<div style="color:${color}; display:flex; align-items:center; gap:4px; font-size:11px; font-weight:700;">
        <span style="width:12px;">${icon}</span><span style="color:${textColor}">${label}</span>
      </div>`;
    };

    const imgUrl = card.image_uris?.normal || card.card_faces?.[0]?.image_uris?.normal || "";
    const fishUrl = `https://www.mtggoldfish.com/price/${formatUrl(card.set_name)}/${formatUrl(baseName)}#paper`;

    overlay.innerHTML = `
      <div style="padding:10px 14px 6px; display:flex; justify-content:space-between; align-items:center; flex-shrink:0;">
        <div style="overflow:hidden; flex:1; padding-right:10px;">
          <div style="font-weight:800; font-size:14px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${card.name}</div>
          <div style="font-size:9px; color:#888; text-transform:uppercase; letter-spacing:0.5px;">${card.set_name.substring(0,24)} • ${card.rarity}</div>
        </div>
        <div onclick="document.getElementById('${id}').remove()" style="width:44px; height:44px; display:flex; align-items:center; justify-content:center; margin:-10px -10px 0 0; cursor:pointer;">
          <div style="background:rgba(255,255,255,0.15); width:24px; height:24px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:bold;">✕</div>
        </div>
      </div>

      <div style="overflow-y:auto; padding:0 14px 12px; display:flex; flex-direction:column; gap:8px;">
        <div style="flex-shrink:1; min-height:100px; display:flex; justify-content:center;">
          <img src="${imgUrl}" style="max-width:100%; max-height:40vh; aspect-ratio:2.5/3.5; object-fit:contain; border-radius:8px; box-shadow:0 4px 10px rgba(0,0,0,0.5);">
        </div>
        
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:6px;">
          <div style="background:rgba(255,255,255,0.04); padding:4px; border-radius:10px; text-align:center; border:1px solid rgba(255,255,255,0.05);">
            <div style="font-size:8px; color:#888;">VALUE</div>
            <div style="color:#00ff88; font-weight:800; font-size:14px;">$${card.prices?.usd || 'N/A'}</div>
          </div>
          <div style="background:rgba(255,255,255,0.04); padding:4px; border-radius:10px; text-align:center; border:1px solid rgba(255,255,255,0.05);">
            <div style="font-size:8px; color:#888;">DECKS</div>
            <div id="decks-val" style="color:#3498db; font-weight:800; font-size:14px;">...</div>
          </div>
        </div>

        <div style="background:rgba(255,255,255,0.02); padding:8px; border-radius:12px; border:1px solid rgba(255,255,255,0.04); display:grid; grid-template-columns:1fr 1fr; gap:3px;">
          ${getL('commander', 'EDH')}
          ${getL('brawl', 'Brawl')}
          ${getL('alchemy', 'Alchemy')}
          ${getL('modern', 'Modern')}
          ${getL('standard', 'Standard')}
          ${getL('pioneer', 'Pioneer')}
          ${getL('pauper', 'Pauper')}
          ${getL('historic', 'Arena')}
        </div>

        <div style="display:flex; gap:6px; margin-top:2px;">
          <a href="${fishUrl}" target="_blank" style="flex:1; background:#007AFF; color:#fff; text-align:center; padding:8px; border-radius:10px; text-decoration:none; font-size:11px; font-weight:bold;">Trend</a>
          <a href="https://edhrec.com/cards/${edhSlug}" target="_blank" style="flex:1; background:rgba(255,255,255,0.1); color:#fff; text-align:center; padding:8px; border-radius:10px; text-decoration:none; font-size:11px; font-weight:bold;">EDHREC</a>
        </div>
      </div>
    `;
  } catch (err) {
    overlay.innerHTML = `<div style="padding:20px; text-align:center;"><b style="color:#ff4b4b;">Failed</b><br><small>${err.message}</small><br><button onclick="document.getElementById('${id}').remove()" style="margin-top:10px; background:#333; color:#fff; border:none; padding:5px 10px; border-radius:5px;">Close</button></div>`;
  }
})();

