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

export const chapters: Chapter[] = [
  {
    id: 1,
    title: 'IP Basics',
    icon: '🌐',
    missions: [
      { id: '1-1', title: "What's an IP?", subtitle: 'Assign IPs to devices, learn public vs private', xp: 50, playable: true },
      { id: '1-2', title: 'Subnetting 101', subtitle: 'Split a network into subnets', xp: 75, playable: false },
      { id: '1-3', title: 'IPv4 vs IPv6', subtitle: 'Quick comparison challenge', xp: 50, playable: false },
    ],
  },
  {
    id: 2,
    title: 'Ports & Protocols',
    icon: '🚪',
    missions: [
      { id: '2-1', title: 'Open the Door', subtitle: 'Learn common ports and their services', xp: 50, playable: true },
      { id: '2-2', title: 'Port Scanner', subtitle: 'Identify which services are running', xp: 75, playable: false },
      { id: '2-3', title: 'TCP vs UDP', subtitle: 'Interactive comparison with examples', xp: 50, playable: false },
    ],
  },
  {
    id: 3,
    title: 'DNS & Domain Names',
    icon: '📖',
    missions: [
      { id: '3-1', title: 'The Phone Book of the Internet', subtitle: 'How DNS resolution works', xp: 50, playable: false },
      { id: '3-2', title: 'Set Up DNS', subtitle: 'Configure A, CNAME, MX records', xp: 75, playable: false },
      { id: '3-3', title: 'Traceroute', subtitle: 'Visual traceroute showing hops', xp: 50, playable: false },
    ],
  },
  {
    id: 4,
    title: 'Localhost vs Web Server vs VPS',
    icon: '🖥️',
    missions: [
      { id: '4-1', title: 'Localhost', subtitle: 'What happens when you run a server on your machine', xp: 50, playable: true },
      { id: '4-2', title: 'Port Forwarding', subtitle: 'Open your localhost to the world', xp: 75, playable: true },
      { id: '4-3', title: 'VPS', subtitle: 'Set up a virtual private server, SSH in, deploy', xp: 100, playable: true },
      { id: '4-4', title: 'Hosting Comparison', subtitle: 'Shared vs VPS vs Dedicated vs Cloud', xp: 50, playable: false },
    ],
  },
  {
    id: 5,
    title: 'Routing & Firewalls',
    icon: '🛡️',
    missions: [
      { id: '5-1', title: 'Route the Packet', subtitle: 'Guide a packet from A to B through routers', xp: 75, playable: true },
      { id: '5-2', title: 'Firewall Rules', subtitle: 'Set up iptables rules to allow/block traffic', xp: 75, playable: false },
      { id: '5-3', title: 'NAT', subtitle: 'Network Address Translation explained', xp: 50, playable: false },
      { id: '5-4', title: 'VPN', subtitle: 'How tunneling works', xp: 50, playable: false },
    ],
  },
  {
    id: 6,
    title: 'Real World Scenarios',
    icon: '🚀',
    missions: [
      { id: '6-1', title: 'Deploy a Website', subtitle: 'Full flow: domain → DNS → VPS → nginx → deploy', xp: 150, playable: false },
      { id: '6-2', title: 'Secure Your Server', subtitle: 'SSH keys, firewall, fail2ban', xp: 100, playable: false },
      { id: '6-3', title: 'Debug the Network', subtitle: "Something's broken — find and fix it!", xp: 100, playable: false },
    ],
  },
];
