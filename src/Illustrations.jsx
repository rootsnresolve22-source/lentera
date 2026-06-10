// Pustaka ilustrasi Lentera.
// Semua diagram menerima: highlight (array id bagian) dan onPart (fungsi klik untuk kuis).
// Saat onPart diberikan, bagian-bagian gambar bisa diklik.

const C = {
  ink: '#1f2a33',
  soft: '#5c6b76',
  faint: '#98a4ac',
  line: '#c8d0d6',
  paper: '#ffffff',
  panel: '#f1f4f6',
  screen: '#eaf3f6',
  flame: '#e8740c',
  flameSoft: '#fdeedd',
  danger: '#b3261e',
  dangerSoft: '#fbeae9',
}

function partProps(id, onPart) {
  if (!onPart) return {}
  return {
    onClick: () => onPart(id),
    style: { cursor: 'pointer' },
    role: 'button',
    tabIndex: 0,
    onKeyDown: (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onPart(id)
      }
    },
  }
}

/* ================= KEYBOARD ================= */

const KB_ROWS = [
  [
    ['esc', 'Esc', 1.4], ['f1', 'F1', 1.15], ['f2', 'F2', 1.15], ['f3', 'F3', 1.15],
    ['f4', 'F4', 1.15], ['f5', 'F5', 1.15], ['f6', 'F6', 1.15], ['f7', 'F7', 1.15],
    ['f8', 'F8', 1.15], ['f9', 'F9', 1.15], ['f10', 'F10', 1.15], ['f11', 'F11', 1.15],
    ['f12', 'F12', 1.15],
  ],
  [
    ['backtick', '`', 1, '~'], ['1', '1', 1, '!'], ['2', '2', 1, '@'], ['3', '3', 1, '#'],
    ['4', '4', 1, '$'], ['5', '5', 1, '%'], ['6', '6', 1, '^'], ['7', '7', 1, '&'],
    ['8', '8', 1, '*'], ['9', '9', 1, '('], ['0', '0', 1, ')'], ['minus', '-', 1, '_'],
    ['equals', '=', 1, '+'], ['backspace', 'Backspace', 2.2],
  ],
  [
    ['tab', 'Tab', 1.6], ['q', 'Q', 1], ['w', 'W', 1], ['e', 'E', 1], ['r', 'R', 1],
    ['t', 'T', 1], ['y', 'Y', 1], ['u', 'U', 1], ['i', 'I', 1], ['o', 'O', 1], ['p', 'P', 1],
    ['lbracket', '[', 1, '{'], ['rbracket', ']', 1, '}'], ['backslash', '\\', 1.6, '|'],
  ],
  [
    ['caps', 'Caps Lock', 2], ['a', 'A', 1], ['s', 'S', 1], ['d', 'D', 1], ['f', 'F', 1],
    ['g', 'G', 1], ['h', 'H', 1], ['j', 'J', 1], ['k', 'K', 1], ['l', 'L', 1],
    ['semicolon', ';', 1, ':'], ['quote', "'", 1, '"'], ['enter', 'Enter', 2.2],
  ],
  [
    ['lshift', 'Shift', 2.6], ['z', 'Z', 1], ['x', 'X', 1], ['c', 'C', 1], ['v', 'V', 1],
    ['b', 'B', 1], ['n', 'N', 1], ['m', 'M', 1], ['comma', ',', 1, '<'],
    ['period', '.', 1, '>'], ['slash', '/', 1, '?'], ['rshift', 'Shift', 2.6],
  ],
  [
    ['lctrl', 'Ctrl', 1.4], ['win', 'Win', 1.2], ['lalt', 'Alt', 1.2], ['space', 'Spasi', 7.6],
    ['ralt', 'Alt', 1.2], ['fn', 'Fn', 1.2], ['rctrl', 'Ctrl', 1.4],
  ],
]

const U = 38
const KH = 34
const KGAP = 4

export function KeyboardMap({ highlight = [], onPart = null }) {
  const boardW = 15.2 * U
  const arrowX = boardW + 14
  const totalW = arrowX + 3 * U
  const totalH = 6 * (KH + KGAP)

  function key(id, label, x, y, w, sub, small) {
    const hot = highlight.includes(id)
    const fontSize = small || label.length > 5 ? 9.5 : label.length > 1 ? 11 : 13
    return (
      <g key={id + x + y} {...partProps(id, onPart)}>
        <title>{label}</title>
        <rect
          x={x} y={y} width={w * U - KGAP} height={KH} rx={6}
          fill={hot ? C.flame : C.paper}
          stroke={hot ? C.flame : C.line}
          strokeWidth={hot ? 2 : 1.2}
        />
        {sub && (
          <text x={x + 8} y={y + 12} fontSize={8.5} fill={hot ? '#ffffff' : C.faint} fontWeight="600">
            {sub}
          </text>
        )}
        <text
          x={x + (w * U - KGAP) / 2}
          y={y + (sub ? 26 : KH / 2 + 4.5)}
          fontSize={fontSize}
          fill={hot ? '#ffffff' : C.ink}
          fontWeight="700"
          textAnchor="middle"
        >
          {label}
        </text>
      </g>
    )
  }

  const keys = []
  KB_ROWS.forEach((row, r) => {
    let x = 0
    const y = r * (KH + KGAP)
    row.forEach(([id, label, w, sub]) => {
      keys.push(key(id, label, x, y, w, sub, r === 0))
      x += w * U
    })
  })

  const yUp = 4 * (KH + KGAP)
  const yLo = 5 * (KH + KGAP)
  keys.push(key('up', '▲', arrowX + U, yUp, 1))
  keys.push(key('left', '◀', arrowX, yLo, 1))
  keys.push(key('down', '▼', arrowX + U, yLo, 1))
  keys.push(key('right', '▶', arrowX + 2 * U, yLo, 1))

  return (
    <svg viewBox={`-2 -2 ${totalW + 4} ${totalH + 2}`} className="diagram" role="img" aria-label="Gambar keyboard laptop">
      {keys}
    </svg>
  )
}

/* ================= MOUSE ================= */

