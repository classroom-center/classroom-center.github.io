/**
 * site-chrome.js
 * Injects the dark header + sidebar into every page that loads it.
 * The iframe / game content is never touched.
 */
(function () {
    'use strict';

    /* ── 1. Inject CSS ──────────────────────────────────────── */
    function injectCSS(href) {
        if (document.querySelector('link[href="' + href + '"]')) return;
        var l = document.createElement('link');
        l.rel = 'stylesheet'; l.type = 'text/css'; l.href = href;
        document.head.appendChild(l);
    }
    injectCSS('/themes/classroom/rs/css/custom.css');
    injectCSS('/themes/classroom/rs/css/search.css');

    /* ── 2. Inject search.js ────────────────────────────────── */
    function injectScript(src, cb) {
        if (document.querySelector('script[src="' + src + '"]')) { if (cb) cb(); return; }
        var s = document.createElement('script');
        s.src = src; if (cb) s.onload = cb;
        document.head.appendChild(s);
    }
    injectScript('/data/js/search.js');

    /* ── 3. Header HTML ─────────────────────────────────────── */
    var HEADER_HTML =
        '<header class="site-header">' +
        '<div class="header-inner">' +
            '<div class="header-left">' +
                '<button class="hamburger-btn" id="hamburger-btn" aria-label="Toggle sidebar">' +
                    '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>' +
                '</button>' +
                '<a class="site-brand" href="/">' +
                    '<img alt="Classroom Center" height="38" src="/data/image/logo.webp" />' +
                '</a>' +
            '</div>' +
            '<div class="header-center">' +
                '<div class="us-searching-box header-search-wrap" id="search-desktop">' +
                    '<form action="/search" class="header-search-form" method="GET">' +
                        '<svg class="header-search-icon" width="18" height="18" viewBox="0 0 32 32" fill="currentColor"><path d="M27.414,24.586l-5.077-5.077C23.386,17.928,24,16.035,24,14c0-5.514-4.486-10-10-10S4,8.486,4,14s4.486,10,10,10c2.035,0,3.928-0.614,5.509-1.663l5.077,5.077c0.78,0.781,2.048,0.781,2.828,0C28.195,26.633,28.195,25.367,27.414,24.586zM7,14c0-3.86,3.14-7,7-7s7,3.14,7,7s-3.14,7-7,7S7,17.86,7,14z"/></svg>' +
                        '<input autocomplete="off" class="header-search-input" id="txt-search1" name="q" placeholder="Search games and categories" type="text" />' +
                        '<div class="search-results" id="search-results-desktop"></div>' +
                    '</form>' +
                '</div>' +
            '</div>' +
            '<div class="header-right">' +
                '<button class="header-icon-btn header-fav-btn my-games" id="open-favorites" aria-label="My favorites">' +
                    '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>' +
                '</button>' +
                '<span style="display:none" id="iconMenu"></span>' +
            '</div>' +
        '</div>' +
        '</header>';

    /* ── 4. Sidebar HTML ────────────────────────────────────── */
    var SIDEBAR_HTML =
        '<aside class="site-sidebar" id="site-sidebar">' +
        '<div class="sidebar-inner">' +
            '<nav class="sidebar-nav">' +
                '<a class="sidebar-item" href="/">' +
                    '<span class="sidebar-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg></span>' +
                    '<span class="sidebar-label">Home</span>' +
                '</a>' +
                '<a class="sidebar-item" href="/category/trending-games">' +
                    '<span class="sidebar-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg></span>' +
                    '<span class="sidebar-label">Trending</span>' +
                '</a>' +
                '<a class="sidebar-item" href="/category/new-games">' +
                    '<span class="sidebar-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></span>' +
                    '<span class="sidebar-label">New</span>' +
                '</a>' +
                '<a class="sidebar-item" href="/category/hot-games">' +
                    '<span class="sidebar-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67z"/></svg></span>' +
                    '<span class="sidebar-label">Popular Games</span>' +
                '</a>' +
                '<a class="sidebar-item" href="/category/2-player-games">' +
                    '<span class="sidebar-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg></span>' +
                    '<span class="sidebar-label">Multiplayer</span>' +
                '</a>' +
            '</nav>' +
            '<div class="sidebar-divider"></div>' +
            '<nav class="sidebar-nav">' +
                '<a class="sidebar-item" href="/category/clicker-games"><span class="sidebar-icon sidebar-icon-img"><img src="/upload/cache/upload/imgs/click1-h40x24.webp" alt="Clicker"/></span><span class="sidebar-label">Clicker</span></a>' +
                '<a class="sidebar-item" href="/category/io-games"><span class="sidebar-icon sidebar-icon-img"><img src="/upload/cache/upload/imgs/io-h40x24.webp" alt="IO"/></span><span class="sidebar-label">IO</span></a>' +
                '<a class="sidebar-item" href="/category/adventure-games"><span class="sidebar-icon sidebar-icon-img"><img src="/upload/cache/upload/imgs/adventure1-h40x24.webp" alt="Adventure"/></span><span class="sidebar-label">Adventure</span></a>' +
                '<a class="sidebar-item" href="/category/2-player-games"><span class="sidebar-icon sidebar-icon-img"><img src="/upload/cache/upload/imgs/2playericon-h40x24.webp" alt="2 Player"/></span><span class="sidebar-label">2 Player</span></a>' +
                '<a class="sidebar-item" href="/category/shooting-games"><span class="sidebar-icon sidebar-icon-img"><img src="/upload/cache/upload/imgs/shooting1-h40x24.webp" alt="Shooting"/></span><span class="sidebar-label">Shooting</span></a>' +
                '<a class="sidebar-item" href="/category/sports-games"><span class="sidebar-icon sidebar-icon-img"><img src="/upload/cache/upload/imgs/sporticon-h40x24.webp" alt="Sports"/></span><span class="sidebar-label">Sports</span></a>' +
                '<a class="sidebar-item" href="/category/car-games"><span class="sidebar-icon sidebar-icon-img"><img src="/upload/cache/upload/imgs/caricon-h40x24.webp" alt="Car"/></span><span class="sidebar-label">Car</span></a>' +
                '<a class="sidebar-item" href="/category/puzzle-games"><span class="sidebar-icon sidebar-icon-img"><img src="/upload/cache/upload/imgs/puzzle2-h40x24.webp" alt="Puzzle"/></span><span class="sidebar-label">Puzzle</span></a>' +
                '<a class="sidebar-item" href="/category/casual-games"><span class="sidebar-icon sidebar-icon-img"><img src="/upload/cache/upload/imgs/casual-h40x24.webp" alt="Casual"/></span><span class="sidebar-label">Casual</span></a>' +
                '<a class="sidebar-item" href="/category/kids-games"><span class="sidebar-icon sidebar-icon-img"><img src="/upload/cache/upload/imgs/kid1-h40x24.webp" alt="Kids"/></span><span class="sidebar-label">Kids</span></a>' +
            '</nav>' +
        '</div>' +
        '</aside>' +
        '<div class="sidebar-overlay" id="sidebar-overlay"></div>';

    /* ── 5. DOM injection + event wiring ────────────────────── */
    function init() {
        var body = document.body;

        /* Hide old header */
        var oldHeader = body.querySelector('header');
        if (oldHeader) { oldHeader.style.display = 'none'; }

        /* Parse new chrome into real nodes */
        var tmp = document.createElement('div');
        tmp.innerHTML = HEADER_HTML + SIDEBAR_HTML;

        /* Insert all new nodes before the old header (or at top of body) */
        var ref = oldHeader || body.firstChild;
        while (tmp.firstChild) {
            body.insertBefore(tmp.firstChild, ref);
        }

        /* Hamburger toggle (sidebar expand/collapse on mobile) */
        var btn     = document.getElementById('hamburger-btn');
        var sidebar = document.getElementById('site-sidebar');
        var overlay = document.getElementById('sidebar-overlay');
        if (btn && sidebar) {
            btn.addEventListener('click', function () {
                sidebar.classList.toggle('expanded');
                if (overlay) overlay.classList.toggle('active');
            });
        }
        if (overlay) {
            overlay.addEventListener('click', function () {
                sidebar.classList.remove('expanded');
                overlay.classList.remove('active');
            });
        }

        /* Kick off search data load once search.js is ready */
        function tryLoadSearch() {
            if (typeof loadGamesData === 'function') { loadGamesData(); }
            else { setTimeout(tryLoadSearch, 100); }
        }
        tryLoadSearch();

        /* ── Game page enhancements ──────────────────────────── */
        initGamePageControls();
    }

    /* ── Game controls: favorite btn, dislike btn, objGame ─── */
    function initGamePageControls() {
        var extend = document.querySelector('.header-game-extend');
        if (!extend) return; /* not a game page */

        /* Extract game metadata from the page */
        var pathParts = window.location.pathname.split('/').filter(Boolean);
        var slug  = (pathParts.length >= 2) ? pathParts[1] : pathParts[0] || 'unknown';
        var nameEl = document.querySelector('.img-thumbnail h1');
        var imgEl  = document.querySelector('.img-thumbnail img');
        var name   = nameEl ? nameEl.textContent.trim() : slug;
        var image  = imgEl  ? (imgEl.getAttribute('src') || imgEl.src) : '';

        /* Expose objGame globally so footer.js likeGames() / addToFavourites() work */
        window.objGame = { slug: slug, name: name, image: image };

        /* Helper: wait for azStorage to be ready */
        function withStorage(cb) {
            if (typeof azStorage !== 'undefined') { cb(); }
            else { setTimeout(function(){ withStorage(cb); }, 80); }
        }

        /* ── Dislike button ────────────────────────────────── */
        var likeBtn = document.getElementById('likegame');
        if (likeBtn && !document.getElementById('dislikegame')) {
            var dislikeBtn = document.createElement('span');
            dislikeBtn.className = 'expand-btn';
            dislikeBtn.id = 'dislikegame';
            dislikeBtn.setAttribute('data-title', 'Dislike');
            dislikeBtn.innerHTML =
                '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">' +
                '<path clip-rule="evenodd" fill-rule="evenodd" d="M15.9 19.5C15.9 21 14.418 22 13.26 22c-.806 0-.869-.612-.993-1.82-.055-.53-.121-1.174-.267-1.93-.386-2.002-1.72-4.56-2.996-5.325V7C9 4.75 9.75 4 13 4h3.773c2.176 0 2.703 1.433 2.899 1.964l.013.036c.114.306.358.547.638.82.31.306.664.653.927 1.18.311.623.27 1.177.233 1.67-.023.299-.044.575.017.83.064.27.146.475.225.671.143.356.275.686.275 1.329 0 1.5-.748 2.498-2.315 2.498H15.5S15.9 18 15.9 19.5zM5.5 14A1.5 1.5 0 0 1 4 12.5v-7a1.5 1.5 0 0 1 3 0v7A1.5 1.5 0 0 1 5.5 14z"/>' +
                '</svg>';

            withStorage(function() {
                if (azStorage.hasDislikeGame(slug)) {
                    dislikeBtn.classList.add('active');
                    dislikeBtn.setAttribute('data-title', 'Remove dislike');
                }
                dislikeBtn.addEventListener('click', function() {
                    if (azStorage.hasDislikeGame(slug)) {
                        azStorage.removeDislikeGame(slug);
                        dislikeBtn.classList.remove('active');
                        dislikeBtn.setAttribute('data-title', 'Dislike');
                    } else {
                        azStorage.addDislikeGame(window.objGame);
                        dislikeBtn.classList.add('active');
                        dislikeBtn.setAttribute('data-title', 'Remove dislike');
                        /* remove like if present */
                        if (azStorage.hasLikeGame(slug)) {
                            azStorage.removeLikeGame(slug);
                            if (likeBtn) likeBtn.classList.remove('active');
                        }
                    }
                });
            });

            /* Insert right after the like button */
            likeBtn.parentNode.insertBefore(dislikeBtn, likeBtn.nextSibling);
        }

        /* ── Favorite button ───────────────────────────────── */
        if (!document.getElementById('addFavoritesGame')) {
            var favBtn = document.createElement('span');
            favBtn.className = 'expand-btn game-fav-btn';
            favBtn.id = 'addFavoritesGame';
            favBtn.setAttribute('data-title', 'Add to favorites');
            favBtn.innerHTML =
                '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">' +
                '<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>' +
                '</svg>';

            withStorage(function() {
                if (azStorage.hasFavoritesGame(slug)) {
                    favBtn.classList.add('active');
                    favBtn.setAttribute('data-title', 'Remove from favorites');
                }
                favBtn.addEventListener('click', function() {
                    if (azStorage.hasFavoritesGame(slug)) {
                        azStorage.removeFavoritesGame(slug);
                        favBtn.classList.remove('active');
                        favBtn.setAttribute('data-title', 'Add to favorites');
                        showGameToast('Removed from favorites');
                    } else {
                        azStorage.addFavoritesGame(window.objGame);
                        favBtn.classList.add('active');
                        favBtn.setAttribute('data-title', 'Remove from favorites');
                        showGameToast('\u2665 Added to favorites!');
                    }
                });
            });

            /* Insert before the fullscreen button */
            var expandBtn = document.getElementById('expand');
            if (expandBtn) { extend.insertBefore(favBtn, expandBtn); }
            else { extend.appendChild(favBtn); }
        }
    }

    /* ── Toast notification ───────────────────────────────── */
    function showGameToast(msg) {
        var existing = document.getElementById('game-toast');
        if (existing) existing.remove();
        var t = document.createElement('div');
        t.id = 'game-toast';
        t.textContent = msg;
        t.style.cssText = 'position:fixed;bottom:28px;left:50%;transform:translateX(-50%);' +
            'background:#32355c;color:#e8e8f4;padding:10px 22px;border-radius:24px;' +
            'font-size:13px;font-weight:600;z-index:9999;box-shadow:0 4px 16px rgba(0,0,0,.5);' +
            'transition:opacity .3s;pointer-events:none;';
        document.body.appendChild(t);
        setTimeout(function() { t.style.opacity = '0'; }, 1800);
        setTimeout(function() { if (t.parentNode) t.remove(); }, 2200);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
