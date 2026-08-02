import * as params from '@params';

let fuse; // holds our search engine
let resList = document.getElementById('searchResults');
let sInput = document.getElementById('searchInput');
let filterBox = document.getElementById('searchFilters');
let first, last, current_elem = null
let resultsAvailable = false;
let activeSection = null;
let allSections = [];

// Random-walk particle sim shown while the search box is empty, so the
// page isn't just dead air before you type anything. Reflecting boundaries,
// adjustable particle count, and a short fading trail per particle.
let walkerEl = document.getElementById('searchWalker');
let walkerCanvas = document.getElementById('walkerCanvas');
let walkerSlider = document.getElementById('walkerCount');
let walkerOut = document.getElementById('walkerCountOut');
let walkerCtx = walkerCanvas ? walkerCanvas.getContext('2d') : null;
let walkerTimer = null;
let walkerW = 0, walkerH = 0;
let walkerParticles = [];
const WALKER_ACC = 0.4, WALKER_MAXV = 3, WALKER_MINV = 0.6, WALKER_TRAIL_LEN = 100;

function walkerRand(a, b) {
    return a + Math.random() * (b - a);
}

function resizeWalker() {
    if (!walkerCanvas) return;
    let rect = walkerCanvas.getBoundingClientRect();
    let dpr = window.devicePixelRatio || 1;
    if (rect.width === 0 || rect.height === 0) return; // hidden, skip
    walkerW = rect.width;
    walkerH = rect.height;
    walkerCanvas.width = Math.max(1, Math.round(walkerW * dpr));
    walkerCanvas.height = Math.max(1, Math.round(walkerH * dpr));
    walkerCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    walkerParticles.forEach(function (p) {
        p.x = Math.min(p.x, walkerW);
        p.y = Math.min(p.y, walkerH);
    });
}

function newWalkerParticle() {
    let angle = walkerRand(0, Math.PI * 2);
    let speed = walkerRand(WALKER_MINV, WALKER_MAXV);
    return {
        x: walkerW ? walkerRand(walkerW * 0.3, walkerW * 0.7) : 0,
        y: walkerH ? walkerRand(walkerH * 0.3, walkerH * 0.7) : 0,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        trail: []
    };
}

function setWalkerCount(n) {
    while (walkerParticles.length < n) walkerParticles.push(newWalkerParticle());
    while (walkerParticles.length > n) walkerParticles.pop();
}

function stepWalker() {
    if (!walkerCtx || !walkerW || !walkerH) return;
    walkerCtx.clearRect(0, 0, walkerW, walkerH);
    walkerParticles.forEach(function (p) {
        let nx = p.x + p.vx, ny = p.y + p.vy;
        if (nx < 0) { nx = -nx; p.vx = -p.vx; }
        if (nx > walkerW) { nx = 2 * walkerW - nx; p.vx = -p.vx; }
        if (ny < 0) { ny = -ny; p.vy = -p.vy; }
        if (ny > walkerH) { ny = 2 * walkerH - ny; p.vy = -p.vy; }
        p.x = nx; p.y = ny;
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > WALKER_TRAIL_LEN) p.trail.shift();
        p.vx += walkerRand(-WALKER_ACC, WALKER_ACC);
        p.vy += walkerRand(-WALKER_ACC, WALKER_ACC);
        let speed = Math.hypot(p.vx, p.vy);
        if (speed > WALKER_MAXV) { p.vx *= WALKER_MAXV / speed; p.vy *= WALKER_MAXV / speed; }
        if (speed < WALKER_MINV) { p.vx *= WALKER_MINV / speed; p.vy *= WALKER_MINV / speed; }
    });
    walkerParticles.forEach(function (p) {
        let n = p.trail.length;
        for (let i = 0; i < n; i++) {
            let pt = p.trail[i];
            let a = ((i + 1) / n) * 0.15;
            walkerCtx.fillStyle = 'rgba(101,99,214,' + a.toFixed(3) + ')';
            walkerCtx.beginPath();
            walkerCtx.arc(pt.x, pt.y, 2, 0, Math.PI * 2);
            walkerCtx.fill();
        }
        walkerCtx.fillStyle = '#6563D6';
        walkerCtx.beginPath();
        walkerCtx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        walkerCtx.fill();
    });
}

