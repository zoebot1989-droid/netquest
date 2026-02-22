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

const webdevChapters: Chapter[] = [
  {
    id: 1,
    title: 'HTML Foundations',
    icon: '🏗️',
    missions: [
      { id: 'web-1-1', title: 'The Skeleton of the Web', subtitle: 'HTML tags, elements, attributes — build your first page', xp: 50, playable: true },
      { id: 'web-1-2', title: 'Structure & Semantics', subtitle: 'header, nav, main, section — meaningful HTML', xp: 60, playable: true },
      { id: 'web-1-3', title: 'Forms & Inputs', subtitle: 'Build interactive forms with inputs, selects, labels', xp: 60, playable: true },
    ],
  },
  {
    id: 2,
    title: 'CSS Styling',
    icon: '🎨',
    missions: [
      { id: 'web-2-1', title: 'Making Things Pretty', subtitle: 'Selectors, properties, colors, fonts', xp: 50, playable: true },
      { id: 'web-2-2', title: 'The Box Model', subtitle: 'Content, padding, border, margin — how layout works', xp: 60, playable: true },
      { id: 'web-2-3', title: 'Flexbox & Grid', subtitle: 'Modern layout with flex and grid', xp: 70, playable: true },
    ],
  },
  {
    id: 3,
    title: 'JavaScript Basics',
    icon: '⚡',
    missions: [
      { id: 'web-3-1', title: 'Making Pages Interactive', subtitle: 'Variables, console.log, data types', xp: 50, playable: true },
      { id: 'web-3-2', title: 'DOM Manipulation', subtitle: 'querySelector, textContent, style, classList', xp: 60, playable: true },
      { id: 'web-3-3', title: 'Events & Listeners', subtitle: 'addEventListener, click, submit, keydown', xp: 70, playable: true },
    ],
  },
  {
    id: 4,
    title: 'Putting It Together',
    icon: '🔧',
    missions: [
      { id: 'web-4-1', title: 'Responsive Design', subtitle: 'Media queries, viewport, relative units', xp: 60, playable: true },
      { id: 'web-4-2', title: 'CSS Frameworks', subtitle: 'Tailwind CSS, Bootstrap — build faster', xp: 60, playable: true },
      { id: 'web-4-3', title: 'Fetch & APIs', subtitle: 'fetch(), async/await, JSON — talk to servers', xp: 70, playable: true },
    ],
  },
  {
    id: 5,
    title: 'Real World Web Dev',
    icon: '🚀',
    missions: [
      { id: 'web-5-1', title: 'Developer Tools', subtitle: 'Chrome DevTools — inspect, debug, test', xp: 60, playable: true },
      { id: 'web-5-2', title: 'Deployment', subtitle: 'GitHub Pages, Netlify, Vercel — go live', xp: 70, playable: true },
      { id: 'web-5-3', title: 'Build a Website', subtitle: 'Full project — personal portfolio with HTML+CSS+JS', xp: 100, playable: true },
    ],
  },
];

const devopsChapters: Chapter[] = [
  {
    id: 1,
    title: 'Version Control (Git)',
    icon: '📝',
    missions: [
      { id: 'devops-1-1', title: 'Git Basics', subtitle: 'init, add, commit, status, log — track your code', xp: 50, playable: true },
      { id: 'devops-1-2', title: 'Branching & Merging', subtitle: 'branch, checkout, merge — parallel development', xp: 60, playable: true },
      { id: 'devops-1-3', title: 'Remote Repos', subtitle: 'push, pull, clone — collaborate with GitHub', xp: 60, playable: true },
    ],
  },
  {
    id: 2,
    title: 'Docker & Containers',
    icon: '🐳',
    missions: [
      { id: 'devops-2-1', title: 'What Are Containers?', subtitle: 'Containers vs VMs, images, Docker Hub', xp: 50, playable: true },
      { id: 'devops-2-2', title: 'Docker Commands', subtitle: 'run, ps, images, stop, rm — manage containers', xp: 60, playable: true },
      { id: 'devops-2-3', title: 'Dockerfiles', subtitle: 'FROM, COPY, RUN, CMD — build custom images', xp: 70, playable: true },
    ],
  },
  {
    id: 3,
    title: 'CI/CD Pipelines',
    icon: '🔄',
    missions: [
      { id: 'devops-3-1', title: 'What is CI/CD?', subtitle: 'Continuous Integration & Delivery explained', xp: 50, playable: true },
      { id: 'devops-3-2', title: 'GitHub Actions', subtitle: 'Workflow YAML, triggers, jobs, steps', xp: 60, playable: true },
      { id: 'devops-3-3', title: 'Testing & Quality', subtitle: 'Unit tests, linting, coverage, test pyramid', xp: 60, playable: true },
    ],
  },
  {
    id: 4,
    title: 'Infrastructure',
    icon: '☁️',
    missions: [
      { id: 'devops-4-1', title: 'Cloud Providers', subtitle: 'AWS, GCP, Azure — key services overview', xp: 50, playable: true },
      { id: 'devops-4-2', title: 'Infrastructure as Code', subtitle: 'Terraform basics — declarative infra', xp: 60, playable: true },
      { id: 'devops-4-3', title: 'Monitoring & Logging', subtitle: 'Prometheus, Grafana, ELK stack', xp: 60, playable: true },
    ],
  },
  {
    id: 5,
    title: 'Real World DevOps',
    icon: '🚀',
    missions: [
      { id: 'devops-5-1', title: 'Docker Compose', subtitle: 'Multi-container apps with docker-compose', xp: 60, playable: true },
      { id: 'devops-5-2', title: 'Kubernetes Basics', subtitle: 'Pods, deployments, services, kubectl', xp: 70, playable: true },
      { id: 'devops-5-3', title: 'The Full Pipeline', subtitle: 'Code → Git → CI → Docker → Deploy', xp: 100, playable: true },
    ],
  },
];

