-- Prospecção fria pelo mesmo WhatsApp: conversa que começou com mensagem nossa ('prospeccao') e conversa encerrada
-- (fornecedor oferecendo serviço ou prospect sem interesse), que o robô não responde mais.
alter table supporta.conversas drop constraint if exists conversas_etapa_check;
alter table supporta.conversas add constraint conversas_etapa_check
  check (etapa in ('inicio', 'prospeccao', 'negocio', 'servicos', 'fotos', 'confirmacao', 'gerando', 'previa', 'dados', 'pagamento', 'pago', 'humano', 'encerrada'));
