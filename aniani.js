(() => {
    const STORAGE = {
        articles: "aniani_articles_v2",
        articleComments: "aniani_article_comments_v1",
        guestbook: "aniani_guestbook_comments_v1",
        adminSession: "aniani_admin_session_v1",
        memoryRanking: "aniani_memory_rankings_v1",
        reactionBest: "aniani_reaction_best_v1"
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
            body: "ミニゲームやポータル内機能の調整を予定しています。",
            createdAt: "2026-04-20T00:01:00+09:00"
        }
    ];
    const PAUSED_PROJECT_NAME = "\u5929\u6daf\u6bd4\u96a3";

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
    const moleBoardEl = document.getElementById("mole-board");
    const moleStatusEl = document.getElementById("mole-status");
    const moleTimeEl = document.getElementById("mole-time");
    const moleScoreEl = document.getElementById("mole-score");
    const moleStartButton = document.getElementById("mole-start");
    const moleResetButton = document.getElementById("mole-reset");
    const reactionTargetButton = document.getElementById("reaction-target");
    const reactionImageEl = document.getElementById("reaction-image");
    const reactionSignalEl = document.getElementById("reaction-signal");
    const reactionStatusEl = document.getElementById("reaction-status");
    const reactionBestEl = document.getElementById("reaction-best");
    const reactionStartButton = document.getElementById("reaction-start");
    const reactionResetButton = document.getElementById("reaction-reset");
    const breakoutCanvasEl = document.getElementById("breakout-canvas");
    const breakoutStatusEl = document.getElementById("breakout-status");
    const breakoutScoreEl = document.getElementById("breakout-score");
    const breakoutLivesEl = document.getElementById("breakout-lives");
    const breakoutStartButton = document.getElementById("breakout-start");
    const breakoutResetButton = document.getElementById("breakout-reset");
    const dropBoardEl = document.getElementById("drop-board");
    const dropStatusEl = document.getElementById("drop-status");
    const dropScoreEl = document.getElementById("drop-score");
    const dropStartButton = document.getElementById("drop-start");
    const dropResetButton = document.getElementById("drop-reset");
    const dropLeftButton = document.getElementById("drop-left");
    const dropRightButton = document.getElementById("drop-right");
    const dropDownButton = document.getElementById("drop-down");
    const snakeCanvasEl = document.getElementById("snake-canvas");
    const snakeStatusEl = document.getElementById("snake-status");
    const snakeScoreEl = document.getElementById("snake-score");
    const snakeStartButton = document.getElementById("snake-start");
    const snakeResetButton = document.getElementById("snake-reset");
    const snakeUpButton = document.getElementById("snake-up");
    const snakeLeftButton = document.getElementById("snake-left");
    const snakeDownButton = document.getElementById("snake-down");
    const snakeRightButton = document.getElementById("snake-right");
    const tetrisCanvasEl = document.getElementById("tetris-canvas");
    const tetrisStatusEl = document.getElementById("tetris-status");
    const tetrisScoreEl = document.getElementById("tetris-score");
    const tetrisLinesEl = document.getElementById("tetris-lines");
    const tetrisStartButton = document.getElementById("tetris-start");
    const tetrisResetButton = document.getElementById("tetris-reset");
    const tetrisLeftButton = document.getElementById("tetris-left");
    const tetrisRightButton = document.getElementById("tetris-right");
    const tetrisRotateButton = document.getElementById("tetris-rotate");
    const tetrisDownButton = document.getElementById("tetris-down");
    const miniTabsRoot = document.getElementById("mini-games-tabs");
    const miniTabButtons = miniTabsRoot
        ? Array.from(miniTabsRoot.querySelectorAll("[data-mini-tab]"))
        : [];
    const miniTabPanels = miniTabsRoot
        ? Array.from(miniTabsRoot.querySelectorAll("[data-mini-panel]"))
        : [];

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

    function loadNumber(key, fallback) {
        const raw = localStorage.getItem(key);
        if (raw === null) {
            return fallback;
        }
        const parsed = Number(raw);
        return Number.isFinite(parsed) ? parsed : fallback;
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

    function setActiveMiniGame(tabKey) {
        if (!miniTabsRoot || !tabKey) {
            return;
        }

        miniTabButtons.forEach((button) => {
            const active = button.dataset.miniTab === tabKey;
            button.classList.toggle("is-active", active);
            button.setAttribute("aria-selected", active ? "true" : "false");
            button.setAttribute("tabindex", active ? "0" : "-1");
        });

        miniTabPanels.forEach((panel) => {
            const active = panel.dataset.miniPanel === tabKey;
            panel.classList.toggle("is-active", active);
            panel.setAttribute("aria-hidden", active ? "false" : "true");
        });

        if (tabKey === "breakout") {
            window.setTimeout(() => {
                drawBreakout();
            }, 0);
            return;
        }
        if (tabKey === "snake") {
            window.setTimeout(() => {
                drawSnake();
            }, 0);
            return;
        }
        if (tabKey === "tetris") {
            window.setTimeout(() => {
                drawTetris();
            }, 0);
        }
    }

    function getActiveMiniGameKey() {
        const active = miniTabButtons.find((button) => button.classList.contains("is-active"));
        return String(active?.dataset.miniTab || "");
    }

    let articles = loadArray(STORAGE.articles, defaultArticles);
    let articleComments = loadObject(STORAGE.articleComments, {});
    let guestbookComments = loadArray(STORAGE.guestbook, []);
    let memoryRankings = loadArray(STORAGE.memoryRanking, []);
    let reactionBestMs = loadNumber(STORAGE.reactionBest, 0);
    let isAdmin = localStorage.getItem(STORAGE.adminSession) === "1";

    if (articles.some((item) => String(item.body || "").includes(PAUSED_PROJECT_NAME) || String(item.title || "").includes(PAUSED_PROJECT_NAME))) {
        articles = articles.map((item) => {
            const title = String(item.title || "");
            const body = String(item.body || "");
            if (!title.includes(PAUSED_PROJECT_NAME) && !body.includes(PAUSED_PROJECT_NAME)) {
                return item;
            }
            if (item.id === "seed-2") {
                return {
                    ...item,
                    body: "ミニゲームやポータル内機能の調整を予定しています。"
                };
            }
            return {
                ...item,
                title: title.replaceAll(PAUSED_PROJECT_NAME, "制作中プロジェクト"),
                body: body.replaceAll(PAUSED_PROJECT_NAME, "制作中プロジェクト")
            };
        });
        save(STORAGE.articles, articles);
    }

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

    const MEMORY_CARD_BACK_PATH = "assets/images/card-back.png";
    const MEMORY_INGREDIENTS = [
        { name: "ごはん", imagePath: "assets/images/cards/rice.png" },
        { name: "のり", imagePath: "assets/images/cards/nori.png" },
        { name: "バナナ", imagePath: "assets/images/cards/banana.png" },
        { name: "カレー粉", imagePath: "assets/images/cards/curry.png" },
        { name: "鶏肉", imagePath: "assets/images/cards/chicken.png" },
        { name: "豚肉", imagePath: "assets/images/cards/pork.png" },
        { name: "牛肉", imagePath: "assets/images/cards/beef.png" },
        { name: "魚", imagePath: "assets/images/cards/fish.png" },
        { name: "牛乳", imagePath: "assets/images/cards/milk.png" },
        { name: "卵", imagePath: "assets/images/cards/egg.png" },
        { name: "キャベツ", imagePath: "assets/images/cards/cabbage.png" },
        { name: "にんじん", imagePath: "assets/images/cards/carrot.png" },
        { name: "じゃがいも", imagePath: "assets/images/cards/potato.png" },
        { name: "たまねぎ", imagePath: "assets/images/cards/onion.png" },
        { name: "大根", imagePath: "assets/images/cards/daikon.png" }
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

    const MOLE_IMAGE_PATHS = [
        "assets/images/events/monomono-kokan.png",
        "assets/images/events/osouji.png",
        "assets/images/events/shokuzai-tansaku.png",
        "assets/images/events/yarinaoshi.png",
        "assets/images/events/bakugai.png"
    ];

    const moleState = {
        running: false,
        score: 0,
        remainingMs: 20000,
        activeIndex: -1,
        activeImagePath: MOLE_IMAGE_PATHS[0],
        countdownTimerId: 0,
        spawnTimerId: 0
    };

    function setMoleStatus(text) {
        if (moleStatusEl) {
            moleStatusEl.textContent = text;
        }
    }

    function updateMoleHud() {
        if (moleTimeEl) {
            moleTimeEl.textContent = (Math.max(0, moleState.remainingMs) / 1000).toFixed(1);
        }
        if (moleScoreEl) {
            moleScoreEl.textContent = String(moleState.score);
        }
    }

    function stopMoleTimers() {
        if (moleState.countdownTimerId) {
            window.clearInterval(moleState.countdownTimerId);
            moleState.countdownTimerId = 0;
        }
        if (moleState.spawnTimerId) {
            window.clearInterval(moleState.spawnTimerId);
            moleState.spawnTimerId = 0;
        }
    }

    function renderMoleBoard() {
        if (!moleBoardEl) {
            return;
        }

        const disabled = moleState.running ? "" : "disabled";
        moleBoardEl.innerHTML = Array.from({ length: 9 }, (_, index) => {
            const isActive = moleState.activeIndex === index;
            const activeClass = isActive ? " is-active" : "";
            const imagePath = isActive
                ? moleState.activeImagePath
                : MOLE_IMAGE_PATHS[index % MOLE_IMAGE_PATHS.length];
            const safePath = escapeHtml(imagePath);
            return `
                <button class="mole-hole${activeClass}" type="button" data-mole-index="${index}" ${disabled} aria-label="もぐら穴${index + 1}">
                    <img src="${safePath}" alt="もぐらたたきターゲット" loading="lazy">
                </button>
            `;
        }).join("");
    }

    function spawnMole() {
        if (!moleState.running) {
            return;
        }
        let next = Math.floor(Math.random() * 9);
        if (next === moleState.activeIndex) {
            next = (next + 1) % 9;
        }
        moleState.activeIndex = next;
        moleState.activeImagePath = MOLE_IMAGE_PATHS[Math.floor(Math.random() * MOLE_IMAGE_PATHS.length)];
        renderMoleBoard();
    }

    function finishMoleGame() {
        moleState.running = false;
        moleState.remainingMs = 0;
        moleState.activeIndex = -1;
        stopMoleTimers();
        updateMoleHud();
        renderMoleBoard();
        setMoleStatus(`終了！ スコア ${moleState.score}`);
    }

    function startMoleGame() {
        moleState.running = true;
        moleState.score = 0;
        moleState.remainingMs = 20000;
        moleState.activeIndex = -1;
        stopMoleTimers();
        updateMoleHud();
        setMoleStatus("20秒スタート！");
        spawnMole();

        moleState.countdownTimerId = window.setInterval(() => {
            moleState.remainingMs -= 100;
            if (moleState.remainingMs <= 0) {
                finishMoleGame();
                return;
            }
            updateMoleHud();
        }, 100);

        moleState.spawnTimerId = window.setInterval(() => {
            spawnMole();
        }, 650);
    }

    function resetMoleGame() {
        moleState.running = false;
        moleState.score = 0;
        moleState.remainingMs = 20000;
        moleState.activeIndex = -1;
        stopMoleTimers();
        updateMoleHud();
        renderMoleBoard();
        setMoleStatus("スタートで開始します。");
    }

    if (moleBoardEl) {
        moleBoardEl.addEventListener("click", (event) => {
            const target = event.target;
            if (!(target instanceof HTMLElement)) {
                return;
            }
            const button = target.closest("[data-mole-index]");
            if (!(button instanceof HTMLElement) || !moleState.running) {
                return;
            }

            const index = Number(button.dataset.moleIndex);
            if (Number.isNaN(index)) {
                return;
            }

            if (index === moleState.activeIndex) {
                moleState.score += 1;
                updateMoleHud();
                setMoleStatus("ヒット！");
                spawnMole();
            }
        });
    }

    if (moleStartButton) {
        moleStartButton.addEventListener("click", startMoleGame);
    }

    if (moleResetButton) {
        moleResetButton.addEventListener("click", resetMoleGame);
    }

    const REACTION_WAIT_IMAGES = [
        "assets/images/character-icons/akatsuki-icons.png",
        "assets/images/character-icons/chizuru-icons.png",
        "assets/images/character-icons/mai-icons.png",
        "assets/images/character-icons/takumi-icons.png"
    ];
    const REACTION_READY_IMAGES = [
        "assets/images/skill-cutins/akatsuki-skill-cutin.png",
        "assets/images/skill-cutins/chizuru-skill-cutin.png",
        "assets/images/skill-cutins/mai-skill-cutin.png",
        "assets/images/skill-cutins/takumi-skill-cutin.png"
    ];

    const reactionState = {
        running: false,
        ready: false,
        readyAt: 0,
        timerId: 0
    };

    function setReactionStatus(text) {
        if (reactionStatusEl) {
            reactionStatusEl.textContent = text;
        }
    }

    function renderReactionBest() {
        if (!reactionBestEl) {
            return;
        }
        reactionBestEl.textContent = reactionBestMs > 0 ? `${reactionBestMs} ms` : "-- ms";
    }

    function setReactionVisual(mode) {
        if (!reactionTargetButton || !reactionImageEl || !reactionSignalEl) {
            return;
        }

        reactionTargetButton.classList.remove("is-wait", "is-ready");
        if (mode === "wait") {
            reactionTargetButton.classList.add("is-wait");
            reactionSignalEl.textContent = "WAIT";
            reactionImageEl.src = REACTION_WAIT_IMAGES[Math.floor(Math.random() * REACTION_WAIT_IMAGES.length)];
            return;
        }
        if (mode === "ready") {
            reactionTargetButton.classList.add("is-ready");
            reactionSignalEl.textContent = "TAP!";
            reactionImageEl.src = REACTION_READY_IMAGES[Math.floor(Math.random() * REACTION_READY_IMAGES.length)];
            return;
        }

        reactionSignalEl.textContent = "READY";
        reactionImageEl.src = REACTION_WAIT_IMAGES[0];
    }

    function clearReactionTimer() {
        if (reactionState.timerId) {
            window.clearTimeout(reactionState.timerId);
            reactionState.timerId = 0;
        }
    }

    function startReactionTest() {
        clearReactionTimer();
        reactionState.running = true;
        reactionState.ready = false;
        reactionState.readyAt = 0;
        setReactionVisual("wait");
        setReactionStatus("合図が出るまで待ってください。");

        const delay = 1400 + Math.floor(Math.random() * 2600);
        reactionState.timerId = window.setTimeout(() => {
            reactionState.ready = true;
            reactionState.readyAt = performance.now();
            setReactionVisual("ready");
            setReactionStatus("今だ！ すぐクリック！");
            reactionState.timerId = 0;
        }, delay);
    }

    function resetReactionTest() {
        clearReactionTimer();
        reactionState.running = false;
        reactionState.ready = false;
        reactionState.readyAt = 0;
        setReactionVisual("idle");
        setReactionStatus("スタートで準備開始。");
        renderReactionBest();
    }

    function handleReactionTap() {
        if (!reactionState.running) {
            setReactionStatus("スタートを押してから挑戦してください。");
            return;
        }

        if (!reactionState.ready) {
            clearReactionTimer();
            reactionState.running = false;
            setReactionVisual("idle");
            setReactionStatus("フライング！ もう一度スタート。");
            return;
        }

        const elapsed = Math.max(0, Math.floor(performance.now() - reactionState.readyAt));
        reactionState.running = false;
        reactionState.ready = false;
        setReactionVisual("idle");
        setReactionStatus(`反応速度: ${elapsed} ms`);

        if (!reactionBestMs || elapsed < reactionBestMs) {
            reactionBestMs = elapsed;
            localStorage.setItem(STORAGE.reactionBest, String(reactionBestMs));
            setReactionStatus(`新記録！ 反応速度: ${elapsed} ms`);
        }
        renderReactionBest();
    }

    if (reactionStartButton) {
        reactionStartButton.addEventListener("click", startReactionTest);
    }

    if (reactionResetButton) {
        reactionResetButton.addEventListener("click", resetReactionTest);
    }

    if (reactionTargetButton) {
        reactionTargetButton.addEventListener("click", handleReactionTap);
    }

    const breakoutCtx = breakoutCanvasEl ? breakoutCanvasEl.getContext("2d") : null;
    const BREAKOUT_COLS = 7;
    const BREAKOUT_ROWS = 4;
    const BREAKOUT_PADDLE_WIDTH = 86;
    const BREAKOUT_PADDLE_HEIGHT = 12;
    const BREAKOUT_BALL_RADIUS = 7;
    const BREAKOUT_BRICK_IMAGES = [
        "assets/images/recipes/chahan.png",
        "assets/images/recipes/curry-rice.png",
        "assets/images/recipes/omurice.png",
        "assets/images/recipes/nikujaga.png",
        "assets/images/recipes/yasai-itame.png",
        "assets/images/recipes/hamburg-steak.png",
        "assets/images/recipes/cream-stew.png",
        "assets/images/recipes/onigiri.png"
    ].map((path) => {
        const image = new Image();
        image.src = path;
        return image;
    });

    const breakoutState = {
        running: false,
        rafId: 0,
        score: 0,
        lives: 3,
        paddleX: 0,
        ballX: 0,
        ballY: 0,
        ballVx: 2.8,
        ballVy: -2.8,
        bricks: []
    };

    function setBreakoutStatus(text) {
        if (breakoutStatusEl) {
            breakoutStatusEl.textContent = text;
        }
    }

    function updateBreakoutHud() {
        if (breakoutScoreEl) {
            breakoutScoreEl.textContent = String(breakoutState.score);
        }
        if (breakoutLivesEl) {
            breakoutLivesEl.textContent = String(breakoutState.lives);
        }
    }

    function stopBreakoutLoop() {
        if (breakoutState.rafId) {
            window.cancelAnimationFrame(breakoutState.rafId);
            breakoutState.rafId = 0;
        }
    }

    function createBreakoutBricks() {
        if (!breakoutCanvasEl) {
            return [];
        }
        const gap = 6;
        const top = 28;
        const left = 18;
        const width = (breakoutCanvasEl.width - left * 2 - gap * (BREAKOUT_COLS - 1)) / BREAKOUT_COLS;
        const height = 24;
        const bricks = [];
        let imageIndex = 0;

        for (let row = 0; row < BREAKOUT_ROWS; row += 1) {
            for (let col = 0; col < BREAKOUT_COLS; col += 1) {
                bricks.push({
                    x: left + col * (width + gap),
                    y: top + row * (height + gap),
                    width,
                    height,
                    alive: true,
                    image: BREAKOUT_BRICK_IMAGES[imageIndex % BREAKOUT_BRICK_IMAGES.length]
                });
                imageIndex += 1;
            }
        }

        return bricks;
    }

    function resetBreakoutBall() {
        if (!breakoutCanvasEl) {
            return;
        }
        breakoutState.ballX = breakoutCanvasEl.width / 2;
        breakoutState.ballY = breakoutCanvasEl.height - 42;
        breakoutState.ballVx = (Math.random() > 0.5 ? 1 : -1) * (2.1 + Math.random() * 1.2);
        breakoutState.ballVy = -2.8;
    }

    function drawBreakout() {
        if (!breakoutCtx || !breakoutCanvasEl) {
            return;
        }

        breakoutCtx.clearRect(0, 0, breakoutCanvasEl.width, breakoutCanvasEl.height);

        breakoutState.bricks.forEach((brick) => {
            if (!brick.alive) {
                return;
            }

            breakoutCtx.save();
            breakoutCtx.beginPath();
            breakoutCtx.rect(brick.x, brick.y, brick.width, brick.height);
            breakoutCtx.clip();
            if (brick.image && brick.image.complete) {
                breakoutCtx.drawImage(brick.image, brick.x, brick.y, brick.width, brick.height);
            } else {
                breakoutCtx.fillStyle = "rgba(255, 194, 74, 0.45)";
                breakoutCtx.fillRect(brick.x, brick.y, brick.width, brick.height);
            }
            breakoutCtx.restore();
            breakoutCtx.strokeStyle = "rgba(168, 210, 255, 0.45)";
            breakoutCtx.lineWidth = 1;
            breakoutCtx.strokeRect(brick.x, brick.y, brick.width, brick.height);
        });

        const paddleY = breakoutCanvasEl.height - 20;
        breakoutCtx.fillStyle = "#f4c36f";
        breakoutCtx.fillRect(
            breakoutState.paddleX,
            paddleY,
            BREAKOUT_PADDLE_WIDTH,
            BREAKOUT_PADDLE_HEIGHT
        );

        breakoutCtx.beginPath();
        breakoutCtx.arc(
            breakoutState.ballX,
            breakoutState.ballY,
            BREAKOUT_BALL_RADIUS,
            0,
            Math.PI * 2
        );
        breakoutCtx.fillStyle = "#f3f9ff";
        breakoutCtx.fill();
        breakoutCtx.closePath();
    }

    function resetBreakoutGame() {
        stopBreakoutLoop();
        breakoutState.running = false;
        breakoutState.score = 0;
        breakoutState.lives = 3;
        breakoutState.bricks = createBreakoutBricks();
        if (breakoutCanvasEl) {
            breakoutState.paddleX = (breakoutCanvasEl.width - BREAKOUT_PADDLE_WIDTH) / 2;
        }
        resetBreakoutBall();
        updateBreakoutHud();
        setBreakoutStatus("スタートで開始。");
        drawBreakout();
    }

    function finishBreakout(resultText) {
        breakoutState.running = false;
        stopBreakoutLoop();
        setBreakoutStatus(resultText);
        drawBreakout();
    }

    function breakoutFrame() {
        if (!breakoutState.running || !breakoutCanvasEl) {
            return;
        }

        const width = breakoutCanvasEl.width;
        const height = breakoutCanvasEl.height;
        const paddleY = height - 20;

        breakoutState.ballX += breakoutState.ballVx;
        breakoutState.ballY += breakoutState.ballVy;

        if (breakoutState.ballX - BREAKOUT_BALL_RADIUS <= 0 || breakoutState.ballX + BREAKOUT_BALL_RADIUS >= width) {
            breakoutState.ballVx *= -1;
            breakoutState.ballX = Math.min(
                width - BREAKOUT_BALL_RADIUS,
                Math.max(BREAKOUT_BALL_RADIUS, breakoutState.ballX)
            );
        }

        if (breakoutState.ballY - BREAKOUT_BALL_RADIUS <= 0) {
            breakoutState.ballVy = Math.abs(breakoutState.ballVy);
            breakoutState.ballY = BREAKOUT_BALL_RADIUS;
        }

        if (
            breakoutState.ballVy > 0 &&
            breakoutState.ballY + BREAKOUT_BALL_RADIUS >= paddleY &&
            breakoutState.ballY - BREAKOUT_BALL_RADIUS <= paddleY + BREAKOUT_PADDLE_HEIGHT &&
            breakoutState.ballX >= breakoutState.paddleX &&
            breakoutState.ballX <= breakoutState.paddleX + BREAKOUT_PADDLE_WIDTH
        ) {
            breakoutState.ballY = paddleY - BREAKOUT_BALL_RADIUS;
            breakoutState.ballVy = -Math.abs(breakoutState.ballVy);
            const offset = (breakoutState.ballX - (breakoutState.paddleX + BREAKOUT_PADDLE_WIDTH / 2)) / (BREAKOUT_PADDLE_WIDTH / 2);
            breakoutState.ballVx = offset * 4.4;
        }

        for (const brick of breakoutState.bricks) {
            if (!brick.alive) {
                continue;
            }

            const hitX = breakoutState.ballX + BREAKOUT_BALL_RADIUS >= brick.x &&
                breakoutState.ballX - BREAKOUT_BALL_RADIUS <= brick.x + brick.width;
            const hitY = breakoutState.ballY + BREAKOUT_BALL_RADIUS >= brick.y &&
                breakoutState.ballY - BREAKOUT_BALL_RADIUS <= brick.y + brick.height;

            if (hitX && hitY) {
                brick.alive = false;
                breakoutState.ballVy *= -1;
                breakoutState.score += 10;
                updateBreakoutHud();
                break;
            }
        }

        if (!breakoutState.bricks.some((brick) => brick.alive)) {
            finishBreakout("クリア！ 全ブロック破壊！");
            return;
        }

        if (breakoutState.ballY - BREAKOUT_BALL_RADIUS > height) {
            breakoutState.lives -= 1;
            updateBreakoutHud();
            if (breakoutState.lives <= 0) {
                finishBreakout("ゲームオーバー。リセットで再挑戦。");
                return;
            }
            resetBreakoutBall();
            setBreakoutStatus("ミス！ 続行します。");
        }

        drawBreakout();
        breakoutState.rafId = window.requestAnimationFrame(breakoutFrame);
    }

    function startBreakoutGame() {
        if (breakoutState.running) {
            return;
        }
        if (!breakoutState.bricks.length || !breakoutState.bricks.some((brick) => brick.alive)) {
            breakoutState.bricks = createBreakoutBricks();
            breakoutState.score = 0;
            breakoutState.lives = 3;
            updateBreakoutHud();
            resetBreakoutBall();
        }
        breakoutState.running = true;
        setBreakoutStatus("プレイ中");
        breakoutState.rafId = window.requestAnimationFrame(breakoutFrame);
    }

    function setBreakoutPaddleByClientX(clientX) {
        if (!breakoutCanvasEl) {
            return;
        }
        const rect = breakoutCanvasEl.getBoundingClientRect();
        if (!rect.width) {
            return;
        }
        const localX = (clientX - rect.left) * (breakoutCanvasEl.width / rect.width);
        const next = localX - BREAKOUT_PADDLE_WIDTH / 2;
        breakoutState.paddleX = Math.max(
            0,
            Math.min(breakoutCanvasEl.width - BREAKOUT_PADDLE_WIDTH, next)
        );
        if (!breakoutState.running) {
            drawBreakout();
        }
    }

    if (breakoutStartButton) {
        breakoutStartButton.addEventListener("click", startBreakoutGame);
    }

    if (breakoutResetButton) {
        breakoutResetButton.addEventListener("click", resetBreakoutGame);
    }

    if (breakoutCanvasEl) {
        breakoutCanvasEl.addEventListener("mousemove", (event) => {
            setBreakoutPaddleByClientX(event.clientX);
        });

        breakoutCanvasEl.addEventListener("touchmove", (event) => {
            if (!event.touches[0]) {
                return;
            }
            setBreakoutPaddleByClientX(event.touches[0].clientX);
            event.preventDefault();
        }, { passive: false });
    }

    const snakeCtx = snakeCanvasEl ? snakeCanvasEl.getContext("2d") : null;
    const SNAKE_COLS = 15;
    const SNAKE_ROWS = 15;
    const snakeState = {
        running: false,
        timerId: 0,
        snake: [],
        dir: { x: 1, y: 0 },
        nextDir: { x: 1, y: 0 },
        food: { x: 10, y: 7 },
        score: 0
    };

    function setSnakeStatus(text) {
        if (snakeStatusEl) {
            snakeStatusEl.textContent = text;
        }
    }

    function updateSnakeHud() {
        if (snakeScoreEl) {
            snakeScoreEl.textContent = String(snakeState.score);
        }
    }

    function stopSnakeLoop() {
        if (snakeState.timerId) {
            window.clearInterval(snakeState.timerId);
            snakeState.timerId = 0;
        }
    }

    function spawnSnakeFood() {
        if (!snakeState.snake.length) {
            snakeState.food = { x: 7, y: 7 };
            return;
        }

        let next = { x: 0, y: 0 };
        let guard = 0;
        do {
            next = {
                x: Math.floor(Math.random() * SNAKE_COLS),
                y: Math.floor(Math.random() * SNAKE_ROWS)
            };
            guard += 1;
            if (guard > 300) {
                break;
            }
        } while (snakeState.snake.some((part) => part.x === next.x && part.y === next.y));

        snakeState.food = next;
    }

    function drawSnake() {
        if (!snakeCtx || !snakeCanvasEl) {
            return;
        }

        const cellW = snakeCanvasEl.width / SNAKE_COLS;
        const cellH = snakeCanvasEl.height / SNAKE_ROWS;
        snakeCtx.clearRect(0, 0, snakeCanvasEl.width, snakeCanvasEl.height);

        snakeCtx.fillStyle = "rgba(6, 18, 38, 0.95)";
        snakeCtx.fillRect(0, 0, snakeCanvasEl.width, snakeCanvasEl.height);

        snakeCtx.strokeStyle = "rgba(136, 178, 242, 0.16)";
        snakeCtx.lineWidth = 1;
        for (let x = 1; x < SNAKE_COLS; x += 1) {
            snakeCtx.beginPath();
            snakeCtx.moveTo(x * cellW, 0);
            snakeCtx.lineTo(x * cellW, snakeCanvasEl.height);
            snakeCtx.stroke();
        }
        for (let y = 1; y < SNAKE_ROWS; y += 1) {
            snakeCtx.beginPath();
            snakeCtx.moveTo(0, y * cellH);
            snakeCtx.lineTo(snakeCanvasEl.width, y * cellH);
            snakeCtx.stroke();
        }

        snakeCtx.fillStyle = "#ffd975";
        snakeCtx.fillRect(
            snakeState.food.x * cellW + 2,
            snakeState.food.y * cellH + 2,
            cellW - 4,
            cellH - 4
        );

        snakeState.snake.forEach((part, index) => {
            snakeCtx.fillStyle = index === 0 ? "#9de6ff" : "#57b6ff";
            snakeCtx.fillRect(part.x * cellW + 2, part.y * cellH + 2, cellW - 4, cellH - 4);
        });
    }

    function resetSnakeGame() {
        stopSnakeLoop();
        snakeState.running = false;
        snakeState.snake = [
            { x: 7, y: 7 },
            { x: 6, y: 7 },
            { x: 5, y: 7 }
        ];
        snakeState.dir = { x: 1, y: 0 };
        snakeState.nextDir = { x: 1, y: 0 };
        snakeState.score = 0;
        spawnSnakeFood();
        updateSnakeHud();
        setSnakeStatus("スタートで開始。");
        drawSnake();
    }

    function setSnakeDirection(dx, dy) {
        if (!snakeState.running) {
            return;
        }
        const oppositeX = snakeState.dir.x * -1;
        const oppositeY = snakeState.dir.y * -1;
        if (dx === oppositeX && dy === oppositeY) {
            return;
        }
        snakeState.nextDir = { x: dx, y: dy };
    }

    function endSnakeGame() {
        snakeState.running = false;
        stopSnakeLoop();
        setSnakeStatus(`ゲームオーバー。スコア ${snakeState.score}`);
        drawSnake();
    }

    function snakeTick() {
        if (!snakeState.running || !snakeState.snake.length) {
            return;
        }

        snakeState.dir = { ...snakeState.nextDir };
        const head = snakeState.snake[0];
        const nextHead = {
            x: head.x + snakeState.dir.x,
            y: head.y + snakeState.dir.y
        };

        if (nextHead.x < 0 || nextHead.x >= SNAKE_COLS || nextHead.y < 0 || nextHead.y >= SNAKE_ROWS) {
            endSnakeGame();
            return;
        }

        const hitSelf = snakeState.snake.some((part) => part.x === nextHead.x && part.y === nextHead.y);
        if (hitSelf) {
            endSnakeGame();
            return;
        }

        snakeState.snake.unshift(nextHead);

        if (nextHead.x === snakeState.food.x && nextHead.y === snakeState.food.y) {
            snakeState.score += 10;
            spawnSnakeFood();
            setSnakeStatus("ナイス！ 食べた！");
        } else {
            snakeState.snake.pop();
            setSnakeStatus("プレイ中");
        }

        updateSnakeHud();
        drawSnake();
    }

    function startSnakeGame() {
        resetSnakeGame();
        snakeState.running = true;
        setSnakeStatus("プレイ中");
        snakeState.timerId = window.setInterval(snakeTick, 125);
    }

    if (snakeStartButton) {
        snakeStartButton.addEventListener("click", startSnakeGame);
    }

    if (snakeResetButton) {
        snakeResetButton.addEventListener("click", resetSnakeGame);
    }

    if (snakeUpButton) {
        snakeUpButton.addEventListener("click", () => setSnakeDirection(0, -1));
    }
    if (snakeLeftButton) {
        snakeLeftButton.addEventListener("click", () => setSnakeDirection(-1, 0));
    }
    if (snakeDownButton) {
        snakeDownButton.addEventListener("click", () => setSnakeDirection(0, 1));
    }
    if (snakeRightButton) {
        snakeRightButton.addEventListener("click", () => setSnakeDirection(1, 0));
    }

    const tetrisCtx = tetrisCanvasEl ? tetrisCanvasEl.getContext("2d") : null;
    const TETRIS_COLS = 10;
    const TETRIS_ROWS = 18;
    const TETRIS_COLORS = [
        "",
        "#6bd4ff",
        "#ffd26f",
        "#c18aff",
        "#ff8a8a",
        "#79f0b6",
        "#8fb2ff",
        "#ffb47f"
    ];
    const TETRIS_SHAPES = [
        [[1, 1, 1, 1]],
        [[1, 1], [1, 1]],
        [[0, 1, 0], [1, 1, 1]],
        [[1, 0, 0], [1, 1, 1]],
        [[0, 0, 1], [1, 1, 1]],
        [[0, 1, 1], [1, 1, 0]],
        [[1, 1, 0], [0, 1, 1]]
    ];

    const tetrisState = {
        running: false,
        timerId: 0,
        board: [],
        piece: null,
        score: 0,
        lines: 0
    };

    function setTetrisStatus(text) {
        if (tetrisStatusEl) {
            tetrisStatusEl.textContent = text;
        }
    }

    function updateTetrisHud() {
        if (tetrisScoreEl) {
            tetrisScoreEl.textContent = String(tetrisState.score);
        }
        if (tetrisLinesEl) {
            tetrisLinesEl.textContent = String(tetrisState.lines);
        }
    }

    function stopTetrisLoop() {
        if (tetrisState.timerId) {
            window.clearInterval(tetrisState.timerId);
            tetrisState.timerId = 0;
        }
    }

    function createTetrisBoard() {
        return Array.from({ length: TETRIS_ROWS }, () => Array(TETRIS_COLS).fill(0));
    }

    function cloneMatrix(matrix) {
        return matrix.map((row) => [...row]);
    }

    function rotateMatrixCW(matrix) {
        const h = matrix.length;
        const w = matrix[0].length;
        const rotated = Array.from({ length: w }, () => Array(h).fill(0));
        for (let y = 0; y < h; y += 1) {
            for (let x = 0; x < w; x += 1) {
                rotated[x][h - 1 - y] = matrix[y][x];
            }
        }
        return rotated;
    }

    function randomTetrisPiece() {
        const index = Math.floor(Math.random() * TETRIS_SHAPES.length);
        const shape = cloneMatrix(TETRIS_SHAPES[index]);
        return {
            shape,
            x: Math.floor((TETRIS_COLS - shape[0].length) / 2),
            y: 0,
            color: index + 1
        };
    }

    function canPlaceTetris(shape, x, y) {
        for (let row = 0; row < shape.length; row += 1) {
            for (let col = 0; col < shape[row].length; col += 1) {
                if (!shape[row][col]) {
                    continue;
                }
                const nx = x + col;
                const ny = y + row;
                if (nx < 0 || nx >= TETRIS_COLS || ny < 0 || ny >= TETRIS_ROWS) {
                    return false;
                }
                if (tetrisState.board[ny][nx]) {
                    return false;
                }
            }
        }
        return true;
    }

    function drawTetrisCell(x, y, colorIndex) {
        if (!tetrisCtx || !tetrisCanvasEl) {
            return;
        }
        const cellW = tetrisCanvasEl.width / TETRIS_COLS;
        const cellH = tetrisCanvasEl.height / TETRIS_ROWS;
        const color = TETRIS_COLORS[colorIndex] || "#6bd4ff";
        tetrisCtx.fillStyle = color;
        tetrisCtx.fillRect(x * cellW + 1, y * cellH + 1, cellW - 2, cellH - 2);
        tetrisCtx.strokeStyle = "rgba(255, 255, 255, 0.15)";
        tetrisCtx.lineWidth = 1;
        tetrisCtx.strokeRect(x * cellW + 1, y * cellH + 1, cellW - 2, cellH - 2);
    }

    function drawTetris() {
        if (!tetrisCtx || !tetrisCanvasEl) {
            return;
        }
        tetrisCtx.clearRect(0, 0, tetrisCanvasEl.width, tetrisCanvasEl.height);
        tetrisCtx.fillStyle = "rgba(5, 16, 34, 0.95)";
        tetrisCtx.fillRect(0, 0, tetrisCanvasEl.width, tetrisCanvasEl.height);

        for (let y = 0; y < TETRIS_ROWS; y += 1) {
            for (let x = 0; x < TETRIS_COLS; x += 1) {
                const color = tetrisState.board[y][x];
                if (color) {
                    drawTetrisCell(x, y, color);
                }
            }
        }

        if (tetrisState.piece) {
            const { shape, x, y, color } = tetrisState.piece;
            for (let row = 0; row < shape.length; row += 1) {
                for (let col = 0; col < shape[row].length; col += 1) {
                    if (!shape[row][col]) {
                        continue;
                    }
                    drawTetrisCell(x + col, y + row, color);
                }
            }
        }
    }

    function mergeTetrisPiece() {
        if (!tetrisState.piece) {
            return;
        }
        const { shape, x, y, color } = tetrisState.piece;
        for (let row = 0; row < shape.length; row += 1) {
            for (let col = 0; col < shape[row].length; col += 1) {
                if (!shape[row][col]) {
                    continue;
                }
                const ny = y + row;
                const nx = x + col;
                if (ny >= 0 && ny < TETRIS_ROWS && nx >= 0 && nx < TETRIS_COLS) {
                    tetrisState.board[ny][nx] = color;
                }
            }
        }
    }

    function clearTetrisLines() {
        let cleared = 0;
        for (let y = TETRIS_ROWS - 1; y >= 0; y -= 1) {
            if (tetrisState.board[y].every(Boolean)) {
                tetrisState.board.splice(y, 1);
                tetrisState.board.unshift(Array(TETRIS_COLS).fill(0));
                cleared += 1;
                y += 1;
            }
        }
        if (cleared > 0) {
            tetrisState.lines += cleared;
            tetrisState.score += cleared * cleared * 100;
            updateTetrisHud();
            setTetrisStatus(`${cleared} ライン消去！`);
        }
    }

    function spawnTetrisPiece() {
        tetrisState.piece = randomTetrisPiece();
        if (!canPlaceTetris(tetrisState.piece.shape, tetrisState.piece.x, tetrisState.piece.y)) {
            tetrisState.running = false;
            stopTetrisLoop();
            setTetrisStatus(`ゲームオーバー。スコア ${tetrisState.score}`);
            drawTetris();
            return false;
        }
        return true;
    }

    function moveTetris(dx, dy) {
        if (!tetrisState.piece) {
            return false;
        }
        const nextX = tetrisState.piece.x + dx;
        const nextY = tetrisState.piece.y + dy;
        if (!canPlaceTetris(tetrisState.piece.shape, nextX, nextY)) {
            return false;
        }
        tetrisState.piece.x = nextX;
        tetrisState.piece.y = nextY;
        return true;
    }

    function rotateTetris() {
        if (!tetrisState.piece) {
            return;
        }
        const rotated = rotateMatrixCW(tetrisState.piece.shape);
        const tryOffsets = [0, -1, 1];
        for (const offset of tryOffsets) {
            const nx = tetrisState.piece.x + offset;
            if (canPlaceTetris(rotated, nx, tetrisState.piece.y)) {
                tetrisState.piece.shape = rotated;
                tetrisState.piece.x = nx;
                break;
            }
        }
        drawTetris();
    }

    function tetrisTick() {
        if (!tetrisState.running) {
            return;
        }
        if (moveTetris(0, 1)) {
            drawTetris();
            return;
        }
        mergeTetrisPiece();
        clearTetrisLines();
        if (!spawnTetrisPiece()) {
            return;
        }
        setTetrisStatus("プレイ中");
        drawTetris();
    }

    function resetTetrisGame() {
        stopTetrisLoop();
        tetrisState.running = false;
        tetrisState.board = createTetrisBoard();
        tetrisState.piece = randomTetrisPiece();
        tetrisState.score = 0;
        tetrisState.lines = 0;
        updateTetrisHud();
        setTetrisStatus("スタートで開始。");
        drawTetris();
    }

    function startTetrisGame() {
        resetTetrisGame();
        tetrisState.running = true;
        setTetrisStatus("プレイ中");
        tetrisState.timerId = window.setInterval(tetrisTick, 450);
    }

    if (tetrisStartButton) {
        tetrisStartButton.addEventListener("click", startTetrisGame);
    }
    if (tetrisResetButton) {
        tetrisResetButton.addEventListener("click", resetTetrisGame);
    }
    if (tetrisLeftButton) {
        tetrisLeftButton.addEventListener("click", () => {
            if (!tetrisState.running) {
                return;
            }
            moveTetris(-1, 0);
            drawTetris();
        });
    }
    if (tetrisRightButton) {
        tetrisRightButton.addEventListener("click", () => {
            if (!tetrisState.running) {
                return;
            }
            moveTetris(1, 0);
            drawTetris();
        });
    }
    if (tetrisRotateButton) {
        tetrisRotateButton.addEventListener("click", () => {
            if (!tetrisState.running) {
                return;
            }
            rotateTetris();
        });
    }
    if (tetrisDownButton) {
        tetrisDownButton.addEventListener("click", () => {
            if (!tetrisState.running) {
                return;
            }
            tetrisTick();
        });
    }

    const DROP_ROWS = 10;
    const DROP_COLS = 6;
    const DROP_IMAGE_PATHS = [
        "assets/images/cards/rice.png",
        "assets/images/cards/nori.png",
        "assets/images/cards/banana.png",
        "assets/images/cards/curry.png",
        "assets/images/cards/chicken.png",
        "assets/images/cards/egg.png"
    ];

    const dropState = {
        running: false,
        timerId: 0,
        board: [],
        current: null,
        score: 0
    };

    function setDropStatus(text) {
        if (dropStatusEl) {
            dropStatusEl.textContent = text;
        }
    }

    function updateDropScore() {
        if (dropScoreEl) {
            dropScoreEl.textContent = String(dropState.score);
        }
    }

    function stopDropLoop() {
        if (dropState.timerId) {
            window.clearInterval(dropState.timerId);
            dropState.timerId = 0;
        }
    }

    function createDropEmptyBoard() {
        return Array.from({ length: DROP_ROWS }, () => Array(DROP_COLS).fill(null));
    }

    function renderDropBoard() {
        if (!dropBoardEl) {
            return;
        }

        const cells = [];
        for (let row = 0; row < DROP_ROWS; row += 1) {
            for (let col = 0; col < DROP_COLS; col += 1) {
                let typeIndex = dropState.board[row]?.[col] ?? null;
                let fallingClass = "";
                if (
                    dropState.current &&
                    dropState.current.x === col &&
                    dropState.current.y === row
                ) {
                    typeIndex = dropState.current.type;
                    fallingClass = " is-falling";
                }

                if (typeIndex === null || typeIndex === undefined) {
                    cells.push("<div class=\"drop-cell\"></div>");
                } else {
                    const path = escapeHtml(DROP_IMAGE_PATHS[typeIndex]);
                    cells.push(`<div class="drop-cell${fallingClass}"><img src="${path}" alt="落ちものブロック" loading="lazy"></div>`);
                }
            }
        }

        dropBoardEl.innerHTML = cells.join("");
    }

    function canPlaceDropPiece(x, y) {
        if (x < 0 || x >= DROP_COLS || y < 0 || y >= DROP_ROWS) {
            return false;
        }
        return dropState.board[y][x] === null;
    }

    function spawnDropPiece() {
        const type = Math.floor(Math.random() * DROP_IMAGE_PATHS.length);
        const x = Math.floor(DROP_COLS / 2);
        const y = 0;
        if (!canPlaceDropPiece(x, y)) {
            return false;
        }
        dropState.current = { x, y, type };
        return true;
    }

    function moveDropPiece(dx, dy) {
        if (!dropState.current) {
            return false;
        }
        const nextX = dropState.current.x + dx;
        const nextY = dropState.current.y + dy;
        if (!canPlaceDropPiece(nextX, nextY)) {
            return false;
        }
        dropState.current.x = nextX;
        dropState.current.y = nextY;
        return true;
    }

    function lockDropPiece() {
        if (!dropState.current) {
            return;
        }
        const { x, y, type } = dropState.current;
        if (y >= 0 && y < DROP_ROWS && x >= 0 && x < DROP_COLS) {
            dropState.board[y][x] = type;
        }
        dropState.current = null;
    }

    function findDropMatches() {
        const matched = new Set();

        for (let row = 0; row < DROP_ROWS; row += 1) {
            let runType = null;
            let runStart = 0;
            for (let col = 0; col <= DROP_COLS; col += 1) {
                const type = col < DROP_COLS ? dropState.board[row][col] : null;
                if (type === runType && type !== null) {
                    continue;
                }
                if (runType !== null && col - runStart >= 3) {
                    for (let x = runStart; x < col; x += 1) {
                        matched.add(`${row}:${x}`);
                    }
                }
                runType = type;
                runStart = col;
            }
        }

        for (let col = 0; col < DROP_COLS; col += 1) {
            let runType = null;
            let runStart = 0;
            for (let row = 0; row <= DROP_ROWS; row += 1) {
                const type = row < DROP_ROWS ? dropState.board[row][col] : null;
                if (type === runType && type !== null) {
                    continue;
                }
                if (runType !== null && row - runStart >= 3) {
                    for (let y = runStart; y < row; y += 1) {
                        matched.add(`${y}:${col}`);
                    }
                }
                runType = type;
                runStart = row;
            }
        }

        return matched;
    }

    function applyDropGravity() {
        for (let col = 0; col < DROP_COLS; col += 1) {
            const stack = [];
            for (let row = DROP_ROWS - 1; row >= 0; row -= 1) {
                const value = dropState.board[row][col];
                if (value !== null) {
                    stack.push(value);
                }
            }
            for (let row = DROP_ROWS - 1; row >= 0; row -= 1) {
                dropState.board[row][col] = stack[DROP_ROWS - 1 - row] ?? null;
            }
        }
    }

    function clearDropMatchesAndCascade() {
        let combo = 0;
        while (true) {
            const matches = findDropMatches();
            if (!matches.size) {
                break;
            }
            combo += 1;

            matches.forEach((key) => {
                const [rowText, colText] = key.split(":");
                const row = Number(rowText);
                const col = Number(colText);
                if (!Number.isNaN(row) && !Number.isNaN(col)) {
                    dropState.board[row][col] = null;
                }
            });

            dropState.score += matches.size * 10 * combo;
            applyDropGravity();
        }

        if (combo > 0) {
            setDropStatus(`${combo} 連鎖！`);
            updateDropScore();
        }
    }

    function endDropGame() {
        dropState.running = false;
        stopDropLoop();
        setDropStatus("ゲームオーバー。リセットで再挑戦。");
        renderDropBoard();
    }

    function dropTick() {
        if (!dropState.running) {
            return;
        }

        if (dropState.current && moveDropPiece(0, 1)) {
            renderDropBoard();
            return;
        }

        lockDropPiece();
        clearDropMatchesAndCascade();

        if (!spawnDropPiece()) {
            endDropGame();
            return;
        }

        setDropStatus("プレイ中");
        renderDropBoard();
    }

    function resetDropGame() {
        stopDropLoop();
        dropState.running = false;
        dropState.board = createDropEmptyBoard();
        dropState.current = null;
        dropState.score = 0;
        updateDropScore();
        setDropStatus("スタートで開始。");
        renderDropBoard();
    }

    function startDropGame() {
        resetDropGame();
        dropState.running = true;
        if (!spawnDropPiece()) {
            endDropGame();
            return;
        }
        setDropStatus("プレイ中");
        renderDropBoard();
        dropState.timerId = window.setInterval(dropTick, 520);
    }

    if (dropStartButton) {
        dropStartButton.addEventListener("click", startDropGame);
    }

    if (dropResetButton) {
        dropResetButton.addEventListener("click", resetDropGame);
    }

    if (dropLeftButton) {
        dropLeftButton.addEventListener("click", () => {
            if (!dropState.running || !dropState.current) {
                return;
            }
            moveDropPiece(-1, 0);
            renderDropBoard();
        });
    }

    if (dropRightButton) {
        dropRightButton.addEventListener("click", () => {
            if (!dropState.running || !dropState.current) {
                return;
            }
            moveDropPiece(1, 0);
            renderDropBoard();
        });
    }

    if (dropDownButton) {
        dropDownButton.addEventListener("click", () => {
            if (!dropState.running) {
                return;
            }
            dropTick();
        });
    }

    window.addEventListener("keydown", (event) => {
        const activeKey = getActiveMiniGameKey();

        if (activeKey === "snake" && snakeState.running) {
            if (event.key === "ArrowUp") {
                setSnakeDirection(0, -1);
                event.preventDefault();
                return;
            }
            if (event.key === "ArrowLeft") {
                setSnakeDirection(-1, 0);
                event.preventDefault();
                return;
            }
            if (event.key === "ArrowDown") {
                setSnakeDirection(0, 1);
                event.preventDefault();
                return;
            }
            if (event.key === "ArrowRight") {
                setSnakeDirection(1, 0);
                event.preventDefault();
                return;
            }
        }

        if (activeKey === "tetris" && tetrisState.running) {
            if (event.key === "ArrowLeft") {
                moveTetris(-1, 0);
                drawTetris();
                event.preventDefault();
                return;
            }
            if (event.key === "ArrowRight") {
                moveTetris(1, 0);
                drawTetris();
                event.preventDefault();
                return;
            }
            if (event.key === "ArrowUp") {
                rotateTetris();
                event.preventDefault();
                return;
            }
            if (event.key === "ArrowDown") {
                tetrisTick();
                event.preventDefault();
                return;
            }
        }

        if (activeKey !== "drop" || !dropState.running || !dropState.current) {
            return;
        }

        if (event.key === "ArrowLeft") {
            moveDropPiece(-1, 0);
            renderDropBoard();
            event.preventDefault();
            return;
        }
        if (event.key === "ArrowRight") {
            moveDropPiece(1, 0);
            renderDropBoard();
            event.preventDefault();
            return;
        }
        if (event.key === "ArrowDown") {
            dropTick();
            event.preventDefault();
        }
    });

    if (miniTabsRoot) {
        miniTabsRoot.addEventListener("click", (event) => {
            const target = event.target;
            if (!(target instanceof HTMLElement)) {
                return;
            }

            const tab = target.closest("[data-mini-tab]");
            if (!(tab instanceof HTMLButtonElement)) {
                return;
            }

            const key = tab.dataset.miniTab;
            if (!key) {
                return;
            }

            setActiveMiniGame(key);
        });
    }

    updateAdminUI();
    renderArticles();
    renderGuestbook();
    resetTtt();
    resetMemoryGameToIdle();
    renderMemoryRanking();
    resetMoleGame();
    resetReactionTest();
    renderReactionBest();
    resetBreakoutGame();
    resetSnakeGame();
    resetTetrisGame();
    resetDropGame();
    if (miniTabButtons.length) {
        const initialKey = miniTabButtons.find((button) => button.classList.contains("is-active"))?.dataset.miniTab
            || miniTabButtons[0].dataset.miniTab;
        if (initialKey) {
            setActiveMiniGame(initialKey);
        }
    }
})();