const hardwareChapters: Chapter[] = [
  {
    id: 1,
    title: 'Inside the Computer',
    icon: '🖥️',
    missions: [
      { id: 'hw-1-1', title: 'How Computers Work', subtitle: 'CPU, RAM, storage, and the fetch-decode-execute cycle', xp: 50, playable: true },
      { id: 'hw-1-2', title: 'The CPU', subtitle: 'Cores, threads, clock speed, cache levels', xp: 60, playable: true },
      { id: 'hw-1-3', title: 'Memory (RAM)', subtitle: 'DDR4 vs DDR5, speed, capacity, dual channel', xp: 60, playable: true },
    ],
  },
  {
    id: 2,
    title: 'Storage & Power',
    icon: '💾',
    missions: [
      { id: 'hw-2-1', title: 'Storage — HDD vs SSD vs NVMe', subtitle: 'Speed, interfaces, and use cases', xp: 60, playable: true },
      { id: 'hw-2-2', title: 'The Power Supply (PSU)', subtitle: 'Wattage, efficiency ratings, calculating needs', xp: 60, playable: true },
      { id: 'hw-2-3', title: 'The Motherboard', subtitle: 'Form factors, chipsets, sockets, expansion slots', xp: 70, playable: true },
    ],
  },
  {
    id: 3,
    title: 'Graphics & Display',
    icon: '🎮',
    missions: [
      { id: 'hw-3-1', title: 'GPUs Explained', subtitle: 'Integrated vs discrete, VRAM, ray tracing', xp: 60, playable: true },
      { id: 'hw-3-2', title: 'Monitors & Display', subtitle: 'Resolution, refresh rate, panel types', xp: 60, playable: true },
      { id: 'hw-3-3', title: 'Cooling Solutions', subtitle: 'Air vs liquid, thermal paste, airflow design', xp: 60, playable: true },
    ],
  },
  {
    id: 4,
    title: 'Building a PC',
    icon: '🔧',
    missions: [
      { id: 'hw-4-1', title: 'Planning Your Build', subtitle: 'Budget, compatibility, avoiding bottlenecks', xp: 70, playable: true },
      { id: 'hw-4-2', title: 'Assembly Step-by-Step', subtitle: 'CPU to cables — the full build process', xp: 80, playable: true },
      { id: 'hw-4-3', title: 'BIOS & First Boot', subtitle: 'POST, UEFI setup, XMP, boot order', xp: 70, playable: true },
    ],
  },
  {
    id: 5,
    title: 'Servers & Infrastructure',
    icon: '🏗️',
    missions: [
      { id: 'hw-5-1', title: 'What is a Server?', subtitle: 'Server hardware, redundancy, RAID, ECC RAM', xp: 70, playable: true },
      { id: 'hw-5-2', title: 'Networking Hardware', subtitle: 'Routers, switches, cables, PoE, network design', xp: 70, playable: true },
      { id: 'hw-5-3', title: 'Building a Home Lab', subtitle: 'Proxmox, Docker, NAS — your own infrastructure', xp: 100, playable: true },
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
    chapters: webdevChapters,
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
    chapters: devopsChapters,
  },
  {
    id: 'hardware',
    title: 'Hardware',
    icon: '🖥️',
    description: 'CPUs, RAM, building machines',
    chapters: hardwareChapters,
  },
];

// Legacy export for backward compatibility
export const chapters = networkingChapters;
