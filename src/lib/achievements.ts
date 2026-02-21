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
];
