// Simulated in-memory Linux file system for terminal missions

export interface FSNode {
  type: 'file' | 'dir';
  name: string;
  content?: string;
  children?: Record<string, FSNode>;
  permissions?: string; // e.g. 'rwxr-xr-x'
  owner?: string;
  group?: string;
  size?: number;
  modified?: string;
}

function dir(name: string, children: Record<string, FSNode>, perms = 'rwxr-xr-x'): FSNode {
  return { type: 'dir', name, children, permissions: perms, owner: 'user', group: 'user', modified: 'Feb 21 12:00' };
}

function file(name: string, content = '', perms = 'rw-r--r--', size?: number): FSNode {
  return { type: 'file', name, content, permissions: perms, owner: 'user', group: 'user', size: size || content.length || 0, modified: 'Feb 21 12:00' };
}

export function createDefaultFS(): FSNode {
  return dir('/', {
    'home': dir('home', {
      'user': dir('user', {
        'Desktop': dir('Desktop', {
          'notes.txt': file('notes.txt', 'Remember to learn terminal commands!\nThis is going to be awesome.'),
          'todo.md': file('todo.md', '# TODO\n- Learn terminal\n- Practice commands\n- Build cool stuff'),
          'project': dir('project', {
            'index.html': file('index.html', '<!DOCTYPE html>\n<html>\n<head><title>My Site</title></head>\n<body><h1>Hello World!</h1></body>\n</html>'),
            'style.css': file('style.css', 'body { color: white; background: #0a0e1a; }'),
            'app.js': file('app.js', 'console.log("Hello from NetQuest!");'),
          }),
        }),
        'Documents': dir('Documents', {
          'report.txt': file('report.txt', 'Quarterly Report\n\nServer uptime: 99.9%\nTotal users: 1,234\nBandwidth: 500GB'),
          'passwords.txt': file('passwords.txt', 'admin:supersecret123\nroot:hunter2\nuser:password123', 'rw-------'),
          'readme.md': file('readme.md', '# Welcome\nThis is your documents folder.'),
        }),
        'Downloads': dir('Downloads', {
          'package.tar.gz': file('package.tar.gz', '[binary data]', 'rw-r--r--', 2048),
          'image.png': file('image.png', '[binary data]', 'rw-r--r--', 15360),
          'script.sh': file('script.sh', '#!/bin/bash\necho "Hello from script!"\ndate\nwhoami', 'rw-r--r--'),
        }),
        'Music': dir('Music', {}),
        'Pictures': dir('Pictures', {
          'vacation.jpg': file('vacation.jpg', '[binary data]', 'rw-r--r--', 3145728),
        }),
        '.bashrc': file('.bashrc', '# ~/.bashrc\nexport PS1="\\u@\\h:\\w$ "\nexport PATH="$HOME/bin:$PATH"\nalias ll="ls -la"\nalias gs="git status"'),
        '.bash_history': file('.bash_history', 'ls\ncd Desktop\npwd\ncat notes.txt\nclear'),
      }),
    }),
    'etc': dir('etc', {
      'hostname': file('hostname', 'netquest-vm'),
      'hosts': file('hosts', '127.0.0.1\tlocalhost\n127.0.1.1\tnetquest-vm\n::1\tlocalhost'),
      'passwd': file('passwd', 'root:x:0:0:root:/root:/bin/bash\nuser:x:1000:1000:User:/home/user:/bin/bash\nnobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin'),
      'nginx': dir('nginx', {
        'nginx.conf': file('nginx.conf', 'server {\n  listen 80;\n  root /var/www/html;\n  index index.html;\n}'),
      }),
      'ssh': dir('ssh', {
        'sshd_config': file('sshd_config', 'Port 22\nPermitRootLogin no\nPasswordAuthentication yes'),
      }),
    }),
    'var': dir('var', {
      'log': dir('log', {
        'syslog': file('syslog', 'Feb 21 12:00:01 netquest systemd[1]: Started Daily apt activities.\nFeb 21 12:00:02 netquest CRON[1234]: (root) CMD (test -x /usr/sbin/anacron)\nFeb 21 12:01:00 netquest nginx[5678]: 192.168.1.1 - GET /index.html 200\nFeb 21 12:01:01 netquest sshd[9012]: Accepted password for user from 10.0.0.5\nFeb 21 12:02:00 netquest nginx[5678]: 10.0.0.3 - GET /api/data 404'),
        'auth.log': file('auth.log', 'Feb 21 11:00:00 sshd[1001]: Failed password for root from 203.0.113.50\nFeb 21 11:00:05 sshd[1002]: Failed password for root from 203.0.113.50\nFeb 21 11:00:10 sshd[1003]: Failed password for admin from 203.0.113.50\nFeb 21 12:01:01 sshd[9012]: Accepted password for user from 10.0.0.5'),
        'nginx': dir('nginx', {
          'access.log': file('access.log', '192.168.1.1 - - [21/Feb/2026:12:01:00] "GET /index.html HTTP/1.1" 200 1234\n10.0.0.3 - - [21/Feb/2026:12:01:01] "GET /api/data HTTP/1.1" 404 0'),
          'error.log': file('error.log', ''),
        }),
      }),
      'www': dir('www', {
        'html': dir('html', {
          'index.html': file('index.html', '<!DOCTYPE html>\n<html><body><h1>Welcome to nginx!</h1></body></html>'),
        }),
      }),
    }),
    'tmp': dir('tmp', {
      'session_abc123': file('session_abc123', 'temp data'),
    }),
    'usr': dir('usr', {
      'bin': dir('bin', {
        'python3': file('python3', '[binary]', 'rwxr-xr-x', 4096),
        'node': file('node', '[binary]', 'rwxr-xr-x', 8192),
        'git': file('git', '[binary]', 'rwxr-xr-x', 2048),
      }),
      'local': dir('local', {
        'bin': dir('bin', {}),
      }),
    }),
    'bin': dir('bin', {
      'bash': file('bash', '[binary]', 'rwxr-xr-x', 1024),
      'ls': file('ls', '[binary]', 'rwxr-xr-x', 512),
      'cat': file('cat', '[binary]', 'rwxr-xr-x', 512),
    }),
    'root': dir('root', {}, 'rwx------'),
  });
}