export function MouseDiagram({ highlight = [], onPart = null, labels = false }) {
  const hot = (id) => highlight.includes(id)
  return (
    <svg viewBox="0 0 300 250" className="diagram diagram-sm" role="img" aria-label="Gambar mouse">
      <g {...partProps('left', onPart)}>
        <title>Tombol kiri</title>
        <path
          d="M108 16 C70 18 50 56 50 105 L108 105 Z"
          fill={hot('left') ? C.flame : C.paper} stroke={C.ink} strokeWidth="2.5" strokeLinejoin="round"
        />
      </g>
      <g {...partProps('right', onPart)}>
        <title>Tombol kanan</title>
        <path
          d="M122 16 C160 18 180 56 180 105 L122 105 Z"
          fill={hot('right') ? C.flame : C.paper} stroke={C.ink} strokeWidth="2.5" strokeLinejoin="round"
        />
      </g>
      <path
        d="M50 105 L180 105 L180 160 C180 205 152 228 115 228 C78 228 50 205 50 160 Z"
        fill={C.paper} stroke={C.ink} strokeWidth="2.5" strokeLinejoin="round"
      />
      <g {...partProps('wheel', onPart)}>
        <title>Roda scroll</title>
        <rect x="106" y="38" width="18" height="50" rx="9"
          fill={hot('wheel') ? C.flame : C.panel} stroke={C.ink} strokeWidth="2.5" />
      </g>
      {labels && (
        <g fontSize="13" fontWeight="700" fill={C.soft}>
          <line x1="78" y1="55" x2="22" y2="42" stroke={C.faint} strokeWidth="1.5" />
          <text x="2" y="34">Klik kiri</text>
          <line x1="152" y1="55" x2="226" y2="42" stroke={C.faint} strokeWidth="1.5" />
          <text x="208" y="34">Klik kanan</text>
          <line x1="124" y1="64" x2="226" y2="96" stroke={C.faint} strokeWidth="1.5" />
          <text x="196" y="116">Roda (scroll)</text>
        </g>
      )}
    </svg>
  )
}

/* ================= TOUCHPAD ================= */

export function TouchpadDiagram({ highlight = [], onPart = null }) {
  const hot = (id) => highlight.includes(id)
  return (
    <svg viewBox="0 0 300 210" className="diagram diagram-sm" role="img" aria-label="Gambar touchpad">
      <g {...partProps('pad', onPart)}>
        <title>Area touchpad</title>
        <rect x="20" y="14" width="260" height="178" rx="16"
          fill={hot('pad') ? C.flameSoft : C.panel} stroke={C.ink} strokeWidth="2.5" />
      </g>
      <line x1="20" y1="146" x2="280" y2="146" stroke={C.faint} strokeWidth="1.5" strokeDasharray="5 5" />
      <line x1="150" y1="146" x2="150" y2="192" stroke={C.faint} strokeWidth="1.5" strokeDasharray="5 5" />
      <g {...partProps('left', onPart)}>
        <title>Zona klik kiri</title>
        <rect x="22" y="148" width="126" height="42" rx="10" fill={hot('left') ? C.flame : 'transparent'} />
        <text x="85" y="174" textAnchor="middle" fontSize="12.5" fontWeight="700"
          fill={hot('left') ? '#fff' : C.soft}>klik kiri</text>
      </g>
      <g {...partProps('right', onPart)}>
        <title>Zona klik kanan</title>
        <rect x="152" y="148" width="126" height="42" rx="10" fill={hot('right') ? C.flame : 'transparent'} />
        <text x="215" y="174" textAnchor="middle" fontSize="12.5" fontWeight="700"
          fill={hot('right') ? '#fff' : C.soft}>klik kanan</text>
      </g>
      <circle cx="130" cy="72" r="9" fill={C.faint} opacity="0.55" />
      <circle cx="160" cy="72" r="9" fill={C.faint} opacity="0.55" />
      <path d="M145 96 v-44" stroke={C.faint} strokeWidth="2" markerEnd="" opacity="0.55" />
      <text x="150" y="120" textAnchor="middle" fontSize="11" fill={C.faint}>2 jari geser = scroll</text>
    </svg>
  )
}

/* ================= LAPTOP ================= */

export function LaptopDiagram({ highlight = [], onPart = null, labels = true }) {
  const hot = (id) => highlight.includes(id)
  return (
    <svg viewBox="0 0 420 300" className="diagram" role="img" aria-label="Gambar laptop dan bagian-bagiannya">
      <g {...partProps('screen', onPart)}>
        <title>Layar</title>
        <rect x="92" y="14" width="240" height="148" rx="10"
          fill={hot('screen') ? C.flameSoft : C.ink} stroke={C.ink} strokeWidth="2.5" />
        <rect x="104" y="25" width="216" height="126" rx="4" fill={C.screen} />
        <text x="212" y="94" textAnchor="middle" fontSize="15" fontWeight="800" fill={C.soft}>Lentera</text>
      </g>
      <path d="M62 168 L362 168 L392 252 L32 252 Z"
        fill="#f4f6f7" stroke={C.ink} strokeWidth="2.5" strokeLinejoin="round" />
      <g {...partProps('keyboard', onPart)}>
        <title>Keyboard</title>
        <rect x="102" y="178" width="220" height="34" rx="5"
          fill={hot('keyboard') ? C.flame : C.paper} stroke={C.ink} strokeWidth="2" />
        <g stroke={hot('keyboard') ? '#fff' : C.line} strokeWidth="1.4">
          <line x1="102" y1="189" x2="322" y2="189" />
          <line x1="102" y1="200" x2="322" y2="200" />
        </g>
      </g>
      <g {...partProps('touchpad', onPart)}>
        <title>Touchpad</title>
        <rect x="176" y="220" width="80" height="22" rx="5"
          fill={hot('touchpad') ? C.flame : C.panel} stroke={C.ink} strokeWidth="2" />
      </g>
      <g {...partProps('power', onPart)}>
        <title>Tombol power</title>
        <circle cx="338" cy="186" r="11"
          fill={hot('power') ? C.flame : C.paper} stroke={C.ink} strokeWidth="2.2" />
        <path d="M338 180 v6 M333 183 a7 7 0 1 0 10 0"
          stroke={hot('power') ? '#fff' : C.ink} strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>
      <g {...partProps('ports', onPart)}>
        <title>Colokan di sisi laptop</title>
        <rect x="36" y="196" width="14" height="9" rx="2" fill={hot('ports') ? C.flame : C.soft} />
        <rect x="33" y="212" width="14" height="9" rx="2" fill={hot('ports') ? C.flame : C.soft} />
      </g>
      <g {...partProps('charger', onPart)}>
        <title>Charger</title>
        <path d="M14 268 C40 268 50 246 56 232" stroke={C.soft} strokeWidth="3" fill="none" strokeLinecap="round" />
        <rect x="52" y="222" width="13" height="12" rx="3"
          fill={hot('charger') ? C.flame : C.soft} />
      </g>
      {labels && (
        <g fontSize="12.5" fontWeight="700" fill={C.soft}>
          <line x1="92" y1="60" x2="46" y2="50" stroke={C.faint} strokeWidth="1.5" />
          <text x="8" y="44">Layar</text>
          <line x1="338" y1="174" x2="372" y2="146" stroke={C.faint} strokeWidth="1.5" />
          <text x="416" y="136" textAnchor="end">Tombol power</text>
          <line x1="102" y1="194" x2="74" y2="124" stroke={C.faint} strokeWidth="1.5" />
          <text x="34" y="116">Keyboard</text>
          <line x1="216" y1="242" x2="216" y2="276" stroke={C.faint} strokeWidth="1.5" />
          <text x="188" y="292">Touchpad</text>
          <text x="6" y="288">Charger</text>
        </g>
      )}
    </svg>
  )
}

