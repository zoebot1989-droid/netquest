export interface Mission {
  id: string;
  title: string;
  subtitle: string;
  xp: number;
  playable: boolean;
}

export interface Chapter {
  id: number;
  title: string;
  icon: string;
  missions: Mission[];
}

export interface Path {
  id: string;
  title: string;
  icon: string;
  description: string;
  chapters: Chapter[];
  comingSoon?: boolean;
}

/**
 * Check if a mission is unlocked based on completed missions within a path.
 */
export function isMissionUnlocked(missionId: string, completedMissions: string[], pathId?: string): boolean {
  const path = pathId ? paths.find(p => p.id === pathId) : paths.find(p => p.chapters.some(ch => ch.missions.some(m => m.id === missionId)));
  if (!path) return false;
  const chapters = path.chapters;

  for (let ci = 0; ci < chapters.length; ci++) {
    const ch = chapters[ci];
    for (let mi = 0; mi < ch.missions.length; mi++) {
      if (ch.missions[mi].id === missionId) {
        if (ci === 0 && mi === 0) return true;
        if (mi > 0) {
          return completedMissions.includes(ch.missions[mi - 1].id);
        }
        const prevChapter = chapters[ci - 1];
        const lastPlayable = [...prevChapter.missions].reverse().find(m => m.playable);
        if (lastPlayable && completedMissions.includes(lastPlayable.id)) return true;
        return prevChapter.missions.every(m => completedMissions.includes(m.id));
      }
    }
  }
  return false;
}

export function getPathMissionCount(pathId: string): number {
  const path = paths.find(p => p.id === pathId);
  if (!path) return 0;
  return path.chapters.reduce((sum, ch) => sum + ch.missions.length, 0);
}

export function getPathCompletedCount(pathId: string, completedMissions: string[]): number {
  const path = paths.find(p => p.id === pathId);
  if (!path) return 0;
  return path.chapters.reduce((sum, ch) => sum + ch.missions.filter(m => completedMissions.includes(m.id)).length, 0);
}

const networkingChapters: Chapter[] = [
  {
    id: 1,
    title: 'IP Basics',
    icon: '🌐',
    missions: [
      { id: 'net-1-1', title: "What's an IP?", subtitle: 'Assign IPs to devices, learn public vs private', xp: 50, playable: true },
      { id: 'net-1-2', title: 'Subnetting 101', subtitle: 'Split a network into subnets', xp: 75, playable: false },
      { id: 'net-1-3', title: 'IPv4 vs IPv6', subtitle: 'Quick comparison challenge', xp: 50, playable: false },
    ],
  },
  {
    id: 2,
    title: 'Ports & Protocols',
    icon: '🚪',
    missions: [
      { id: 'net-2-1', title: 'Open the Door', subtitle: 'Learn common ports and their services', xp: 50, playable: true },
      { id: 'net-2-2', title: 'Port Scanner', subtitle: 'Identify which services are running', xp: 75, playable: false },
      { id: 'net-2-3', title: 'TCP vs UDP', subtitle: 'Interactive comparison with examples', xp: 50, playable: false },
    ],
  },
  {
    id: 3,
    title: 'DNS & Domain Names',
    icon: '📖',
    missions: [
      { id: 'net-3-1', title: 'The Phone Book of the Internet', subtitle: 'How DNS resolution works', xp: 50, playable: false },
      { id: 'net-3-2', title: 'Set Up DNS', subtitle: 'Configure A, CNAME, MX records', xp: 75, playable: false },
      { id: 'net-3-3', title: 'Traceroute', subtitle: 'Visual traceroute showing hops', xp: 50, playable: false },
    ],
  },
  {
    id: 4,
    title: 'Localhost vs Web Server vs VPS',
    icon: '🖥️',
    missions: [
      { id: 'net-4-1', title: 'Localhost', subtitle: 'What happens when you run a server on your machine', xp: 50, playable: true },
      { id: 'net-4-2', title: 'Port Forwarding', subtitle: 'Open your localhost to the world', xp: 75, playable: true },
      { id: 'net-4-3', title: 'VPS', subtitle: 'Set up a virtual private server, SSH in, deploy', xp: 100, playable: true },
      { id: 'net-4-4', title: 'Hosting Comparison', subtitle: 'Shared vs VPS vs Dedicated vs Cloud', xp: 50, playable: false },
    ],
  },
  {
    id: 5,
    title: 'Routing & Firewalls',
    icon: '🛡️',
    missions: [
      { id: 'net-5-1', title: 'Route the Packet', subtitle: 'Guide a packet from A to B through routers', xp: 75, playable: true },
      { id: 'net-5-2', title: 'Firewall Rules', subtitle: 'Set up iptables rules to allow/block traffic', xp: 75, playable: false },
      { id: 'net-5-3', title: 'NAT', subtitle: 'Network Address Translation explained', xp: 50, playable: false },
      { id: 'net-5-4', title: 'VPN', subtitle: 'How tunneling works', xp: 50, playable: false },
    ],
  },
  {
    id: 6,
    title: 'Real World Scenarios',
    icon: '🚀',
    missions: [
      { id: 'net-6-1', title: 'Deploy a Website', subtitle: 'Full flow: domain → DNS → VPS → nginx → deploy', xp: 150, playable: false },
      { id: 'net-6-2', title: 'Secure Your Server', subtitle: 'SSH keys, firewall, fail2ban', xp: 100, playable: false },
      { id: 'net-6-3', title: "Debug the Network", subtitle: "Something's broken — find and fix it!", xp: 100, playable: false },
    ],
  },
];

