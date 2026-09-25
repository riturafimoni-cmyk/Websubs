// Supabase Configuration
const SUPABASE_URL = "https://firmyknalxgtmgnxmtdo.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_UpfYT4yKOBgcU3P5FDxcMw_IasiYca_";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const ADMIN_WA = "8801985405068";
const PAY_NUMS = {
  bKash: "01985405068",
  Nagad: "01613305454"
};

// Component Loader Function
async function loadSection(id, file) {
  try {
    const res = await fetch(file);
    if (res.ok) {
      document.getElementById(id).innerHTML = await res.text();
    }
  } catch (e) {
    console.log("Loading error for:", file);
  }
}

// Load All Sections Automatically
async function initApp() {
  await Promise.all([
    loadSection('sec-header', 'header.html'),
    loadSection('sec-hero', 'hero.html'),
    loadSection('sec-banner', 'banner.html'),
    loadSection('sec-features', 'features.html'),
    loadSection('sec-audience', 'audience.html'),
    loadSection('sec-benefits', 'benefits.html'),
    loadSection('sec-poster', 'poster.html'),
    loadSection('sec-order', 'order.html'),
    loadSection('sec-faq', 'faq.html'),
    loadSection('sec-footer', 'footer.html')
  ]);

  startCountdown();
}

// Countdown Timer
function startCountdown() {
  let countdownTime = (7 * 86400) + (12 * 3600) + (30 * 60) + 26;
  setInterval(() => {
    if (countdownTime <= 0) return;
    countdownTime--;
    const d = document.getElementById('days');
    const h = document.getElementById('hours');
    const m = document.getElementById('mins');
    const s = document.getElementById('secs');
    if (d && h && m && s) {
      d.innerText = String(Math.floor(countdownTime / 86400)).padStart(2, '0');
      h.innerText = String(Math.floor((countdownTime % 86400) / 3600)).padStart(2, '0');
      m.innerText = String(Math.floor((countdownTime % 3600) / 60)).padStart(2, '0');
      s.innerText = String(countdownTime % 60).padStart(2, '0');
    }
  }, 1000);
}

// Dark/Light Theme Toggle
function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.classList.toggle('dark');
  const light = document.getElementById('lightPill');
  const dark = document.getElementById('darkPill');
  if (light && dark) {
    light.className = isDark ? "px-2.5 py-0.5 rounded-full flex items-center gap-1 text-zinc-400" : "px-2.5 py-0.5 rounded-full flex items-center gap-1 bg-[#FF5A00] text-white shadow";
    dark.className = isDark ? "px-2.5 py-0.5 rounded-full flex items-center gap-1 bg-[#FF5A00] text-white shadow" : "px-2.5 py-0.5 rounded-full flex items-center gap-1 text-zinc-400";
  }
}

// Payment Methods
function updatePayNum() {
  const sel = document.getElementById('payMethod').value;
  document.getElementById('methodLabel').innerText = sel + ' (সেন্ড মানি):';
  document.getElementById('activeNum').innerText = PAY_NUMS[sel];
}

function copyActiveNum(btn) {
  navigator.clipboard.writeText(document.getElementById('activeNum').innerText);
  const old = btn.innerText; btn.innerText = "কপি!"; setTimeout(() => btn.innerText = old, 1200);
}

// Order Placement to Supabase
async function submitCustomerOrder(e) {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');
  btn.innerText = "প্রসেস হচ্ছে..."; btn.disabled = true;
  const orderCode = 'SM-' + Math.floor(1000 + Math.random() * 9000);

  try {
    const { error } = await supabaseClient.from('orders').insert([{
      order_code: orderCode,
      customer_name: document.getElementById('custName').value.trim(),
      customer_email: document.getElementById('custEmail').value.trim(),
      whatsapp_number: document.getElementById('custPhone').value.trim(),
      package_name: 'Gemini Pro 18 Months',
      amount: 250,
      payment_method: document.getElementById('payMethod').value,
      trx_id: document.getElementById('custTrx').value.trim(),
      status: 'Pending'
    }]);

    if (error) throw error;
    const msg = `হ্যালো Subs Mart BD!\nআমি Gemini Pro (18 Months) প্যাকেজ অর্ডার করেছি।\n📌 অর্ডার কোড: ${orderCode}\n👤 নাম: ${document.getElementById('custName').value}\n✉️ জিমেইল: ${document.getElementById('custEmail').value}\n📱 মোবাইল: ${document.getElementById('custPhone').value}\n💳 মেথড: ${document.getElementById('payMethod').value}\n🔢 TrxID: ${document.getElementById('custTrx').value}\n💰 মূল্য: ২৫০ ৳`;
    document.getElementById('displayOrderCode').innerText = orderCode;
    document.getElementById('waSendBtn').href = `https://wa.me/${ADMIN_WA}?text=${encodeURIComponent(msg)}`;
    document.getElementById('orderForm').classList.add('hidden');
    document.getElementById('orderSuccess').classList.remove('hidden');
  } catch (err) {
    alert('অর্ডার ব্যর্থ হয়েছে: ' + err.message);
    btn.innerText = "আবার চেষ্টা করুন"; btn.disabled = false;
  }
}

// FAQ Accordion
function toggleFaq(btn) {
  const ans = btn.nextElementSibling;
  const icon = btn.querySelector('i');
  if (ans.style.maxHeight && ans.style.maxHeight !== '0px') {
    ans.style.maxHeight = '0px';
    icon.className = "fa-solid fa-plus text-[#FF5A00]";
  } else {
    ans.style.maxHeight = ans.scrollHeight + 20 + 'px';
    icon.className = "fa-solid fa-minus text-[#FF5A00]";
  }
}

// Start app
window.addEventListener('DOMContentLoaded', initApp);
