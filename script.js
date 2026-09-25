// মোবাইলে কাজ করার মতো পারফেক্ট এক্সিট পপআপ
function setupExitIntent() {
  let modal = document.getElementById('exitModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'exitModal';
    modal.className = 'fixed inset-0 bg-[#08080A]/90 z-50 flex items-center justify-center p-4 backdrop-blur-md hidden';
    modal.innerHTML = `
      <div class="bg-[#121216] border-2 border-[#FF5A00] p-6 rounded-3xl max-w-sm w-full text-center shadow-[0_0_40px_rgba(255,90,0,0.4)] relative">
        <button onclick="closeExitModal()" class="absolute top-3 right-3 text-zinc-400 hover:text-white text-sm bg-zinc-800 w-7 h-7 rounded-full flex items-center justify-center">
          <i class="fa-solid fa-xmark"></i>
        </button>
        <div class="w-12 h-12 rounded-2xl bg-[#FF5A00]/20 text-[#FF5A00] flex items-center justify-center text-2xl mx-auto mb-3">
          <i class="fa-solid fa-hand"></i>
        </div>
        <h3 class="text-lg font-black text-white">যাওয়ার আগে একটু দাঁড়ান!</h3>
        <p class="text-xs text-zinc-300 mt-1 mb-5 leading-relaxed">
          Gemini Pro ১৮ মাসের প্যাকেজ নিয়ে কোনো প্রশ্ন বা দ্বিধা আছে? সরাসরি আমাদের WhatsApp-এ কথা বলে সব ক্লিয়ার হয়ে নিন।
        </p>
        <div class="space-y-2">
          <a href="https://wa.me/8801985405068?text=হ্যালো%20Subs%20Mart%20BD,%20অর্ডার%20করার%20আগে%20কিছু%20জানতে%20চাচ্ছি।" target="_blank" class="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition">
            <i class="fa-brands fa-whatsapp text-base"></i> WhatsApp-এ কথা বলুন
          </a>
          <button onclick="closeExitModal(); location.href='#order';" class="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-2.5 rounded-xl text-xs transition">
            না, আমি ২৫০ টাকায় এখনই অর্ডার করব
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  // মোবাইলে ব্যাক বাটন প্রেস হ্যান্ডলার
  window.history.pushState({ page: 1 }, "", "");
  window.addEventListener('popstate', function() {
    if (!sessionStorage.getItem('exitModalShown')) {
      showExitModal();
    }
  });

  // ডেস্কটপে মাউস উপরে নিলে
  document.addEventListener('mouseleave', (e) => {
    if (e.clientY <= 10 && !sessionStorage.getItem('exitModalShown')) {
      showExitModal();
    }
  });
}
