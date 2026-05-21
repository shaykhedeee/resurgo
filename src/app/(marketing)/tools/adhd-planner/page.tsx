import type { Metadata } from 'next';
import Link from 'next/link';
import EmailCapture from '@/components/marketing/EmailCapture';

export const metadata: Metadata = {
  title: 'Free ADHD Daily Planner | Resurgo',
  description: 'A low-friction, high-feedback daily planner designed specifically for ADHD brains. Powered by Puter.js.',
};

export default function AdhdPlannerPage() {
  return (
    <main className="min-h-screen bg-black text-zinc-100">
      <div className="mx-auto max-w-4xl px-4 py-16 md:py-24">
        <section className="border border-zinc-900 bg-zinc-950 p-6 md:p-10">
          <p className="font-mono text-xs tracking-widest text-orange-500">FREE_TOOL :: ADHD_PLANNER</p>
          <h1 className="mt-4 font-mono text-4xl font-bold tracking-tight text-white">ADHD Daily Planner</h1>
          <p className="mt-4 font-mono text-sm leading-relaxed text-zinc-400">
            Standard planners are designed for neurotypical brains. This is a low-friction, high-feedback daily planner that requires zero setup. Built using Puter.js for immediate, localized storage.
          </p>

          <div className="mt-8 rounded border border-zinc-800 bg-black p-6">
            <div id="puter-adhd-planner-container" className="min-h-[400px] flex items-center justify-center border border-dashed border-zinc-800 rounded">
              <p className="font-mono text-sm text-zinc-500 text-center">
                Puter.js Planner Initializing...<br />
                <span className="text-xs mt-2 block">(Please ensure JavaScript is enabled)</span>
              </p>
            </div>
            {/* Puter.js integration block */}
            <script src="https://js.puter.com/v2/"></script>
            <script dangerouslySetInnerHTML={{
              __html: `
                // Wait for Puter to be available
                document.addEventListener('DOMContentLoaded', async () => {
                  const container = document.getElementById('puter-adhd-planner-container');
                  if (!window.puter) {
                    container.innerHTML = '<p class="font-mono text-sm text-red-500">Error: Puter.js failed to load.</p>';
                    return;
                  }

                  // Render a simple interactive planner UI that saves to Puter's key-value store
                  async function renderPlanner() {
                    const today = new Date().toISOString().split('T')[0];
                    let savedTasks = [];
                    try {
                      const data = await puter.kv.get('adhd-tasks-' + today);
                      if (data) savedTasks = JSON.parse(data);
                    } catch (e) {
                      console.warn('No saved tasks or not logged in yet.');
                    }

                    container.innerHTML = \`
                      <div class="w-full max-w-md mx-auto">
                        <div class="mb-4">
                          <label class="block font-mono text-xs tracking-widest text-zinc-500 mb-2">ADD A TASK (ONE AT A TIME)</label>
                          <div class="flex gap-2">
                            <input type="text" id="task-input" class="w-full border border-zinc-800 bg-zinc-900 px-3 py-2 font-mono text-sm text-white focus:border-orange-500 focus:outline-none" placeholder="What needs doing?" />
                            <button id="add-task-btn" class="border border-orange-500 bg-orange-500/10 px-4 py-2 font-mono text-sm text-orange-500 hover:bg-orange-500 hover:text-black transition">ADD</button>
                          </div>
                        </div>
                        <div id="task-list" class="space-y-2 mt-6">
                        </div>
                      </div>
                    \`;

                    const taskList = document.getElementById('task-list');
                    const taskInput = document.getElementById('task-input');
                    const addBtn = document.getElementById('add-task-btn');

                    function renderTasks() {
                      taskList.innerHTML = '';
                      if (savedTasks.length === 0) {
                        taskList.innerHTML = '<p class="font-mono text-xs text-zinc-500 text-center py-4">No tasks yet. Start small.</p>';
                        return;
                      }
                      savedTasks.forEach((task, index) => {
                        const div = document.createElement('div');
                        div.className = 'flex items-center justify-between border border-zinc-800 p-3 bg-zinc-950';
                        div.innerHTML = \`
                          <div class="flex items-center gap-3">
                            <input type="checkbox" \${task.done ? 'checked' : ''} class="w-4 h-4 accent-orange-500" data-index="\${index}">
                            <span class="font-mono text-sm \${task.done ? 'line-through text-zinc-600' : 'text-zinc-200'}">\${task.text}</span>
                          </div>
                          <button class="text-xs text-red-500/50 hover:text-red-500 font-mono" data-delete="\${index}">X</button>
                        \`;
                        taskList.appendChild(div);
                      });
                    }

                    renderTasks();

                    addBtn.addEventListener('click', async () => {
                      const text = taskInput.value.trim();
                      if (text) {
                        savedTasks.push({ text, done: false });
                        taskInput.value = '';
                        renderTasks();
                        if (puter.auth.isSignedIn()) {
                          await puter.kv.set('adhd-tasks-' + today, JSON.stringify(savedTasks));
                        }
                      }
                    });

                    taskList.addEventListener('change', async (e) => {
                      if (e.target.type === 'checkbox') {
                        const index = e.target.getAttribute('data-index');
                        savedTasks[index].done = e.target.checked;
                        renderTasks();
                        if (puter.auth.isSignedIn()) {
                          await puter.kv.set('adhd-tasks-' + today, JSON.stringify(savedTasks));
                        }
                      }
                    });

                    taskList.addEventListener('click', async (e) => {
                      if (e.target.hasAttribute('data-delete')) {
                        const index = e.target.getAttribute('data-delete');
                        savedTasks.splice(index, 1);
                        renderTasks();
                        if (puter.auth.isSignedIn()) {
                          await puter.kv.set('adhd-tasks-' + today, JSON.stringify(savedTasks));
                        }
                      }
                    });
                  }

                  renderPlanner();
                });
              `
            }} />
          </div>
        </section>

        <section className="mt-8 border border-zinc-900 bg-zinc-950 p-6 md:p-10">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="font-mono text-xl font-bold text-zinc-100">Why this works for ADHD</h2>
              <ul className="mt-4 space-y-3 font-mono text-sm text-zinc-400">
                <li className="flex items-start gap-2">
                  <span className="text-orange-500">→</span>
                  <span><strong>Zero setup:</strong> You don't need to build a Notion database. Just type.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500">→</span>
                  <span><strong>Localized saving:</strong> Uses Puter.js so your tasks stay with you without a heavy login flow initially.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500">→</span>
                  <span><strong>Visual completion:</strong> High-contrast checkmarks provide immediate dopamine.</span>
                </li>
              </ul>
            </div>
            <div className="border border-zinc-800 bg-black p-5">
              <p className="font-mono text-xs tracking-widest text-zinc-500">READY FOR THE FULL SYSTEM?</p>
              <p className="mt-3 font-mono text-sm leading-relaxed text-zinc-400">
                The full Resurgo app includes AI coaching, goal decomposition, and streak protection designed specifically for ADHD productivity.
              </p>
              <div className="mt-6">
                <EmailCapture variant="inline" source="tools_adhd_planner" offer="Get early access" />
              </div>
              <div className="mt-4 text-center">
                <Link href="/sign-up" className="inline-block border border-orange-500 px-6 py-3 font-mono text-sm font-bold tracking-widest text-orange-500 transition hover:bg-orange-500 hover:text-black">
                  CREATE FREE ACCOUNT
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