const terminalChapters: Chapter[] = [
  {
    id: 1,
    title: 'Getting Started',
    icon: '🚀',
    missions: [
      { id: 'term-1-1', title: 'What is the Terminal?', subtitle: 'CLI vs GUI, why the terminal matters', xp: 40, playable: true },
      { id: 'term-1-2', title: 'Your First Commands', subtitle: 'pwd, ls, cd, echo, whoami, clear', xp: 50, playable: true },
      { id: 'term-1-3', title: 'Navigating the File System', subtitle: 'cd, ls -la, absolute vs relative paths', xp: 60, playable: true },
    ],
  },
  {
    id: 2,
    title: 'Files & Directories',
    icon: '📁',
    missions: [
      { id: 'term-2-1', title: 'Creating & Deleting', subtitle: 'mkdir, touch, rm, rmdir — build and destroy', xp: 50, playable: true },
      { id: 'term-2-2', title: 'Copy, Move, Rename', subtitle: 'cp, mv — organize your files', xp: 50, playable: true },
      { id: 'term-2-3', title: 'Reading Files', subtitle: 'cat, head, tail, wc — peek inside files', xp: 60, playable: true },
    ],
  },
  {
    id: 3,
    title: 'Power Tools',
    icon: '⚡',
    missions: [
      { id: 'term-3-1', title: 'Find & Search', subtitle: 'grep, find — hunt for files and text', xp: 60, playable: true },
      { id: 'term-3-2', title: 'Pipes & Redirection', subtitle: '|, >, >> — chain commands like a pro', xp: 70, playable: true },
      { id: 'term-3-3', title: 'Permissions', subtitle: 'chmod, chown — who can do what', xp: 70, playable: true },
    ],
  },
  {
    id: 4,
    title: 'Getting Stuff Done',
    icon: '🔧',
    missions: [
      { id: 'term-4-1', title: 'Package Managers', subtitle: 'apt, brew, yum — install anything', xp: 50, playable: true },
      { id: 'term-4-2', title: 'Processes', subtitle: 'ps, top, kill — manage running programs', xp: 60, playable: true },
      { id: 'term-4-3', title: 'Environment Variables', subtitle: '$PATH, export, .bashrc — configure your shell', xp: 60, playable: true },
    ],
  },
  {
    id: 5,
    title: 'Real World Terminal',
    icon: '🌍',
    missions: [
      { id: 'term-5-1', title: 'SSH Into a Server', subtitle: 'Remote access with SSH and SCP', xp: 70, playable: true },
      { id: 'term-5-2', title: 'Shell Scripting Basics', subtitle: 'Write your first bash script', xp: 80, playable: true },
      { id: 'term-5-3', title: 'Terminal Customization', subtitle: 'Aliases, prompts, Oh My Zsh', xp: 60, playable: true },
    ],
  },
];

const linuxChapters: Chapter[] = [
  {
    id: 1,
    title: 'Welcome to Linux',
    icon: '🐧',
    missions: [
      { id: 'linux-1-1', title: 'What is Linux?', subtitle: 'History, why it matters, Linux everywhere', xp: 40, playable: true },
      { id: 'linux-1-2', title: 'Distributions', subtitle: 'Ubuntu, Fedora, Arch — pick your flavor', xp: 50, playable: true },
      { id: 'linux-1-3', title: 'The Linux Desktop', subtitle: 'GNOME, KDE, XFCE — GUIs on Linux', xp: 50, playable: true },
    ],
  },
  {
    id: 2,
    title: 'Users & Groups',
    icon: '👥',
    missions: [
      { id: 'linux-2-1', title: 'Users', subtitle: 'root vs regular, whoami, id, /etc/passwd', xp: 50, playable: true },
      { id: 'linux-2-2', title: 'Groups', subtitle: 'groups, /etc/group, usermod, groupadd', xp: 50, playable: true },
      { id: 'linux-2-3', title: 'sudo Power', subtitle: 'sudo, sudoers, with great power...', xp: 60, playable: true },
    ],
  },
  {
    id: 3,
    title: 'The File System',
    icon: '📂',
    missions: [
      { id: 'linux-3-1', title: 'Everything is a File', subtitle: 'Linux philosophy, file types', xp: 50, playable: true },
      { id: 'linux-3-2', title: 'Directory Structure', subtitle: '/, /home, /etc, /var — what lives where', xp: 60, playable: true },
      { id: 'linux-3-3', title: 'Links & Mounts', subtitle: 'Hard links, symlinks, mount points', xp: 60, playable: true },
    ],
  },
  {
    id: 4,
    title: 'Services & Packages',
    icon: '📦',
    missions: [
      { id: 'linux-4-1', title: 'Package Management', subtitle: 'apt, yum, pacman — install anything', xp: 60, playable: true },
      { id: 'linux-4-2', title: 'Services & systemd', subtitle: 'systemctl start/stop/status', xp: 60, playable: true },
      { id: 'linux-4-3', title: 'Logs & Monitoring', subtitle: 'journalctl, dmesg, /var/log/', xp: 70, playable: true },
    ],
  },
  {
    id: 5,
    title: 'Linux Administration',
    icon: '🔧',
    missions: [
      { id: 'linux-5-1', title: 'Networking on Linux', subtitle: 'ip addr, ss, /etc/hosts', xp: 60, playable: true },
      { id: 'linux-5-2', title: 'Cron Jobs', subtitle: 'Schedule tasks like a pro', xp: 70, playable: true },
      { id: 'linux-5-3', title: 'Disk & Storage', subtitle: 'df, du, lsblk — manage your disks', xp: 70, playable: true },
    ],
  },
];

