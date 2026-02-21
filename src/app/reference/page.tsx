'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

const tabs = ['Ports', 'IPs', 'Subnets', 'Protocols', 'Commands'];

const portsData = [
  { port: 20, service: 'FTP Data', protocol: 'TCP' },
  { port: 21, service: 'FTP Control', protocol: 'TCP' },
  { port: 22, service: 'SSH', protocol: 'TCP' },
  { port: 23, service: 'Telnet', protocol: 'TCP' },
  { port: 25, service: 'SMTP', protocol: 'TCP' },
  { port: 53, service: 'DNS', protocol: 'TCP/UDP' },
  { port: 67, service: 'DHCP Server', protocol: 'UDP' },
  { port: 68, service: 'DHCP Client', protocol: 'UDP' },
  { port: 80, service: 'HTTP', protocol: 'TCP' },
  { port: 110, service: 'POP3', protocol: 'TCP' },
  { port: 143, service: 'IMAP', protocol: 'TCP' },
  { port: 443, service: 'HTTPS', protocol: 'TCP' },
  { port: 993, service: 'IMAPS', protocol: 'TCP' },
  { port: 3306, service: 'MySQL', protocol: 'TCP' },
  { port: 3389, service: 'RDP', protocol: 'TCP' },
  { port: 5432, service: 'PostgreSQL', protocol: 'TCP' },
  { port: 6379, service: 'Redis', protocol: 'TCP' },
  { port: 8080, service: 'HTTP Alt', protocol: 'TCP' },
  { port: 27017, service: 'MongoDB', protocol: 'TCP' },
];

