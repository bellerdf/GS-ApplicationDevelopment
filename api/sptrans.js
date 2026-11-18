export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const TOKEN = "87e2eabd59625aaab31a4b2f33e6e4717ca31c8b766ebef5d52122a941fc4b69";
  const BASE_URL = "https://api.olhovivo.sptrans.com.br/v2.1";
  const { acao, termo, codigoParada } = req.query;

  try {
    const authRes = await fetch(`${BASE_URL}/Login/Autenticar?token=${TOKEN}`, {
      method: 'POST'
    });
    
    const authText = await authRes.text();
    if (!authText.includes('true')) {
      return res.status(401).json({ erro: "Autenticação falhou na SPTrans" });
    }

    const cookieHeader = authRes.headers.get('set-cookie') || '';

    let endpoint = '';
    if (acao === 'buscarParada') {
      endpoint = `/Parada/Buscar?termosBusca=${encodeURIComponent(termo)}`;
    } else if (acao === 'previsaoParada') {
      endpoint = `/Previsao/Parada?codigoParada=${encodeURIComponent(codigoParada)}`;
    } else {
      return res.status(400).json({ erro: "Ação inválida" });
    }

    const dataRes = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Cookie': cookieHeader
      }
    });

    const data = await dataRes.json();
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ erro: error.message });
  }
}
