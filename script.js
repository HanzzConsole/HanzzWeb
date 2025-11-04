// script.js — Nebula HTML Encryptor (v12.0 - Universal Stability Fix)
// • Fix: Solved the "Latin1 Range" btoa crash by re-implementing full Unicode handling 
//   for the payload, ensuring 100% stability with emojis and complex Unicode in the input.
// • Priority: Max stability, max obfuscation (V10 handlers retained).

(() => {
  // -------------------------------------------------------------------
  // KONFIGURASI INTI
  // -------------------------------------------------------------------
  const SECRET_KEY = "Hanzz-Nebula-Universal-Key-2033-v12!@#"; 
  const EMOJI_NOISE_SET = ['😪', '😢', '🗿', '👍', '🤭', '😚', '🤙', '😍', '🤪', '🤓', '😵‍💫', '😭', '🥵', '😏', '🔲', '😹', '✍️', '🇮🇩', '😖', '😝', '😞', '😔', '💀', '🤮', '💀', '😟', '🥳', '🤫', '😎', '😩', '😂'];

  const getRandomEmojiNoise = (count = 100) => {
    let noise = '';
    for (let i = 0; i < count; i++) {
      const index = Math.floor(Math.random() * EMOJI_NOISE_SET.length);
      noise += EMOJI_NOISE_SET[index];
    }
    return noise;
  };

  // --- DOM Element Selection ---
  const $ = id => document.getElementById(id);
  
  const inputEl = $('input') || $('inputHtml') || document.querySelector('textarea#input, textarea:not([readonly])');
  const outputEl = $('output') || $('result') || document.querySelector('textarea[readonly]') || document.querySelector('textarea#output');
  const btnEncrypt = $('encrypt-btn') || $('btnEncrypt') || $('encryptBtn') || $('btn-encrypt');
  const btnCopy = $('copy-btn') || $('btnCopy') || $('copyBtn');
  const btnClear = $('btnClear') || $('clear-btn') || $('clearBtn');
  let downloadLink = $('downloadLink') || $('dl');
  let currentBlobUrl = null;

  // --- Core Encryption Logic (FULL UNICODE SUPPORT) ---
  const xorCipher = (str, key) => {
    let output = '';
    for (let i = 0; i < str.length; i++) {
      const charCode = str.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      output += String.fromCharCode(charCode);
    }
    return output;
  };
  
  // SOLUSI KRITIS: Fungsi Base64 yang menangani Unicode/Emoji
  const unicodeToBase64 = str => {
    try { return btoa(unescape(encodeURIComponent(str))); }
    catch { return btoa(str); }
  };
  // Fungsi dekode Base64 yang menangani Unicode/Emoji (akan di-embed)
  const base64ToUnicode = b64 => {
    try { return decodeURIComponent(escape(atob(b64))); }
    catch(e) { return atob(b64); }
  }

  const escapePayloadForHtml = b64 => b64.replace(/</g, '\\u003c');


  // --- FUNGSI OBFUSCATION STABIL (V12) ---
  function buildStableDecryptionScript(key, payload) {
    // 1. Array Kunci Terenkripsi (Fungsi dan Konstanta)
    const CORE_KEYS = ['atob', 'eval', 'write', 'charCodeAt', 'String.fromCharCode', 'document', 'open', 'close', 'innerHTML', 'body']; 
    const ENCRYPTED_CORE_KEYS = btoa(xorCipher(CORE_KEYS.join('|'), key)); // btoa murni di sini AMAN
    
    // 2. Payload Obfuscation (Array Join)
    const chunkSize = 40;
    const payloadChunks = [];
    for (let i = 0; i < payload.length; i += chunkSize) {
      payloadChunks.push(payload.substring(i, i + chunkSize));
    }
    const payloadConstructor = `[${payloadChunks.map(c => `'${c}'`).join(', ')}].join('')`;

    // 3. Kunci Obfuscation
    const keyMaker = `'${key}'`;

    // 4. Skrip Dekripsi Inti (Stabil & Tersembunyi)
    const rawDecryptor = `
      const P = ${payloadConstructor}; 
      const K = ${keyMaker}; 
      let F; 

      // Fungsi Inti Dekripsi XOR
      const X = (s, c) => {
        let o = '';
        for (let i = 0; i < s.length; i++) {
          o += window['String']['fromCharCode']((s['charCodeAt'](i) ^ c['charCodeAt'](i % c.length)));
        }
        return o;
      };
      
      // FUNGSI INTI DEKODE BASE64 UNICODE (Dibuat tersembunyi)
      const B_FULL = (b) => {
          try { return decodeURIComponent(escape(atob(b))); }
          catch(e) { return atob(b); }
      };

      // Fungsi B (atob murni untuk Array Kunci)
      const B_SIMPLE = (b) => atob(b);

      try {
          // 1. Dekripsi Array Kunci
          const encryptedF = B_SIMPLE('${ENCRYPTED_CORE_KEYS}');
          F = X(encryptedF, K).split('|'); 
          
          // 2. Dekode Payload (Menggunakan B_FULL untuk Unicode)
          const xorEnc = B_FULL(P); 
          
          // 3. XOR Decode Payload
          const X_FINAL = (s, c) => {
              let o = '';
              for (let i = 0; i < s.length; i++) {
                  o += window[F[4].split('.')[0]][F[4].split('.')[1]]((s[F[3]](i) ^ c[F[3]](i % c.length)));
              }
              return o;
          };

          const html = X_FINAL(xorEnc, K); 

          // 4. Tulis ke Dokumen
          window[F[5]][F[6]]();
          window[F[5]][F[2]](html);
          window[F[5]][F[7]]();
      } catch(e) {
        window[F[5]][F[9]][F[8]] = '<div style="color:#f88;padding:20px">Error: Gagal Memuat Konten. Silakan cek konsol (F12) untuk detail.</div>';
        console.error("Critical Decryption Failure:", e);
      }
    `;

    // 5. Final Obfuscation: Base64 + Eval (Menggunakan btoa murni untuk stabilitas)
    const b64_obfuscated = btoa(rawDecryptor); 
    
    // Gunakan 'eval' yang di-obfuscate
    return `
      (function(){
        try {
          const S='${b64_obfuscated}';
          window['\\x65\\x76\\x61\\x6c'](window['\\x61\\x74\\x6f\\x62'](S));
        } catch(e) {
          document.body.innerHTML = '<div style="color:#f88;padding:20px">E-002: Loader Failed.</div>';
        }
      })();
    `;
  }

  // --- Loader/HTML Builder (v12) ---
  function buildLoaderFile(base64Payload) {
    const safePayload = escapePayloadForHtml(base64Payload);
    const obfuscatedScript = buildStableDecryptionScript(SECRET_KEY, safePayload);

    const topNoise = getRandomEmojiNoise(80);
    const bottomNoise = getRandomEmojiNoise(80);

    return `<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Protected Page</title>
<style>
body {
  background: radial-gradient(circle at center, #0b0020 0%, #000 100%);
  color: #eaf0ff;
  font-family: "Inter", system-ui;
  padding: 30px;
  text-align: center;
}
.credit { font-size: 14px; color: #777; margin-bottom: 12px; letter-spacing: 0.5px; }
</style>
</head>
<body>
<div class="credit">🔒 Encrypt By <b>@Hanzz</b> (Universal Stability Shield)</div>
<script>
${obfuscatedScript}
<\/script>
</body>
</html>`;
  }

  // --- Handlers Palsu dan Inti (Tetap SIBUK) ---

  function dummyConsoleHandler(e) { /* ... */ }
  function fakeInteractionHandler(e) {
    const randomEl = document.querySelector('.non-existent-class-' + Math.floor(Math.random() * 5));
    if (randomEl) randomEl.classList.toggle('active');
  }
  function globalResizeHandler() { /* ... */ }

  async function encryptHandler() {
    if (!inputEl) return alert('Error: Input element not found.');
    const raw = String(inputEl.value || '');
    if (!raw.trim()) return alert('⚠️ Please enter the HTML code first!');

    const btn = btnEncrypt;
    const prevText = btn?.textContent || 'Encrypt HTML';

    if (btn) { btn.disabled = true; btn.textContent = '🛡️ Applying Universal Shield...'; }

    try {
      const normalized = raw.trim();
      
      const xorEncrypted = xorCipher(normalized, SECRET_KEY); 
      // MENGGUNAKAN UNICODE BASE64 UNTUK MENCEGAH CRASH
      const b64 = unicodeToBase64(xorEncrypted); 
      
      const loaderHtml = buildLoaderFile(b64);

      if (outputEl) outputEl.value = loaderHtml;
      prepareDownloadLink(loaderHtml);

      outputEl?.focus();
      outputEl?.select?.();

    } catch (err) {
      console.error(err);
      alert('Error during encryption: ' + (err.message || String(err)));
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = prevText; }
    }
  }

  async function copyHandler() {
    // ... (Code menyalin) ...
    if (!outputEl) return alert('Error: Output textarea not found.');
    const text = outputEl.value;
    if (!text) return alert('No result to copy.');

    try {
      await navigator.clipboard.writeText(text);
      alert('✅ Encrypted result copied to clipboard!');
    } catch (e) {
      console.warn("Clipboard API failed:", e);
      outputEl.select();
      try {
        document.execCommand('copy');
        alert('✅ Copied (manual selection fallback).');
      } catch (e2) {
        alert('❌ Failed to copy automatically. Please copy the text manually.');
      }
    }
  }

  function clearHandler() {
    // ... (Code clear) ...
    inputEl && (inputEl.value = '');
    outputEl && (outputEl.value = '');
    if (downloadLink) {
      if (currentBlobUrl) {
          try { URL.revokeObjectURL(currentBlobUrl); } catch {}
          currentBlobUrl = null;
      }
      downloadLink.style.display = 'none';
      downloadLink.href = '#';
    }
  }
  
  function getDownloadFilename() {
    const now = new Date();
    const timestamp = [
      now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0'), '_',
      String(now.getHours()).padStart(2, '0'), String(now.getMinutes()).padStart(2, '0'), String(now.getSeconds()).padStart(2, '0')
    ].join('');
    return `protected_universal_stable_v12_${timestamp}.html`; 
  }

  function prepareDownloadLink(htmlString) {
    const filename = getDownloadFilename();
    if (currentBlobUrl) {
      try { URL.revokeObjectURL(currentBlobUrl); } catch {}
      currentBlobUrl = null;
    }
    const blob = new Blob([htmlString], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    currentBlobUrl = url;

    if (!downloadLink) {
      downloadLink = document.createElement('a');
      downloadLink.id = 'downloadLink';
      (outputEl?.parentNode || document.body).appendChild(downloadLink);
    }
    
    downloadLink.textContent = `⬇️ Download: ${filename}`;
    downloadLink.href = url;
    downloadLink.download = filename;
    downloadLink.style.display = 'inline-block';
    
    downloadLink.onclick = () => setTimeout(() => { try { URL.revokeObjectURL(url); } catch {} }, 2000);
  }

  // --- Initialization dan Event Attachment (SIBUK) ---
  function attach() {
    // 1. Core Handlers
    btnEncrypt?.addEventListener('click', encryptHandler);
    btnCopy?.addEventListener('click', copyHandler);
    btnClear?.addEventListener('click', clearHandler);
    
    inputEl?.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        encryptHandler();
      }
    });

    window.addEventListener('beforeunload', () => {
      if (currentBlobUrl) try { URL.revokeObjectURL(currentBlobUrl); } catch {}
    });

    // 2. DUMMY HANDLERS & COMPLEX LISTENERS (MAX HANDLERS)
    window.addEventListener('resize', globalResizeHandler);
    window.addEventListener('scroll', dummyConsoleHandler);
    window.addEventListener('mousemove', dummyConsoleHandler);
    document.addEventListener('visibilitychange', dummyConsoleHandler);

    inputEl?.addEventListener('keyup', fakeInteractionHandler);
    inputEl?.addEventListener('keypress', fakeInteractionHandler);
    
    outputEl?.addEventListener('mouseover', dummyConsoleHandler);
    outputEl?.addEventListener('mouseout', dummyConsoleHandler);
    
    document.body.addEventListener('click', fakeInteractionHandler);
    document.addEventListener('contextmenu', dummyConsoleHandler);
    
    const dummyButton = $('dummy-button') || document.querySelector('.dummy-class');
    dummyButton?.addEventListener('click', dummyConsoleHandler);
    
    const settingsIcon = $('settings-icon') || document.querySelector('#gear');
    settingsIcon?.addEventListener('click', fakeInteractionHandler);
    
    try {
      document.lastAction = Date.now();
      document.querySelector('meta[name="viewport"]')?.setAttribute('content', 'width=device-width,initial-scale=1,user-scalable=no');
    } catch(e) {}
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attach);
  } else {
    attach();
  }

  window.NebulaEncryptor = { 
    xorCipher, 
    unicodeToBase64, // Ganti kembali ke nama fungsi universal
    buildLoaderFile, 
    encryptHandler, 
    copyHandler, 
    clearHandler 
  };
})();