function showIdle() {
    if (!walkerEl) return;
    walkerEl.style.display = '';
    resizeWalker();
    if (!walkerParticles.length) {
        setWalkerCount(parseInt((walkerSlider && walkerSlider.value) || 6, 10));
    }
    if (!walkerTimer) walkerTimer = setInterval(stepWalker, 30);
}

function hideIdle() {
    if (walkerEl) walkerEl.style.display = 'none';
    if (walkerTimer) { clearInterval(walkerTimer); walkerTimer = null; }
}

if (walkerSlider) {
    walkerSlider.addEventListener('input', function () {
        if (walkerOut) walkerOut.textContent = walkerSlider.value;
        setWalkerCount(parseInt(walkerSlider.value, 10));
    });
}
window.addEventListener('resize', resizeWalker);
window.addEventListener('orientationchange', resizeWalker);

// A few terms that changed identity over time (institute rename, lab
// nicknames, etc). Searching either side should still find everything.
const SYNONYMS = {
    'igc': ['gimm', 'gulbenkian institute for molecular medicine'],
    'gimm': ['igc', 'instituto gulbenkian de ciência'],
    'kanchan garai': ['single molecule biophysics lab'],
    'sartori lab': ['living physics laboratory'],
    'living physics laboratory': ['sartori lab']
};

function escapeHtml(str) {
    return (str || '').replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
}

function expandQueries(q) {
    let variants = new Set([q]);
    let lower = q.toLowerCase();
    Object.keys(SYNONYMS).forEach(function (key) {
        if (lower.includes(key)) {
            SYNONYMS[key].forEach(function (alt) {
                variants.add(lower.split(key).join(alt));
            });
        }
    });
    return Array.from(variants).filter(function (v) { return v.trim().length > 0; });
}

// Best single match for a given set of index keys (e.g. content/summary),
// used both for the deep-link text fragment and for highlighting the snippet.
function bestMatch(result, keys) {
    if (!result.matches) return null;
    let candidates = result.matches.filter(function (m) { return keys.includes(m.key); });
    if (!candidates.length) return null;
    let best = null, bestLen = -1;
    candidates.forEach(function (m) {
        (m.indices || []).forEach(function (range) {
            let len = range[1] - range[0];
            if (len > bestLen) { bestLen = len; best = { key: m.key, value: m.value, start: range[0], end: range[1] }; }
        });
    });
    return best;
}

function buildSnippetHtml(entry, match) {
    let text, mStart = -1, mEnd = -1;
    if (match && (match.key === 'summary' || match.key === 'content')) {
        text = match.value || '';
        mStart = match.start;
        mEnd = match.end + 1;
    } else {
        text = (entry.summary && entry.summary.trim()) ? entry.summary : (entry.content || '');
    }
    text = text.replace(/\s+/g, ' ');

    let radius = 90;
    let winStart = 0, winEnd = Math.min(text.length, 180);
    if (mStart >= 0) {
        winStart = Math.max(0, mStart - radius);
        winEnd = Math.min(text.length, mEnd + radius);
    }
    let prefix = winStart > 0 ? '…' : '';
    let suffix = winEnd < text.length ? '…' : '';

    if (mStart >= 0) {
        let before = text.slice(winStart, mStart);
        let matched = text.slice(mStart, mEnd);
        let after = text.slice(mEnd, winEnd);
        return escapeHtml(prefix + before) + '<mark>' + escapeHtml(matched) + '</mark>' + escapeHtml(after + suffix);
    }
    return escapeHtml(prefix + text.slice(winStart, winEnd) + suffix);
}

// Turn the best content/summary match into a short literal phrase we can
// deep-link to with a browser Text Fragment (#:~:text=...).
function textFragmentFor(result) {
    let match = bestMatch(result, ['content', 'summary']);
    if (!match) return '';

    let text = match.value;
    let start = match.start, end = match.end + 1;
    while (start > 0 && /\S/.test(text[start - 1])) start--;
    while (end < text.length && /\S/.test(text[end])) end++;
    for (let i = 0; i < 3 && start > 0; i++) {
        start--;
        while (start > 0 && text[start] !== ' ') start--;
    }
    for (let i = 0; i < 3 && end < text.length; i++) {
        end++;
        while (end < text.length && text[end] !== ' ') end++;
    }
    let snippet = text.slice(start, end).replace(/\s+/g, ' ').trim();
    if (snippet.length > 120) snippet = snippet.slice(0, 120).trim();
    return snippet;
}