/* ================= WINDOW ================= */

export function WindowDiagram({ highlight = [], onPart = null, title = 'Suratku — Notepad' }) {
  const hot = (id) => highlight.includes(id)
  return (
    <svg viewBox="0 0 360 230" className="diagram diagram-sm" role="img" aria-label="Gambar jendela aplikasi">
      <rect x="8" y="8" width="344" height="214" rx="10" fill={C.paper} stroke={C.ink} strokeWidth="2.5" />
      <g {...partProps('titlebar', onPart)}>
        <title>Bilah judul</title>
        <path d="M8 18 a10 10 0 0 1 10-10 h324 a10 10 0 0 1 10 10 v26 H8 Z"
          fill={hot('titlebar') ? C.flameSoft : C.panel} />
        <text x="22" y="32" fontSize="12.5" fontWeight="700" fill={C.ink}>{title}</text>
      </g>
      <g {...partProps('min', onPart)}>
        <title>Minimize — sembunyikan sementara</title>
        <rect x="240" y="8" width="36" height="36" fill={hot('min') ? C.flame : 'transparent'} />
        <line x1="251" y1="28" x2="265" y2="28" stroke={hot('min') ? '#fff' : C.ink} strokeWidth="2.5" />
      </g>
      <g {...partProps('max', onPart)}>
        <title>Maximize — perbesar satu layar</title>
        <rect x="276" y="8" width="36" height="36" fill={hot('max') ? C.flame : 'transparent'} />
        <rect x="287" y="19" width="14" height="14" fill="none"
          stroke={hot('max') ? '#fff' : C.ink} strokeWidth="2.2" />
      </g>
      <g {...partProps('close', onPart)}>
        <title>Close — tutup jendela</title>
        <path d="M312 8 h30 a10 10 0 0 1 10 10 v26 h-40 Z" fill={hot('close') ? C.danger : C.dangerSoft} />
        <path d="M325 21 l14 14 M339 21 l-14 14"
          stroke={hot('close') ? '#fff' : C.danger} strokeWidth="2.5" strokeLinecap="round" />
      </g>
      <line x1="8" y1="44" x2="352" y2="44" stroke={C.line} strokeWidth="1.5" />
      <g {...partProps('content', onPart)} stroke={C.line} strokeWidth="6" strokeLinecap="round">
        <line x1="28" y1="74" x2="290" y2="74" />
        <line x1="28" y1="100" x2="320" y2="100" />
        <line x1="28" y1="126" x2="250" y2="126" />
        <line x1="28" y1="152" x2="300" y2="152" />
      </g>
    </svg>
  )
}

/* ================= TASKBAR / DESKTOP ================= */

export function TaskbarDiagram({ highlight = [], onPart = null, menuOpen = false }) {
  const hot = (id) => highlight.includes(id)
  return (
    <svg viewBox="0 0 400 260" className="diagram" role="img" aria-label="Gambar layar desktop dan taskbar">
      <g {...partProps('desktop', onPart)}>
        <title>Desktop — layar utama</title>
        <rect x="4" y="4" width="392" height="216" rx="8" fill="#dfeaf0" stroke={C.ink} strokeWidth="2.5" />
      </g>
      <g fontSize="9.5" fill={C.ink} textAnchor="middle">
        <rect x="22" y="20" width="30" height="24" rx="4" fill="#f6c453" stroke={C.ink} strokeWidth="1.6" />
        <text x="37" y="58">Dokumen</text>
        <path d="M82 20 h22 l6 8 v18 h-28 Z" fill={C.paper} stroke={C.ink} strokeWidth="1.6" />
        <text x="96" y="58">Surat</text>
      </g>
      {menuOpen && (
        <g>
          <rect x="10" y="84" width="160" height="130" rx="10" fill={C.paper} stroke={C.ink} strokeWidth="2" />
          <text x="26" y="110" fontSize="12" fontWeight="700" fill={C.ink}>Notepad</text>
          <text x="26" y="134" fontSize="12" fontWeight="700" fill={C.ink}>Word</text>
          <text x="26" y="158" fontSize="12" fontWeight="700" fill={C.ink}>Excel</text>
          <line x1="10" y1="172" x2="170" y2="172" stroke={C.line} strokeWidth="1.5" />
          <g {...partProps('power', onPart)}>
            <title>Tombol power di menu Start</title>
            <rect x="18" y="180" width="144" height="26" rx="7" fill={hot('power') ? C.flame : C.panel} />
            <circle cx="34" cy="193" r="7" fill="none"
              stroke={hot('power') ? '#fff' : C.ink} strokeWidth="2" />
            <line x1="34" y1="186" x2="34" y2="192" stroke={hot('power') ? '#fff' : C.ink} strokeWidth="2" />
            <text x="48" y="197" fontSize="11.5" fontWeight="700" fill={hot('power') ? '#fff' : C.ink}>Shut down</text>
          </g>
        </g>
      )}
      <rect x="4" y="220" width="392" height="36" rx="6" fill="#f7f9fa" stroke={C.ink} strokeWidth="2.5" />
      <g {...partProps('start', onPart)}>
        <title>Tombol Start</title>
        <rect x="12" y="226" width="32" height="24" rx="6" fill={hot('start') ? C.flame : 'transparent'} />
        <g fill={hot('start') ? '#fff' : '#2b6cb0'}>
          <rect x="20" y="231" width="7" height="7" rx="1" />
          <rect x="29" y="231" width="7" height="7" rx="1" />
          <rect x="20" y="240" width="7" height="7" rx="1" />
          <rect x="29" y="240" width="7" height="7" rx="1" />
        </g>
      </g>
      <g {...partProps('apps', onPart)}>
        <title>Aplikasi yang sedang terbuka</title>
        <rect x="56" y="229" width="18" height="18" rx="4" fill={hot('apps') ? C.flame : '#cfe3f0'} stroke={C.soft} />
        <rect x="80" y="229" width="18" height="18" rx="4" fill={hot('apps') ? C.flame : '#d8f0dd'} stroke={C.soft} />
      </g>
      <g {...partProps('wifi', onPart)}>
        <title>Ikon WiFi</title>
        <rect x="282" y="226" width="28" height="24" rx="6" fill={hot('wifi') ? C.flame : 'transparent'} />
        <g stroke={hot('wifi') ? '#fff' : C.ink} strokeWidth="2" fill="none" strokeLinecap="round">
          <path d="M289 240 a10 10 0 0 1 14 0" />
          <path d="M293 244 a5 5 0 0 1 6 0" />
        </g>
        <circle cx="296" cy="247.5" r="1.6" fill={hot('wifi') ? '#fff' : C.ink} />
      </g>
      <g {...partProps('volume', onPart)}>
        <title>Ikon volume</title>
        <rect x="312" y="226" width="26" height="24" rx="6" fill={hot('volume') ? C.flame : 'transparent'} />
        <path d="M319 235 h4 l5 -4 v14 l-5 -4 h-4 Z" fill={hot('volume') ? '#fff' : C.ink} />
        <path d="M331 234 a6 6 0 0 1 0 9" stroke={hot('volume') ? '#fff' : C.ink} strokeWidth="1.8" fill="none" />
      </g>
      <g {...partProps('clock', onPart)}>
        <title>Jam</title>
        <rect x="342" y="226" width="48" height="24" rx="6" fill={hot('clock') ? C.flame : 'transparent'} />
        <text x="366" y="242" textAnchor="middle" fontSize="11" fontWeight="700"
          fill={hot('clock') ? '#fff' : C.ink}>10:45</text>
      </g>
    </svg>
  )
}

