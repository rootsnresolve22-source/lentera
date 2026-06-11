# Pembangun PDF "Lentera — Buku Saku Modul 0"
# Sumber: /tmp/lentera-pdf/content.json (diekspor dari src/content/modul0.js)
# Gambar: /tmp/lentera-pdf/png/*.png (render react-dom/server -> cairosvg)

import json, os
from PIL import Image as PILImage
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor, white
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, Image,
    Table, TableStyle, ListFlowable, ListItem, PageBreak, KeepTogether,
)
from reportlab.platypus.tableofcontents import TableOfContents

MOD = os.environ.get('MOD', 'm0')
N = MOD[1:]
SUB = {'0': 'Dasar Komputer', '1': 'Word Dasar', '2': 'Excel Dasar', '3': 'PowerPoint Dasar', '4': 'Pelengkap Kerja'}[N]
TAG = {'0': 'Dari menyalakan laptop sampai mengetik 10 jari - ditulis sederhana untuk kamu yang baru mulai.',
       '1': 'Dari kertas kosong sampai surat resmi yang rapi - Word untuk pekerjaan sehari-hari.',
       '2': 'Dari kotak-kotak sel sampai rumus yang menghitung sendiri - Excel tanpa takut angka.',
       '3': 'Dari slide pertama sampai tampil percaya diri - PowerPoint untuk presentasi kerja.',
       '4': 'Email, PDF, cetak-pindai, dan internet sehat - bekal terakhir sebelum terjun bekerja.'}[N]
NEXT = {'0': 'Lulus ujian ini berarti kamu resmi siap lanjut ke Modul Word.',
        '1': 'Lulus berarti gerbang Modul Excel terbuka.',
        '2': 'Lulus berarti gerbang Modul PowerPoint terbuka.',
        '3': 'Lulus berarti gerbang Modul Pelengkap terbuka.',
        '4': 'Lulus berarti seluruh kurikulum Lentera tuntas - saatnya sertifikat.'}[N]
BASE = f'/tmp/lentera-pdf-{MOD}'
OUT = f'{BASE}/Lentera-Modul-{N}.pdf'
M = json.load(open(f'{BASE}/content.json'))
MAN = json.load(open(f'{BASE}/manifest.json'))

# ---------- Palet Lentera ----------
INK = HexColor('#1f2a33')
SOFT = HexColor('#5c6b76')
FAINT = HexColor('#98a4ac')
LINE = HexColor('#c8d0d6')
PAPER = HexColor('#fdfbf7')
FLAME = HexColor('#e8740c')
FLAME_DEEP = HexColor('#b85608')
FLAME_SOFT = HexColor('#fdeedd')
SEA = HexColor('#0f766e')
SEA_SOFT = HexColor('#e6f2f0')
DANGER = HexColor('#b3261e')
DANGER_SOFT = HexColor('#fbeae9')

PAGE_W, PAGE_H = A4
MARGIN = 18 * mm
CONTENT_W = PAGE_W - 2 * MARGIN

# ---------- Sanitasi teks (font standar = WinAnsi/cp1252) ----------
SUBST = {
    'lambang Σ': 'lambang sigma', 'Σ ': '', 'Σ': 'sigma',
    '\u25c0': 'Panah Kiri', '\u25b6': 'Panah Kanan',
    '\u25b2': 'Panah Atas', '\u25bc': 'Panah Bawah',
    '\u203a': '>', '\u25a2': '[ ]', '\u2192': '->', '\u00d7': 'x',
}
def tx(s):
    s = str(s)
    for a, b in SUBST.items():
        s = s.replace(a, b)
    out = []
    for ch in s:
        try:
            ch.encode('cp1252')
            out.append(ch)
        except UnicodeEncodeError:
            out.append('?')
            print('  [peringatan glyph]', repr(ch), 'di:', s[:50])
    return ''.join(out)

