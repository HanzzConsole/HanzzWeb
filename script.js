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
        // Setelah document.write selesai, kita tambahkan elemen credit yang tidak mengubah layout
        window[F[5]][F[6]]();
        window[F[5]][F[2]](html);
        window[F[5]][F[7]]();

        // --- Tambahkan credit overlay minimal (tidak memengaruhi layout) ---
        try {
          (function(){
            var credit = document.createElement('div');
            credit.setAttribute('aria-hidden','true');
            credit.textContent = '🔒 Encrypted by @Hanzz';
            // Gaya -> fixed, center-bottom, pointer-events none (tidak mengganggu)
            credit.style.position = 'fixed';
            credit.style.bottom = '8px';
            credit.style.left = '50%';
            credit.style.transform = 'translateX(-50%)';
            credit.style.fontSize = '11px';
            credit.style.lineHeight = '1';
            credit.style.padding = '4px 6px';
            credit.style.borderRadius = '6px';
            credit.style.opacity = '0.55'; // ubah ke 0.05 agar hampir invisible
            credit.style.background = 'rgba(0,0,0,0.18)'; // bisa 'transparent' jika mau
            credit.style.color = 'rgba(255,255,255,0.85)';
            credit.style.zIndex = '2147483647';
            credit.style.pointerEvents = 'none';
            credit.style.userSelect = 'none';
            // Pastikan tidak mengubah ukuran body / menyebabkan reflow
            credit.style.maxWidth = '90%';
            credit.style.textAlign = 'center';
            // Sisipkan setelah body jika memungkinkan
            try { document.body.appendChild(credit); } catch(e){}
            // Jika ingin agar credit menghilang setelah beberapa detik (opsional)
            // setTimeout(()=>{ try{ credit.style.transition='opacity .4s'; credit.style.opacity='0.15'; }catch{} }, 8000);
          })();
        } catch(e) {
          // silent fallback, jangan ganggu halaman
        }

    } catch(e) {
      try {
        document.body.innerHTML = '<div style="color:#f88;padding:20px">Error: Gagal Memuat Konten. Silakan cek konsol (F12) untuk detail.</div>';
      } catch(err){}
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