const pythonChapters: Chapter[] = [
  {
    id: 1,
    title: 'Python Basics',
    icon: '🐍',
    missions: [
      { id: 'py-1-1', title: 'Hello Python!', subtitle: 'What is Python and your first print()', xp: 40, playable: true },
      { id: 'py-1-2', title: 'Variables & Data Types', subtitle: 'Strings, ints, floats, booleans, type()', xp: 50, playable: true },
      { id: 'py-1-3', title: 'Input & Output', subtitle: 'print(), input(), f-strings', xp: 50, playable: true },
    ],
  },
  {
    id: 2,
    title: 'Control Flow',
    icon: '🔀',
    missions: [
      { id: 'py-2-1', title: 'If / Elif / Else', subtitle: 'Conditional logic and comparisons', xp: 50, playable: true },
      { id: 'py-2-2', title: 'Loops — For', subtitle: 'for loops, range(), iteration', xp: 60, playable: true },
      { id: 'py-2-3', title: 'Loops — While', subtitle: 'while loops, break, continue', xp: 60, playable: true },
    ],
  },
  {
    id: 3,
    title: 'Data Structures',
    icon: '📦',
    missions: [
      { id: 'py-3-1', title: 'Lists', subtitle: 'Create, index, slice, append, sort', xp: 60, playable: true },
      { id: 'py-3-2', title: 'Dictionaries', subtitle: 'Key-value pairs, nested dicts', xp: 60, playable: true },
      { id: 'py-3-3', title: 'Tuples & Sets', subtitle: 'Immutability and set operations', xp: 60, playable: true },
    ],
  },
  {
    id: 4,
    title: 'Functions & Modules',
    icon: '⚙️',
    missions: [
      { id: 'py-4-1', title: 'Functions', subtitle: 'def, parameters, return values', xp: 60, playable: true },
      { id: 'py-4-2', title: 'Modules & Imports', subtitle: 'import, standard library highlights', xp: 60, playable: true },
      { id: 'py-4-3', title: 'Error Handling', subtitle: 'try/except/finally, common exceptions', xp: 70, playable: true },
    ],
  },
  {
    id: 5,
    title: 'Real World Python',
    icon: '🌍',
    missions: [
      { id: 'py-5-1', title: 'File I/O', subtitle: 'Reading and writing files', xp: 70, playable: true },
      { id: 'py-5-2', title: 'APIs & Requests', subtitle: 'HTTP, JSON, querying APIs', xp: 70, playable: true },
      { id: 'py-5-3', title: 'Build a Tool', subtitle: 'Put it all together!', xp: 100, playable: true },
    ],
  },
];

export const paths: Path[] = [
  {
    id: 'networking',
    title: 'Networking',
    icon: '🌐',
    description: 'IPs, ports, DNS, VPS, routing, firewalls',
    chapters: networkingChapters,
  },
  {
    id: 'terminal',
    title: 'Terminal',
    icon: '💻',
    description: 'Master the command line from scratch',
    chapters: terminalChapters,
  },
  {
    id: 'linux',
    title: 'Linux',
    icon: '🐧',
    description: 'Learn the OS that runs the internet',
    chapters: linuxChapters,
  },
  {
    id: 'python',
    title: 'Coding (Python)',
    icon: '🐍',
    description: 'Python fundamentals and beyond',
    chapters: pythonChapters,
  },
  {
    id: 'webdev',
    title: 'Web Dev',
    icon: '🕸️',
    description: 'HTML, CSS, JS — build for the web',
    chapters: [],
    comingSoon: true,
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity',
    icon: '🔐',
    description: 'Encryption, hacking, defense',
    chapters: [],
    comingSoon: true,
  },
  {
    id: 'devops',
    title: 'DevOps',
    icon: '🐳',
    description: 'Docker, Git, CI/CD pipelines',
    chapters: [],
    comingSoon: true,
  },
  {
    id: 'hardware',
    title: 'Hardware',
    icon: '🖥️',
    description: 'CPUs, RAM, building machines',
    chapters: [],
    comingSoon: true,
  },
];

// Legacy export for backward compatibility
export const chapters = networkingChapters;
