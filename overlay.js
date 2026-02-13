(async () => {
  const id = 'mtg-overlay-root';
  const existing = document.getElementById(id);
  if (existing) existing.remove();

  /* Helper for name normalization (handles // cards like Fable or Zenos) */
  const normalize = (name) => {
    if (!name) return "";
    return name.split(' // ')[0].trim();
  };

  /* Format for URLs: spaces to '+' and remove special chars that break links */
  const formatForUrl = (str) => {
    return str.replace(/\s+/g, '+').replace(/[^\w+]/g, '');
  };

  let cardName = window.getSelection().toString().trim();
  if (!cardName) {
    cardName = prompt("Enter MTG Card Name:");
    if (!cardName) return;
  }

  /* Create UI Frame (Ultra-Compact for iPad/Mobile) */
  const overlay = document.createElement('div');
  overlay.id = id;
  overlay.style = `
    position: fixed; top: 8px; right: 8px; width: 90vw; max-width: 320px; 
    max-height: calc(100vh - 16px); background: rgba(18, 18, 18, 0.98); color: #fff; 
    border-radius: 20px; z-index: 2147483647; padding: 14px; 
    border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 15px 40px rgba(0,0,0,0.8);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto;
    backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px);
    display: flex; flex-direction: column; line-height: 1.2;
  `;
  overlay.innerHTML = `<div style="text-align:center; padding:15px; color:#00ff88; font-weight:bold; font-size:0.85em; letter-spacing:1px;">✨ SUMMONING...</div>`;
  document.body.appendChild(overlay);

  try {
    const scryRes = await fetch(`https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(cardName)}`);
    if (!scryRes.ok) throw new Error(`Card not found.`);
    const card = await scryRes.json();

    const baseName = normalize(card.name);
    const edhSlug = baseName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    let edhData = null;
    if (edhSlug) {
      try {
        const edhRes = await fetch(`https://json.edhrec.com/pages/cards/${edhSlug}.json`);
        if (edhRes.ok) edhData = await edhRes.json();
      } catch(e) {}
    }

    const numDecks = edhData?.card?.num_decks || 
                     edhData?.container?.json_dict?.card?.num_decks || 
                     edhData?.container?.json_dict?.cardlists?.find(l => l.header === "Decks")?.cardlist?.length || 0;
                     
    const topCmdr = edhData?.container?.json_dict?.cardlists?.find(l => l.tag === 'commanders')?.cardlist?.[0];
    
    let usageInsight = "Niche Tech";
    if (numDecks > 40000) usageInsight = "Global Staple";
    else if (numDecks > 10000) usageInsight = "Format Staple";
    if (topCmdr && topCmdr.synergy > 10) usageInsight = `+${topCmdr.synergy}% with ${topCmdr.name}`;

    const getL = (key, label) => {
      const status = card.legalities?.[key] || 'not_legal';
      let icon = '·', color = '#444';
      if (status === 'legal') { icon = '✓'; color = '#4CAF50'; }
      else if (status === 'banned' || status === 'restricted') { icon = '✕'; color = '#ff4444'; }
      return `<div style="color:${color}; display:flex; align-items:center; gap:4px; font-size:0.68em; font-weight:700;">
        <span>${icon}</span><span style="white-space:nowrap;">${label}</span>
      </div>`;
    };

    const imgUrl = card.image_uris?.normal || card.card_faces?.[0]?.image_uris?.normal || "";
    const rarityCol = { common: '#fff', uncommon: '#95a5a6', rare: '#d4af37', mythic: '#e67e22' }[card.rarity] || '#fff';

    const fishSet = formatForUrl(card.set_name);
    const fishName = formatForUrl(baseName);
    const goldFishUrl = `https://www.mtggoldfish.com/price/${fishSet}/${fishName}#paper`;

    overlay.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:10px;">
        <div style="max-width:230px; overflow:hidden;">
            <b style="font-size:1em; display:block; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${card.name}</b>
            <span style="font-size:0.6em; color:#888; text-transform:uppercase;">${card.set_name.substring(0, 22)} • <span style="color:${rarityCol}">${card.rarity}</span></span>
        </div>
        <button onclick="document.getElementById('${id}').remove()" style="background:none; border:none; color:#888; font-size:1.2em; cursor:pointer; padding:0 5px;">✕</button>
      </div>
      
      <img src="${imgUrl}" style="width:100%; border-radius:10px; margin-bottom:10px; border: 1px solid rgba(255,255,255,0.05);">
      
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:10px;">
        <div style="background:rgba(255,255,255,0.04); padding:6px; border-radius:12px; text-align:center;">
          <div style="font-size:0.5em; color:#888; letter-spacing:1px;">VALUE</div>
          <div style="color:#00ff88; font-weight:900; font-size:1.1em;">$${card.prices?.usd || 'N/A'}</div>
        </div>
        <div style="background:rgba(255,255,255,0.04); padding:6px; border-radius:12px; text-align:center;">
          <div style="font-size:0.5em; color:#888; letter-spacing:1px;">DECKS</div>
          <div style="color:#3498db; font-weight:900; font-size:1.1em;">${numDecks > 0 ? numDecks.toLocaleString() : '0'}</div>
        </div>
      </div>

      <div style="background:rgba(255,255,255,0.02); padding:10px; border-radius:14px; border: 1px solid rgba(255,255,255,0.05); margin-bottom:8px;">
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:4px;">
          ${getL('commander', 'EDH')}
          ${getL('brawl', 'Brawl')}
          ${getL('alchemy', 'Alchemy')}
          ${getL('modern', 'Modern')}
          ${getL('standard', 'Standard')}
          ${getL('pioneer', 'Pioneer')}
          ${getL('pauper', 'Pauper')}
          ${getL('historic', 'Arena')}
        </div>
      </div>

      <div style="font-size:0.62em; color:#bbb; text-align:center; margin-bottom:10px;">
        <b>${usageInsight}</b>
      </div>

      <div style="display:flex; gap:8px;">
        <a href="${goldFishUrl}" target="_blank" style="flex:1; background:#007AFF; color:white; text-align:center; padding:8px; border-radius:10px; text-decoration:none; font-size:0.75em; font-weight:bold;">Trend</a>
        <a href="https://edhrec.com/cards/${edhSlug}" target="_blank" style="flex:1; background:rgba(255,255,255,0.1); color:white; text-align:center; padding:8px; border-radius:10px; text-decoration:none; font-size:0.75em; font-weight:bold;">EDHREC</a>
      </div>
    `;
  } catch (err) {
    overlay.innerHTML = `<div style="padding:20px; text-align:center; color:#ff4444; font-size:0.8em;"><b>Lookup Failed</b><br>${err.message}</div>`;
  }
})();