# ---------- Gaya ----------
F, FB, FI = 'Helvetica', 'Helvetica-Bold', 'Helvetica-Oblique'
def st(name, **kw):
    base = dict(fontName=F, fontSize=10.5, leading=15.5, textColor=INK, spaceAfter=6)
    base.update(kw)
    return ParagraphStyle(name, **base)

S = {
    'body': st('body'),
    'h1': st('h1', fontName=FB, fontSize=21, leading=25, textColor=FLAME_DEEP, spaceBefore=4, spaceAfter=4),
    'h2': st('h2', fontName=FB, fontSize=13.5, leading=17, textColor=INK, spaceBefore=12, spaceAfter=5),
    'eyebrow': st('eyebrow', fontName=FB, fontSize=9, leading=11, textColor=FLAME_DEEP, spaceAfter=2),
    'desc': st('desc', fontName=FI, fontSize=10.5, textColor=SOFT, spaceAfter=10),
    'caption': st('caption', fontSize=8.8, leading=11.5, textColor=SOFT, alignment=TA_CENTER, spaceBefore=3, spaceAfter=4),
    'boxlabel': st('boxlabel', fontName=FB, fontSize=8.5, leading=10, spaceAfter=2),
    'boxtext': st('boxtext', fontSize=10, leading=14.5, spaceAfter=0),
    'li': st('li', spaceAfter=4),
    'glo_t': st('glo_t', fontName=FB, fontSize=9.8, leading=13, spaceAfter=0),
    'glo_d': st('glo_d', fontSize=9.8, leading=13, textColor=SOFT, spaceAfter=0),
    'kbd': st('kbd', fontName=FB, fontSize=10, leading=14, spaceAfter=0),
    'soal': st('soal', fontName=FB, fontSize=10.5, leading=15, spaceBefore=7, spaceAfter=3),
    'opsi': st('opsi', fontSize=10, leading=14, leftIndent=14, spaceAfter=1.5),
    'kunci': st('kunci', fontSize=9.6, leading=13.5, spaceAfter=3),
    'toc1': st('toc1', fontSize=11, leading=18, fontName=FB),
    'toc2': st('toc2', fontSize=10, leading=15, leftIndent=12, textColor=SOFT),
}

def img_for(kind, props):
    key = kind + '|' + json.dumps(props or {}, separators=(',', ':'))
    # manifest dibuat dari JSON.stringify default (tanpa spasi) — samakan
    if key not in MAN:
        # coba varian urutan kunci apa adanya dari content
        for k in MAN:
            if k.split('|')[0] == kind and json.loads(k.split('|', 1)[1]) == (props or {}):
                key = k
                break
    f = MAN[key]
    return f'{BASE}/png/{f[:-4]}.png'

def flow_img(path, max_w=CONTENT_W * 0.92, max_h=95 * mm):
    w, h = PILImage.open(path).size
    scale = min(max_w / w, max_h / h)
    return Image(path, width=w * scale, height=h * scale)

def box(label, text, bg, border, label_color):
    lbl = Paragraph(tx(label.upper()), ParagraphStyle('bl', parent=S['boxlabel'], textColor=label_color))
    body = Paragraph(tx(text), S['boxtext'])
    t = Table([[lbl], [body]], colWidths=[CONTENT_W - 8 * mm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), bg),
        ('BOX', (0, 0), (-1, -1), 1, border),
        ('LEFTPADDING', (0, 0), (-1, -1), 10), ('RIGHTPADDING', (0, 0), (-1, -1), 10),
        ('TOPPADDING', (0, 0), (-1, 0), 7), ('BOTTOMPADDING', (0, -1), (-1, -1), 8),
        ('TOPPADDING', (0, 1), (-1, 1), 0),
        ('ROUNDEDCORNERS', [6, 6, 6, 6]),
    ]))
    return [Spacer(1, 4), t, Spacer(1, 6)]

BOX_KIND = {
    'tip': ('Tips', SEA_SOFT, HexColor('#c4e2de'), SEA),
    'warn': ('Hati-hati', DANGER_SOFT, HexColor('#f0cfcc'), DANGER),
    'try': ('Coba sekarang', FLAME_SOFT, HexColor('#f5d9bb'), FLAME_DEEP),
}

