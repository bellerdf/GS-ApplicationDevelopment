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
    const authRes = await fetch(`${BASE_URL}/Login/Autenticar?token=${TOKEN}`, {
      method: 'POST'
    });
    const authText = await authRes.text();

    if (!authText.includes('true')) {
      return res.status(401).json({ erro: "Token inválido" });
    }

    // Pega o cookie retornado pelo login
    const cookie = authRes.headers.get('set-cookie') || '';

    let endpoint = acao === 'buscarParada' 
      ? `/Parada/Buscar?termosBusca=${encodeURIComponent(termo)}`
      : `/Previsao/Parada?codigoParada=${encodeURIComponent(codigoParada)}`;

    const dataRes = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: { 'Cookie': cookie }
    });

    const data = await dataRes.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
}
