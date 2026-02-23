<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-8">
    <!-- 標題區 -->
    <div class="text-center mb-12">
      <div class="text-7xl mb-4">🌸</div>
      <h1 class="text-4xl font-bold text-green-800 mb-2">橫州茉莉花研學活動</h1>
      <p class="text-green-600 text-lg">探索茉莉之鄉，體驗農耕智慧</p>
    </div>

    <!-- 功能選單 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
      <router-link to="/learn" class="card-btn bg-green-100 hover:bg-green-200 border-green-300">
        <div class="text-4xl mb-3">📚</div>
        <h2 class="text-xl font-bold text-green-800">茉莉花教學</h2>
        <p class="text-green-600 text-sm mt-1">認識茉莉花的生長與栽培</p>
      </router-link>

      <router-link to="/discuss" class="card-btn bg-yellow-50 hover:bg-yellow-100 border-yellow-300">
        <div class="text-4xl mb-3">💬</div>
        <h2 class="text-xl font-bold text-yellow-800">情境討論</h2>
        <p class="text-yellow-600 text-sm mt-1">小組討論，一起解決農場難題</p>
      </router-link>

      <router-link to="/game" class="card-btn bg-orange-50 hover:bg-orange-100 border-orange-300">
        <div class="text-4xl mb-3">🏆</div>
        <h2 class="text-xl font-bold text-orange-800">農場競賽</h2>
        <p class="text-orange-600 text-sm mt-1">各隊角色分工，應對農場挑戰</p>
      </router-link>

      <router-link to="/admin" class="card-btn bg-slate-100 hover:bg-slate-200 border-slate-300">
        <div class="text-4xl mb-3">⚙️</div>
        <h2 class="text-xl font-bold text-slate-800">主持人控制台</h2>
        <p class="text-slate-600 text-sm mt-1">活動管理與計分板</p>
      </router-link>
    </div>

    <p class="mt-10 text-green-400 text-sm">廣西橫州 · 中國茉莉之都</p>
  </div>
</template>

<style scoped>
@reference "tailwindcss";

.card-btn {
  @apply flex flex-col items-center justify-center p-8 rounded-2xl border-2 cursor-pointer transition-all duration-200 text-center no-underline;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}
.card-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.1);
}
</style>
