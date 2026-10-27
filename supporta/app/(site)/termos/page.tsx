import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/ui/LegalPage";
import { plans } from "@/lib/plans";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Termos de Uso e da Assinatura | Supporta",
  description: "Termos da assinatura Supporta: planos, cobrança recorrente no cartão, fidelidade de 12 meses, cancelamento, domínio, ajustes e prazos.",
  path: "/termos",
});

export default function TermosPage() {
  return (
    <LegalPage title="Termos de Uso e da Assinatura" path="/termos" updated="outubro de 2026">
      <p>
        Estes Termos regulam a contratação dos serviços da {site.name}, nome fantasia de <strong>{site.razaoSocial}</strong>, inscrita no CNPJ sob o
        nº <strong>{site.cnpj}</strong>, com sede em [ENDERECO_COMPLETO] (&quot;Supporta&quot;), por pessoas físicas ou jurídicas (&quot;Cliente&quot;). Versão {site.termsVersion}.
      </p>

      <h2>1. O serviço</h2>
      <p>
        A Supporta cria, publica, hospeda e mantém o site do Cliente mediante assinatura mensal, conforme o plano escolhido. Os planos e seus itens são os
        publicados na página <Link href="/planos" className="link text-ink">Planos</Link> no momento da contratação:
      </p>
      <ul>
        {plans.map((p) => (
          <li key={p.id}>
            <strong>{p.name} (R${p.price}/mês):</strong> {p.features.join("; ")}.
          </li>
        ))}
      </ul>

      <h2>2. Pagamento</h2>
      <p>
        A assinatura é cobrada de forma recorrente e mensal no cartão de crédito informado pelo Cliente, por meio de parceiro de pagamento
        ([NOME_DO_PROVEDOR_DE_PAGAMENTO]). A primeira cobrança ocorre na contratação e as seguintes na mesma data dos meses subsequentes. Não há custo de criação.
      </p>
      <p>
        Em caso de recusa do cartão, a Supporta avisará o Cliente e fará novas tentativas. Persistindo a falta de pagamento por mais de [PRAZO_INADIMPLENCIA] dias,
        o site poderá ser suspenso até a regularização.
      </p>

      <h2>3. Fidelidade de 12 meses</h2>
      <p>
        A assinatura tem prazo mínimo de 12 (doze) meses contados da primeira cobrança. <strong>É o que permite não cobrar a criação do site:</strong> o custo de
        criação é diluído nas mensalidades desse período.
      </p>
      <p>
        Em caso de cancelamento pelo Cliente antes do fim dos 12 meses, será devida [REGRA_DE_CANCELAMENTO_ANTECIPADO, por exemplo: multa de X% sobre as
        mensalidades restantes ou valor proporcional ao custo de criação], conforme revisão jurídica. Após os 12 meses, a assinatura segue por prazo indeterminado
        e pode ser cancelada a qualquer momento, sem multa, com aviso pelo WhatsApp ou e-mail.
      </p>
      <p>O aceite destes Termos é registrado com data, hora, IP e versão do documento no momento da contratação.</p>

      <h2>4. Direito de arrependimento</h2>
      <p>
        Conforme o art. 49 do Código de Defesa do Consumidor, quando aplicável, o Cliente pode desistir da contratação em até 7 (sete) dias da assinatura, com
        devolução integral dos valores pagos. [VALIDAR_APLICACAO_A_CONTRATANTES_PJ]
      </p>

      <h2>5. Prazos de entrega</h2>
      <p>
        Os prazos contam em dias úteis a partir do recebimento do briefing completo e dos materiais (logo, fotos e informações): Start em até{" "}
        {site.deliveryDays.start} dias, Pro em até {site.deliveryDays.pro} dias e Premium em até {site.deliveryDays.premium} dias. Atrasos no envio dos materiais
        pelo Cliente suspendem a contagem.
      </p>

      <h2>6. Ajustes</h2>
      <p>
        Ajustes são pequenas alterações de conteúdo (textos, fotos, horários, preços, contatos), pedidos pelo WhatsApp. A quantidade mensal depende do plano e
        não é cumulativa. Mudanças estruturais (novas seções, troca de modelo, novas páginas fora do plano) são avaliadas e combinadas à parte.
      </p>

      <h2>7. Domínio</h2>
      <p>
        O domínio .com.br incluso no primeiro ano é registrado em nome do Cliente (CPF ou CNPJ informado). A partir do segundo ano, a renovação é [INCLUSA_OU_COBRADA,
        definir]. Em caso de cancelamento, a Supporta orienta a transferência do domínio, que permanece do Cliente.
      </p>

      <h2>8. Conteúdo e propriedade</h2>
      <p>
        O Cliente garante ter direito de uso sobre os materiais que envia (logo, fotos, textos) e é responsável pela veracidade das informações. Para profissões
        regulamentadas (como saúde, odontologia e advocacia), o Cliente é responsável por revisar e aprovar os textos conforme as regras do seu conselho de classe.
      </p>
      <p>
        O conteúdo do Cliente pertence ao Cliente. O código, os modelos e o sistema de publicação pertencem à Supporta. Ao final da assinatura, [DEFINIR_O_QUE_E_ENTREGUE:
        por exemplo, exportação dos textos e imagens].
      </p>

      <h2>9. Disponibilidade e limitações</h2>
      <p>
        A Supporta se esforça para manter o site no ar continuamente, mas não garante disponibilidade ininterrupta, que depende de terceiros (hospedagem, provedores de
        internet, registro de domínio). A Supporta não garante posições no Google nem citações em ferramentas de inteligência artificial, cujos resultados não
        controla.
      </p>

      <h2>10. Mudança de plano e reajuste</h2>
      <p>
        O Cliente pode subir de plano a qualquer momento, com efeito na próxima cobrança. Descer de plano depende de acordo, respeitado o prazo de fidelidade. O valor
        fica fixo durante os 12 meses iniciais; reajustes posteriores serão comunicados com pelo menos 30 dias de antecedência.
      </p>

      <h2>11. Dados pessoais</h2>
      <p>
        O tratamento de dados pessoais segue a <Link href="/privacidade" className="link text-ink">Política de Privacidade</Link> e a Lei Geral de Proteção de Dados
        (Lei 13.709/2018).
      </p>

      <h2>12. Foro</h2>
      <p>Fica eleito o foro da comarca de [CIDADE_UF], ressalvado o direito do consumidor de propor ação no foro do seu domicílio.</p>

      <p>
        Contato: {site.email} · WhatsApp {site.whatsapp}
      </p>
    </LegalPage>
  );
}