def keys_block(items):
    rows = []
    for k in items:
        combo = '  +  '.join(f'[ {tx(c)} ]' for c in k['combo'])
        rows.append([Paragraph(combo, S['kbd']), Paragraph(tx(k['label']), S['boxtext'])])
    t = Table(rows, colWidths=[58 * mm, CONTENT_W - 8 * mm - 58 * mm])
    t.setStyle(TableStyle([
        ('BOX', (0, 0), (-1, -1), 1, LINE),
        ('LINEBELOW', (0, 0), (-1, -2), 0.5, LINE),
        ('LEFTPADDING', (0, 0), (-1, -1), 10), ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 6), ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('ROUNDEDCORNERS', [6, 6, 6, 6]),
    ]))
    return [Spacer(1, 3), t, Spacer(1, 6)]

def glossary_block(items):
    rows = [[Paragraph(tx(g['term']), S['glo_t']), Paragraph(tx(g['def']), S['glo_d'])] for g in items]
    t = Table(rows, colWidths=[34 * mm, CONTENT_W - 8 * mm - 34 * mm])
    t.setStyle(TableStyle([
        ('LINEBELOW', (0, 0), (-1, -2), 0.4, LINE),
        ('LEFTPADDING', (0, 0), (-1, -1), 2), ('RIGHTPADDING', (0, 0), (-1, -1), 4),
        ('TOPPADDING', (0, 0), (-1, -1), 4), ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    return [Paragraph('Kamus bab ini', S['h2']), t, Spacer(1, 4)]

def list_block(items, numbered):
    lis = [ListItem(Paragraph(tx(i), S['li'])) for i in items]
    kw = dict(bulletFontName=FB, bulletFontSize=10,
              bulletColor=FLAME_DEEP if numbered else FLAME,
              leftIndent=16, bulletDedent=4)
    if numbered:
        return [ListFlowable(lis, bulletType='1', bulletFormat='%s.', **kw), Spacer(1, 4)]
    return [ListFlowable(lis, bulletType='bullet', **kw), Spacer(1, 4)]

# ---------- Dokumen + header/footer ----------
class Doc(BaseDocTemplate):
    def afterFlowable(self, fl):
        if hasattr(fl, '_toc'):
            level, text = fl._toc
            self.notify('TOCEntry', (level, text, self.page))

def on_page(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(PAPER)
    canvas.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
    if doc.page > 1:
        canvas.setStrokeColor(LINE); canvas.setLineWidth(0.8)
        canvas.line(MARGIN, PAGE_H - 12 * mm, PAGE_W - MARGIN, PAGE_H - 12 * mm)
        canvas.setFont(FB, 8); canvas.setFillColor(FLAME_DEEP)
        canvas.drawString(MARGIN, PAGE_H - 10.2 * mm, 'LENTERA')
        canvas.setFont(F, 8); canvas.setFillColor(SOFT)
        canvas.drawRightString(PAGE_W - MARGIN, PAGE_H - 10.2 * mm, f'Buku Saku Modul {N} - {SUB}')
        canvas.setFillColor(FAINT)
        canvas.drawCentredString(PAGE_W / 2, 9 * mm, f'{doc.page}')
        canvas.setFont(F, 7.5)
        canvas.drawString(MARGIN, 9 * mm, 'created by Mohammad Dimas Priambodo')
    canvas.restoreState()

def heading(text, style, level):
    p = Paragraph(tx(text), style)
    p._toc = (level, tx(text))
    return p

doc = Doc(OUT, pagesize=A4,
          leftMargin=MARGIN, rightMargin=MARGIN,
          topMargin=18 * mm, bottomMargin=16 * mm,
          title=f'Lentera - Buku Saku Modul {N}', author='Mohammad Dimas Priambodo')
frame = Frame(MARGIN, 16 * mm, CONTENT_W, PAGE_H - 18 * mm - 16 * mm, id='f')
doc.addPageTemplates([PageTemplate(id='p', frames=[frame], onPage=on_page)])

story = []

# ---------- SAMPUL ----------
story.append(Spacer(1, 26 * mm))
lamp = PILImage.open(f'{BASE}/png/lamp.png').size
lw = 52 * mm
story.append(Image(f'{BASE}/png/lamp.png', width=lw, height=lw * lamp[1] / lamp[0]))
story.append(Spacer(1, 8 * mm))
story.append(Paragraph('LENTERA', st('cv1', fontName=FB, fontSize=40, leading=44, alignment=TA_CENTER, textColor=INK)))
story.append(Paragraph(f'Buku Saku Modul {N} - {SUB}', st('cv2', fontName=FB, fontSize=15, leading=20, alignment=TA_CENTER, textColor=FLAME_DEEP)))
story.append(Spacer(1, 5 * mm))
story.append(Paragraph(tx(TAG),
                       st('cv3', fontSize=11, leading=16, alignment=TA_CENTER, textColor=SOFT)))
story.append(Spacer(1, 42 * mm))
story.append(Paragraph('created by', st('cv4', fontSize=9.5, alignment=TA_CENTER, textColor=FAINT, spaceAfter=1)))
story.append(Paragraph('Mohammad Dimas Priambodo', st('cv5', fontName=FB, fontSize=12.5, alignment=TA_CENTER, textColor=INK)))
story.append(Paragraph('Pendamping belajar versi cetak dari aplikasi Lentera', st('cv6', fontSize=9, alignment=TA_CENTER, textColor=FAINT, spaceBefore=2)))
story.append(PageBreak())

# ---------- DAFTAR ISI ----------
story.append(Paragraph('Daftar isi', S['h1']))
toc = TableOfContents()
toc.levelStyles = [S['toc1'], S['toc2']]
story.append(toc)
story.append(Spacer(1, 8))
story.append(Paragraph(tx('Cara pakai buku ini: baca babnya pelan-pelan, lalu PRAKTIKKAN langsung di laptop. '
                          'Kotak oranye "Coba sekarang" adalah tugasmu. Di akhir tiap bab ada latihan tertulis - '
                          'kunci jawabannya di halaman paling belakang. Latihan interaktif, latihan mengetik, dan '
                          'ujian kelulusan dikerjakan di aplikasi Lentera.'), S['body']))
story.append(PageBreak())

# ---------- PENGANTAR ----------
story.append(heading('Selamat datang', S['h1'], 0))
story.append(Paragraph(tx(M['intro']), S['body']))
story.append(Spacer(1, 4))
story.extend(box('Tips', 'Buku ini kembaran dari aplikasi Lentera. Materinya sama persis - jadi kamu bisa membaca di '
                 'HP atau kertas kapan saja, lalu berlatih di laptop saat giliranmu tiba.', SEA_SOFT, HexColor('#c4e2de'), SEA))

# ---------- BAB ----------
ABC = 'ABCDEFGH'
kunci_global = []
for bab in M['bab']:
    story.append(PageBreak())
    story.append(Paragraph(f"BAB {bab['no']}", S['eyebrow']))
    story.append(heading(f"Bab {bab['no']} - {bab['title']}", S['h1'], 0))
    story.append(Paragraph(tx(bab['desc']), S['desc']))

    for b in bab['blocks']:
        t = b['t']
        if t == 'p':
            story.append(Paragraph(tx(b['text']), S['body']))
        elif t == 'h':
            story.append(Paragraph(tx(b['text']), S['h2']))
        elif t == 'img':
            el = [flow_img(img_for(b['kind'], b.get('props')))]
            if b.get('caption'):
                el.append(Paragraph(tx(b['caption']), S['caption']))
            story.append(KeepTogether(el))
        elif t == 'steps':
            story.extend(list_block(b['items'], numbered=True))
        elif t == 'list':
            story.extend(list_block(b['items'], numbered=False))
        elif t in BOX_KIND:
            lbl, bg, bd, lc = BOX_KIND[t]
            story.append(KeepTogether(box(lbl, b['text'], bg, bd, lc)))
        elif t == 'keys':
            story.append(KeepTogether(keys_block(b['items'])))
        elif t == 'glossary':
            story.append(KeepTogether(glossary_block(b['items'])))

    # Latihan tertulis bab
    soal_flow = [Paragraph(f"Latihan tertulis Bab {bab['no']}", S['h2']),
                 Paragraph(tx('Kerjakan dengan pensil. Kunci jawaban ada di halaman belakang - jangan mengintip dulu!'),
                           st('note', fontName=FI, fontSize=9.3, textColor=SOFT, spaceAfter=6))]
    kunci_bab = []
    for i, q in enumerate(bab['quiz'], 1):
        if q['type'] == 'mc':
            el = [Paragraph(f"{i}. {tx(q['q'])}", S['soal'])]
            for j, opt in enumerate(q['options']):
                el.append(Paragraph(f"{ABC[j]}. {tx(opt)}", S['opsi']))
            soal_flow.append(KeepTogether(el))
            kunci_bab.append(f"{i}. {ABC[q['answer']]} - {tx(q.get('explain', ''))}")
        else:  # hotspot -> tugas lingkari pada gambar
            el = [Paragraph(f"{i}. {tx(q['q']).replace('Klik', 'Lingkari')}", S['soal']),
                  flow_img(img_for(q['img']['kind'], q['img'].get('props')), max_w=CONTENT_W * 0.7, max_h=58 * mm)]
            soal_flow.append(KeepTogether(el))
            kunci_bab.append(f"{i}. {tx(q.get('explain', 'Lihat kembali gambarnya di bab ini.'))}")
    story.append(KeepTogether(soal_flow[:2]) if len(soal_flow) <= 2 else soal_flow[0])
    if len(soal_flow) > 1:
        story.extend(soal_flow[1:])
    kunci_global.append((bab['no'], bab['title'], kunci_bab))

# ---------- TENTANG LATIHAN DI APLIKASI ----------
story.append(PageBreak())
story.append(heading('Setelah membaca buku ini', S['h1'], 0))
story.append(Paragraph(tx('Buku hanya separuh perjalanan. Separuh lainnya ada di aplikasi Lentera:'), S['body']))
butir = []
if N == '0':
    butir.append('Latihan mengetik 10 jari - 3 level dengan papan ketik penunjuk yang menyala.')
butir.append('Kuis interaktif tiap bab - jawaban salah langsung dijelaskan.')
if M.get('praktik'):
    butir.append('Ujian praktek - kerjakan tugas sungguhan di aplikasinya, unggah file .' + M['praktik']['ext'][0] + ', dinilai otomatis per rubrik dengan saran perbaikan.')
butir.append('Ujian akhir Modul ' + N + ' - ' + str(len(M['final']['questions'])) + ' soal, nilai lulus ' + str(M['final']['pass']) + '. ' + NEXT)
story.extend(list_block(butir, numbered=False))
story.extend(box('Coba sekarang', 'Buka aplikasi Lentera di laptop, masuk dengan akunmu, lalu selesaikan bab demi bab. '
                 'Gunakan jurus belah layar (Win + Panah) supaya bisa membaca sambil praktik.', FLAME_SOFT, HexColor('#f5d9bb'), FLAME_DEEP))

# ---------- KUNCI JAWABAN ----------
story.append(PageBreak())
story.append(heading('Kunci jawaban latihan tertulis', S['h1'], 0))
for no, title, kunci in kunci_global:
    el = [Paragraph(f"Bab {no} - {tx(title)}", S['h2'])]
    for k in kunci:
        el.append(Paragraph(k, S['kunci']))
    story.append(KeepTogether(el))

doc.multiBuild(story)
size = os.path.getsize(OUT)
print('PDF jadi:', OUT, '|', round(size / 1024 / 1024, 2), 'MB')
