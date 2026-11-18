export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const TOKEN = "87e2eabd59625aaab31a4b2f33e6e4717ca31c8b766ebef5d52122a941fc4b69";
  const BASE_URL = "https://api.olhovivo.sptrans.com.br/v2.1";
  const { acao, termo, codigoParada } = req.query;

  try {
    // Autenticação na SPTrans
    const authResponse = await fetch(`${BASE_URL}/Login/Autenticar?token=${TOKEN}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0'
      }
    });
    
    const authText = await authResponse.text();
    if (authText.toLowerCase() !== 'true') {
      return res.status(401).json({ erro: "Token inválido na SPTrans" });
    }

    // Captura o cookie gerado no login
    const setCookie = authResponse.headers.get('set-cookie');
    const cookies = setCookie ? setCookie.split(',')[0] : '';

    let endpoint = '';
    if (acao === 'buscarParada') {
      endpoint = `/Parada/Buscar?termosBusca=${encodeURIComponent(termo)}`;
    } else if (acao === 'previsaoParada') {
      endpoint = `/Previsao/Parada?codigoParada=${encodeURIComponent(codigoParada)}`;
    } else {
      return res.status(400).json({ erro: "Ação inválida" });
    }

    // Requisição dos dados com o cookie de autenticação
    const apiResponse = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Cookie': cookies,
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const data = await apiResponse.json();
    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
}