export default function Reference() {
  const [tab, setTab] = useState(0);

  return (
    <div className="pb-8">
      <h1 className="text-xl font-bold mb-4">📚 Quick Reference</h1>

      <div className="flex gap-1 mb-4 overflow-x-auto pb-1">
        {tabs.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${tab === i ? 'bg-cyan-900/30 text-[#00f0ff]' : 'bg-gray-800/50 text-gray-500'}`}
          >
            {t}
          </button>
        ))}
      </div>

      <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        {tab === 0 && (
          <div className="card overflow-hidden p-0">
            <div className="grid grid-cols-3 gap-0 text-xs font-mono">
              <div className="p-2 bg-gray-800/50 font-semibold" style={{ color: '#00f0ff' }}>Port</div>
              <div className="p-2 bg-gray-800/50 font-semibold" style={{ color: '#39ff14' }}>Service</div>
              <div className="p-2 bg-gray-800/50 font-semibold text-gray-400">Protocol</div>
              {portsData.map(p => (
                <>
                  <div key={`${p.port}-p`} className="p-2 border-t border-gray-800/50" style={{ color: '#00f0ff' }}>{p.port}</div>
                  <div key={`${p.port}-s`} className="p-2 border-t border-gray-800/50">{p.service}</div>
                  <div key={`${p.port}-pr`} className="p-2 border-t border-gray-800/50 text-gray-500">{p.protocol}</div>
                </>
              ))}
            </div>
          </div>
        )}

        {tab === 1 && (
          <div className="space-y-3">
            <div className="card">
              <h3 className="font-semibold mb-2" style={{ color: '#39ff14' }}>Private IP Ranges</h3>
              <div className="font-mono text-xs space-y-2">
                <div><span style={{ color: '#00f0ff' }}>10.0.0.0/8</span> — 10.0.0.0 to 10.255.255.255<br/><span className="text-gray-500">Class A — Large networks (16M hosts)</span></div>
                <div><span style={{ color: '#00f0ff' }}>172.16.0.0/12</span> — 172.16.0.0 to 172.31.255.255<br/><span className="text-gray-500">Class B — Medium networks (1M hosts)</span></div>
                <div><span style={{ color: '#00f0ff' }}>192.168.0.0/16</span> — 192.168.0.0 to 192.168.255.255<br/><span className="text-gray-500">Class C — Home/small networks (65K hosts)</span></div>
              </div>
            </div>
            <div className="card">
              <h3 className="font-semibold mb-2" style={{ color: '#ff9500' }}>Special Addresses</h3>
              <div className="font-mono text-xs space-y-1">
                <div><span style={{ color: '#00f0ff' }}>127.0.0.1</span> — Loopback (localhost)</div>
                <div><span style={{ color: '#00f0ff' }}>0.0.0.0</span> — All interfaces</div>
                <div><span style={{ color: '#00f0ff' }}>255.255.255.255</span> — Broadcast</div>
                <div><span style={{ color: '#00f0ff' }}>8.8.8.8</span> — Google DNS</div>
                <div><span style={{ color: '#00f0ff' }}>1.1.1.1</span> — Cloudflare DNS</div>
              </div>
            </div>
          </div>
        )}

        {tab === 2 && (
          <div className="card">
            <h3 className="font-semibold mb-3">Subnet Masks</h3>
            <div className="font-mono text-xs space-y-1">
              {[
                { cidr: '/8', mask: '255.0.0.0', hosts: '16,777,214' },
                { cidr: '/16', mask: '255.255.0.0', hosts: '65,534' },
                { cidr: '/24', mask: '255.255.255.0', hosts: '254' },
                { cidr: '/25', mask: '255.255.255.128', hosts: '126' },
                { cidr: '/26', mask: '255.255.255.192', hosts: '62' },
                { cidr: '/27', mask: '255.255.255.224', hosts: '30' },
                { cidr: '/28', mask: '255.255.255.240', hosts: '14' },
                { cidr: '/29', mask: '255.255.255.248', hosts: '6' },
                { cidr: '/30', mask: '255.255.255.252', hosts: '2' },
                { cidr: '/32', mask: '255.255.255.255', hosts: '1' },
              ].map(s => (
                <div key={s.cidr} className="flex justify-between py-1 border-b border-gray-800/30">
                  <span style={{ color: '#00f0ff' }}>{s.cidr}</span>
                  <span className="text-gray-400">{s.mask}</span>
                  <span style={{ color: '#39ff14' }}>{s.hosts} hosts</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 3 && (
          <div className="space-y-3">
            <div className="card">
              <h3 className="font-semibold mb-2">TCP vs UDP vs ICMP</h3>
              <div className="text-xs space-y-3">
                <div>
                  <p className="font-semibold" style={{ color: '#00f0ff' }}>TCP (Transmission Control Protocol)</p>
                  <p className="text-gray-400">Reliable, ordered delivery. Connection-based (3-way handshake). Used for: HTTP, SSH, FTP, email.</p>
                </div>
                <div>
                  <p className="font-semibold" style={{ color: '#39ff14' }}>UDP (User Datagram Protocol)</p>
                  <p className="text-gray-400">Fast, no guarantee of delivery. Connectionless. Used for: DNS, video streaming, gaming, VoIP.</p>
                </div>
                <div>
                  <p className="font-semibold" style={{ color: '#ff9500' }}>ICMP (Internet Control Message Protocol)</p>
                  <p className="text-gray-400">Network diagnostics. Used by: ping, traceroute. Not for data transfer.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 4 && (
          <div className="space-y-2">
            {[
              { cmd: 'ping <host>', desc: 'Test if a host is reachable and measure latency' },
              { cmd: 'traceroute <host>', desc: 'Show the path packets take to reach a host' },
              { cmd: 'nslookup <domain>', desc: 'Look up DNS records for a domain' },
              { cmd: 'dig <domain>', desc: 'Advanced DNS lookup tool' },
              { cmd: 'ssh user@host', desc: 'Connect to a remote server securely' },
              { cmd: 'scp file user@host:path', desc: 'Copy files to/from remote server' },
              { cmd: 'curl <url>', desc: 'Make HTTP requests from command line' },
              { cmd: 'netstat -tulpn', desc: 'Show listening ports and connections' },
              { cmd: 'ss -tulpn', desc: 'Modern replacement for netstat' },
              { cmd: 'ifconfig / ip addr', desc: 'Show network interface configuration' },
              { cmd: 'iptables -L', desc: 'List firewall rules' },
              { cmd: 'ufw status', desc: 'Simple firewall status (Ubuntu)' },
              { cmd: 'systemctl status nginx', desc: 'Check if nginx is running' },
            ].map(c => (
              <div key={c.cmd} className="card py-2">
                <div className="font-mono text-sm" style={{ color: '#39ff14' }}>{c.cmd}</div>
                <div className="text-xs text-gray-500">{c.desc}</div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
