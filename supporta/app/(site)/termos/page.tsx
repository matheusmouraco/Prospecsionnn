import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/ui/LegalPage";
import { annualFreeMonths, billing, earlyCancelFee, loyaltyPriceFor, plans, priceFor } from "@/lib/plans";
import { pageMetadata } from "@/lib/seo";
import { formatBRLCents, site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Termos de Uso e da Assinatura | Supporta",
  description: "Termos da assinatura Supporta: planos, cobrança mensal ou anual no cartão, prazo mínimo de 12 meses, multa, desconto, cancelamento, domínio, ajustes e prazos.",
  path: "/termos",
});

export default function TermosPage() {
  return (
    <LegalPage title="Termos de Uso e da Assinatura" path="/termos" updated="outubro de 2026">
      <p>
        Estes Termos regulam a contratação dos serviços da {site.name}, nome fantasia de <strong>{site.razaoSocial}</strong>, inscrita no CNPJ sob o
        nº <strong>{site.cnpj}</strong>, com sede na {site.address.street}, {site.address.city}/{site.address.state} (&quot;Supporta&quot;), por pessoas físicas ou jurídicas (&quot;Cliente&quot;). Versão {site.termsVersion}.
      </p>

      <h2>1. O serviço</h2>
      <p>
        A Supporta cria, publica, hospeda e mantém o site do Cliente mediante assinatura, com cobrança mensal ou anual, conforme o plano e o ciclo escolhidos. Os planos e seus itens são os
        publicados na página <Link href="/planos" className="link text-ink">Planos</Link> no momento da contratação:
      </p>
      <ul>
        {plans.map((p) => (
          <li key={p.id}>
            <strong>
              {p.name} (R${p.price}/mês no mensal ou {formatBRLCents(priceFor(p, "anual"))}/ano no anual):
            </strong> {p.features.join("; ")}.
          </li>
        ))}
      </ul>

      <h2>2. Pagamento</h2>
      <p>
        A assinatura é cobrada no cartão de crédito informado pelo Cliente, por meio de parceiro de pagamento (Stripe), em um dos dois
        ciclos escolhidos na contratação:
      </p>
      <ul>
        <li>
          <strong>Mensal:</strong> uma cobrança por mês no valor do plano. A primeira ocorre na contratação e as seguintes na mesma data dos meses subsequentes.
        </li>
        <li>
          <strong>Anual:</strong> uma cobrança por ano equivalente a {billing.annualMonthsCharged} mensalidades, cobrindo 12 meses de assinatura ({annualFreeMonths}{" "}
          meses sem custo). A primeira ocorre na contratação e as seguintes a cada 12 meses.
        </li>
      </ul>
      <p>Não há custo de criação em nenhum dos ciclos. O Cliente pode trocar de ciclo na renovação, com aviso pelo WhatsApp ou e-mail.</p>
      <p>
        Em caso de recusa do cartão, a Supporta avisará o Cliente e fará novas tentativas. Com {site.overdue.suspendAfterDays} dias de atraso, o site poderá ser suspenso (fora do ar) até a regularização. Com{" "}
        {site.overdue.cancelAfterDays} dias de atraso, a Supporta poderá encerrar a assinatura; se isso ocorrer dentro do prazo mínimo, aplica-se a multa do item 3
        sobre as mensalidades que faltam, além dos valores em atraso.
      </p>

      <h2>3. Prazo mínimo de {billing.minMonths} meses, multa e desconto</h2>
      <p>
        A contratação é uma <strong>assinatura</strong>, e não a compra de um site: o site fica publicado e mantido enquanto a assinatura estiver ativa. A
        assinatura tem prazo mínimo de {billing.minMonths} (doze) meses contados da primeira cobrança. <strong>É o que permite não cobrar a criação do site.</strong>
      </p>
      <p>
        <strong>Cancelamento antes de {billing.minMonths} meses.</strong> Fora do prazo de arrependimento do item 4, o cancelamento pelo Cliente antes do fim do prazo
        mínimo gera multa de <strong>{billing.earlyCancelFeePct}% sobre o valor das mensalidades que faltam</strong> para completar os {billing.minMonths} meses.
        No ciclo mensal, a multa é cobrada uma única vez, no cartão cadastrado. Exemplo: no Start, cancelando após 8 mensalidades pagas, faltam 4 mensalidades de R$
        {plans[0].price}, e a multa é de {formatBRLCents(earlyCancelFee(plans[0], 8))}. No ciclo anual, o Cliente recebe de volta o valor proporcional aos meses não
        usados, descontada a multa de {billing.earlyCancelFeePct}% sobre esse valor.
      </p>
      <p>
        <strong>Depois de {billing.minMonths} meses.</strong> A assinatura segue por prazo indeterminado e pode ser cancelada a qualquer momento,{" "}
        <strong>sem multa</strong>, com aviso pelo WhatsApp ou e-mail. A partir do 13º mês, o Cliente que continua tem{" "}
        <strong>{billing.loyaltyDiscountPct}% de desconto</strong> sobre o valor do plano (por exemplo, o Start passa de R${plans[0].price} para{" "}
        {formatBRLCents(loyaltyPriceFor(plans[0], "mensal"))} por mês no mensal), salvo reajuste comunicado conforme o item 10. O cancelamento interrompe a próxima
        cobrança; o período já pago segue no ar até o fim.
      </p>
      <p>O aceite destes Termos é registrado com data, hora, IP e versão do documento no momento da contratação.</p>

      <h2>4. Direito de arrependimento</h2>
      <p>
        Conforme o art. 49 do Código de Defesa do Consumidor, o Cliente pode desistir da contratação em até 7 (sete) dias da assinatura, com
        devolução integral dos valores pagos. Esse direito vale tanto para pessoas físicas (CPF) quanto para empresas (CNPJ).
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
        O domínio .com.br incluso no primeiro ano é registrado em nome do Cliente (CPF ou CNPJ informado). A partir do segundo ano, a renovação do domínio é paga pelo Cliente, diretamente ao Registro.br, e não faz parte da mensalidade. Em caso de cancelamento,
        o domínio continua registrado em nome do Cliente.
      </p>

      <h2>8. Conteúdo e propriedade</h2>
      <p>
        O Cliente garante ter direito de uso sobre os materiais que envia (logo, fotos, textos) e é responsável pela veracidade das informações. Para profissões
        regulamentadas (como saúde, odontologia e advocacia), o Cliente é responsável por revisar e aprovar os textos conforme as regras do seu conselho de classe.
      </p>
      <p>
        O conteúdo do Cliente pertence ao Cliente. O código, os modelos e o sistema de publicação pertencem à Supporta. Por se tratar de uma assinatura, <strong>nada é entregue ao Cliente com o fim dela</strong>: o site deixa de ser publicado e o
        código, o layout, o design e os textos e imagens produzidos pela Supporta não são transferidos. Os materiais que o próprio Cliente enviou (logo, fotos e
        textos dele) continuam sendo dele, e o domínio continua registrado em seu nome.
      </p>

      <h2>9. Disponibilidade e limitações</h2>
      <p>
        A Supporta se esforça para manter o site no ar continuamente, mas não garante disponibilidade ininterrupta, que depende de terceiros (hospedagem, provedores de
        internet, registro de domínio). A Supporta não garante posições no Google nem citações em ferramentas de inteligência artificial, cujos resultados não
        controla.
      </p>

      <h2>10. Mudança de plano e reajuste</h2>
      <p>
        O Cliente pode subir de plano a qualquer momento, com efeito na próxima cobrança. Descer de plano depende de acordo, respeitado o prazo mínimo. O valor
        fica fixo durante os {billing.minMonths} meses iniciais; reajustes posteriores serão comunicados com pelo menos 30 dias de antecedência.
      </p>

      <h2>11. Dados pessoais</h2>
      <p>
        O tratamento de dados pessoais segue a <Link href="/privacidade" className="link text-ink">Política de Privacidade</Link> e a Lei Geral de Proteção de Dados
        (Lei 13.709/2018).
      </p>

      <h2>12. Foro</h2>
      <p>Fica eleito o foro da comarca de São Paulo/SP, ressalvado o direito do consumidor de propor ação no foro do seu domicílio.</p>

      <p>
        Contato: {site.email} · WhatsApp {site.whatsapp}
      </p>
    </LegalPage>
  );
}
