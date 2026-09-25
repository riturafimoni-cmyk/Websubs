// Supabase Configuration
const SUPABASE_URL = "https://firmyknalxgtmgnxmtdo.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_UpfYT4yKOBgcU3P5FDxcMw_IasiYca_";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const ADMIN_WA = "8801985405068";
const PAY_NUMS = {
  bKash: "01985405068",
  Nagad: "01613305454"
};

// কনফেটি লাইব্রেরি অটো-লোড
(function loadConfettiLib() {
  const script = document.createElement('script');
  script.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js";
  document.head.appendChild(script);
})();

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
  startLiveSalesPopup();
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

// Modern Glass Toast
function showToast(text) {
  let toast = document.getElementById('customToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'customToast';
    toast.className = 'fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#16161E]/95 border border-[#FF5A00] text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-full shadow-[0_0_25px_rgba(255,90,0,0.5)] backdrop-blur-md transition-all duration-300 transform -translate-y-20 opacity-0 flex items-center gap-2 pointer-events-none';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<i class="fa-solid fa-circle-check text-[#FF5A00]"></i> ${text}`;
  toast.classList.remove('-translate-y-20', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');
  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('-translate-y-20', 'opacity-0');
  }, 2200);
}

function updatePayNum() {
  const sel = document.getElementById('payMethod').value;
  document.getElementById('methodLabel').innerText = sel + ' (সেন্ড মানি):';
  document.getElementById('activeNum').innerText = PAY_NUMS[sel];
}

function copyActiveNum(btn) {
  const num = document.getElementById('activeNum').innerText;
  navigator.clipboard.writeText(num);
  showToast("নাম্বার কপি হয়েছে: " + num);
  const old = btn.innerText; btn.innerText = "কপি!"; setTimeout(() => btn.innerText = old, 1200);
}

// প্রিমিয়াম কনফেটি ব্লাস্ট অ্যানিমেশন
function fireCelebrationConfetti() {
  if (typeof confetti !== 'function') return;

  const count = 200;
  const defaults = { 
    origin: { y: 0.7 }, 
    colors: ['#FF5A00', '#FFA726', '#10B981', '#FFFFFF', '#FF3D00'] 
  };

  function fire(particleRatio, opts) {
    confetti(Object.assign({}, defaults, opts, {
      particleCount: Math.floor(count * particleRatio)
    }));
  }

  // বিভিন্ন অ্যাঙ্গেলে রঙিন ফুলঝুরির বিস্ফোরণ
  fire(0.25, { spread: 26, startVelocity: 55 });
  fire(0.2, { spread: 60 });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
  fire(0.1, { spread: 120, startVelocity: 45 });
}

// Order Placement to Supabase + Confetti Trigger
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
    
    // কনফেটি ফুলঝুরি ফোটানো
    fireCelebrationConfetti();

    const msg = `হ্যালো Subs Mart BD!\nআমি Gemini Pro (18 Months) প্যাকেজ অর্ডার করেছি।\n📌 অর্ডার কোড: ${orderCode}\n👤 নাম: ${document.getElementById('custName').value}\n✉️ জিমেইল: ${document.getElementById('custEmail').value}\n📱 মোবাইল: ${document.getElementById('custPhone').value}\n💳 মেথড: ${document.getElementById('payMethod').value}\n🔢 TrxID: ${document.getElementById('custTrx').value}\n💰 মূল্য: ২৫০ ৳`;
    document.getElementById('displayOrderCode').innerText = orderCode;
    document.getElementById('waSendBtn').href = `https://wa.me/${ADMIN_WA}?text=${encodeURIComponent(msg)}`;
    document.getElementById('orderForm').classList.add('hidden');
    document.getElementById('orderSuccess').classList.remove('hidden');

  } catch (err) {
    showToast('অর্ডার ব্যর্থ হয়েছে: ' + err.message);
    btn.innerText = "আবার চেষ্টা করুন"; btn.disabled = false;
  }
}

