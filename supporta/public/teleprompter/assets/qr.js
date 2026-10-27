/**
 * Gerador de QR Code (modo byte, correcao de erro nivel M).
 *
 * Escrito aqui em vez de importar uma biblioteca porque o app inteiro precisa
 * abrir sem nenhuma dependencia externa e funcionar com internet ruim.
 * Implementa a especificacao ISO/IEC 18004: Reed-Solomon, posicionamento de
 * modulos, mascaras e escolha da mascara por penalidade.
 */

// ------------------------------------------------------------- Galois (GF 256)
const EXP = new Uint8Array(512);
const LOG = new Uint8Array(256);
(function tabelas() {
    let x = 1;
    for (let i = 0; i < 255; i++) {
        EXP[i] = x;
        LOG[x] = i;
        x <<= 1;
        if (x & 0x100) x ^= 0x11d;
    }
    for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
})();

const mul = (a, b) => (a === 0 || b === 0 ? 0 : EXP[LOG[a] + LOG[b]]);

function polinomioGerador(grau) {
    let p = [1];
    for (let i = 0; i < grau; i++) {
        const novo = new Array(p.length + 1).fill(0);
        for (let j = 0; j < p.length; j++) {
            novo[j] ^= p[j];
            novo[j + 1] ^= mul(p[j], EXP[i]);
        }
        p = novo;
    }
    return p;
}

function correcao(dados, quantidade) {
    const gen = polinomioGerador(quantidade);
    const resto = new Array(quantidade).fill(0);
    for (const byte of dados) {
        const fator = byte ^ resto[0];
        resto.shift();
        resto.push(0);
        if (fator !== 0) {
            for (let i = 0; i < quantidade; i++) resto[i] ^= mul(gen[i + 1], fator);
        }
    }
    return resto;
}

// --------------------------------------------------------------- tabelas QR
// Por versao (1 a 10), nivel M: [total de codewords de dados, codewords de
// correcao por bloco, blocos do grupo 1, blocos do grupo 2]
const VERSOES = {
    1: [16, 10, 1, 0],
    2: [28, 16, 1, 0],
    3: [44, 26, 1, 0],
    4: [64, 18, 2, 0],
    5: [86, 24, 2, 0],
    6: [108, 16, 4, 0],
    7: [124, 18, 4, 0],
    8: [154, 22, 2, 2],
    9: [182, 22, 3, 2],
    10: [216, 26, 4, 1],
};

const ALINHAMENTO = {
    1: [],
    2: [6, 18],
    3: [6, 22],
    4: [6, 26],
    5: [6, 30],
    6: [6, 34],
    7: [6, 22, 38],
    8: [6, 24, 42],
    9: [6, 26, 46],
    10: [6, 28, 50],
};

/**
 * Gera a matriz do QR.
 * @param {string} texto
 * @returns {boolean[][]} matriz quadrada, true = modulo escuro
 */