/* ================= FILE EXPLORER ================= */

export function FileExplorerDiagram({ highlight = [], onPart = null }) {
  const hot = (id) => highlight.includes(id)
  return (
    <svg viewBox="0 0 400 250" className="diagram" role="img" aria-label="Gambar File Explorer">
      <rect x="6" y="6" width="388" height="238" rx="10" fill={C.paper} stroke={C.ink} strokeWidth="2.5" />
      <rect x="6" y="6" width="388" height="34" rx="10" fill={C.panel} />
      <text x="20" y="27" fontSize="12" fontWeight="700" fill={C.ink}>File Explorer</text>
      <rect x="18" y="48" width="364" height="20" rx="5" fill={C.panel} />
      <text x="26" y="62" fontSize="10.5" fill={C.soft}>This PC  ›  Documents</text>
      <g {...partProps('sidebar', onPart)}>
        <title>Daftar tempat di sisi kiri</title>
        <rect x="18" y="78" width="106" height="152" rx="6"
          fill={hot('sidebar') ? C.flameSoft : '#fafbfc'} stroke={C.line} />
      </g>
      <g fontSize="11" fontWeight="600" fill={C.ink}>
        <text x="30" y="98">This PC</text>
        <g {...partProps('documents', onPart)}>
          <title>Folder Documents</title>
          <rect x="22" y="106" width="98" height="20" rx="5" fill={hot('documents') ? C.flame : 'transparent'} />
          <text x="30" y="120" fill={hot('documents') ? '#fff' : C.ink}>Documents</text>
        </g>
        <text x="30" y="144">Downloads</text>
        <g {...partProps('recycle', onPart)}>
          <title>Recycle Bin — tempat sampah</title>
          <rect x="22" y="152" width="98" height="20" rx="5" fill={hot('recycle') ? C.flame : 'transparent'} />
          <text x="30" y="166" fill={hot('recycle') ? '#fff' : C.ink}>Recycle Bin</text>
        </g>
      </g>
      <g {...partProps('blank', onPart)}>
        <title>Area kosong</title>
        <rect x="132" y="78" width="250" height="152" fill="transparent" />
      </g>
      <g {...partProps('folder', onPart)} fontSize="10" textAnchor="middle" fill={C.ink}>
        <title>Folder</title>
        <path d="M150 92 h20 l6 7 h22 v26 h-48 Z"
          fill={hot('folder') ? C.flame : '#f6c453'} stroke={C.ink} strokeWidth="1.8" />
        <text x="174" y="140">Foto</text>
        <path d="M222 92 h20 l6 7 h22 v26 h-48 Z"
          fill={hot('folder') ? C.flame : '#f6c453'} stroke={C.ink} strokeWidth="1.8" />
        <text x="246" y="140">LATIHAN</text>
      </g>
      <g {...partProps('file', onPart)} fontSize="10" textAnchor="middle" fill={C.ink}>
        <title>File</title>
        <path d="M156 162 h26 l10 10 v26 h-36 Z" fill={hot('file') ? C.flame : '#eaf1fb'}
          stroke={C.ink} strokeWidth="1.8" />
        <text x="174" y="212">Surat.docx</text>
        <path d="M228 162 h26 l10 10 v26 h-36 Z" fill={hot('file') ? C.flame : '#e3f3e8'}
          stroke={C.ink} strokeWidth="1.8" />
        <text x="246" y="212">Data.xlsx</text>
      </g>
    </svg>
  )
}

/* ================= WIFI PANEL ================= */

export function WifiPanel({ highlight = [], onPart = null }) {
  const hot = (id) => highlight.includes(id)
  function bars(x, y, n, on) {
    const col = on ? C.ink : C.faint
    return (
      <g stroke={col} strokeWidth="2" fill="none" strokeLinecap="round">
        {n >= 3 && <path d={`M${x} ${y} a12 12 0 0 1 17 0`} />}
        {n >= 2 && <path d={`M${x + 4} ${y + 5} a6.5 6.5 0 0 1 9 0`} />}
        <circle cx={x + 8.5} cy={y + 9.5} r="1.7" fill={col} stroke="none" />
      </g>
    )
  }
  return (
    <svg viewBox="0 0 280 230" className="diagram diagram-sm" role="img" aria-label="Gambar panel WiFi">
      <rect x="8" y="8" width="264" height="214" rx="12" fill={C.paper} stroke={C.ink} strokeWidth="2.5" />
      <text x="24" y="34" fontSize="13" fontWeight="800" fill={C.ink}>Jaringan WiFi</text>
      <g {...partProps('network', onPart)}>
        <title>WiFi Rumah</title>
        <rect x="18" y="46" width="244" height="58" rx="9"
          fill={hot('network') ? C.flameSoft : C.panel} stroke={hot('network') ? C.flame : C.line} strokeWidth="1.8" />
        {bars(30, 62, 3, true)}
        <text x="58" y="70" fontSize="12.5" fontWeight="700" fill={C.ink}>WiFi Rumah</text>
        <rect x="58" y="78" width="120" height="18" rx="5" fill="#fff" stroke={C.line} />
        <text x="66" y="91" fontSize="11" fill={C.soft}>••••••••</text>
        <text x="186" y="91" fontSize="9.5" fill={C.faint}>password</text>
      </g>
      <g {...partProps('connect', onPart)}>
        <title>Tombol Connect</title>
        <rect x="166" y="110" width="96" height="26" rx="8" fill={hot('connect') ? C.flame : C.flame} opacity={hot('connect') ? 1 : 0.92} />
        <text x="214" y="127" textAnchor="middle" fontSize="12" fontWeight="800" fill="#fff">Connect</text>
      </g>
      <g opacity="0.8">
        {bars(30, 158, 2, false)}
        <text x="58" y="166" fontSize="12" fontWeight="600" fill={C.soft}>Tetangga123</text>
        {bars(30, 192, 2, false)}
        <text x="58" y="200" fontSize="12" fontWeight="600" fill={C.soft}>MEG-Guest</text>
      </g>
    </svg>
  )
}

