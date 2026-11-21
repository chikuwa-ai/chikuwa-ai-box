(function () {
  'use strict';

  const state = {
    usdJpy: SITE_CONFIG.defaultUsdJpy || 155,
    simMode: 'diagnose',
    selectedGoals: new Set(['research_writing', 'coding']),
    budget: '6500',
    manualSelected: new Set(['google_ai_pro', 'cursor_pro']),
    promptCategory: 'all',
    promptDifficulty: 'all',
    promptQuery: '',
    toolCategory: 'all',
    toolQuery: '',
    activePromptId: null
  };

  function toJpy(plan) {
    if (plan.currency === 'JPY') return Math.round(plan.price);
    return Math.round(plan.price * state.usdJpy);
  }

  function formatYen(amount) {
    return amount.toLocaleString('ja-JP') + '円';
  }

  function getShareUrl() {
    if (SITE_CONFIG.siteUrlHint) return SITE_CONFIG.siteUrlHint;
    if (window.location.protocol.startsWith('http')) return window.location.href.split('#')[0];
    return '';
  }

  function getCleanHandle() {
    const h = (SITE_CONFIG.xHandle || '@your_ai_lab').trim();
    return h.startsWith('@') ? h : '@' + h;
  }

  function openXShare(text) {
    const url = 'https://x.com/intent/tweet?text=' + encodeURIComponent(text);
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(function () {
      toast.classList.remove('show');
    }, 2400);
  }

  function copyText(text, successMsg) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () {
        showToast(successMsg || 'コピーしました');
      }).catch(function () {
        fallbackCopy(text, successMsg);
      });
      return;
    }
    fallbackCopy(text, successMsg);
  }

  function fallbackCopy(text, successMsg) {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.top = '-9999px';
    document.body.appendChild(area);
    area.select();
    try {
      document.execCommand('copy');
      showToast(successMsg || 'コピーしました');
    } catch (e) {
      showToast('コピーに失敗しました。手動で選択してください');
    }
    document.body.removeChild(area);
  }

  function applyConfig() {
    const handle = getCleanHandle();
    const xProfileUrl = 'https://x.com/' + handle.replace(/^@/, '');

    document.title = SITE_CONFIG.siteName + '｜' + SITE_CONFIG.tagline;
    document.getElementById('site-title').textContent = SITE_CONFIG.siteName;
    document.getElementById('site-tagline').textContent = SITE_CONFIG.tagline;
    document.getElementById('updated-badge').textContent = '最終更新：' + SITE_CONFIG.updatedAt;

    document.getElementById('stat-subs').textContent = String(SUBSCRIPTIONS.length);
    document.getElementById('stat-prompts').textContent = String(PROMPTS.length);
    document.getElementById('stat-tools').textContent = String(TOOLS.length);

    const navX = document.getElementById('nav-x-link');
    navX.href = xProfileUrl;
    navX.textContent = handle + ' をフォロー';

    document.getElementById('x-follow-link').href = xProfileUrl;
    document.getElementById('hero-note-link').href = SITE_CONFIG.noteUrl;
    document.getElementById('note-cta-link').href = SITE_CONFIG.noteUrl;
    document.getElementById('credit-text-preview').textContent = SITE_CONFIG.siteName + ' · ' + handle;
    document.getElementById('footer-text').textContent =
      SITE_CONFIG.siteName + '｜Created by ' + SITE_CONFIG.authorName + ' (' + handle + ')';

    const slider = document.getElementById('usd-jpy-slider');
    slider.value = String(state.usdJpy);
    updateRateLabels();
  }

  function updateRateLabels() {
    document.getElementById('usd-jpy-value').textContent = '1ドル = ' + state.usdJpy + '円';
    document.getElementById('sample-20usd').textContent = formatYen(20 * state.usdJpy);
  }

  function initTheme() {
    const btn = document.getElementById('theme-toggle');
    let saved = 'light';
    try {
      saved = localStorage.getItem('ai_hub_theme') || 'light';
    } catch (e) {
      saved = 'light';
    }
    setTheme(saved);

    btn.addEventListener('click', function () {
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      setTheme(next);
    });

    function setTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      btn.textContent = theme === 'dark' ? '☀️ ライト' : '🌙 ダーク';
      try {
        localStorage.setItem('ai_hub_theme', theme);
      } catch (e) {
        // file:// 環境等でストレージ制限がある場合は無視
      }
    }
  }

  function buildRecommendation() {
    const goals = state.selectedGoals;
    const budgetCap = state.budget === 'unlimited' ? Infinity : Number(state.budget);
    const byId = {};
    SUBSCRIPTIONS.forEach(function (s) {
      byId[s.id] = s;
    });

    let pickedIds = [];
    let reason = '';
    let skipAdvice = 'まだ無料枠の回数制限に1度も引っかかっていない場合は、初月から無理に課金せず1週間無料版を使い倒してから選ぶのが一番損しないルートです。';

    if (goals.size === 0) {
      return {
        plans: [byId.google_ai_plus],
        reason: 'やりたいことが未選択のため、まずは月1,000円以下で試せるライトプランを提案しています。上のQ1から目的をチェックしてみてください。',
        skipAdvice: skipAdvice
      };
    }

    if (budgetCap <= 3000) {
      if (goals.has('coding') && !goals.has('storage')) {
        pickedIds = goals.has('research_writing') ? ['claude_pro'] : ['cursor_pro'];
        reason = '月3,000円前後の1本枠で非エンジニアのツール自作も狙うなら、文章と開発の両輪を回せる Claude Pro（またはエディタ操作重視で Cursor Pro）が最もコスパ良く回収できます。';
        skipAdvice = 'いきなり複数のAIや上位Maxプラン（$100）に入る必要はありません。まずは1本だけ使い倒しましょう。';
      } else if (goals.has('storage') || goals.has('automation')) {
        pickedIds = ['google_ai_pro'];
        reason = '普段のGoogle連携や5TBストレージまで丸ごと付く Google AI Pro（2,900円）が、1本目の固定費として圧倒的に元が取りやすい構成です。';
        skipAdvice = 'Googleドライブ容量を一切使わない場合は、ChatGPT Plus（3,000円）や ChatGPT Go（1,400円）でも十分です。';
      } else if (goals.has('creative') && goals.size === 1) {
        pickedIds = ['midjourney_basic', 'suno_pro'];
        reason = '画像と音楽の制作特化なら、それぞれ月額$10クラスの組み合わせでも約3,000円前後に収まります。';
        skipAdvice = '動画生成（Runway等）はクレジット消費が早いため、最初は静止画・音楽を固めてから追加するのが節約のコツです。';
      } else {
        pickedIds = ['chatgpt_plus'];
        reason = '文章・リサーチ・画像生成・簡単な作業まで1つで完結する ChatGPT Plus（3,000円）が迷わない王道です。';
        skipAdvice = '使用頻度が週2〜3回程度なら、最初は ChatGPT Go（1,400円）や Google AI Plus（725円）から始めるのも賢い選択です。';
      }
    } else if (budgetCap <= 6500) {
      const baseId = goals.has('storage') ? 'google_ai_pro' : 'chatgpt_plus';
      if (goals.has('coding')) {
        pickedIds = goals.has('storage') ? ['google_ai_pro', 'cursor_pro'] : ['claude_pro', 'cursor_pro'];
        if (pickedIds[0] === 'claude_pro' && toJpy(byId.claude_pro) + toJpy(byId.cursor_pro) > budgetCap) {
          pickedIds = ['google_ai_pro', 'cursor_pro'];
        }
        reason = '日常のリサーチ・設計担当（Google AI Pro または Claude Pro）と、実際のツール自作担当（Cursor Pro）の2本柱。非エンジニアが「月10時間以上の時短＋ツール制作」に踏み込む最強の実用セットです。';
        skipAdvice = '月$100の Claude Max はまだ不要です。$20枠を2つ組み合わせる方がカバー範囲が広くなります。';
      } else if (goals.has('creative')) {
        pickedIds = [baseId, 'suno_pro', 'midjourney_basic'];
        if (totalOf(pickedIds) > budgetCap) {
          pickedIds = [baseId, 'midjourney_basic'];
        }
        reason = '汎用AI（文章・企画出し）＋制作特化AIの組み合わせで、発信や制作物のクオリティを一気に引き上げられます。';
        skipAdvice = '動画AIまで同時に契約すると使い切れずもったいないので、よく使う1ジャンルだけ課金しましょう。';
      } else {
        pickedIds = ['google_ai_pro', 'perplexity_pro'];
        if (totalOf(pickedIds) > budgetCap) {
          pickedIds = ['google_ai_pro', 'chatgpt_plus'];
        }
        reason = '日常業務のGoogle連携（5TB付）＋最新情報や企画作成の精度を上げる組み合わせです。';
        skipAdvice = '同じ用途の汎用チャットAIを3つ同時に課金すると使わないものが必ず出ます。最大2つまでに絞るのが鉄則です。';
      }
    } else if (budgetCap <= 10000) {
      const picked = [goals.has('storage') ? 'google_ai_pro' : 'chatgpt_plus'];
      if (goals.has('coding')) picked.push('cursor_pro');
      if (goals.has('creative')) picked.push('midjourney_basic', 'suno_pro');
      else if (goals.has('research_writing')) picked.push('claude_pro');
      pickedIds = dedupeFit(picked, budgetCap);
      reason = '実務・開発・クリエイティブの主要領域をバランス良くカバーできる本格運用構成です。自分の時間が確実に浮く作業から優先投入できます。';
      skipAdvice = '使っていない月が出たサブスクは翌月すぐ解約して、使う月だけ入り直す「スポット課金」にするとさらに節約できます。';
    } else {
      const picked = [goals.has('storage') ? 'google_ai_pro' : 'chatgpt_plus', 'claude_pro'];
      if (goals.has('coding')) picked.push('cursor_pro');
      if (goals.has('creative')) picked.push('midjourney_basic', 'suno_pro', 'runway_standard');
      if (goals.has('research_writing') && !picked.includes('perplexity_pro')) picked.push('perplexity_pro');
      pickedIds = Array.from(new Set(picked));
      reason = '検証・発信・開発・動画制作までフルカバーするプロ検証構成。X発信や業務自動化で時間を丸ごと買うフェーズ向けです。';
      skipAdvice = 'フル構成でも「同じ役割のチャットを惰性で毎月払わない」ために、月1回は使用頻度を見直してください。';
    }

    function totalOf(ids) {
      return ids.reduce(function (sum, id) {
        return sum + (byId[id] ? toJpy(byId[id]) : 0);
      }, 0);
    }

    function dedupeFit(ids, cap) {
      const out = [];
      let sum = 0;
      Array.from(new Set(ids)).forEach(function (id) {
        const plan = byId[id];
        if (!plan) return;
        const cost = toJpy(plan);
        if (sum + cost <= cap || out.length === 0) {
          out.push(id);
          sum += cost;
        }
      });
      return out;
    }

    return {
      plans: pickedIds.map(function (id) { return byId[id]; }).filter(Boolean),
      reason: reason,
      skipAdvice: skipAdvice
    };
  }

  function renderGoals() {
    const container = document.getElementById('goal-checkboxes');
    container.innerHTML = '';
    GOALS.forEach(function (goal) {
      const label = document.createElement('label');
      label.className = 'goal-item' + (state.selectedGoals.has(goal.id) ? ' selected' : '');

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = state.selectedGoals.has(goal.id);
      checkbox.addEventListener('change', function () {
        if (checkbox.checked) state.selectedGoals.add(goal.id);
        else state.selectedGoals.delete(goal.id);
        renderGoals();
        renderDiagnosis();
      });

      const body = document.createElement('div');
      const strong = document.createElement('strong');
      strong.textContent = goal.label;
      const span = document.createElement('span');
      span.textContent = goal.desc;
      body.appendChild(strong);
      body.appendChild(span);

      label.appendChild(checkbox);
      label.appendChild(body);
      container.appendChild(label);
    });
  }

  function renderDiagnosis() {
    const container = document.getElementById('diagnosis-result');
    const result = buildRecommendation();
    const total = result.plans.reduce(function (sum, p) { return sum + toJpy(p); }, 0);

    container.innerHTML = '';

    const header = document.createElement('div');
    header.className = 'diag-header';
    const titleWrap = document.createElement('div');
    const badge = document.createElement('span');
    badge.className = 'badge badge-accent';
    badge.textContent = 'あなたへのおすすめ構成';
    const h3 = document.createElement('h3');
    h3.style.margin = '6px 0 0';
    h3.textContent = result.plans.map(function (p) { return p.name; }).join(' ＋ ');
    titleWrap.appendChild(badge);
    titleWrap.appendChild(h3);

    const priceBox = document.createElement('div');
    priceBox.className = 'diag-price';
    priceBox.textContent = '約 ' + formatYen(total) + ' / 月';

    header.appendChild(titleWrap);
    header.appendChild(priceBox);
    container.appendChild(header);

    const list = document.createElement('div');
    list.className = 'diag-list';
    result.plans.forEach(function (plan) {
      const card = document.createElement('div');
      card.className = 'diag-plan-card';

      const top = document.createElement('div');
      top.className = 'diag-plan-top';
      const name = document.createElement('strong');
      name.textContent = plan.name;
      const price = document.createElement('span');
      price.className = 'badge';
      price.textContent = plan.currency === 'JPY'
        ? formatYen(plan.price)
        : '$' + plan.price + '（約' + formatYen(toJpy(plan)) + '）';
      top.appendChild(name);
      top.appendChild(price);

      const p = document.createElement('p');
      p.textContent = plan.summary;

      card.appendChild(top);
      card.appendChild(p);
      list.appendChild(card);
    });
    container.appendChild(list);

    const reasonP = document.createElement('p');
    reasonP.style.fontSize = '13.5px';
    reasonP.style.margin = '0 0 12px';
    reasonP.textContent = '💡 選定理由：' + result.reason;
    container.appendChild(reasonP);

    const warn = document.createElement('div');
    warn.className = 'warn-callout';
    const warnTitle = document.createElement('strong');
    warnTitle.textContent = '⚠️ 逆に「今すぐ課金しなくていい人」';
    const warnBody = document.createElement('span');
    warnBody.textContent = result.skipAdvice;
    warn.appendChild(warnTitle);
    warn.appendChild(warnBody);
    container.appendChild(warn);

    const actions = document.createElement('div');
    actions.className = 'diag-actions';
    const shareBtn = document.createElement('button');
    shareBtn.type = 'button';
    shareBtn.className = 'btn btn-primary';
    shareBtn.textContent = '診断結果をXでシェア';
    shareBtn.addEventListener('click', function () {
      const planNames = result.plans.map(function (p) { return p.name; }).join(' + ');
      const url = getShareUrl();
      const lines = [
        SITE_CONFIG.siteName + ' でAI課金コスパを診断してみた👇',
        '',
        '✅ おすすめ構成：' + planNames,
        '💰 月額目安：約' + formatYen(total) + '（1ドル=' + state.usdJpy + '円換算）',
        '',
        'via ' + getCleanHandle()
      ];
      if (url) lines.push(url);
      openXShare(lines.join('\n'));
    });

    const copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.className = 'btn btn-outline';
    copyBtn.textContent = '結果をテキストコピー';
    copyBtn.addEventListener('click', function () {
      const text = 'おすすめAI構成：' + result.plans.map(function (p) { return p.name; }).join(' + ') +
        '（合計約' + formatYen(total) + '/月）｜' + SITE_CONFIG.siteName + ' ' + getCleanHandle();
      copyText(text, '診断結果をコピーしました');
    });

    actions.appendChild(shareBtn);
    actions.appendChild(copyBtn);
    container.appendChild(actions);
  }

  function renderManualSimulator() {
    const grid = document.getElementById('manual-subs-grid');
    grid.innerHTML = '';

    let total = 0;
    let count = 0;
    const selectedNames = [];

    SUBSCRIPTIONS.forEach(function (plan) {
      const isChecked = state.manualSelected.has(plan.id);
      const jpy = toJpy(plan);
      if (isChecked) {
        total += jpy;
        count += 1;
        selectedNames.push(plan.name);
      }

      const card = document.createElement('label');
      card.className = 'sub-card' + (isChecked ? ' checked' : '');

      const upper = document.createElement('div');
      const top = document.createElement('div');
      top.className = 'sub-top';

      const titleWrap = document.createElement('div');
      titleWrap.className = 'sub-title-wrap';
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = isChecked;
      cb.addEventListener('change', function () {
        if (cb.checked) state.manualSelected.add(plan.id);
        else state.manualSelected.delete(plan.id);
        renderManualSimulator();
      });

      const titleBox = document.createElement('div');
      const strong = document.createElement('strong');
      strong.textContent = plan.name;
      const small = document.createElement('div');
      small.style.fontSize = '11.5px';
      small.style.color = 'var(--text-muted)';
      small.textContent = plan.billingNote;
      titleBox.appendChild(strong);
      titleBox.appendChild(small);
      titleWrap.appendChild(cb);
      titleWrap.appendChild(titleBox);

      const priceTag = document.createElement('span');
      priceTag.className = 'sub-price-tag';
      priceTag.textContent = plan.currency === 'JPY'
        ? formatYen(jpy)
        : '$' + plan.price + ' / 約' + formatYen(jpy);

      top.appendChild(titleWrap);
      top.appendChild(priceTag);

      const summary = document.createElement('p');
      summary.className = 'sub-summary';
      summary.textContent = plan.summary;

      const ul = document.createElement('ul');
      ul.className = 'sub-perks';
      plan.perks.forEach(function (perk) {
        const li = document.createElement('li');
        li.textContent = perk;
        ul.appendChild(li);
      });

      upper.appendChild(top);
      upper.appendChild(summary);
      upper.appendChild(ul);

      const caveat = document.createElement('div');
      caveat.className = 'sub-caveat';
      caveat.textContent = '注意点：' + plan.caveat;

      card.appendChild(upper);
      card.appendChild(caveat);
      grid.appendChild(card);
    });

    document.getElementById('manual-total-jpy').textContent = formatYen(total) + ' / 月';
    document.getElementById('manual-yearly-jpy').textContent = formatYen(total * 12) + ' / 年';
    document.getElementById('manual-count').textContent = count + '件';

    const shareBtn = document.getElementById('manual-share-btn');
    shareBtn.onclick = function () {
      const url = getShareUrl();
      const body = count > 0
        ? '私のAIサブスク構成を計算してみた👇\n' + selectedNames.join(' + ') + '\n合計：約' + formatYen(total) + '/月（1ドル=' + state.usdJpy + '円）\n\nvia ' + getCleanHandle()
        : SITE_CONFIG.siteName + ' のAI課金シミュレーターで比較中！\n\nvia ' + getCleanHandle();
      openXShare(url ? body + '\n' + url : body);
    };
  }

  function renderSimulator() {
    renderGoals();
    renderDiagnosis();
    renderManualSimulator();
  }

  function getCategoryLabel(catId, list) {
    const found = list.find(function (c) { return c.id === catId; });
    return found ? found.label : catId;
  }

  function renderPromptCategories() {
    const container = document.getElementById('prompt-category-pills');
    container.innerHTML = '';
    PROMPT_CATEGORIES.forEach(function (cat) {
      const count = cat.id === 'all'
        ? PROMPTS.length
        : PROMPTS.filter(function (p) { return p.category === cat.id; }).length;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'pill-btn' + (state.promptCategory === cat.id ? ' active' : '');
      btn.textContent = cat.label + ' (' + count + ')';
      btn.addEventListener('click', function () {
        state.promptCategory = cat.id;
        renderPromptCategories();
        renderPrompts();
      });
      container.appendChild(btn);
    });
  }

  function renderPrompts() {
    const grid = document.getElementById('prompts-grid');
    const q = state.promptQuery.trim().toLowerCase();

    const filtered = PROMPTS.filter(function (p) {
      if (state.promptCategory !== 'all' && p.category !== state.promptCategory) return false;
      if (state.promptDifficulty !== 'all' && p.difficulty !== state.promptDifficulty) return false;
      if (!q) return true;
      const hay = (p.title + ' ' + p.summary + ' ' + p.recommendedTool + ' ' + p.promptText).toLowerCase();
      return hay.indexOf(q) !== -1;
    });

    document.getElementById('prompt-count-label').textContent =
      filtered.length + '件のプロンプトを表示中（全' + PROMPTS.length + '件）';

    grid.innerHTML = '';
    if (filtered.length === 0) {
      const empty = document.createElement('p');
      empty.textContent = '該当するプロンプトが見つかりませんでした。検索ワードを変えてお試しください。';
      grid.appendChild(empty);
      return;
    }

    filtered.forEach(function (p) {
      const card = document.createElement('article');
      card.className = 'prompt-card';

      const top = document.createElement('div');
      const badges = document.createElement('div');
      badges.className = 'card-badges';

      const bCat = document.createElement('span');
      bCat.className = 'badge';
      bCat.textContent = getCategoryLabel(p.category, PROMPT_CATEGORIES);

      const bDiff = document.createElement('span');
      bDiff.className = 'badge badge-accent';
      bDiff.textContent = p.difficulty;

      const bTool = document.createElement('span');
      bTool.className = 'badge badge-teal';
      bTool.textContent = p.recommendedTool;

      badges.appendChild(bCat);
      badges.appendChild(bDiff);
      badges.appendChild(bTool);

      const h3 = document.createElement('h3');
      h3.textContent = p.title;

      const desc = document.createElement('p');
      desc.textContent = p.summary;

      const preview = document.createElement('div');
      preview.className = 'prompt-preview';
      preview.textContent = p.promptText;

      top.appendChild(badges);
      top.appendChild(h3);
      top.appendChild(desc);
      top.appendChild(preview);

      const actions = document.createElement('div');
      actions.className = 'card-actions';

      const viewBtn = document.createElement('button');
      viewBtn.type = 'button';
      viewBtn.className = 'btn btn-outline btn-sm';
      viewBtn.textContent = '全文・コツを見る';
      viewBtn.addEventListener('click', function () {
        openPromptModal(p);
      });

      const copyBtn = document.createElement('button');
      copyBtn.type = 'button';
      copyBtn.className = 'btn btn-primary btn-sm';
      copyBtn.textContent = 'コピー';
      copyBtn.addEventListener('click', function () {
        copyText(p.promptText, '「' + p.title + '」をコピーしました');
      });

      const shareBtn = document.createElement('button');
      shareBtn.type = 'button';
      shareBtn.className = 'btn btn-ghost btn-sm';
      shareBtn.textContent = 'Xで紹介';
      shareBtn.addEventListener('click', function () {
        sharePromptToX(p);
      });

      actions.appendChild(viewBtn);
      actions.appendChild(copyBtn);
      actions.appendChild(shareBtn);

      card.appendChild(top);
      card.appendChild(actions);
      grid.appendChild(card);
    });
  }

  function sharePromptToX(prompt) {
    const url = getShareUrl();
    const lines = [
      '『' + prompt.title + '』がそのまま使えて便利だった👇',
      '',
      prompt.summary,
      '',
      '出典：' + SITE_CONFIG.siteName + ' (' + getCleanHandle() + ')'
    ];
    if (url) lines.push(url);
    openXShare(lines.join('\n'));
  }

  function openPromptModal(prompt) {
    state.activePromptId = prompt.id;
    document.getElementById('modal-category').textContent = getCategoryLabel(prompt.category, PROMPT_CATEGORIES);
    document.getElementById('modal-difficulty').textContent = prompt.difficulty;
    document.getElementById('modal-tool').textContent = prompt.recommendedTool;
    document.getElementById('modal-title').textContent = prompt.title;
    document.getElementById('modal-summary').textContent = prompt.summary;
    document.getElementById('modal-prompt-text').textContent = prompt.promptText;
    document.getElementById('modal-tips').textContent = prompt.tips;

    document.getElementById('modal-copy-btn').onclick = function () {
      copyText(prompt.promptText, 'プロンプト全文をコピーしました');
    };
    document.getElementById('modal-share-btn').onclick = function () {
      sharePromptToX(prompt);
    };

    document.getElementById('prompt-modal').classList.remove('hidden');
  }

  function closePromptModal() {
    document.getElementById('prompt-modal').classList.add('hidden');
    state.activePromptId = null;
  }

  function renderToolCategories() {
    const container = document.getElementById('tool-category-pills');
    container.innerHTML = '';
    TOOL_CATEGORIES.forEach(function (cat) {
      const count = cat.id === 'all'
        ? TOOLS.length
        : TOOLS.filter(function (t) { return t.category === cat.id; }).length;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'pill-btn' + (state.toolCategory === cat.id ? ' active' : '');
      btn.textContent = cat.label + ' (' + count + ')';
      btn.addEventListener('click', function () {
        state.toolCategory = cat.id;
        renderToolCategories();
        renderTools();
      });
      container.appendChild(btn);
    });
  }

  function renderTools() {
    const grid = document.getElementById('tools-grid');
    const q = state.toolQuery.trim().toLowerCase();

    const filtered = TOOLS.filter(function (t) {
      if (state.toolCategory !== 'all' && t.category !== state.toolCategory) return false;
      if (!q) return true;
      const hay = (t.name + ' ' + t.freeTier + ' ' + t.paidPrice + ' ' + t.bestFor + ' ' + t.pitfall).toLowerCase();
      return hay.indexOf(q) !== -1;
    });

    grid.innerHTML = '';
    if (filtered.length === 0) {
      const empty = document.createElement('p');
      empty.textContent = '該当するツールが見つかりませんでした。';
      grid.appendChild(empty);
      return;
    }

    filtered.forEach(function (t) {
      const card = document.createElement('article');
      card.className = 'tool-card';

      const top = document.createElement('div');
      top.className = 'tool-top';
      const h3 = document.createElement('h3');
      h3.textContent = t.name;
      const rating = document.createElement('span');
      rating.className = 'tool-rating';
      rating.textContent = '非Eng向け ' + '★'.repeat(t.rating) + '☆'.repeat(5 - t.rating);
      top.appendChild(h3);
      top.appendChild(rating);

      const meta = document.createElement('div');
      meta.className = 'tool-meta';
      const bFree = document.createElement('span');
      bFree.className = 'badge badge-teal';
      bFree.textContent = t.freeTier;
      const bPaid = document.createElement('span');
      bPaid.className = 'badge';
      bPaid.textContent = '有料: ' + t.paidPrice;
      meta.appendChild(bFree);
      meta.appendChild(bPaid);

      const best = document.createElement('p');
      best.className = 'tool-best';
      best.textContent = '得意用途：' + t.bestFor;

      const pitfall = document.createElement('p');
      pitfall.className = 'tool-pitfall';
      pitfall.textContent = '⚠️ ハマりやすい罠：' + t.pitfall;

      card.appendChild(top);
      card.appendChild(meta);
      card.appendChild(best);
      card.appendChild(pitfall);
      grid.appendChild(card);
    });
  }

  function bindEvents() {
    const slider = document.getElementById('usd-jpy-slider');
    slider.addEventListener('input', function () {
      state.usdJpy = Number(slider.value);
      updateRateLabels();
      renderDiagnosis();
      renderManualSimulator();
    });

    const diagBtn = document.getElementById('mode-diagnose-btn');
    const manBtn = document.getElementById('mode-manual-btn');
    const diagPanel = document.getElementById('diagnose-panel');
    const manPanel = document.getElementById('manual-panel');

    diagBtn.addEventListener('click', function () {
      state.simMode = 'diagnose';
      diagBtn.classList.add('active');
      manBtn.classList.remove('active');
      diagBtn.setAttribute('aria-selected', 'true');
      manBtn.setAttribute('aria-selected', 'false');
      diagPanel.classList.remove('hidden');
      manPanel.classList.add('hidden');
    });

    manBtn.addEventListener('click', function () {
      state.simMode = 'manual';
      manBtn.classList.add('active');
      diagBtn.classList.remove('active');
      manBtn.setAttribute('aria-selected', 'true');
      diagBtn.setAttribute('aria-selected', 'false');
      manPanel.classList.remove('hidden');
      diagPanel.classList.add('hidden');
    });

    document.querySelectorAll('#budget-radios .pill-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('#budget-radios .pill-btn').forEach(function (b) {
          b.classList.remove('active');
        });
        btn.classList.add('active');
        state.budget = btn.getAttribute('data-budget');
        renderDiagnosis();
      });
    });

    document.getElementById('manual-reset-btn').addEventListener('click', function () {
      state.manualSelected.clear();
      renderManualSimulator();
      showToast('選択をリセットしました');
    });

    const promptSearch = document.getElementById('prompt-search');
    promptSearch.addEventListener('input', function () {
      state.promptQuery = promptSearch.value;
      renderPrompts();
    });

    document.querySelectorAll('#prompt-difficulty-pills .pill-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('#prompt-difficulty-pills .pill-btn').forEach(function (b) {
          b.classList.remove('active');
        });
        btn.classList.add('active');
        state.promptDifficulty = btn.getAttribute('data-diff');
        renderPrompts();
      });
    });

    const toolSearch = document.getElementById('tool-search');
    toolSearch.addEventListener('input', function () {
      state.toolQuery = toolSearch.value;
      renderTools();
    });

    document.getElementById('copy-credit-btn').addEventListener('click', function () {
      copyText(SITE_CONFIG.siteName + ' · ' + getCleanHandle(), 'クレジット表記をコピーしました');
    });

    document.getElementById('modal-close-btn').addEventListener('click', closePromptModal);
    document.getElementById('modal-backdrop').addEventListener('click', closePromptModal);

    document.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        promptSearch.focus();
        promptSearch.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      if (e.key === 'Escape' && state.activePromptId) {
        closePromptModal();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    applyConfig();
    bindEvents();
    renderSimulator();
    renderPromptCategories();
    renderPrompts();
    renderToolCategories();
    renderTools();
  });
})();