export function gerarQR(texto) {
    const bytes = new TextEncoder().encode(texto);

    // escolhe a menor versao que comporta os dados
    let versao = 0;
    for (let v = 1; v <= 10; v++) {
        const capacidade = VERSOES[v][0] - (v >= 10 ? 3 : 2); // cabecalho: modo + contador
        if (bytes.length <= capacidade) {
            versao = v;
            break;
        }
    }
    if (!versao) throw new Error("texto longo demais para o QR");

    const [totalDados, ecPorBloco, g1, g2] = VERSOES[versao];
    const tamanho = 17 + versao * 4;

    // ---------------------------------------------------------- bits de dados
    const bits = [];
    const push = (valor, n) => {
        for (let i = n - 1; i >= 0; i--) bits.push((valor >> i) & 1);
    };

    push(0b0100, 4); // modo byte
    push(bytes.length, versao >= 10 ? 16 : 8);
    for (const b of bytes) push(b, 8);

    const capacidadeBits = totalDados * 8;
    for (let i = 0; i < 4 && bits.length < capacidadeBits; i++) bits.push(0); // terminador
    while (bits.length % 8 !== 0) bits.push(0);

    const dados = [];
    for (let i = 0; i < bits.length; i += 8) {
        let byte = 0;
        for (let j = 0; j < 8; j++) byte = (byte << 1) | bits[i + j];
        dados.push(byte);
    }
    const preenchimento = [0xec, 0x11];
    let k = 0;
    while (dados.length < totalDados) dados.push(preenchimento[k++ % 2]);

    // ------------------------------------------------------ blocos e correcao
    const totalBlocos = g1 + g2;
    const baseTam = Math.floor(totalDados / totalBlocos);
    const blocosDados = [];
    const blocosEC = [];
    let pos = 0;
    for (let i = 0; i < totalBlocos; i++) {
        const tam = i < g1 ? baseTam : baseTam + 1;
        const bloco = dados.slice(pos, pos + tam);
        pos += tam;
        blocosDados.push(bloco);
        blocosEC.push(correcao(bloco, ecPorBloco));
    }

    // intercala
    const finais = [];
    const maiorDado = Math.max(...blocosDados.map((b) => b.length));
    for (let i = 0; i < maiorDado; i++) {
        for (const b of blocosDados) if (i < b.length) finais.push(b[i]);
    }
    for (let i = 0; i < ecPorBloco; i++) {
        for (const b of blocosEC) finais.push(b[i]);
    }

    // ---------------------------------------------------------- matriz
    const m = Array.from({ length: tamanho }, () => new Array(tamanho).fill(null));

    const marcarFinder = (linha, coluna) => {
        for (let i = -1; i <= 7; i++) {
            for (let j = -1; j <= 7; j++) {
                const l = linha + i;
                const c = coluna + j;
                if (l < 0 || l >= tamanho || c < 0 || c >= tamanho) continue;
                const borda = i >= 0 && i <= 6 && (j === 0 || j === 6);
                const topo = j >= 0 && j <= 6 && (i === 0 || i === 6);
                const miolo = i >= 2 && i <= 4 && j >= 2 && j <= 4;
                m[l][c] = borda || topo || miolo;
            }
        }
    };
    marcarFinder(0, 0);
    marcarFinder(0, tamanho - 7);
    marcarFinder(tamanho - 7, 0);

    // timing
    for (let i = 8; i < tamanho - 8; i++) {
        m[6][i] = i % 2 === 0;
        m[i][6] = i % 2 === 0;
    }

    // alinhamento
    const centros = ALINHAMENTO[versao];
    for (const a of centros) {
        for (const b of centros) {
            if ((a === 6 && b === 6) || (a === 6 && b === tamanho - 7) || (a === tamanho - 7 && b === 6)) continue;
            for (let i = -2; i <= 2; i++) {
                for (let j = -2; j <= 2; j++) {
                    m[a + i][b + j] = Math.max(Math.abs(i), Math.abs(j)) !== 1;
                }
            }
        }
    }

    // modulo escuro fixo
    m[tamanho - 8][8] = true;

    // reserva area de formato
    const reservado = Array.from({ length: tamanho }, () => new Array(tamanho).fill(false));
    for (let i = 0; i < 9; i++) {
        if (m[8][i] === null) reservado[8][i] = true;
        if (m[i][8] === null) reservado[i][8] = true;
    }
    for (let i = 0; i < 8; i++) {
        if (m[8][tamanho - 1 - i] === null) reservado[8][tamanho - 1 - i] = true;
        if (m[tamanho - 1 - i][8] === null) reservado[tamanho - 1 - i][8] = true;
    }

    // ------------------------------------------------------- colocacao dos bits
    const fluxo = [];
    for (const byte of finais) for (let i = 7; i >= 0; i--) fluxo.push((byte >> i) & 1);

    let idx = 0;
    let subindo = true;
    for (let col = tamanho - 1; col > 0; col -= 2) {
        if (col === 6) col--; // pula a coluna de timing
        for (let passo = 0; passo < tamanho; passo++) {
            const linha = subindo ? tamanho - 1 - passo : passo;
            for (let d = 0; d < 2; d++) {
                const c = col - d;
                if (m[linha][c] !== null || reservado[linha][c]) continue;
                m[linha][c] = idx < fluxo.length ? fluxo[idx++] === 1 : false;
            }
        }
        subindo = !subindo;
    }

    // ------------------------------------------------------------- mascaras
    const MASCARAS = [
        (i, j) => (i + j) % 2 === 0,
        (i) => i % 2 === 0,
        (i, j) => j % 3 === 0,
        (i, j) => (i + j) % 3 === 0,
        (i, j) => (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0,
        (i, j) => ((i * j) % 2) + ((i * j) % 3) === 0,
        (i, j) => (((i * j) % 2) + ((i * j) % 3)) % 2 === 0,
        (i, j) => (((i + j) % 2) + ((i * j) % 3)) % 2 === 0,
    ];

    const ehFuncional = (i, j) => {
        if (i === 6 || j === 6) return true;
        if (i < 9 && j < 9) return true;
        if (i < 9 && j >= tamanho - 8) return true;
        if (i >= tamanho - 8 && j < 9) return true;
        for (const a of centros) {
            for (const b of centros) {
                if ((a === 6 && b === 6) || (a === 6 && b === tamanho - 7) || (a === tamanho - 7 && b === 6)) continue;
                if (Math.abs(i - a) <= 2 && Math.abs(j - b) <= 2) return true;
            }
        }
        return false;
    };

    function penalidade(mat) {
        let p = 0;
        // 1: sequencias de 5 ou mais iguais
        for (let i = 0; i < tamanho; i++) {
            for (const eixo of [0, 1]) {
                let cor = null;
                let seq = 0;
                for (let j = 0; j < tamanho; j++) {
                    const v = eixo === 0 ? mat[i][j] : mat[j][i];
                    if (v === cor) seq++;
                    else {
                        if (seq >= 5) p += 3 + (seq - 5);
                        cor = v;
                        seq = 1;
                    }
                }
                if (seq >= 5) p += 3 + (seq - 5);
            }
        }
        // 2: blocos 2x2
        for (let i = 0; i < tamanho - 1; i++) {
            for (let j = 0; j < tamanho - 1; j++) {
                const v = mat[i][j];
                if (v === mat[i][j + 1] && v === mat[i + 1][j] && v === mat[i + 1][j + 1]) p += 3;
            }
        }
        // 3: padrao parecido com finder
        const alvo1 = [true, false, true, true, true, false, true, false, false, false, false];
        const alvo2 = [false, false, false, false, true, false, true, true, true, false, true];
        for (let i = 0; i < tamanho; i++) {
            for (let j = 0; j < tamanho - 10; j++) {
                const linha = [];
                const coluna = [];
                for (let k = 0; k < 11; k++) {
                    linha.push(mat[i][j + k]);
                    coluna.push(mat[j + k][i]);
                }
                const igual = (a, b) => a.every((v, n) => v === b[n]);
                if (igual(linha, alvo1) || igual(linha, alvo2)) p += 40;
                if (igual(coluna, alvo1) || igual(coluna, alvo2)) p += 40;
            }
        }
        // 4: proporcao de modulos escuros
        let escuros = 0;
        for (let i = 0; i < tamanho; i++) for (let j = 0; j < tamanho; j++) if (mat[i][j]) escuros++;
        const perc = (escuros * 100) / (tamanho * tamanho);
        p += Math.floor(Math.abs(perc - 50) / 5) * 10;
        return p;
    }

    // informacao de formato (nivel M = 0b00) com BCH
    function bitsFormato(mascara) {
        const dadosFmt = (0b00 << 3) | mascara;
        let v = dadosFmt << 10;
        for (let i = 4; i >= 0; i--) {
            if ((v >> (i + 10)) & 1) v ^= 0b10100110111 << i;
        }
        return ((dadosFmt << 10) | v) ^ 0b101010000010010;
    }

    let melhor = null;
    let melhorNota = Infinity;
    let melhorMascara = 0;

    for (let mascara = 0; mascara < 8; mascara++) {
        const teste = m.map((linha) => [...linha]);
        for (let i = 0; i < tamanho; i++) {
            for (let j = 0; j < tamanho; j++) {
                if (!ehFuncional(i, j) && MASCARAS[mascara](i, j)) teste[i][j] = !teste[i][j];
            }
        }
        // aplica formato antes de pontuar
        const fmt = bitsFormato(mascara);
        aplicarFormato(teste, fmt, tamanho);
        const nota = penalidade(teste);
        if (nota < melhorNota) {
            melhorNota = nota;
            melhor = teste;
            melhorMascara = mascara;
        }
    }

    return melhor;
}

function aplicarFormato(mat, fmt, tamanho) {
    // Atencao a ordem: aqui a matriz e [linha][coluna]. A primeira copia corre
    // pela COLUNA 8 (de cima para baixo) e depois pela LINHA 8; a segunda copia
    // faz o inverso. Trocar os dois eixos gera um QR que nenhum leitor decodifica.
    const bit = (i) => ((fmt >> i) & 1) === 1;

    // copia 1: coluna 8 (linhas 0 a 5), depois linha 8 (colunas 7 a 0)
    for (let i = 0; i <= 5; i++) mat[i][8] = bit(i);
    mat[7][8] = bit(6);
    mat[8][8] = bit(7);
    mat[8][7] = bit(8);
    for (let i = 9; i <= 14; i++) mat[8][14 - i] = bit(i);

    // copia 2: linha 8 (colunas da direita), depois coluna 8 (linhas de baixo)
    for (let i = 0; i <= 7; i++) mat[8][tamanho - 1 - i] = bit(i);
    for (let i = 8; i <= 14; i++) mat[tamanho - 15 + i][8] = bit(i);

    mat[tamanho - 8][8] = true; // modulo sempre escuro
}

/** Devolve o QR como SVG pronto para inserir. */
export function qrSVG(texto, lado = 168) {
    const m = gerarQR(texto);
    const n = m.length;
    const borda = 2;
    const total = n + borda * 2;
    let caminho = "";
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (m[i][j]) caminho += `M${j + borda},${i + borda}h1v1h-1z`;
        }
    }
    return `<svg viewBox="0 0 ${total} ${total}" width="${lado}" height="${lado}" role="img" aria-label="QR code para abrir no celular"><rect width="${total}" height="${total}" fill="#fff"/><path d="${caminho}" fill="#000"/></svg>`;
}
