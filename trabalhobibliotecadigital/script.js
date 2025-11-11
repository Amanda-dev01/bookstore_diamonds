// script.js — versão unificada e robusta
(function () {
  "use strict";

  /* ===================== UTIL ===================== */
  const safeQuery = (selector, ctx = document) => ctx.querySelector(selector);
  const safeQueryAll = (selector, ctx = document) => Array.from(ctx.querySelectorAll(selector));

  /* ===================== CARROSSEL VAI E VEM ===================== */
  function ativarCarrosselVaieVem(carrosselContainerSelector) {
    const containers = document.querySelectorAll(carrosselContainerSelector);
    if (!containers.length) return;

    containers.forEach(container => {
      const carrossel = safeQuery(".carrossel", container);
      const setaEsq = safeQuery(".seta.esquerda", container);
      const setaDir = safeQuery(".seta.direita", container);
      if (!carrossel) return;

      // setas opcionais
      if (setaDir) {
        setaDir.addEventListener("click", () => {
          carrossel.scrollBy({ left: 300, behavior: "smooth" });
        });
      }
      if (setaEsq) {
        setaEsq.addEventListener("click", () => {
          carrossel.scrollBy({ left: -300, behavior: "smooth" });
        });
      }

      // AUTOPLAY (silencioso se o container tem menos itens)
      let autoPlayInterval = null;
      let direction = 1;
      const scrollStep = 1;
      const intervalTime = 15;

      function startAutoPlay() {
        // evita autoplay se conteúdo for menor que área visível
        if (carrossel.scrollWidth <= carrossel.clientWidth) return;
        clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(() => {
          carrossel.scrollLeft += scrollStep * direction;
          const scrollMax = carrossel.scrollWidth - carrossel.clientWidth;
          if (carrossel.scrollLeft >= scrollMax - 1) direction = -1;
          else if (carrossel.scrollLeft <= 0) direction = 1;
        }, intervalTime);
      }

      function stopAutoPlay() {
        clearInterval(autoPlayInterval);
      }

      carrossel.addEventListener("mouseenter", stopAutoPlay);
      carrossel.addEventListener("mouseleave", startAutoPlay);

      // inicia autoplay com proteção
      startAutoPlay();
    });
  }

  /* ===================== DADOS / HELPERS ===================== */
  const livrosDados = {
    "A-CHAVE-DO-LABIRINTO-ASTRAL": {
      titulo: "A Chave do Labirinto Astral",
      autor: "Orion Nova",
      valor: "R$ 24,99",
      imagem: "Imagens/Livros/A-CHAVE-DO-LABIRINTO-ASTRAL.png"
    },
    "A-CRONISTA-DOS-CEUS-ESQUECIDOS": {
      titulo: "A Cronista dos Ceus Esquecidos",
      autor: "Aura Meridien",
      valor: "R$ 59,90",
      imagem: "Imagens/Livros/A-CRONISTA-DOS-CEUS-ESQUECIDOS.png"
    },
    "A-CRONOMETISTA-DO-TEMPO-PERDIDO": {
      titulo: "A Cronometista do Tempo Perdido",
      autor: "Clara Tempus",
      valor: "R$ 59,90",
      imagem: "Imagens/Livros/A-CRONOMETISTA-DO-TEMPO-PERDIDO.png"
    },
    "A-DAMA-DO-DESERTO-DE-AREIA": {
      titulo: "A Dama do Deserto de Areia",
      autor: "Zara Oasis",
      valor: "R$ 59,90",
      imagem: "Imagens/Livros/A-DAMA-DO-DESERTO-DE-AREIA.png"
    },
    "A-ENGRENAGEM-DO-DESTINO": {
      titulo: "A Engrenagem do Destino",
      autor: "Kaelen Reid",
      valor: "R$ 36,99",
      imagem: "Imagens/Livros/A-ENGRENAGEM-DO-DESTINO.png"
    },
    "A-FLAUTA-DOS-VENTOS-ESCONDIDOS": {
      titulo: "A Flauta dos Ventos Escondidos",
      autor: "Elara Swift",
      valor: "R$ 99,90",
      imagem: "Imagens/Livros/A-FLAUTA-DOS-VENTOS-ESCONDIDOS.png"
    },
    "A-MELODIA-SILENCIOSA-DA-LUA": {
      titulo: "A Melodia Silenciosa da Lua",
      autor: "Rhys Montgomery",
      valor: "R$ 59,90",
      imagem: "Imagens/Livros/A-MELODIA-SILENCIOSA-DA-LUA.png"
    },
    "A-SINFONIA-CRISTALINA-DOS-ORBES": {
      titulo: "A Sinfonia Cristalina dos Orbes",
      autor: "Professor Alistair Finch",
      valor: "R$ 49,90",
      imagem: "Imagens/Livros/A-SINFONIA-CRISTALINA-DOS-ORBES.png"
    },
    "A-TECEIRA-DE-DESTINOS-NA-FLORESTA-SOMBRIA": {
      titulo: "A Teceira de Destinos na Floresta Sombria",
      autor: "Luna Whisper",
      valor: "R$ 59,90",
      imagem: "Imagens/Livros/A-TECEIRA-DE-DESTINOS-NA-FLORESTA-SOMBRIA.png"
    },
    "O-ALQUIMISTA-DA-LUZ-ETERNA": {
      titulo: "O Alquimista da Luz Eterna",
      autor: "Dr. Silas Vesper",
      valor: "R$ 59,90",
      imagem: "Imagens/Livros/O-ALQUIMISTA-DA-LUZ-ETERNA.png"
    },
  };

  /* ===================== ATUALIZAÇÃO DA VISUALIZAÇÃO ===================== */
  function atualizarVisualizacao(idLivro) {
    const visualizacao = safeQuery("#livro-visualizacao");
    if (!visualizacao) return;

    const img = safeQuery("#livro-imagem", visualizacao);
    const titulo = safeQuery("#livro-titulo", visualizacao);
    const autor = safeQuery("#livro-autor", visualizacao);
    const valor = safeQuery("#livro-valor", visualizacao);

    if (!idLivro || !livrosDados[idLivro]) {
      visualizacao.style.display = "none";
      return;
    }

    const data = livrosDados[idLivro];
    visualizacao.style.display = "flex";
    if (img) { img.src = data.imagem; img.alt = data.titulo; }
    if (titulo) titulo.textContent = data.titulo;
    if (autor) autor.textContent = `Autor: ${data.autor}`;
    if (valor) valor.textContent = data.valor;
  }

  /* ===================== AÇÃO PARA CLIQUE NOS ITENS DA GALERIA (delegation) ===================== */
  function ativarCliqueGaleria() {
    const galeria = safeQuery(".galeria-livros");
    if (!galeria) return;

    galeria.addEventListener("click", (e) => {
      const livro = e.target.closest(".livro-item");
      if (!livro) return; // clicou fora de um item
      if (!livro.dataset.titulo && !livro.dataset.id) return;

      const idLivro = livro.dataset.id || livro.dataset.titulo.toLowerCase().replace(/\s+/g, '-');
      const dados = {
        id: idLivro,
        titulo: livro.dataset.titulo,
        autor: livro.dataset.autor,
        sinopse: livro.dataset.sinopse,
        valor: livro.dataset.valor,
        imagem: livro.dataset.imagem
      };

      localStorage.setItem('livroSelecionado', JSON.stringify(dados));
      // navega para página de compra (se existir). Se não, deixa salvo.
      window.location.href = `comprar_${idLivro}.html`;
    });
  }

  /* ===================== PESQUISA NA BIBLIOTECA ===================== */
  function ativarPesquisaBiblioteca() {
    const campoPesquisa = safeQuery("#campo-pesquisa");
    const galeria = safeQuery(".galeria-livros");
    if (!campoPesquisa || !galeria) return;

    // Guard snapshot da ordem original
    const livrosItens = safeQueryAll(".livro-item", galeria);
    const ordemOriginal = Array.from(livrosItens);

    campoPesquisa.addEventListener("input", () => {
      const termo = campoPesquisa.value.toLowerCase().trim();
      let encontrou = false;

      const itens = safeQueryAll(".livro-item", galeria);
      itens.forEach(livro => {
        const tituloEl = livro.querySelector("h3");
        const titulo = tituloEl ? tituloEl.textContent.toLowerCase() : "";
        livro.classList.remove("destacado");
        livro.classList.remove("hidden");
        if (termo && titulo.includes(termo)) {
          livro.classList.add("destacado");
          encontrou = true;
        } else if (termo) {
          livro.classList.add("hidden");
        }
      });

      if (encontrou) {
        const livroDestacado = galeria.querySelector(".livro-item.destacado");
        if (livroDestacado) {
          galeria.prepend(livroDestacado);
          livroDestacado.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }

      if (!termo) {
        // restaura ordem original
        galeria.innerHTML = "";
        ordemOriginal.forEach(livro => galeria.appendChild(livro));
      }
    });
  }

  /* ===================== FUNÇÃO COMPRAR (usada em páginas de detalhe) ===================== */
  function comprarLivro(idLivro) {
    if (!idLivro || !livrosDados[idLivro]) return;
    const dados = livrosDados[idLivro];
    localStorage.setItem('livroSelecionado', JSON.stringify({ id: idLivro, ...dados }));
  }

  /* ===================== INICIALIZAÇÃO GERAL (DOM ready) ===================== */
  window.addEventListener("DOMContentLoaded", () => {
    // 1) ativa carrossel (se presente)
    ativarCarrosselVaieVem(".carrossel-container");

    // 2) ativa pesquisa (se presente)
    ativarPesquisaBiblioteca();

    // 3) ativa clique por delegação na galeria
    ativarCliqueGaleria();

    // 4) inicializa seleção/visualização em comprar.html (se tiver elementos)
    const livroSalvoRaw = localStorage.getItem("livroSelecionado");
    try {
      const livroSalvo = livroSalvoRaw ? JSON.parse(livroSalvoRaw) : null;
      const selectLivro = safeQuery("#livro-selecionado");
      if (livroSalvo) {
        atualizarVisualizacao(livroSalvo.id);
        if (selectLivro) selectLivro.value = livroSalvo.id;
      }
      if (selectLivro) {
        selectLivro.addEventListener("change", () => {
          const escolha = selectLivro.value;
          atualizarVisualizacao(escolha);
          if (escolha && livrosDados[escolha]) {
            const dados = livrosDados[escolha];
            localStorage.setItem("livroSelecionado", JSON.stringify({ id: escolha, ...dados }));
          }
        });
      }
    } catch (err) {
      console.warn("Erro ao ler livroSelecionado do localStorage:", err);
    }

    // 5) formulários (compra/login) — proteções se não existirem
    const formCompra = safeQuery("#form-compra");
    if (formCompra) {
      formCompra.addEventListener("submit", (e) => {
        e.preventDefault();
        alert('Compra realizada com sucesso! Obrigada por escolher a Bookstore Diamonds 💎');
        formCompra.reset();
      });
    }

    const formLogin = safeQuery("#form-login");
    if (formLogin) {
      formLogin.addEventListener("submit", (e) => {
        e.preventDefault();
        alert('Login realizado com sucesso!');
        formLogin.reset();
      });
    }

    /* ===================== CONTROLE DE FONTE E TEMA (Acessibilidade) ===================== */
    // ids esperados no HTML: "aumentar-fonte", "diminuir-fonte", "alternar-tema"
    const btnAumentar = document.getElementById("aumentar-fonte");
    const btnDiminuir = document.getElementById("diminuir-fonte");
    const btnTema = document.getElementById("alternar-tema");

    // aplica tamanho salvo (se houver)
    const fontSaved = localStorage.getItem("fontSizePercent");
    let tamanhoFonte = fontSaved ? parseInt(fontSaved, 10) : 100;
    if (!isNaN(tamanhoFonte) && tamanhoFonte > 0) {
      document.documentElement.style.fontSize = `${tamanhoFonte}%`;
    } else {
      tamanhoFonte = 100;
    }

    if (btnAumentar) {
      btnAumentar.addEventListener("click", () => {
        if (tamanhoFonte < 200) {
          tamanhoFonte += 10;
          document.documentElement.style.fontSize = `${tamanhoFonte}%`;
          localStorage.setItem("fontSizePercent", String(tamanhoFonte));
        }
      });
    }

    if (btnDiminuir) {
      btnDiminuir.addEventListener("click", () => {
        if (tamanhoFonte > 60) {
          tamanhoFonte -= 10;
          document.documentElement.style.fontSize = `${tamanhoFonte}%`;
          localStorage.setItem("fontSizePercent", String(tamanhoFonte));
        }
      });
    }

    // tema
    const temaSalvo = localStorage.getItem("tema"); // "escuro" | "claro"
    if (temaSalvo === "escuro") {
      document.body.classList.add("modo-escuro");
      if (btnTema) btnTema.textContent = "☀️";
    } else {
      if (btnTema) btnTema.textContent = "🌙";
    }

    if (btnTema) {
      btnTema.addEventListener("click", () => {
        const ativo = document.body.classList.toggle("modo-escuro");
        if (ativo) {
          btnTema.textContent = "☀️";
          localStorage.setItem("tema", "escuro");
        } else {
          btnTema.textContent = "🌙";
          localStorage.setItem("tema", "claro");
        }
      });
    }

    // small debug helper: log se botões não existem — evita crash, mas informa no console
    if (!btnAumentar && !btnDiminuir && !btnTema) {
      // nenhum botão presente neste HTML — tudo bem, comportamento protegido
      // console.info("Acessibilidade: botões não encontrados nesta página (esperado em algumas páginas).");
    }
  }); // end DOMContentLoaded

  // expõe função comprarLivro globalmente (se quiser chamar no HTML inline)
  window.comprarLivro = comprarLivro;

})();