function linkFor(entry, result) {
    let fragment = textFragmentFor(result);
    if (fragment) {
        return entry.permalink + '#:~:text=' + encodeURIComponent(fragment);
    }
    return entry.permalink;
}

function searchAll(query, limit) {
    if (!fuse) return [];
    let variants = expandQueries(query);
    let byPermalink = new Map();
    variants.forEach(function (v) {
        fuse.search(v).forEach(function (r) {
            let key = r.item.permalink;
            let existing = byPermalink.get(key);
            if (!existing || (r.score ?? 1) < (existing.score ?? 1)) {
                byPermalink.set(key, r);
            }
        });
    });
    let merged = Array.from(byPermalink.values());
    merged.sort(function (a, b) {
        let d = (a.score ?? 0) - (b.score ?? 0);
        if (Math.abs(d) > 0.02) return d;
        return (b.item.timestamp || 0) - (a.item.timestamp || 0);
    });
    return merged.slice(0, limit);
}

function renderFilters() {
    if (!filterBox || allSections.length < 2) return;
    let pills = ['<button type="button" class="search-pill' + (activeSection === null ? ' active' : '') + '" data-section="">all</button>'];
    allSections.forEach(function (s) {
        pills.push('<button type="button" class="search-pill' + (activeSection === s ? ' active' : '') + '" data-section="' + escapeHtml(s) + '">' + escapeHtml(s) + '</button>');
    });
    filterBox.innerHTML = pills.join('');
    filterBox.querySelectorAll('.search-pill').forEach(function (btn) {
        btn.addEventListener('click', function () {
            activeSection = this.getAttribute('data-section') || null;
            renderFilters();
            runSearch();
        });
    });
}

function renderResults(results, query) {
    if (results.length !== 0) {
        let resultSet = '';
        for (let item in results) {
            let entry = results[item].item;
            let match = bestMatch(results[item], ['summary', 'content']);
            let tagsLine = (entry.tags && entry.tags.length)
                ? `<div class="search-tags">${entry.tags.map(escapeHtml).join(' · ')}</div>`
                : '';
            let href = linkFor(entry, results[item]);
            resultSet += `<li class="post-entry">` +
                `<header class="entry-header">${escapeHtml(entry.title)}&nbsp;»</header>` +
                `<div class="entry-content"><p>${buildSnippetHtml(entry, match)}</p></div>` +
                tagsLine +
                `<a href="${href}" aria-label="${escapeHtml(entry.title)}"></a></li>`
        }
        resList.innerHTML = resultSet;
        resultsAvailable = true;
        first = resList.firstChild;
        last = resList.lastChild;
    } else {
        resultsAvailable = false;
        if (query && query.trim()) {
            let filterNote = activeSection ? ` in “${escapeHtml(activeSection)}”` : '';
            resList.innerHTML = `<li class="post-entry search-empty">No results for “${escapeHtml(query.trim())}”${filterNote}. Try a different term` + (activeSection ? ', or clear the filter above.' : '.') + `</li>`;
        } else {
            resList.innerHTML = '';
        }
    }
}

function runSearch() {
    let query = sInput.value;
    let params2 = new URLSearchParams(window.location.search);
    if (query.trim()) {
        params2.set('q', query.trim());
    } else {
        params2.delete('q');
    }
    let newUrl = window.location.pathname + (params2.toString() ? '?' + params2.toString() : '');
    history.replaceState(null, '', newUrl);

    if (!fuse || !query.trim()) {
        resultsAvailable = false;
        resList.innerHTML = '';
        showIdle();
        return;
    }
    hideIdle();
    let limit = (params.fuseOpts && params.fuseOpts.limit) || 20;
    let results = searchAll(query, limit);
    if (activeSection) {
        results = results.filter(function (r) { return r.item.section === activeSection; });
    }
    renderResults(results, query);
}