/* ================= PEMETAAN UMUM ================= */

const MAP = {
  keyboard: KeyboardMap,
  word: WordDiagram,
  excel: ExcelDiagram,
  ppt: PowerPointDiagram,
  savedialog: SaveDialog,
  printdialog: PrintDialog,
  mouse: MouseDiagram,
  touchpad: TouchpadDiagram,
  laptop: LaptopDiagram,
  window: WindowDiagram,
  taskbar: TaskbarDiagram,
  explorer: FileExplorerDiagram,
  wifi: WifiPanel,
}

export function Diagram({ kind, props = {}, onPart = null }) {
  const Comp = MAP[kind]
  if (!Comp) return null
  return <Comp {...props} onPart={onPart} />
}

/* ================= WORD (jendela utama) ================= */

export function WordDiagram({ highlight = [], onPart = null }) {
  const hot = (id) => highlight.includes(id)
  const btn = (id, x, y, w, title, children) => (
    <g key={id} {...partProps(id, onPart)}>
      <title>{title}</title>
      <rect x={x} y={y} width={w} height={24} rx={5}
        fill={hot(id) ? C.flame : C.paper} stroke={hot(id) ? C.flame : C.line} strokeWidth="1.4" />
      <g fill={hot(id) ? '#fff' : C.ink} stroke={hot(id) ? '#fff' : C.ink}>{children}</g>
    </g>
  )
  const alignLines = (x, widths, yBase) =>
    widths.map((w, i) => (
      <line key={i} x1={x[i] ?? x[0]} y1={yBase + 6 + i * 4.5} x2={(x[i] ?? x[0]) + w} y2={yBase + 6 + i * 4.5}
        strokeWidth="1.8" strokeLinecap="round" />
    ))
  return (
    <svg viewBox="0 0 460 330" className="diagram" role="img" aria-label="Gambar jendela Microsoft Word">
      <rect x="4" y="4" width="452" height="322" rx="10" fill={C.paper} stroke={C.ink} strokeWidth="2.5" />
      {/* Bilah judul + Quick Access */}
      <rect x="4" y="4" width="452" height="30" rx="10" fill="#1f5cb0" />
      <rect x="4" y="22" width="452" height="12" fill="#1f5cb0" />
      <g {...partProps('save', onPart)}>
        <title>Tombol Simpan (disket)</title>
        <rect x="14" y="9" width="22" height="20" rx="4" fill={hot('save') ? C.flame : 'transparent'} />
        <path d="M18 12 h11 l3 3 v9 h-14 Z" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinejoin="round" />
        <rect x="21" y="18" width="8" height="6" fill="#fff" />
      </g>
      <text x="230" y="23" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#fff">Surat Izin - Word</text>
      <g stroke="#fff" strokeWidth="1.8">
        <line x1="398" y1="19" x2="408" y2="19" />
        <rect x="416" y="13" width="11" height="11" fill="none" />
        <path d="M436 13 l10 10 M446 13 l-10 10" />
      </g>
      {/* Tab ribbon */}
      <g fontSize="10.5" fontWeight="700">
        <rect x="10" y="38" width="36" height="20" rx="4" fill="#1f5cb0" />
        <text x="28" y="52" textAnchor="middle" fill="#fff">File</text>
        <text x="66" y="52" textAnchor="middle" fill={C.ink}>Home</text>
        <rect x="50" y="56" width="32" height="2.5" fill={C.flame} />
        <text x="110" y="52" textAnchor="middle" fill={C.soft}>Insert</text>
        <text x="156" y="52" textAnchor="middle" fill={C.soft}>Layout</text>
      </g>
      {/* Badan ribbon */}
      <rect x="4" y="60" width="452" height="64" fill="#f6f8f9" stroke={C.line} strokeWidth="1" />
      {/* Grup Font */}
      <rect x="12" y="66" width="92" height="18" rx="4" fill={C.paper} stroke={C.line} />
      <text x="18" y="79" fontSize="10" fill={C.ink}>Calibri</text>
      <g {...partProps('fontsize', onPart)}>
        <title>Ukuran huruf</title>
        <rect x="108" y="66" width="30" height="18" rx="4"
          fill={hot('fontsize') ? C.flame : C.paper} stroke={hot('fontsize') ? C.flame : C.line} />
        <text x="123" y="79" textAnchor="middle" fontSize="10" fontWeight="700"
          fill={hot('fontsize') ? '#fff' : C.ink}>12</text>
      </g>
      {btn('bold', 12, 90, 26, 'Bold - menebalkan',
        <text x="25" y="107" textAnchor="middle" fontSize="13" fontWeight="900" stroke="none">B</text>)}
      {btn('italic', 42, 90, 26, 'Italic - memiringkan',
        <text x="55" y="107" textAnchor="middle" fontSize="13" fontStyle="italic" fontWeight="700" stroke="none">I</text>)}
      {btn('underline', 72, 90, 26, 'Underline - menggarisbawahi',
        <g stroke="none"><text x="85" y="105" textAnchor="middle" fontSize="12.5" fontWeight="700">U</text>
        <rect x="79" y="108" width="12" height="1.8" /></g>)}
      <text x="75" y="121" textAnchor="middle" fontSize="8" fill={C.faint}>Font</text>
      <line x1="148" y1="64" x2="148" y2="118" stroke={C.line} />
      {/* Grup Paragraph */}
      {btn('bullets', 158, 66, 28, 'Daftar titik (bullets)',
        <g strokeWidth="1.6" strokeLinecap="round">
          <circle cx="165" cy="73" r="1.6" stroke="none" /><line x1="170" y1="73" x2="180" y2="73" />
          <circle cx="165" cy="78" r="1.6" stroke="none" /><line x1="170" y1="78" x2="180" y2="78" />
          <circle cx="165" cy="83" r="1.6" stroke="none" /><line x1="170" y1="83" x2="180" y2="83" />
        </g>)}
      {btn('numbering', 190, 66, 28, 'Daftar bernomor (numbering)',
        <g strokeWidth="1.6" strokeLinecap="round" fontSize="6.5" fontWeight="700">
          <text x="195" y="75" stroke="none">1</text><line x1="202" y1="73" x2="212" y2="73" />
          <text x="195" y="80" stroke="none">2</text><line x1="202" y1="78" x2="212" y2="78" />
          <text x="195" y="85" stroke="none">3</text><line x1="202" y1="83" x2="212" y2="83" />
        </g>)}
      {btn('alignleft', 158, 90, 26, 'Rata kiri',
        <g strokeLinecap="round">{alignLines([163], [16, 11, 16, 9], 90)}</g>)}
      {btn('aligncenter', 188, 90, 26, 'Rata tengah',
        <g strokeLinecap="round">{alignLines([193, 195.5, 193, 196.5], [16, 11, 16, 9], 90)}</g>)}
      {btn('alignright', 218, 90, 26, 'Rata kanan',
        <g strokeLinecap="round">{alignLines([223, 228, 223, 230], [16, 11, 16, 9], 90)}</g>)}
      {btn('justify', 248, 90, 26, 'Rata kiri-kanan (justify)',
        <g strokeLinecap="round">{alignLines([253], [16, 16, 16, 16], 90)}</g>)}
      <text x="208" y="121" textAnchor="middle" fontSize="8" fill={C.faint}>Paragraph</text>
      <line x1="284" y1="64" x2="284" y2="118" stroke={C.line} />
      <text x="296" y="78" fontSize="8.5" fill={C.faint}>Styles ...</text>
      {/* Halaman */}
      <rect x="4" y="124" width="452" height="180" fill="#e6ebee" />
      <g {...partProps('page', onPart)}>
        <title>Halaman tempat mengetik</title>
        <rect x="92" y="136" width="276" height="158" fill={hot('page') ? C.flameSoft : '#fff'}
          stroke={C.line} strokeWidth="1.2" />
        <text x="230" y="160" textAnchor="middle" fontSize="11" fontWeight="800" fill={C.ink}>SURAT IZIN</text>
        <g stroke={C.line} strokeWidth="5" strokeLinecap="round">
          <line x1="112" y1="180" x2="330" y2="180" />
          <line x1="112" y1="196" x2="348" y2="196" />
          <line x1="112" y1="212" x2="300" y2="212" />
        </g>
        <rect x="303" y="205" width="2.4" height="14" fill={C.ink} />
      </g>
      {/* Status bar */}
      <rect x="4" y="304" width="452" height="22" fill="#f6f8f9" stroke={C.line} strokeWidth="1" />
      <text x="14" y="319" fontSize="9" fill={C.soft}>Page 1 of 1    28 words</text>
      <text x="446" y="319" textAnchor="end" fontSize="9" fill={C.soft}>100%</text>
    </svg>
  )
}

