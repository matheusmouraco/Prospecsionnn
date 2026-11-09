import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/ui/LegalPage";
import { chargesFor, priceLabel, priceRows, pricing, site99 } from "@/lib/plans";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Termos de Uso | Supporta",
  description: `Termos de uso da Supporta: site por ${priceLabel(pricing.site)} pago uma vez, renovação anual do endereço por ${priceLabel(pricing.endereco)} a partir do 2º ano, domínio opcional, alterações, cancelamento sem multa e arrependimento em 7 dias.`,
  path: "/termos",
});

const comDominio = chargesFor(true);

export default function TermosPage() {
  return (
    <LegalPage title="Termos de Uso" path="/termos" updated="novembro de 2026">
      <p>
        Estes Termos regulam a contratação dos serviços da {site.name}, nome fantasia de <strong>{site.razaoSocial}</strong>, inscrita no CNPJ sob o
        nº <strong>{site.cnpj}</strong>, com sede na {site.address.street}, {site.address.city}/{site.address.state} (&quot;Supporta&quot;), por pessoas físicas ou jurídicas (&quot;Cliente&quot;). Versão {site.termsVersion}.
      </p>

      <h2>1. O serviço</h2>
      <p>
        A Supporta cria, publica e hospeda o site do Cliente. O site é montado por inteligência artificial a partir das respostas do Cliente no criador, com a marca dele, e o
        Cliente vê a prévia antes de pagar. O produto e seus itens são os publicados na página <Link href="/planos" className="link text-ink">Preço</Link> no momento da contratação:
      </p>
      <ul>
        <li>
          <strong>
            {site99.name} ({priceLabel(site99.price)}, pago uma vez):
          </strong>{" "}
          {site99.features.join("; ")}.
        </li>
      </ul>
      <p>Valores de cada item:</p>
      <ul>
        {priceRows.map((r) => (
          <li key={r.item}>
            <strong>{r.item}:</strong> {priceLabel(r.value)}
            {r.per}, {r.detail}.
          </li>
        ))}
      </ul>
      <p>
        Projetos personalizados, fora do site criado automaticamente, são combinados à parte, diretamente pelo WhatsApp, com proposta e valores próprios.
      </p>

      <h2>2. Pagamento</h2>
      <p>
        O pagamento é feito no cartão de crédito informado pelo Cliente, por meio de parceiro de pagamento (Stripe). Na contratação, o Cliente paga{" "}
        <strong>{priceLabel(pricing.site)} uma única vez</strong> pelo site, mais {priceLabel(pricing.dominio)} se escolher o domínio próprio (total de{" "}
        {priceLabel(comDominio.hoje)}). Não há mensalidade. A nota fiscal é emitida a cada cobrança, no CPF ou CNPJ informado.
      </p>

      <h2>3. Renovação anual</h2>
      <p>
        O endereço nome.supporta.com.br, com hospedagem e certificado SSL, está incluso no primeiro ano, contado da publicação do site. A partir do segundo ano, ele é
        renovado automaticamente por <strong>{priceLabel(pricing.endereco)} por ano</strong>, cobrados no cartão cadastrado. Com domínio próprio, a renovação anual soma{" "}
        {priceLabel(pricing.dominio)} do domínio, total de {priceLabel(comDominio.anual)} por ano. A Supporta avisa o Cliente por e-mail antes de cada renovação.
      </p>
      <p>
        Em caso de recusa do cartão na renovação, a Supporta avisará o Cliente e fará novas tentativas. Com {site.overdue.suspendAfterDays} dias de atraso, o site poderá
        ser suspenso (fora do ar) até a regularização. Com {site.overdue.cancelAfterDays} dias de atraso, a Supporta poderá encerrar a hospedagem do site.
      </p>
      <p>
        Eventual reajuste dos valores de renovação será comunicado com pelo menos 30 dias de antecedência e só vale a partir da renovação seguinte.
      </p>

      <h2>4. Cancelamento</h2>
      <p>
        Não há prazo mínimo, fidelidade nem multa. O Cliente pode cancelar a renovação anual quando quiser, pela área do cliente, pelo WhatsApp ou por e-mail. O
        cancelamento interrompe a próxima cobrança, e o site fica no ar até o fim do ano já pago. Valores de anos já iniciados não são devolvidos, salvo o direito de
        arrependimento do item 5.
      </p>
      <p>O aceite destes Termos é registrado com data, hora, IP e versão do documento no momento da contratação.</p>

      <h2>5. Direito de arrependimento</h2>
      <p>
        Conforme o art. 49 do Código de Defesa do Consumidor, o Cliente pode desistir da contratação em até 7 (sete) dias do pagamento, com
        reembolso integral dos valores pagos. Esse direito vale tanto para pessoas físicas (CPF) quanto para empresas (CNPJ).
      </p>

      <h2>6. Prazo de entrega</h2>
      <p>
        O site é montado pela IA a partir das respostas do Cliente e a prévia aparece antes do pagamento. Depois da confirmação do pagamento, o site entra no ar em até{" "}
        {pricing.prazoHoras} horas no endereço nome.supporta.com.br. A ligação de um domínio próprio é combinada com o Cliente pelo WhatsApp.
      </p>

      <h2>7. Alterações</h2>
      <p>
        Alterações são mudanças de conteúdo (textos, fotos, horários, preços, contatos), pedidas pelo WhatsApp ou pela área do cliente. Nos primeiros{" "}
        {pricing.diasAlteracaoGratis} dias depois da entrega do site, as alterações não têm custo. Depois desse prazo, cada alteração custa{" "}
        <strong>{priceLabel(pricing.alteracao)}</strong>, cobrados no cartão cadastrado depois da confirmação do Cliente. Mudanças estruturais (novas seções, troca de
        modelo, páginas além das incluídas) são avaliadas e combinadas à parte.
      </p>

      <h2>8. Domínio próprio</h2>
      <p>
        O domínio próprio .com.br é opcional e custa {priceLabel(pricing.dominio)} por ano desde o primeiro ano, renovado junto com o endereço. Ele é registrado em nome
        do Cliente (CPF ou CNPJ informado). Se o Cliente cancelar a renovação, o domínio continua registrado em seu nome e pode ser renovado por ele diretamente no
        Registro.br.
      </p>

      <h2>9. Conteúdo e propriedade</h2>
      <p>
        O Cliente garante ter direito de uso sobre os materiais que envia (logo, fotos, textos) e é responsável pela veracidade das informações. Para profissões
        regulamentadas (como saúde, odontologia e advocacia), o Cliente é responsável por revisar e aprovar os textos conforme as regras do seu conselho de classe.
      </p>
      <p>
        O conteúdo do Cliente pertence ao Cliente. O código, os modelos e o sistema de publicação pertencem à Supporta. O site é publicado na plataforma da Supporta
        enquanto a hospedagem estiver em dia: <strong>com o fim da hospedagem, o site deixa de ser publicado</strong> e o código, o layout e o design não são transferidos. Os materiais que o próprio Cliente enviou (logo, fotos e
        textos dele) continuam sendo dele, e o domínio continua registrado em seu nome.
      </p>

      <h2>10. Disponibilidade e limitações</h2>
      <p>
        A Supporta se esforça para manter o site no ar continuamente, mas não garante disponibilidade ininterrupta, que depende de terceiros (hospedagem, provedores de
        internet, registro de domínio). A Supporta não garante posições no Google nem citações em ferramentas de inteligência artificial, cujos resultados não
        controla.
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
