const bd = require('../bd/bd_utils.js');
const modelo = require('../modelo.js');

beforeEach(() => {
  bd.reconfig('./bd/esmforum-teste.db');
  // limpa dados de todas as tabelas
  bd.exec('delete from perguntas', []);
  bd.exec('delete from respostas', []);
});

test('Testando banco de dados vazio', () => {
  expect(modelo.listar_perguntas().length).toBe(0);
});

test('Testando cadastro de três perguntas', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');
  modelo.cadastrar_pergunta('2 + 2 = ?');
  modelo.cadastrar_pergunta('3 + 3 = ?');
  const perguntas = modelo.listar_perguntas(); 
  expect(perguntas.length).toBe(3);
  expect(perguntas[0].texto).toBe('1 + 1 = ?');
  expect(perguntas[1].texto).toBe('2 + 2 = ?');
  expect(perguntas[2].num_respostas).toBe(0);
  expect(perguntas[1].id_pergunta).toBe(perguntas[2].id_pergunta-1);
});

test('Testando pergunta texto', () => {
  const textoPergunta = 'O que é o que é, que tem cabeça, corpo, mas não tem braços nem pernas?';
  modelo.cadastrar_pergunta(textoPergunta);
  const perguntas = modelo.listar_perguntas();  
  const id = perguntas[0].id_pergunta;
  expect(modelo.get_pergunta(id).texto).toBe(textoPergunta);
});

test('Testando respostas', () => {
  modelo.cadastrar_pergunta('O que é que é, que quanto mais se tira, maior fica?');
  const perguntas = modelo.listar_perguntas();  
  const id = perguntas[0].id_pergunta;
  modelo.cadastrar_resposta(id, 'O buraco');
  const respostas = modelo.get_respostas(id);   
  expect(respostas[0].texto).toBe('O buraco');
});

test('Testando número de respostas', () => {
  modelo.cadastrar_pergunta('Dentro da caixa o gato está?');
  const perguntas = modelo.listar_perguntas();  
  const id = perguntas[0].id_pergunta;
  modelo.cadastrar_resposta(id, 'Vivo');
  modelo.cadastrar_resposta(id, 'Morto');
  expect(modelo.get_num_respostas(id)).toBe(2);
});
