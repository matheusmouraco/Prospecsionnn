// pm2 processes on the VPS (`pm2 start deploy/ecosystem.config.cjs`). Times follow the VPS clock,
// which deploy/vps-setup.sh sets to America/Sao_Paulo.
const job = (name, script, cron) => ({
  name, script: 'npm', args: `run ${script} -- --agendado`, cwd: __dirname + '/..',
  cron_restart: cron, autorestart: false, time: true,
});

module.exports = {
  apps: [
    { name: 'bot', script: 'npm', args: 'run telegram:bot', cwd: __dirname + '/..', autorestart: true, restart_delay: 10000, time: true },
    job('travas', 'travas', '*/30 * * * *'),
    job('resumo', 'resumo', '0 19 * * *'),
  ],
};
