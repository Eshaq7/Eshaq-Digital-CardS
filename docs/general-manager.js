const card = document.querySelector('#card');
const languageToggle = document.querySelector('#languageToggle');
const qrTrigger = document.querySelector('#qrTrigger');
const qrDialog = document.querySelector('#qrDialog');
const wechatDialog = document.querySelector('#wechatDialog');
const toast = document.querySelector('#toast');
let language = 'en';
let toastTimer;

const words = {
  en: {
    digital: 'Digital contact', name: 'Abdullah Zaid <span>Eshaq</span>', role: 'General Manager', company: 'Eshaq Trading Company', location: 'Head office: Sana’a, Yemen', branch: 'Branch: Aden, Yemen', save: 'Save contact', available: 'Available for business', wechat: 'Add on WeChat', qr: 'Share', languageCode: 'AR', languageTitle: 'العربية', languageAria: 'Switch card to Arabic', shareAria: 'Share this contact card', qrAria: 'Show card QR code', qrTitle: 'Scan to open my card', qrDescription: 'Point your camera at this code to open this digital contact.', qrClose: 'Close QR code', wechatQrTitle: 'Scan to add on WeChat', wechatQrDescription: 'Scan this official WeChat code to connect directly.', wechatQrClose: 'Close WeChat QR code', linkCopied: 'Card link copied'
  },
  ar: {
    digital: 'بطاقة اتصال رقمية', name: 'عبدالله زيد <span>إسحاق</span>', role: 'المدير العام', company: 'شركة إسحاق التجارية', location: 'المقر: صنعاء، اليمن', branch: 'الفرع: عدن، اليمن', save: 'حفظ جهة الاتصال', available: 'متاح للتواصل', wechat: 'أضفني على وي شات', qr: 'مشاركة', languageCode: 'EN', languageTitle: 'English', languageAria: 'تحويل البطاقة إلى الإنجليزية', shareAria: 'مشاركة بطاقة الاتصال', qrAria: 'إظهار رمز QR للبطاقة', qrTitle: 'امسح الرمز لفتح بطاقتي', qrDescription: 'وجّه كاميرا هاتفك إلى الرمز لفتح بطاقة الاتصال الرقمية.', qrClose: 'إغلاق رمز QR', wechatQrTitle: 'امسح الرمز للإضافة عبر وي شات', wechatQrDescription: 'امسح رمز وي شات الرسمي للتواصل مباشرة.', wechatQrClose: 'إغلاق رمز وي شات', linkCopied: 'تم نسخ رابط البطاقة'
  }
};

function cardUrl() { return new URL(location.pathname, location.href).href; }
function qrSource() { return `https://api.qrserver.com/v1/create-qr-code/?size=460x460&margin=14&format=png&data=${encodeURIComponent(cardUrl())}`; }
function showToast(message) { toast.querySelector('span').textContent = message; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 2600); }
function fitCardToViewport() {
  card.style.zoom = '1';
  if (window.innerWidth <= 580) return;
  const scale = Math.min(1, (window.innerWidth - 34) / card.offsetWidth, (window.innerHeight - 34) / card.scrollHeight);
  card.style.zoom = String(Math.max(.64, scale));
}

function applyLanguage(next) {
  language = words[next] ? next : 'en';
  const t = words[language];
  document.documentElement.lang = language;
  document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  card.setAttribute('aria-label', language === 'ar' ? 'بطاقة الاتصال الرقمية الفاخرة لعبدالله زيد إسحاق' : 'Premium digital business card for Abdullah Zaid Eshaq');
  document.querySelector('#digitalLabel').lastChild.textContent = t.digital;
  document.querySelector('#personName').innerHTML = t.name;
  document.querySelector('#personRole').textContent = t.role;
  document.querySelector('#companyName').textContent = t.company;
  document.querySelector('#locationValue').textContent = t.location;
  document.querySelector('#availability').textContent = t.available;
  document.querySelector('#wechatLabel').textContent = t.wechat;
  document.querySelector('#qrLabel').textContent = t.qr;
  languageToggle.querySelector('b').textContent = t.languageCode;
  languageToggle.title = t.languageTitle;
  languageToggle.setAttribute('aria-label', t.languageAria);
  document.querySelector('#share').setAttribute('aria-label', t.shareAria);
  qrTrigger.setAttribute('aria-label', t.qrAria);
  document.querySelector('#qrTitle').textContent = t.qrTitle;
  document.querySelector('#qrDescription').textContent = t.qrDescription;
  document.querySelector('#qrClose').setAttribute('aria-label', t.qrClose);
  document.querySelector('#wechatQrTitle').textContent = t.wechatQrTitle;
  document.querySelector('#wechatQrDescription').textContent = t.wechatQrDescription;
  document.querySelector('#wechatQrClose').setAttribute('aria-label', t.wechatQrClose);
  document.querySelector('#branchValue').textContent = t.branch;
  document.querySelector('#saveContact').textContent = t.save;
  fitCardToViewport();
}

languageToggle.addEventListener('click', () => applyLanguage(language === 'en' ? 'ar' : 'en'));
document.querySelector('#share').addEventListener('click', async () => {
  const t = words[language];
  try { if (navigator.share) await navigator.share({ title: language === 'ar' ? 'عبدالله زيد إسحاق' : 'Abdullah Zaid Eshaq', text: t.company, url: cardUrl() }); else { await navigator.clipboard.writeText(cardUrl()); showToast(t.linkCopied); } } catch (error) { if (error.name !== 'AbortError') { window.prompt(language === 'ar' ? 'انسخ رابط البطاقة' : 'Copy card link', cardUrl()); } }
});
qrTrigger.addEventListener('click', () => { document.querySelector('#dialogQrImage').src = qrSource(); document.querySelector('#qrUrl').textContent = cardUrl().replace(/^https:\/\//, ''); qrDialog.showModal(); });
document.querySelector('#qrClose').addEventListener('click', () => qrDialog.close());
document.querySelector('#wechat').addEventListener('click', () => wechatDialog.showModal());
document.querySelector('#wechatQrClose').addEventListener('click', () => wechatDialog.close());
document.querySelector('#qrImage').src = qrSource();
applyLanguage(language);
fitCardToViewport();
window.addEventListener('resize', fitCardToViewport, { passive: true });
