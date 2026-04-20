(() => {
    const STORAGE = {
        articles: "aniani_articles_v2",
        articleComments: "aniani_article_comments_v1",
        guestbook: "aniani_guestbook_comments_v1",
        adminSession: "aniani_admin_session_v1",
        memoryRanking: "aniani_memory_rankings_v1"
    };

    // 静的サイトでの簡易管理者認証です。必要なら任意の文字列へ変更してください。
    const ADMIN_PASSCODE = "ANIANI-ONLY-2026";

    const defaultArticles = [
        {
            id: "seed-1",
            title: "ポータル公開",
            category: "お知らせ",
            body: "ゲームリンクと更新記事をまとめるポータルを公開しました。",
            createdAt: "2026-04-20T00:00:00+09:00"
        },
        {
            id: "seed-2",
            title: "今後の更新予定",
            category: "配信予定",
            body: "天涯比隣の更新導線強化、ポータル内機能の調整を予定しています。",
            createdAt: "2026-04-20T00:01:00+09:00"
        }
    ];

    const form = document.getElementById("article-form");
    const list = document.getElementById("article-list");
    const clearButton = document.getElementById("article-clear");
    const submitButton = document.getElementById("article-submit");
    const titleInput = document.getElementById("article-title");
    const categoryInput = document.getElementById("article-category");
    const bodyInput = document.getElementById("article-body");

    const adminState = document.getElementById("admin-state");
    const adminLoginButton = document.getElementById("admin-login");
    const adminLogoutButton = document.getElementById("admin-logout");

    const guestbookList = document.getElementById("guestbook-list");
    const guestbookForm = document.getElementById("guestbook-form");

    const tttBoardEl = document.getElementById("ttt-board");
    const tttStatusEl = document.getElementById("ttt-status");
    const tttResetButton = document.getElementById("ttt-reset");
    const memoryNicknameInput = document.getElementById("memory-nickname");
    const memoryStartButton = document.getElementById("memory-start");
    const memoryResetButton = document.getElementById("memory-reset");
    const memoryBoardEl = document.getElementById("memory-board");
    const memoryStatusEl = document.getElementById("memory-status");
    const memoryTimerEl = document.getElementById("memory-timer");
    const memoryRankingListEl = document.getElementById("memory-ranking-list");

    function loadArray(key, fallback) {
        const raw = localStorage.getItem(key);
        if (!raw) {
            localStorage.setItem(key, JSON.stringify(fallback));
            return [...fallback];
        }

        try {
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [...fallback];
        } catch {
            return [...fallback];
        }
    }

    function loadObject(key, fallback) {
        const raw = localStorage.getItem(key);
        if (!raw) {
            localStorage.setItem(key, JSON.stringify(fallback));
            return { ...fallback };
        }

        try {
            const parsed = JSON.parse(raw);
            if (!parsed || Array.isArray(parsed) || typeof parsed !== "object") {
                return { ...fallback };
            }
            return parsed;
        } catch {
            return { ...fallback };
        }
    }

    function save(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function formatDate(value) {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
            return "日時不明";
        }

        return date.toLocaleString("ja-JP", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        });
    }

    function formatDuration(ms) {
        const safe = Number.isFinite(ms) ? Math.max(0, Math.floor(ms)) : 0;
        const min = Math.floor(safe / 60000);
        const sec = Math.floor((safe % 60000) / 1000);
        const milli = safe % 1000;
        return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}.${String(milli).padStart(3, "0")}`;
    }

    function normalizeName(value) {
        const name = String(value || "").trim();
        if (!name) {
            return "ゲスト";
        }
        return name.slice(0, 24);
    }

    let articles = loadArray(STORAGE.articles, defaultArticles);
    let articleComments = loadObject(STORAGE.articleComments, {});
    let guestbookComments = loadArray(STORAGE.guestbook, []);
    let memoryRankings = loadArray(STORAGE.memoryRanking, []);
    let isAdmin = localStorage.getItem(STORAGE.adminSession) === "1";

    function saveArticles() {
        save(STORAGE.articles, articles);
    }

    function saveArticleComments() {
        save(STORAGE.articleComments, articleComments);
    }

    function saveGuestbook() {
        save(STORAGE.guestbook, guestbookComments);
    }

    function saveMemoryRankings() {
        save(STORAGE.memoryRanking, memoryRankings);
    }

    function setFormDisabled(disabled) {
        if (!form) {
            return;
        }

        const controls = [titleInput, categoryInput, bodyInput, submitButton, clearButton];
        controls.forEach((control) => {
            if (control) {
                control.disabled = disabled;
            }
        });

        form.classList.toggle("is-locked", disabled);
    }

    function updateAdminUI() {
        if (adminState) {
            adminState.textContent = isAdmin
                ? "現在: 管理者モード（記事投稿・削除可）"
                : "現在: 閲覧モード（記事投稿不可）";
        }

        if (adminLoginButton) {
            adminLoginButton.style.display = isAdmin ? "none" : "inline-flex";
        }

        if (adminLogoutButton) {
            adminLogoutButton.style.display = isAdmin ? "inline-flex" : "none";
        }

        setFormDisabled(!isAdmin);
    }

    function setAdmin(next) {
        isAdmin = next;
        localStorage.setItem(STORAGE.adminSession, next ? "1" : "0");
        updateAdminUI();
        renderArticles();
    }

    function addReaction(articleId, name, message) {
        if (!articleComments[articleId]) {
            articleComments[articleId] = [];
        }

        articleComments[articleId].push({
            id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
            name: normalizeName(name),
            message: String(message).trim().slice(0, 400),
            createdAt: new Date().toISOString()
        });

        if (articleComments[articleId].length > 60) {
            articleComments[articleId] = articleComments[articleId].slice(-60);
        }

        saveArticleComments();
    }

    function renderArticles() {
        if (!list) {
            return;
        }

        if (!articles.length) {
            list.innerHTML = "<p class=\"article-empty\">記事はまだありません。管理者ログイン後に追加できます。</p>";
            return;
        }

        const sorted = [...articles].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        list.innerHTML = sorted.map((item) => {
            const id = escapeHtml(item.id);
            const title = escapeHtml(item.title || "");
            const category = escapeHtml(item.category || "");
            const body = escapeHtml(item.body || "");
            const createdAt = escapeHtml(formatDate(item.createdAt));
            const comments = Array.isArray(articleComments[item.id]) ? articleComments[item.id] : [];

            const commentsHtml = comments.length
                ? comments.slice().reverse().map((comment) => {
                    const cName = escapeHtml(normalizeName(comment.name));
                    const cText = escapeHtml(comment.message || "");
                    const cDate = escapeHtml(formatDate(comment.createdAt));
                    return `
                        <article class="reaction-item">
                            <div class="reaction-meta">${cName} / ${cDate}</div>
                            <p class="reaction-text">${cText}</p>
                        </article>
                    `;
                }).join("")
                : "<p class=\"comment-empty\">まだコメントはありません。</p>";

            const deleteButton = isAdmin
                ? `<button class="article-delete" type="button" data-delete-id="${id}">削除</button>`
                : "";

            return `
                <article class="article-item" data-id="${id}">
                    <div class="article-item-head">
                        <h5>${title}</h5>
                        ${deleteButton}
                    </div>
                    <div class="article-meta">
                        <span class="tag">${category}</span>
                        <span>${createdAt}</span>
                    </div>
                    <p class="article-body">${body}</p>

                    <div class="article-reactions">
                        <h6>この記事へのコメント</h6>
                        <div class="reaction-list">${commentsHtml}</div>
                        <form class="reaction-form" data-article-id="${id}">
                            <input type="text" name="commenter" maxlength="24" placeholder="名前（任意）">
                            <textarea name="comment" rows="3" maxlength="400" required placeholder="記事への感想を入力"></textarea>
                            <button class="btn btn-ghost btn-mini" type="submit">コメント送信</button>
                        </form>
                    </div>
                </article>
            `;
        }).join("");
    }

    function renderGuestbook() {
        if (!guestbookList) {
            return;
        }

        if (!guestbookComments.length) {
            guestbookList.innerHTML = "<p class=\"article-empty\">まだコメントはありません。</p>";
            return;
        }

        const sorted = [...guestbookComments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        guestbookList.innerHTML = sorted.map((item) => {
            const name = escapeHtml(normalizeName(item.name));
            const message = escapeHtml(item.message || "");
            const createdAt = escapeHtml(formatDate(item.createdAt));
            return `
                <article class="guestbook-item">
                    <div class="guestbook-meta">${name} / ${createdAt}</div>
                    <p class="guestbook-text">${message}</p>
                </article>
            `;
        }).join("");
    }

    if (form) {
        form.addEventListener("submit", (event) => {
            event.preventDefault();

            if (!isAdmin) {
                window.alert("記事投稿は管理者ログイン後に利用できます。");
                return;
            }

            const title = String(titleInput?.value || "").trim();
            const category = String(categoryInput?.value || "").trim() || "お知らせ";
            const body = String(bodyInput?.value || "").trim();

            if (!title || !body) {
                return;
            }

            articles = [
                {
                    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
                    title: title.slice(0, 80),
                    category: category.slice(0, 40),
                    body: body.slice(0, 2000),
                    createdAt: new Date().toISOString()
                },
                ...articles
            ];

            saveArticles();
            renderArticles();
            form.reset();
            if (titleInput) {
                titleInput.focus();
            }
        });
    }

    if (clearButton) {
        clearButton.addEventListener("click", () => {
            form?.reset();
            if (titleInput) {
                titleInput.focus();
            }
        });
    }

    if (adminLoginButton) {
        adminLoginButton.addEventListener("click", () => {
            const input = window.prompt("管理者パスコードを入力してください");
            if (input === null) {
                return;
            }

            if (input.trim() === ADMIN_PASSCODE) {
                setAdmin(true);
                window.alert("管理者モードを有効化しました。");
            } else {
                window.alert("パスコードが違います。");
            }
        });
    }

    if (adminLogoutButton) {
        adminLogoutButton.addEventListener("click", () => {
            setAdmin(false);
        });
    }

    if (list) {
        list.addEventListener("click", (event) => {
            const target = event.target;
            if (!(target instanceof HTMLElement)) {
                return;
            }

            const deleteId = target.dataset.deleteId;
            if (!deleteId) {
                return;
            }

            if (!isAdmin) {
                window.alert("削除は管理者モードでのみ可能です。");
                return;
            }

            articles = articles.filter((item) => item.id !== deleteId);
            delete articleComments[deleteId];
            saveArticles();
            saveArticleComments();
            renderArticles();
        });

        list.addEventListener("submit", (event) => {
            const target = event.target;
            if (!(target instanceof HTMLFormElement)) {
                return;
            }

            if (!target.classList.contains("reaction-form")) {
                return;
            }

            event.preventDefault();
            const articleId = target.dataset.articleId;
            if (!articleId) {
                return;
            }

            const formData = new FormData(target);
            const commenter = formData.get("commenter");
            const comment = String(formData.get("comment") || "").trim();

            if (!comment) {
                return;
            }

            addReaction(articleId, commenter, comment);
            renderArticles();
        });
    }

    if (guestbookForm) {
        guestbookForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const formData = new FormData(guestbookForm);
            const name = normalizeName(formData.get("guestName"));
            const message = String(formData.get("guestMessage") || "").trim();

            if (!message) {
                return;
            }

            guestbookComments.push({
                id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
                name,
                message: message.slice(0, 400),
                createdAt: new Date().toISOString()
            });

            if (guestbookComments.length > 120) {
                guestbookComments = guestbookComments.slice(-120);
            }

            saveGuestbook();
            renderGuestbook();
            guestbookForm.reset();
        });
    }

    const WIN_LINES = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    let tttBoard = ["", "", "", "", "", "", "", "", ""];
    let tttTurn = "○";
    let tttFinished = false;
    let tttWinLine = [];

    function findWinLine(board) {
        for (const line of WIN_LINES) {
            const [a, b, c] = line;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return line;
            }
        }
        return [];
    }

    function updateTttStatus(text) {
        if (tttStatusEl) {
            tttStatusEl.textContent = text;
        }
    }

    function renderTtt() {
        if (!tttBoardEl) {
            return;
        }

        tttBoardEl.innerHTML = tttBoard.map((value, index) => {
            const mark = escapeHtml(value || "");
            const winClass = tttWinLine.includes(index) ? " is-win" : "";
            return `<button class="ttt-cell${winClass}" type="button" data-ttt-index="${index}" aria-label="${index + 1}マス">${mark}</button>`;
        }).join("");
    }

    function resetTtt() {
        tttBoard = ["", "", "", "", "", "", "", "", ""];
        tttTurn = "○";
        tttFinished = false;
        tttWinLine = [];
        updateTttStatus("○ の番です");
        renderTtt();
    }

    if (tttBoardEl) {
        tttBoardEl.addEventListener("click", (event) => {
            const target = event.target;
            if (!(target instanceof HTMLElement)) {
                return;
            }

            const button = target.closest("[data-ttt-index]");
            if (!(button instanceof HTMLElement)) {
                return;
            }

            const index = Number(button.dataset.tttIndex);
            if (Number.isNaN(index) || index < 0 || index > 8) {
                return;
            }

            if (tttFinished || tttBoard[index]) {
                return;
            }

            tttBoard[index] = tttTurn;
            tttWinLine = findWinLine(tttBoard);

            if (tttWinLine.length) {
                tttFinished = true;
                updateTttStatus(`${tttTurn} の勝ちです`);
                renderTtt();
                return;
            }

            if (tttBoard.every(Boolean)) {
                tttFinished = true;
                updateTttStatus("引き分けです");
                renderTtt();
                return;
            }

            tttTurn = tttTurn === "○" ? "×" : "○";
            updateTttStatus(`${tttTurn} の番です`);
            renderTtt();
        });
    }

    if (tttResetButton) {
        tttResetButton.addEventListener("click", resetTtt);
    }

    const MEMORY_CARD_BACK_PATH = "../assets/images/card-back.png";
    const MEMORY_INGREDIENTS = [
        { name: "ごはん", imagePath: "../assets/images/cards/rice.png" },
        { name: "のり", imagePath: "../assets/images/cards/nori.png" },
        { name: "バナナ", imagePath: "../assets/images/cards/banana.png" },
        { name: "カレー粉", imagePath: "../assets/images/cards/curry.png" },
        { name: "鶏肉", imagePath: "../assets/images/cards/chicken.png" },
        { name: "豚肉", imagePath: "../assets/images/cards/pork.png" },
        { name: "牛肉", imagePath: "../assets/images/cards/beef.png" },
        { name: "魚", imagePath: "../assets/images/cards/fish.png" },
        { name: "牛乳", imagePath: "../assets/images/cards/milk.png" },
        { name: "卵", imagePath: "../assets/images/cards/egg.png" },
        { name: "キャベツ", imagePath: "../assets/images/cards/cabbage.png" },
        { name: "にんじん", imagePath: "../assets/images/cards/carrot.png" },
        { name: "じゃがいも", imagePath: "../assets/images/cards/potato.png" },
        { name: "たまねぎ", imagePath: "../assets/images/cards/onion.png" },
        { name: "大根", imagePath: "../assets/images/cards/daikon.png" }
    ];
    const MEMORY_TOTAL_PAIRS = MEMORY_INGREDIENTS.length;

    const memoryState = {
        cards: [],
        running: false,
        finished: false,
        playerName: "",
        startAt: 0,
        elapsedMs: 0,
        firstId: null,
        lock: false,
        matchedPairs: 0,
        timerRafId: 0
    };

    function shuffleInPlace(array) {
        for (let i = array.length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    function buildMemoryCards() {
        const cards = [];
        MEMORY_INGREDIENTS.forEach((item) => {
            cards.push({
                id: `${item.name}-a`,
                pairKey: item.name,
                name: item.name,
                imagePath: item.imagePath,
                flipped: false,
                matched: false
            });
            cards.push({
                id: `${item.name}-b`,
                pairKey: item.name,
                name: item.name,
                imagePath: item.imagePath,
                flipped: false,
                matched: false
            });
        });
        return shuffleInPlace(cards);
    }

    function renderMemoryRanking() {
        if (!memoryRankingListEl) {
            return;
        }

        if (!memoryRankings.length) {
            memoryRankingListEl.innerHTML = "<li class=\"memory-ranking-empty\">まだスコアがありません。</li>";
            return;
        }

        const top = [...memoryRankings]
            .sort((a, b) => Number(a.timeMs) - Number(b.timeMs))
            .slice(0, 20);

        memoryRankingListEl.innerHTML = top.map((entry, index) => {
            const rank = index + 1;
            const name = escapeHtml(normalizeName(entry.name));
            const timeText = escapeHtml(formatDuration(Number(entry.timeMs)));
            const dateText = escapeHtml(formatDate(entry.finishedAt));
            return `<li>${rank}位 ${name} - ${timeText} <span class="reaction-meta">(${dateText})</span></li>`;
        }).join("");
    }

    function setMemoryStatus(text) {
        if (memoryStatusEl) {
            memoryStatusEl.textContent = text;
        }
    }

    function updateMemoryTimer() {
        if (memoryTimerEl) {
            memoryTimerEl.textContent = formatDuration(memoryState.elapsedMs);
        }
    }

    function stopMemoryTimerLoop() {
        if (memoryState.timerRafId) {
            window.cancelAnimationFrame(memoryState.timerRafId);
            memoryState.timerRafId = 0;
        }
    }

    function memoryTimerTick() {
        if (!memoryState.running) {
            return;
        }

        memoryState.elapsedMs = performance.now() - memoryState.startAt;
        updateMemoryTimer();
        memoryState.timerRafId = window.requestAnimationFrame(memoryTimerTick);
    }

    function renderMemoryBoard() {
        if (!memoryBoardEl) {
            return;
        }

        if (!memoryState.cards.length) {
            memoryBoardEl.innerHTML = "";
            return;
        }

        memoryBoardEl.innerHTML = memoryState.cards.map((card) => {
            const flippedClass = card.flipped ? " is-flipped" : "";
            const matchedClass = card.matched ? " is-matched" : "";
            const disabled = !memoryState.running || card.flipped || card.matched ? "disabled" : "";
            const safeName = escapeHtml(card.name);
            const safePath = escapeHtml(card.imagePath);
            const safeBack = escapeHtml(MEMORY_CARD_BACK_PATH);
            const safeId = escapeHtml(card.id);

            return `
                <button class="memory-card${flippedClass}${matchedClass}" type="button" data-memory-id="${safeId}" ${disabled} aria-label="${safeName}">
                    <span class="memory-card-inner">
                        <span class="memory-face back"><img src="${safeBack}" alt="カード裏面" loading="lazy"></span>
                        <span class="memory-face front"><img src="${safePath}" alt="${safeName}" loading="lazy"></span>
                    </span>
                </button>
            `;
        }).join("");
    }

    function resetMemoryGameToIdle() {
        stopMemoryTimerLoop();
        memoryState.cards = [];
        memoryState.running = false;
        memoryState.finished = false;
        memoryState.playerName = "";
        memoryState.startAt = 0;
        memoryState.elapsedMs = 0;
        memoryState.firstId = null;
        memoryState.lock = false;
        memoryState.matchedPairs = 0;
        updateMemoryTimer();
        renderMemoryBoard();
        setMemoryStatus("スタートを押すと開始します。");
    }

    function startMemoryGame() {
        const rawName = String(memoryNicknameInput?.value || "").trim();
        if (!rawName) {
            window.alert("ニックネームを入力してからスタートしてください。");
            return;
        }

        const nickname = normalizeName(rawName);
        stopMemoryTimerLoop();
        memoryState.cards = buildMemoryCards();
        memoryState.running = true;
        memoryState.finished = false;
        memoryState.playerName = nickname;
        memoryState.startAt = performance.now();
        memoryState.elapsedMs = 0;
        memoryState.firstId = null;
        memoryState.lock = false;
        memoryState.matchedPairs = 0;

        updateMemoryTimer();
        setMemoryStatus(`${nickname} さん、神経衰弱スタート！`);
        renderMemoryBoard();
        memoryState.timerRafId = window.requestAnimationFrame(memoryTimerTick);
    }

    function finishMemoryGame() {
        memoryState.running = false;
        memoryState.finished = true;
        stopMemoryTimerLoop();
        memoryState.elapsedMs = Math.max(0, Math.floor(memoryState.elapsedMs));
        updateMemoryTimer();

        setMemoryStatus(`クリア！ ${memoryState.playerName} さんのスコア: ${formatDuration(memoryState.elapsedMs)}`);

        memoryRankings.push({
            name: memoryState.playerName,
            timeMs: memoryState.elapsedMs,
            finishedAt: new Date().toISOString()
        });
        memoryRankings = memoryRankings
            .sort((a, b) => Number(a.timeMs) - Number(b.timeMs))
            .slice(0, 20);
        saveMemoryRankings();
        renderMemoryRanking();
    }

    function handleMemoryCardClick(cardId) {
        if (!memoryState.running || memoryState.lock) {
            return;
        }

        const card = memoryState.cards.find((item) => item.id === cardId);
        if (!card || card.flipped || card.matched) {
            return;
        }

        card.flipped = true;
        renderMemoryBoard();

        if (!memoryState.firstId) {
            memoryState.firstId = cardId;
            return;
        }

        const firstCard = memoryState.cards.find((item) => item.id === memoryState.firstId);
        const secondCard = card;
        memoryState.firstId = null;

        if (!firstCard || !secondCard) {
            return;
        }

        if (firstCard.pairKey === secondCard.pairKey) {
            firstCard.matched = true;
            secondCard.matched = true;
            memoryState.matchedPairs += 1;
            setMemoryStatus(`ナイス！ ${memoryState.matchedPairs}/${MEMORY_TOTAL_PAIRS} ペア成立`);
            renderMemoryBoard();

            if (memoryState.matchedPairs >= MEMORY_TOTAL_PAIRS) {
                finishMemoryGame();
            }
            return;
        }

        memoryState.lock = true;
        setMemoryStatus("不一致。次のペアを探そう。");
        window.setTimeout(() => {
            firstCard.flipped = false;
            secondCard.flipped = false;
            memoryState.lock = false;
            renderMemoryBoard();
        }, 700);
    }

    if (memoryBoardEl) {
        memoryBoardEl.addEventListener("click", (event) => {
            const target = event.target;
            if (!(target instanceof HTMLElement)) {
                return;
            }

            const button = target.closest("[data-memory-id]");
            if (!(button instanceof HTMLElement)) {
                return;
            }

            const cardId = button.dataset.memoryId;
            if (!cardId) {
                return;
            }

            handleMemoryCardClick(cardId);
        });
    }

    if (memoryStartButton) {
        memoryStartButton.addEventListener("click", startMemoryGame);
    }

    if (memoryResetButton) {
        memoryResetButton.addEventListener("click", resetMemoryGameToIdle);
    }

    updateAdminUI();
    renderArticles();
    renderGuestbook();
    resetTtt();
    resetMemoryGameToIdle();
    renderMemoryRanking();
})();