export function resolvePath(fs: FSNode, cwd: string, target: string): string {
  // Handle ~ as /home/user
  target = target.replace(/^~/, '/home/user');
  
  let parts: string[];
  if (target.startsWith('/')) {
    parts = target.split('/').filter(Boolean);
  } else {
    parts = [...cwd.split('/').filter(Boolean), ...target.split('/').filter(Boolean)];
  }

  // Resolve . and ..
  const resolved: string[] = [];
  for (const p of parts) {
    if (p === '.') continue;
    if (p === '..') { resolved.pop(); continue; }
    resolved.push(p);
  }
  return '/' + resolved.join('/');
}

export function getNode(fs: FSNode, path: string): FSNode | null {
  if (path === '/') return fs;
  const parts = path.split('/').filter(Boolean);
  let current = fs;
  for (const part of parts) {
    if (current.type !== 'dir' || !current.children?.[part]) return null;
    current = current.children[part];
  }
  return current;
}

export function getParentAndName(fs: FSNode, path: string): { parent: FSNode | null; name: string } {
  const parts = path.split('/').filter(Boolean);
  if (parts.length === 0) return { parent: null, name: '' };
  const name = parts.pop()!;
  const parentPath = '/' + parts.join('/');
  return { parent: getNode(fs, parentPath), name };
}

export function formatPermissions(node: FSNode): string {
  const prefix = node.type === 'dir' ? 'd' : '-';
  return prefix + (node.permissions || 'rw-r--r--');
}

export function formatLsLine(node: FSNode): string {
  const perms = formatPermissions(node);
  const links = node.type === 'dir' ? '2' : '1';
  const owner = node.owner || 'user';
  const group = node.group || 'user';
  const size = String(node.size || (node.content?.length || 0)).padStart(6);
  const date = node.modified || 'Feb 21 12:00';
  return `${perms} ${links} ${owner} ${group} ${size} ${date} ${node.name}`;
}