// load our search index
window.onload = function () {
    showIdle(); // the starfield doesn't need the index, so start it immediately
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                let data = JSON.parse(xhr.responseText);
                if (data) {
                    // fuse.js options; check fuse.js website for details
                    let options = {
                        distance: 100,
                        threshold: 0.4,
                        ignoreLocation: true,
                        keys: [
                            'title',
                            'permalink',
                            'summary',
                            'content'
                        ]
                    };
                    if (params.fuseOpts) {
                        options = {
                            isCaseSensitive: params.fuseOpts.iscasesensitive ?? false,
                            includeScore: params.fuseOpts.includescore ?? false,
                            includeMatches: params.fuseOpts.includematches ?? false,
                            minMatchCharLength: params.fuseOpts.minmatchcharlength ?? 1,
                            shouldSort: params.fuseOpts.shouldsort ?? true,
                            findAllMatches: params.fuseOpts.findallmatches ?? false,
                            keys: params.fuseOpts.keys ?? ['title', 'permalink', 'summary', 'content'],
                            location: params.fuseOpts.location ?? 0,
                            threshold: params.fuseOpts.threshold ?? 0.4,
                            distance: params.fuseOpts.distance ?? 100,
                            ignoreLocation: params.fuseOpts.ignorelocation ?? true
                        }
                    }
                    fuse = new Fuse(data, options); // build the index from the json file

                    let sections = new Set();
                    data.forEach(function (d) { if (d.section) sections.add(d.section); });
                    allSections = Array.from(sections).sort();
                    renderFilters();

                    // Prefill from ?q= so searches are shareable/linkable.
                    let qParam = new URLSearchParams(window.location.search).get('q');
                    if (qParam) {
                        sInput.value = qParam;
                        runSearch();
                    } else {
                        showIdle();
                    }
                }
            } else {
                console.log(xhr.responseText);
            }
        }
    };
    xhr.open('GET', "../index.json");
    xhr.send();
}

function activeToggle(ae) {
    document.querySelectorAll('.focus').forEach(function (element) {
        // rm focus class
        element.classList.remove("focus")
    });
    if (ae) {
        ae.focus()
        document.activeElement = current_elem = ae;
        ae.parentElement.classList.add("focus")
    } else {
        document.activeElement.parentElement.classList.add("focus")
    }
}

function reset() {
    resultsAvailable = false;
    resList.innerHTML = sInput.value = ''; // clear inputbox and searchResults
    sInput.focus(); // shift focus to input box
    showIdle();
    let p = new URLSearchParams(window.location.search);
    p.delete('q');
    history.replaceState(null, '', window.location.pathname + (p.toString() ? '?' + p.toString() : ''));
}

// execute search as each character is typed
sInput.onkeyup = function (e) {
    runSearch();
}

sInput.addEventListener('search', function (e) {
    // clicked on x
    if (!this.value) reset()
})

// kb bindings
document.onkeydown = function (e) {
    let key = e.key;
    let ae = document.activeElement;

    let inbox = document.getElementById("searchbox").contains(ae)

    if (ae === sInput) {
        let elements = document.getElementsByClassName('focus');
        while (elements.length > 0) {
            elements[0].classList.remove('focus');
        }
    } else if (current_elem) ae = current_elem;

    if (key === "Escape") {
        reset()
    } else if (!resultsAvailable || !inbox) {
        return
    } else if (key === "ArrowDown") {
        e.preventDefault();
        if (ae == sInput) {
            // if the currently focused element is the search input, focus the <a> of first <li>
            activeToggle(resList.firstChild.lastChild);
        } else if (ae.parentElement != last) {
            // if the currently focused element's parent is last, do nothing
            // otherwise select the next search result
            activeToggle(ae.parentElement.nextSibling.lastChild);
        }
    } else if (key === "ArrowUp") {
        e.preventDefault();
        if (ae.parentElement == first) {
            // if the currently focused element is first item, go to input box
            activeToggle(sInput);
        } else if (ae != sInput) {
            // if the currently focused element is input box, do nothing
            // otherwise select the previous search result
            activeToggle(ae.parentElement.previousSibling.lastChild);
        }
    } else if (key === "ArrowRight") {
        ae.click(); // click on active link
    }
}
