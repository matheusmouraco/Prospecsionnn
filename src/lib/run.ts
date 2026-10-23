import { spawn } from 'node:child_process';
import { envDosAjustes } from '../control/ajustes.js';

export interface RunResult { code: number; saida: string }

// Runs one of the project's npm scripts as a child process (same .env, same logs), keeping the tail of its output.
// Settings changed on Telegram (controle `ajuste:*`) override the .env values; dotenv never overwrites them.
export async function runNpm(script: string, args: string[] = [], cwd = process.cwd()): Promise<RunResult> {
  const env = { ...process.env, ...(await envDosAjustes()) };
  return new Promise((resolve) => {
    const child = spawn('npm', ['run', '--silent', script, '--', ...args], { cwd, env });
    let saida = '';
    const keep = (b: Buffer) => { saida = (saida + b.toString()).slice(-4000); };
    child.stdout.on('data', keep);
    child.stderr.on('data', keep);
    child.on('close', (code) => resolve({ code: code ?? 1, saida }));
    child.on('error', (err) => resolve({ code: 1, saida: String(err) }));
  });
}