/* ================= DIALOG SIMPAN (Save As) ================= */

export function SaveDialog({ highlight = [], onPart = null }) {
  const hot = (id) => highlight.includes(id)
  return (
    <svg viewBox="0 0 400 240" className="diagram diagram-sm" role="img" aria-label="Gambar jendela Save As">
      <rect x="6" y="6" width="388" height="228" rx="10" fill={C.paper} stroke={C.ink} strokeWidth="2.5" />
      <rect x="6" y="6" width="388" height="32" rx="10" fill={C.panel} />
      <text x="20" y="27" fontSize="12.5" fontWeight="800" fill={C.ink}>Save As</text>
      <g {...partProps('location', onPart)}>
        <title>Lokasi penyimpanan</title>
        <rect x="20" y="48" width="360" height="24" rx="6"
          fill={hot('location') ? C.flameSoft : '#fff'} stroke={hot('location') ? C.flame : C.line} strokeWidth="1.5" />
        <path d="M30 54 h9 l3 3.5 h10 v9 h-22 Z" fill="#f6c453" stroke={C.ink} strokeWidth="1.2" />
        <text x="58" y="64" fontSize="10.5" fill={C.ink}>This PC  &gt;  Documents  &gt;  LATIHAN</text>
      </g>
      <text x="20" y="98" fontSize="10.5" fontWeight="700" fill={C.soft}>File name:</text>
      <g {...partProps('filename', onPart)}>
        <title>Kotak nama file</title>
        <rect x="92" y="84" width="288" height="24" rx="6"
          fill={hot('filename') ? C.flameSoft : '#fff'} stroke={hot('filename') ? C.flame : C.line} strokeWidth="1.5" />
        <text x="100" y="100" fontSize="11" fontWeight="700" fill={C.ink}>Surat Izin Tidak Masuk</text>
        <rect x="232" y="89" width="2" height="14" fill={C.ink} />
      </g>
      <text x="20" y="132" fontSize="10.5" fontWeight="700" fill={C.soft}>Save as type:</text>
      <rect x="108" y="118" width="272" height="24" rx="6" fill="#fff" stroke={C.line} strokeWidth="1.5" />
      <text x="116" y="134" fontSize="10.5" fill={C.ink}>Word Document (*.docx)</text>
      <g {...partProps('savebtn', onPart)}>
        <title>Tombol Save</title>
        <rect x="216" y="186" width="78" height="30" rx="8" fill={C.flame}
          stroke={hot('savebtn') ? C.ink : C.flame} strokeWidth={hot('savebtn') ? 2.5 : 1} />
        <text x="255" y="206" textAnchor="middle" fontSize="12.5" fontWeight="800" fill="#fff">Save</text>
      </g>
      <rect x="302" y="186" width="78" height="30" rx="8" fill="#fff" stroke={C.line} strokeWidth="1.5" />
      <text x="341" y="206" textAnchor="middle" fontSize="12" fontWeight="700" fill={C.soft}>Cancel</text>
    </svg>
  )
}

/* ================= DIALOG CETAK (Print) ================= */

