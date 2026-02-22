export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export const achievements: Achievement[] = [
  // General
  { id: 'first-mission', title: 'First Steps', description: 'Complete your first mission', icon: '🎯' },
  { id: 'streak-3', title: 'On a Roll', description: '3-day streak', icon: '🔥' },
  { id: 'streak-7', title: 'Week Warrior', description: '7-day streak', icon: '⚡' },
  { id: 'level-5', title: 'Network Engineer', description: 'Reach level 5', icon: '👨‍💻' },

  // Networking
  { id: 'ip-master', title: 'IP Master', description: 'Complete all IP Basics missions', icon: '🌐' },
  { id: 'port-master', title: 'Port Master', description: 'Complete all Ports & Protocols missions', icon: '🚪' },
  { id: 'dns-wizard', title: 'DNS Wizard', description: 'Complete all DNS missions', icon: '🧙' },
  { id: 'server-lord', title: 'Server Lord', description: 'Complete all VPS missions', icon: '🖥️' },
  { id: 'firewall-guardian', title: 'Firewall Guardian', description: 'Complete all Routing & Firewall missions', icon: '🛡️' },
  { id: 'first-ssh', title: 'First SSH!', description: 'Use SSH in the terminal', icon: '🔑' },

  // Terminal
  { id: 'hello-terminal', title: 'Hello World', description: 'Complete your first Terminal mission', icon: '💻' },
  { id: 'navigator', title: 'Navigator', description: 'Navigate to 5 different directories', icon: '🧭' },
  { id: 'file-master', title: 'File Master', description: 'Create, copy, move, and delete files', icon: '📁' },
  { id: 'pipe-dream', title: 'Pipe Dream', description: 'Use pipes to chain 3 commands', icon: '🔗' },
  { id: 'root-access', title: 'Root Access', description: 'Learn about permissions', icon: '🔓' },
  { id: 'script-kiddie', title: 'Script Kiddie', description: 'Write your first shell script', icon: '📜' },
  { id: 'ssh-agent', title: 'SSH Agent', description: 'SSH into a simulated server', icon: '🛰️' },

  // Linux
  { id: 'penguin-power', title: 'Penguin Power', description: 'Complete first Linux mission', icon: '🐧' },
  { id: 'distro-hopper', title: 'Distro Hopper', description: 'Learn about 5+ distributions', icon: '🏄' },
  { id: 'root-beer', title: 'Root Beer', description: 'Successfully use sudo', icon: '🍺' },
  { id: 'system-admin', title: 'System Admin', description: 'Manage a service with systemctl', icon: '⚙️' },
  { id: 'log-detective', title: 'Log Detective', description: 'Find an error in system logs', icon: '🔍' },
  { id: 'cron-master', title: 'Cron Master', description: 'Write a correct cron expression', icon: '⏰' },
  { id: 'disk-doctor', title: 'Disk Doctor', description: 'Analyze disk usage', icon: '💾' },

  // Python
  { id: 'pythonista', title: 'Pythonista', description: 'Complete your first Python mission', icon: '🐍' },
  { id: 'hello-world', title: 'Hello World!', description: 'Print hello world in Python', icon: '👋' },
  { id: 'loop-master', title: 'Loop Master', description: 'Complete all loop missions', icon: '🔄' },
  { id: 'data-wrangler', title: 'Data Wrangler', description: 'Work with lists, dicts, and sets', icon: '📊' },
  { id: 'function-factory', title: 'Function Factory', description: 'Write 5 functions', icon: '🏭' },
  { id: 'bug-squasher', title: 'Bug Squasher', description: 'Fix broken code with try/except', icon: '🐛' },
  { id: 'api-explorer', title: 'API Explorer', description: 'Query a simulated API', icon: '🌐' },

  // Web Dev
  { id: 'web-weaver', title: 'Web Weaver', description: 'Complete first Web Dev mission', icon: '🕸️' },
  { id: 'semantic-scholar', title: 'Semantic Scholar', description: 'Use all semantic HTML tags', icon: '📐' },
  { id: 'style-master', title: 'Style Master', description: 'Complete all CSS missions', icon: '🎨' },
  { id: 'flex-lord', title: 'Flex Lord', description: 'Master flexbox layout', icon: '📦' },
  { id: 'dom-wizard', title: 'DOM Wizard', description: 'Manipulate the DOM with JavaScript', icon: '🧙' },
  { id: 'full-stack-starter', title: 'Full Stack Starter', description: 'Complete the Web Dev path', icon: '🏆' },
  { id: 'deployed', title: 'Deployed!', description: 'Learn about deployment', icon: '🚀' },

  // DevOps
  { id: 'git-gud', title: 'Git Gud', description: 'Complete first Git mission', icon: '📝' },
  { id: 'branch-manager', title: 'Branch Manager', description: 'Create and merge a branch', icon: '🌿' },
  { id: 'container-captain', title: 'Container Captain', description: 'Run first Docker container', icon: '🐳' },
  { id: 'dockerfile-author', title: 'Dockerfile Author', description: 'Write a Dockerfile', icon: '📄' },
  { id: 'pipeline-pro', title: 'Pipeline Pro', description: 'Build a CI/CD pipeline', icon: '🔄' },
  { id: 'cloud-native', title: 'Cloud Native', description: 'Learn about cloud providers', icon: '☁️' },
  { id: 'full-devops', title: 'Full DevOps', description: 'Complete the DevOps path', icon: '🏆' },

  // Hardware
  { id: 'pc-builder', title: 'PC Builder', description: 'Complete first Hardware mission', icon: '🖥️' },
  { id: 'spec-reader', title: 'Spec Reader', description: 'Compare CPUs correctly', icon: '📋' },
  { id: 'cable-manager', title: 'Cable Manager', description: 'Learn about all cable types', icon: '🔌' },
  { id: 'budget-builder', title: 'Budget Builder', description: 'Build a PC within budget', icon: '💰' },
  { id: 'first-boot', title: 'First Boot', description: 'Configure BIOS settings', icon: '⚡' },
  { id: 'server-admin', title: 'Server Admin', description: 'Learn about server hardware', icon: '🏗️' },
  { id: 'home-lab-hero', title: 'Home Lab Hero', description: 'Plan a home lab', icon: '🏠' },

  // Cybersecurity
  { id: 'white-hat', title: 'White Hat', description: 'Complete first Cybersecurity mission', icon: '🎩' },
  { id: 'osint-detective', title: 'OSINT Detective', description: 'Complete all recon missions', icon: '🕵️' },
  { id: 'sql-injector', title: 'SQL Injector', description: 'Successfully exploit SQL injection', icon: '💉' },
  { id: 'xss-hunter', title: 'XSS Hunter', description: 'Find and exploit XSS', icon: '🎯' },
  { id: 'hash-cracker', title: 'Hash Cracker', description: 'Crack a password hash', icon: '🔓' },
  { id: 'packet-sniffer', title: 'Packet Sniffer', description: 'Analyze network packets', icon: '📡' },
  { id: 'firewall-master', title: 'Firewall Guardian', description: 'Write defensive firewall rules', icon: '🧱' },
  { id: 'incident-commander', title: 'Incident Commander', description: 'Complete incident response', icon: '🚨' },
  { id: 'ctf-champion', title: 'CTF Champion', description: 'Solve all CTF challenges', icon: '🏆' },
  { id: 'pentester', title: 'Pentester', description: 'Complete pentest methodology', icon: '🔬' },
  { id: 'cyber-complete', title: 'Cyber Complete', description: 'Complete the entire Cybersecurity path', icon: '🔐' },
];