// Live Sales Popup
function startLiveSalesPopup() {
  const buyers = [
    { name: "তানভীর আহমেদ", time: "১ মিনিট আগে" },
    { name: "রাকিবুল হাসান", time: "৩ মিনিট আগে" },
    { name: "মেহেদী হাসান", time: "৫ মিনিট আগে" },
    { name: "আরিফুল ইসলাম", time: "২ মিনিট আগে" },
    { name: "মাহমুদুর রহমান", time: "৭ মিনিট আগে" },
    { name: "সাকিব চৌধুরী", time: "৪ মিনিট আগে" },
    { name: "ফারহান সাদিক", time: "৬ মিনিট আগে" },
    { name: "জুবায়ের হোসেন", time: "৮ মিনিট আগে" },
    { name: "নাজমুল ইসলাম", time: "১০ মিনিট আগে" },
    { name: "রায়হান কবির", time: "৩ মিনিট আগে" },
    { name: "মোস্তাফিজুর রহমান", time: "১২ মিনিট আগে" },
    { name: "শফিউল আলম", time: "৫ মিনিট আগে" },
    { name: "তৌহিদুল ইসলাম", time: "৯ মিনিট আগে" },
    { name: "শাহরিয়ার নাফিস", time: "৪ মিনিট আগে" },
    { name: "আশিকুর রহমান", time: "১১ মিনিট আগে" },
    { name: "হাসিবুল হাসান", time: "২ মিনিট আগে" },
    { name: "আবদুল্লাহ আল মামুন", time: "১৪ মিনিট আগে" },
    { name: "নাঈম হাসান", time: "৬ মিনিট আগে" },
    { name: "সাইদুর রহমান", time: "১৫ মিনিট আগে" },
    { name: "ইমরান নাজির", time: "১৮ মিনিট আগে" }
  ];

  let box = document.getElementById('salesPopup');
  if (!box) {
    box = document.createElement('div');
    box.id = 'salesPopup';
    box.className = 'fixed bottom-5 left-3 sm:left-4 z-50 max-w-[310px] bg-[#121216]/95 border border-[#FF5A00]/70 p-3 rounded-2xl shadow-[0_0_30px_rgba(255,90,0,0.35)] backdrop-blur-md transition-all duration-500 transform translate-y-36 opacity-0 flex items-center gap-3 pointer-events-none';
    document.body.appendChild(box);
  }

  let index = 0;

  function triggerPopup() {
    const buyer = buyers[index % buyers.length];
    index++;

    box.innerHTML = `
      <div class="w-10 h-10 rounded-xl bg-[#FF5A00]/20 border border-[#FF5A00] flex items-center justify-center text-[#FF5A00] text-base shrink-0 shadow-[0_0_15px_rgba(255,90,0,0.4)]">
        <i class="fa-solid fa-bag-shopping"></i>
      </div>
      <div class="text-left text-xs leading-snug text-zinc-300">
        <div class="flex items-center gap-1.5">
          <b class="text-white text-sm tracking-tight">${buyer.name}</b>
          <i class="fa-solid fa-circle-check text-emerald-400 text-xs"></i>
        </div>
        <p class="text-zinc-400 text-[11px] mt-0.5">Gemini Pro ১৮ মাসের প্যাকেজ নিয়েছেন</p>
        <div class="flex items-center gap-2 mt-1 text-[10px] text-zinc-400">
          <span class="text-[#FF5A00] font-bold font-en">${buyer.time}</span>
          <span>•</span>
          <span class="text-zinc-500">ভেরিফাইড পারচেজ</span>
        </div>
      </div>
    `;

    box.classList.remove('translate-y-36', 'opacity-0');
    box.classList.add('translate-y-0', 'opacity-100');

    setTimeout(() => {
      box.classList.remove('translate-y-0', 'opacity-100');
      box.classList.add('translate-y-36', 'opacity-0');
    }, 5500);
  }

  setTimeout(triggerPopup, 3000);
  setInterval(triggerPopup, 18000);
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

window.addEventListener('DOMContentLoaded', initApp);