export function PrintDialog({ highlight = [], onPart = null }) {
  const hot = (id) => highlight.includes(id)
  return (
    <svg viewBox="0 0 440 270" className="diagram" role="img" aria-label="Gambar layar Print">
      <rect x="4" y="4" width="432" height="262" rx="10" fill={C.paper} stroke={C.ink} strokeWidth="2.5" />
      <text x="22" y="34" fontSize="16" fontWeight="800" fill={C.ink}>Print</text>
      <g {...partProps('printbtn', onPart)}>
        <title>Tombol Print</title>
        <rect x="22" y="48" width="120" height="36" rx="9" fill={C.flame}
          stroke={hot('printbtn') ? C.ink : C.flame} strokeWidth={hot('printbtn') ? 2.5 : 1} />
        <g stroke="#fff" strokeWidth="1.8" fill="none">
          <rect x="34" y="60" width="16" height="9" rx="1.5" />
          <path d="M37 60 v-4 h10 v4 M37 66 h10" />
        </g>
        <text x="96" y="71" textAnchor="middle" fontSize="13" fontWeight="800" fill="#fff">Print</text>
      </g>
      <text x="158" y="64" fontSize="10.5" fontWeight="700" fill={C.soft}>Copies:</text>
      <g {...partProps('copies', onPart)}>
        <title>Jumlah salinan</title>
        <rect x="206" y="50" width="44" height="24" rx="6"
          fill={hot('copies') ? C.flameSoft : '#fff'} stroke={hot('copies') ? C.flame : C.line} strokeWidth="1.5" />
        <text x="228" y="66" textAnchor="middle" fontSize="11.5" fontWeight="800" fill={C.ink}>1</text>
      </g>
      <text x="22" y="112" fontSize="10" fontWeight="800" fill={C.faint}>PRINTER</text>
      <g {...partProps('printer', onPart)}>
        <title>Pilihan printer</title>
        <rect x="22" y="120" width="228" height="28" rx="7"
          fill={hot('printer') ? C.flameSoft : '#fff'} stroke={hot('printer') ? C.flame : C.line} strokeWidth="1.5" />
        <circle cx="38" cy="134" r="4.5" fill={C.sea} />
        <text x="50" y="138" fontSize="10.5" fontWeight="700" fill={C.ink}>EPSON L3110 - Ready</text>
      </g>
      <text x="22" y="176" fontSize="10" fontWeight="800" fill={C.faint}>SETTINGS</text>
      <g {...partProps('range', onPart)}>
        <title>Halaman yang dicetak</title>
        <rect x="22" y="184" width="228" height="28" rx="7"
          fill={hot('range') ? C.flameSoft : '#fff'} stroke={hot('range') ? C.flame : C.line} strokeWidth="1.5" />
        <text x="34" y="202" fontSize="10.5" fontWeight="700" fill={C.ink}>Print All Pages</text>
        <path d="M236 192 l5 6 l5 -6" stroke={C.soft} strokeWidth="1.8" fill="none" />
      </g>
      {/* Pratinjau */}
      <rect x="270" y="48" width="148" height="200" fill="#e6ebee" rx="6" />
      <rect x="292" y="62" width="104" height="146" fill="#fff" stroke={C.line} strokeWidth="1.2" />
      <text x="344" y="82" textAnchor="middle" fontSize="7.5" fontWeight="800" fill={C.ink}>SURAT IZIN</text>
      <g stroke={C.line} strokeWidth="3.5" strokeLinecap="round">
        <line x1="302" y1="96" x2="384" y2="96" />
        <line x1="302" y1="106" x2="378" y2="106" />
        <line x1="302" y1="116" x2="386" y2="116" />
        <line x1="302" y1="126" x2="360" y2="126" />
      </g>
      <text x="344" y="230" textAnchor="middle" fontSize="9" fill={C.soft}>1 of 1</text>
    </svg>
  )
}

/* ================= EXCEL (jendela utama) ================= */

export function ExcelDiagram({ highlight = [], onPart = null }) {
  const hot = (id) => highlight.includes(id)
  const cols = ['A', 'B', 'C', 'D', 'E', 'F']
  const cw = 64, rh = 22, gx = 36, gy = 118
  return (
    <svg viewBox="0 0 460 330" className="diagram" role="img" aria-label="Gambar jendela Microsoft Excel">
      <rect x="4" y="4" width="452" height="322" rx="10" fill={C.paper} stroke={C.ink} strokeWidth="2.5" />
      <rect x="4" y="4" width="452" height="30" rx="10" fill="#1e7145" />
      <rect x="4" y="22" width="452" height="12" fill="#1e7145" />
      <text x="230" y="23" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#fff">Belanja Dapur - Excel</text>
      <g stroke="#fff" strokeWidth="1.8">
        <line x1="398" y1="19" x2="408" y2="19" />
        <rect x="416" y="13" width="11" height="11" fill="none" />
        <path d="M436 13 l10 10 M446 13 l-10 10" />
      </g>
      {/* Ribbon mini + AutoSum */}
      <rect x="4" y="34" width="452" height="34" fill="#f6f8f9" stroke={C.line} strokeWidth="1" />
      <text x="16" y="55" fontSize="10.5" fontWeight="700" fill={C.ink}>Home</text>
      <text x="62" y="55" fontSize="10.5" fill={C.soft}>Insert</text>
      <text x="106" y="55" fontSize="10.5" fill={C.soft}>Formulas</text>
      <g {...partProps('autosum', onPart)}>
        <title>Tombol AutoSum (jumlah otomatis)</title>
        <rect x="356" y="40" width="92" height="22" rx="5"
          fill={hot('autosum') ? C.flame : C.paper} stroke={hot('autosum') ? C.flame : C.line} strokeWidth="1.4" />
        <text x="402" y="55" textAnchor="middle" fontSize="11" fontWeight="800"
          fill={hot('autosum') ? '#fff' : C.ink}>{'\u03a3'} AutoSum</text>
      </g>
      {/* Name box + formula bar */}
      <g {...partProps('namebox', onPart)}>
        <title>Name Box (alamat sel aktif)</title>
        <rect x="10" y="74" width="58" height="22" rx="4"
          fill={hot('namebox') ? C.flameSoft : '#fff'} stroke={hot('namebox') ? C.flame : C.line} strokeWidth="1.4" />
        <text x="39" y="89" textAnchor="middle" fontSize="10.5" fontWeight="800" fill={C.ink}>D2</text>
      </g>
      <g {...partProps('formulabar', onPart)}>
        <title>Formula Bar (isi/rumus sel)</title>
        <rect x="74" y="74" width="376" height="22" rx="4"
          fill={hot('formulabar') ? C.flameSoft : '#fff'} stroke={hot('formulabar') ? C.flame : C.line} strokeWidth="1.4" />
        <text x="82" y="89" fontSize="10.5" fontWeight="700" fill={C.ink}>=B2*C2</text>
      </g>
      {/* Grid */}
      <rect x="10" y={gy - rh} width={26} height={rh * 7 + rh} fill="#eef1f3" stroke={C.line} strokeWidth="1" />
      {cols.map((c, i) => (
        <g key={c}>
          <rect x={gx + i * cw} y={gy - rh} width={cw} height={rh} fill="#eef1f3" stroke={C.line} strokeWidth="1" />
          <text x={gx + i * cw + cw / 2} y={gy - 7} textAnchor="middle" fontSize="10" fontWeight="700" fill={C.soft}>{c}</text>
        </g>
      ))}
      {[1, 2, 3, 4, 5, 6, 7].map((r) => (
        <g key={r}>
          <text x="23" y={gy + (r - 1) * rh + 15} textAnchor="middle" fontSize="10" fontWeight="700" fill={C.soft}>{r}</text>
          {cols.map((c, i) => (
            <rect key={c} x={gx + i * cw} y={gy + (r - 1) * rh} width={cw} height={rh} fill="#fff" stroke={C.line} strokeWidth="0.8" />
          ))}
        </g>
      ))}
      <g fontSize="9.5" fill={C.ink}>
        <text x={gx + 6} y={gy + 15} fontWeight="800">Barang</text>
        <text x={gx + cw + 6} y={gy + 15} fontWeight="800">Harga</text>
        <text x={gx + 2 * cw + 6} y={gy + 15} fontWeight="800">Jumlah</text>
        <text x={gx + 3 * cw + 6} y={gy + 15} fontWeight="800">Total</text>
        <text x={gx + 6} y={gy + rh + 15}>Beras</text>
        <text x={gx + cw + 6} y={gy + rh + 15}>15000</text>
        <text x={gx + 2 * cw + 6} y={gy + rh + 15}>2</text>
        <text x={gx + 6} y={gy + 2 * rh + 15}>Minyak</text>
        <text x={gx + cw + 6} y={gy + 2 * rh + 15}>18000</text>
        <text x={gx + 2 * cw + 6} y={gy + 2 * rh + 15}>1</text>
      </g>
      <g {...partProps('cell', onPart)}>
        <title>Sel aktif D2</title>
        <rect x={gx + 3 * cw} y={gy + rh} width={cw} height={rh}
          fill={hot('cell') ? C.flameSoft : '#fff'} stroke={hot('cell') ? C.flame : '#1e7145'} strokeWidth="2.2" />
        <text x={gx + 3 * cw + 6} y={gy + rh + 15} fontSize="9.5" fontWeight="700" fill={C.ink}>=B2*C2</text>
      </g>
      {/* Sheet tabs */}
      <rect x="4" y="296" width="452" height="30" fill="#f6f8f9" stroke={C.line} strokeWidth="1" />
      <g {...partProps('sheettab', onPart)}>
        <title>Tab lembar kerja (Sheet)</title>
        <rect x="14" y="301" width="64" height="20" rx="4"
          fill={hot('sheettab') ? C.flame : '#fff'} stroke={hot('sheettab') ? C.flame : C.line} strokeWidth="1.4" />
        <text x="46" y="315" textAnchor="middle" fontSize="9.5" fontWeight="700" fill={hot('sheettab') ? '#fff' : C.ink}>Sheet1</text>
      </g>
      <rect x="84" y="301" width="24" height="20" rx="4" fill="#fff" stroke={C.line} strokeWidth="1.2" />
      <text x="96" y="316" textAnchor="middle" fontSize="12" fontWeight="700" fill={C.soft}>+</text>
    </svg>
  )
}

