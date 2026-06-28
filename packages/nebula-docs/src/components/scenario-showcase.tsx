import { ArrowUpRight } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

const transparentSyntaxBackground = { background: 'transparent' };
const terminalSyntaxStyle = {
  margin: 0,
  padding: '1.25rem',
  background: 'transparent',
};

const codingAgentWorkflow = [
  '$ agent "Build a travel planner"',
  '            |',
  '            v',
  '[LLM] plans the miniapp and selects MCP tools',
  '            |',
  '            v',
  '[MCP] create_project',
  '            |',
  '            +--> build_project',
  '            |',
  '            +--> deploy_project',
  '            |',
  '            v',
  '[Cloud] release published',
  '            |',
  '            v',
  '[User] Open MiniApp -> install and run in host',
].join('\n');

const scenarioItems = [
  {
    title: 'Super App',
    description:
      'One seamless shell, endless modular apps. Ship independently while sharing identity, payments, and native device capabilities.',
    examples: ['Payments', 'Ride hailing', 'Food delivery', 'Shopping'],
    code: "NebulaAPI.openApp('ride-hailing')",
    language: 'typescript',
  },
  {
    title: 'Coding Agent',
    description:
      'Integrate an LLM with an MCP server to create, build, and publish miniapps through governed tools.',
    examples: ['LLM tool calls', 'MCP integration', 'Cloud building'],
    workflow: true,
  },
  {
    title: 'Embed in native apps',
    description:
      'Keep your native app shell, navigation, and product identity while opening independently shipped miniapps from Nebula Cloud.',
    examples: ['Keep your app UI', 'Nebula SDK'],
    code: `NebulaHost.shared.setServerBaseURL(
  "https://cloud.example.com/api"
)

NebulaHost.shared.openApp(
  "superapp-travel",
  from: navigationController,
  initialProps: ["entry": "home"]
) { error in
  if let error { present(error) }
}`,
    language: 'swift',
  },
];

export function ScenarioShowcase() {
  return (
    <section
      data-device-showcase="scenarios"
      className="border-b border-black/10 bg-[#f8f8f6] px-6 py-24 text-[#202020]"
    >
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 max-w-3xl md:mb-16">
          <p className="mb-3 text-xs uppercase tracking-[0.22em] text-[#777]">
            Examples
          </p>
          <h2 className="text-balance text-4xl leading-[1.15] tracking-tighter text-[#202020] md:text-6xl">
            One runtime, three ways to ship
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[#666] md:text-lg">
            A super app, an AI coding agent, or a fully native shell — every
            miniapp is still independently built, distributed, and updated.
          </p>
        </header>

        <div className="grid items-start gap-12 lg:max-w-3xl">
          <div>
            {scenarioItems.map((scenario, index) => (
              <article
                key={scenario.title}
                data-scenario-index={index}
                className={`relative min-h-[145svh] py-16 md:min-h-[165svh] md:py-24 ${
                  index < scenarioItems.length - 1
                    ? 'mb-[20vh] md:mb-[24vh]'
                    : ''
                }`}
              >
                <div className="sticky top-1/2 max-w-2xl -translate-y-1/2">
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <p className="mb-3 font-mono text-xs tracking-[0.3em] text-[#999]">
                        {String(index + 1).padStart(2, '0')} /{' '}
                        {String(scenarioItems.length).padStart(2, '0')}
                      </p>
                      <h3 className="text-3xl tracking-tight text-[#252525] md:text-5xl">
                        {scenario.title}
                      </h3>
                    </div>
                    <span
                      aria-hidden="true"
                      className="mt-9 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/15 text-[#555] transition-colors duration-300 group-hover:border-black/40 group-hover:text-black"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                  <p className="mt-8 max-w-xl text-base leading-7 text-[#666]">
                    {scenario.description}
                  </p>
                  {scenario.workflow ? (
                    <div className="mt-8 max-w-xl overflow-hidden rounded-lg border border-black/12 bg-[#f4f4f2]">
                      <SyntaxHighlighter
                        language="text"
                        style={oneLight}
                        className="overflow-x-auto font-mono text-xs leading-6 md:text-sm"
                        customStyle={terminalSyntaxStyle}
                        codeTagProps={{
                          style: transparentSyntaxBackground,
                        }}
                      >
                        {codingAgentWorkflow}
                      </SyntaxHighlighter>
                    </div>
                  ) : scenario.code ? (
                    <div className="mt-8 max-w-xl overflow-hidden rounded-lg border border-black/12 bg-[#f4f4f2] text-sm leading-6 text-[#333]">
                      <SyntaxHighlighter
                        language={scenario.language}
                        style={oneLight}
                        className="scenario-code"
                        showLineNumbers
                        customStyle={transparentSyntaxBackground}
                        codeTagProps={{
                          style: transparentSyntaxBackground,
                        }}
                        lineNumberStyle={transparentSyntaxBackground}
                      >
                        {scenario.code}
                      </SyntaxHighlighter>
                    </div>
                  ) : null}
                  <div className="mt-8 flex flex-wrap gap-x-3 gap-y-2 text-sm text-[#666]">
                    {scenario.examples.map(example => (
                      <span
                        key={example}
                        className="rounded-full border border-black/15 bg-white/60 px-3.5 py-1.5 text-[13px] text-[#444] transition-colors duration-200 hover:border-black/40 hover:text-black"
                      >
                        {example}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
