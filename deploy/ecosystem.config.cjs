// pm2 processes on the VPS (`pm2 start deploy/ecosystem.config.cjs`): the Telegram bot and the scheduler,
// both always on. Every cycle (import, analysis, emails, sending, replies, drafts, locks, summary) runs
// from src/scheduler/jobs.ts at its São Paulo time.
const app = (name, script) => ({
  name, script: 'npm', args: `run ${script}`, cwd: __dirname + '/..', autorestart: true, restart_delay: 10000, time: true,
});

module.exports = { apps: [app('bot', 'telegram:bot'), app('agendador', 'agendador')] };
