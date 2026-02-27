
let pirmasSkaicius = '';
let antrasSkaicius = '';
let veiksmas = '';
let rezultatas = '';
let pradetiIsNaujo = false;

const operacijosLaukas = document.querySelector('.calculator-operation');
const rezultatoLaukas = document.querySelector('.calculator-operation-result');
const mygtukai = document.querySelectorAll('.calculator-button');

function atnaujintiIsvedima() {
  rezultatoLaukas.textContent = rezultatas || antrasSkaicius || pirmasSkaicius || '0';
  operacijosLaukas.textContent = pirmasSkaicius + ' ' + veiksmas + ' ' + antrasSkaicius;
}

function atliktiVeiksma() {
  const a = parseFloat(pirmasSkaicius);
  const b = parseFloat(antrasSkaicius);
  if (isNaN(a) || isNaN(b)) return;

  switch (veiksmas) {
    case '+': rezultatas = (a + b).toString(); break;
    case '-': rezultatas = (a - b).toString(); break;
    case '*': rezultatas = (a * b).toString(); break;
    case '/': rezultatas = b !== 0 ? (a / b).toString() : 'Klaida'; break;
    case '%': rezultatas = (a % b).toString(); break;
  }

  pirmasSkaicius = rezultatas;
  antrasSkaicius = '';
  veiksmas = '';
  pradetiIsNaujo = true;
  atnaujintiIsvedima();
}

function spauskSkaiciu(s) {
  if (pradetiIsNaujo) {
    pirmasSkaicius = '';
    rezultatas = '';
    pradetiIsNaujo = false;
  }

  if (veiksmas === '') pirmasSkaicius += s;
  else antrasSkaicius += s;

  atnaujintiIsvedima();
}

function spauskVeiksma(op) {
  if (pirmasSkaicius === '') return;
  if (veiksmas && antrasSkaicius) atliktiVeiksma();
  veiksmas = op;
  atnaujintiIsvedima();
}

function isvalyti() {
  pirmasSkaicius = '';
  antrasSkaicius = '';
  veiksmas = '';
  rezultatas = '';
  pradetiIsNaujo = false;
  atnaujintiIsvedima();
}

function trintiPaskutini() {
  if (antrasSkaicius) antrasSkaicius = antrasSkaicius.slice(0, -1);
  else if (veiksmas) veiksmas = '';
  else pirmasSkaicius = pirmasSkaicius.slice(0, -1);
  atnaujintiIsvedima();
}

mygtukai.forEach(m => {
  m.addEventListener('click', () => {
    const val = m.dataset.value;

    if (!isNaN(val) || val === '.') {
      spauskSkaiciu(val);
    } else if (['+', '-', '*', '/', '%'].includes(val)) {
      spauskVeiksma(val);
    } else if (val === '=') {
      atliktiVeiksma();
    } else if (val === 'C') {
      isvalyti();
    } else if (val === 'back') {
      trintiPaskutini();
    }
  });
});

document.addEventListener('keydown', e => {
  const key = e.key;
  if (!isNaN(key) || key === '.') spauskSkaiciu(key);
  if (['+', '-', '*', '/', '%'].includes(key)) spauskVeiksma(key);
  if (key === 'Enter') atliktiVeiksma();
  if (key === 'Backspace') trintiPaskutini();
  if (key === 'Escape') isvalyti();
});