/* ================= POWERPOINT (jendela utama) ================= */

export function PowerPointDiagram({ highlight = [], onPart = null }) {
  const hot = (id) => highlight.includes(id)
  return (
    <svg viewBox="0 0 460 330" className="diagram" role="img" aria-label="Gambar jendela Microsoft PowerPoint">
      <rect x="4" y="4" width="452" height="322" rx="10" fill={C.paper} stroke={C.ink} strokeWidth="2.5" />
      <rect x="4" y="4" width="452" height="30" rx="10" fill="#b7472a" />
      <rect x="4" y="22" width="452" height="12" fill="#b7472a" />
      <text x="230" y="23" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#fff">Perkenalan Diri - PowerPoint</text>
      <g stroke="#fff" strokeWidth="1.8">
        <line x1="398" y1="19" x2="408" y2="19" />
        <rect x="416" y="13" width="11" height="11" fill="none" />
        <path d="M436 13 l10 10 M446 13 l-10 10" />
      </g>
      <rect x="4" y="34" width="452" height="34" fill="#f6f8f9" stroke={C.line} strokeWidth="1" />
      <text x="16" y="55" fontSize="10.5" fontWeight="700" fill={C.ink}>Home</text>
      <g {...partProps('newslide', onPart)}>
        <title>Tombol New Slide (slide baru)</title>
        <rect x="58" y="40" width="86" height="22" rx="5"
          fill={hot('newslide') ? C.flame : C.paper} stroke={hot('newslide') ? C.flame : C.line} strokeWidth="1.4" />
        <text x="101" y="55" textAnchor="middle" fontSize="10" fontWeight="800" fill={hot('newslide') ? '#fff' : C.ink}>+ New Slide</text>
      </g>
      <g {...partProps('present', onPart)}>
        <title>Tombol Slide Show (mulai presentasi)</title>
        <rect x="346" y="40" width="102" height="22" rx="5"
          fill={hot('present') ? C.flame : C.paper} stroke={hot('present') ? C.flame : C.line} strokeWidth="1.4" />
        <g fill={hot('present') ? '#fff' : C.ink}>
          <path d="M356 45 l8 6 l-8 6 Z" />
          <text x="404" y="55" textAnchor="middle" fontSize="10" fontWeight="800">Slide Show</text>
        </g>
      </g>
      {/* Panel thumbnail kiri */}
      <g {...partProps('thumbs', onPart)}>
        <title>Panel daftar slide (kiri)</title>
        <rect x="4" y="68" width="96" height="258" fill={hot('thumbs') ? C.flameSoft : '#eef1f3'} stroke={C.line} strokeWidth="1" />
        {[1, 2, 3].map((n) => (
          <g key={n}>
            <text x="14" y={86 + (n - 1) * 62} fontSize="9" fontWeight="700" fill={C.soft}>{n}</text>
            <rect x="22" y={74 + (n - 1) * 62} width="70" height="44" rx="3"
              fill="#fff" stroke={n === 1 ? '#b7472a' : C.line} strokeWidth={n === 1 ? 2 : 1} />
            <line x1="30" y1={88 + (n - 1) * 62} x2="84" y2={88 + (n - 1) * 62} stroke={C.line} strokeWidth="3" strokeLinecap="round" />
            <line x1="30" y1={98 + (n - 1) * 62} x2="74" y2={98 + (n - 1) * 62} stroke={C.line} strokeWidth="2" strokeLinecap="round" />
          </g>
        ))}
      </g>
      {/* Slide besar */}
      <g {...partProps('slidearea', onPart)}>
        <title>Slide yang sedang disunting</title>
        <rect x="116" y="84" width="324" height="196" rx="4"
          fill={hot('slidearea') ? C.flameSoft : '#fff'} stroke={C.ink} strokeWidth="1.6" />
      </g>
      <g {...partProps('titlebox', onPart)}>
        <title>Kotak judul slide</title>
        <rect x="140" y="104" width="276" height="38" rx="3"
          fill={hot('titlebox') ? C.flameSoft : '#fff'}
          stroke={hot('titlebox') ? C.flame : C.faint} strokeWidth={hot('titlebox') ? 1.8 : 1.2} strokeDasharray="5 4" />
        <text x="278" y="128" textAnchor="middle" fontSize="13" fontWeight="800" fill={C.ink}>PERKENALAN DIRI</text>
      </g>
      <g {...partProps('bodybox', onPart)}>
        <title>Kotak isi slide (butir-butir)</title>
        <rect x="140" y="156" width="276" height="104" rx="3"
          fill={hot('bodybox') ? C.flameSoft : '#fff'}
          stroke={hot('bodybox') ? C.flame : C.faint} strokeWidth={hot('bodybox') ? 1.8 : 1.2} strokeDasharray="5 4" />
        <g stroke={C.line} strokeWidth="4" strokeLinecap="round">
          <line x1="156" y1="176" x2="380" y2="176" />
          <line x1="156" y1="194" x2="350" y2="194" />
          <line x1="156" y1="212" x2="368" y2="212" />
        </g>
      </g>
      <text x="278" y="300" textAnchor="middle" fontSize="9" fill={C.soft}>Slide 1 of 3</text>
    </svg>
  )
}
