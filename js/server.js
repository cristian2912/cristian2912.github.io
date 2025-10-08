
// server_v2.js - acepta JSON y x-www-form-urlencoded, guarda en CSV
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const dataDir = path.join(__dirname, 'data');
const fileCSV = path.join(dataDir, 'contactos.csv');

function ensureStorage(){
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(fileCSV)) fs.writeFileSync(fileCSV, 'fecha,nombre,telefono,mail,servicio,mensaje\n');
}
function clean(s){ return String(s||'').replace(/\r?\n/g,' ').replace(/,/g,';').trim(); }

function parseBody(req, cb){
  let body='';
  req.on('data', chunk => { body += chunk; if (body.length > 1e6) req.destroy(); });
  req.on('end', ()=>{
    const ct = (req.headers['content-type'] || '').toLowerCase();
    try{
      if (ct.includes('application/json')){
        cb(null, JSON.parse(body||'{}'));
      } else if (ct.includes('application/x-www-form-urlencoded')){
        const parsed = Object.fromEntries(Object.entries(parseQS(body)));
        cb(null, parsed);
      } else {
        // intenta JSON por defecto
        try { cb(null, JSON.parse(body||'{}')); }
        catch{ cb(null, {}); }
      }
    }catch(e){ cb(e); }
  });
}
function parseQS(body){
  const obj = {};
  const qs = new URLSearchParams(body);
  for (const [k,v] of qs.entries()) obj[k]=v;
  return obj;
}

const server = http.createServer((req,res)=>{
  // CORS
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if (req.method === 'OPTIONS'){ res.writeHead(204); return res.end(); }

  const url = new URL(req.url, 'http://localhost');
  if (req.method === 'GET' && url.pathname === '/'){
    res.writeHead(200, {'Content-Type':'text/plain'});
    return res.end('API viva en /contacto (POST)');
  }

  if (url.pathname === '/contacto'){
    if (req.method !== 'POST'){
      res.writeHead(405, {'Content-Type':'application/json'});
      return res.end(JSON.stringify({ok:false, error:'Use POST'}));
    }
    return parseBody(req, (err, data)=>{
      if (err){ res.writeHead(400,{'Content-Type':'application/json'}); return res.end(JSON.stringify({ok:false, error:'Body inválido'})); }
      const { nombre, telefono, mail, servicio, mensaje } = data || {};
      ensureStorage();
      const fecha = new Date().toISOString();
      const row = [fecha, clean(nombre), clean(telefono), clean(mail), clean(servicio), clean(mensaje)].join(',') + '\n';
      fs.appendFile(fileCSV, row, (e)=>{
        if (e){ res.writeHead(500,{'Content-Type':'application/json'}); return res.end(JSON.stringify({ok:false})); }
        console.log('OK:', nombre, telefono, mail, servicio);
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end(JSON.stringify({ok:true}));
      });
    });
  }

  res.writeHead(404, {'Content-Type':'application/json'});
  res.end(JSON.stringify({ok:false, error:'Not found'}));
});

server.listen(PORT, ()=> console.log('API http://localhost:'+PORT));
