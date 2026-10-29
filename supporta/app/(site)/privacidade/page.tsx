import type { Metadata } from "next";
import { LegalPage } from "@/components/ui/LegalPage";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Política de Privacidade (LGPD) | Supporta",
  description: "Como a Supporta coleta, usa e protege seus dados pessoais, quais cookies usamos e como exercer seus direitos pela LGPD.",
  path: "/privacidade",
});

export default function PrivacidadePage() {
  return (
    <LegalPage title="Política de Privacidade" path="/privacidade" updated="outubro de 2026">
      <p>
        Esta Política explica como <strong>{site.razaoSocial}</strong> (CNPJ {site.cnpj}), controladora dos dados, trata dados pessoais de quem visita o site, usa o
        diagnóstico grátis ou assina um plano, conforme a Lei Geral de Proteção de Dados (Lei 13.709/2018, LGPD).
      </p>

      <h2>1. Dados que coletamos</h2>
      <ul>
        <li><strong>Diagnóstico grátis:</strong> endereço do site analisado, e-mail e IP.</li>
        <li><strong>Assinatura:</strong> nome, nome da empresa, CPF ou CNPJ, e-mail, WhatsApp, informações do briefing e registro do aceite dos Termos (data, hora, IP e navegador).</li>
        <li><strong>Pagamento:</strong> os dados do cartão são digitados direto na página do provedor de pagamento (Stripe). Não recebemos nem armazenamos o número do cartão.</li>
        <li><strong>Navegação:</strong> com o seu consentimento, cookies de medição do Google Analytics e do Meta Pixel.</li>
      </ul>

      <h2>2. Para que usamos</h2>
      <ul>
        <li>Gerar e enviar o relatório do diagnóstico e entrar em contato sobre ele (legítimo interesse e procedimentos preliminares a contrato).</li>
        <li>Executar a assinatura: criar o site, cobrar, emitir nota fiscal e prestar suporte (execução de contrato).</li>
        <li>Guardar o registro do aceite dos Termos (exercício regular de direitos).</li>
        <li>Cumprir obrigações fiscais e legais (obrigação legal).</li>
        <li>Medir o desempenho do site e de anúncios (consentimento, que pode ser recusado ou retirado a qualquer momento).</li>
      </ul>

      <h2>3. Com quem compartilhamos</h2>
      <p>Somente com fornecedores necessários para o serviço, sob contrato:</p>
      <ul>
        <li>Provedor de pagamento (Stripe);</li>
        <li>Hospedagem do site (Vercel Inc., com servidores fora do Brasil);</li>
        <li>Google (PageSpeed Insights, que recebe só o endereço do site analisado, e Google Analytics, se você aceitar);</li>
        <li>Meta (Meta Pixel, se você aceitar);</li>
        <li>Nossas ferramentas de atendimento (WhatsApp e e-mail) e de gestão de clientes.</li>
      </ul>
      <p>Alguns desses fornecedores ficam fora do Brasil. A transferência internacional segue o art. 33 da LGPD e se apoia nas cláusulas contratuais de proteção de dados adotadas por esses fornecedores.</p>

      <h2>4. Cookies</h2>
      <p>
        Cookies de medição só são ativados se você clicar em &quot;Aceitar&quot; no aviso de cookies. Se recusar, o site funciona normalmente. Para mudar a escolha,
        limpe os dados do site no seu navegador e o aviso aparece de novo.
      </p>

      <h2>5. Por quanto tempo guardamos</h2>
      <p>
        Dados do diagnóstico: até 24 meses ou até você pedir a exclusão. Dados da assinatura: durante o contrato e pelo prazo legal após o fim
        (obrigações fiscais e defesa em processos), em geral 5 anos.
      </p>

      <h2>6. Seus direitos</h2>
      <p>
        Você pode pedir confirmação de tratamento, acesso, correção, anonimização, portabilidade, exclusão, informação sobre compartilhamento e revogação do
        consentimento (art. 18 da LGPD). Basta escrever para {site.email}. Respondemos em até 15 dias.
      </p>

      <h2>7. Segurança</h2>
      <p>Usamos conexão criptografada (HTTPS), acesso restrito aos dados e fornecedores com práticas reconhecidas de segurança.</p>

      <h2>8. Encarregado (DPO)</h2>
      <p>Encarregado pelo tratamento de dados: {site.dpo}, e-mail {site.email}. Endereço: {site.address.street}, {site.address.city}/{site.address.state}.</p>

      <h2>9. Alterações</h2>
      <p>Esta Política pode ser atualizada. A versão vigente fica sempre nesta página, com a data de atualização no topo.</p>
    </LegalPage>
  );
}
