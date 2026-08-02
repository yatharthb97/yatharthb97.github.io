import * as params from '@params';

let fuse; // holds our search engine
let resList = document.getElementById('searchResults');
let sInput = document.getElementById('searchInput');
let first, last, current_elem = null
let resultsAvailable = false;

function escapeHtml(str) {
    return (str || '').replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
}

function snippetFor(item) {
    // Prefer the summary field; fall back to a slice of the raw content.
    let text = item.summary && item.summary.trim() ? item.summary : (item.content || '');
    text = text.replace(/\s+/g, ' ').trim();
    if (text.length > 180) text = text.slice(0, 180).trim() + '…';
    return escapeHtml(text);
}

// Find the best content/summary match from a Fuse result and turn it into a
// short literal phrase we can deep-link to with a browser Text Fragment
// (#:~:text=...). Falls back to no fragment if there's nothing to point at.
function textFragmentFor(result) {
    if (!result.matches) return '';
    let candidates = result.matches.filter(function (m) {
        return m.key === 'content' || m.key === 'summary';
    });
    if (!candidates.length) return '';

    let best = null, bestLen = -1;
    candidates.forEach(function (m) {
        (m.indices || []).forEach(function (range) {
            let len = range[1] - range[0];
            if (len > bestLen) { bestLen = len; best = { value: m.value, start: range[0], end: range[1] }; }
        });
    });
    if (!best) return '';

    let text = best.value;
    let start = best.start, end = best.end + 1;
    // expand to whole words
    while (start > 0 && /\S/.test(text[start - 1])) start--;
    while (end < text.length && /\S/.test(text[end])) end++;
    // pad a couple of words either side so the phrase is distinctive enough
    // for the browser to locate reliably
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

// load our search index
window.onload = function () {
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
}

// execute search as each character is typed
sInput.onkeyup = function (e) {
    // run a search query (for "term") every time a letter is typed
    // in the search box
    if (fuse) {
        let results;
        let limit = (params.fuseOpts && params.fuseOpts.limit) || 20;
        results = fuse.search(this.value.trim(), { limit: limit });
        if (results.length !== 0) {
            // build our html if result exists
            let resultSet = ''; // our results bucket

            for (let item in results) {
                let entry = results[item].item;
                let tagsLine = (entry.tags && entry.tags.length)
                    ? `<div class="search-tags">${entry.tags.map(escapeHtml).join(' · ')}</div>`
                    : '';
                let href = linkFor(entry, results[item]);
                resultSet += `<li class="post-entry">` +
                    `<header class="entry-header">${escapeHtml(entry.title)}&nbsp;»</header>` +
                    `<div class="entry-content"><p>${snippetFor(entry)}</p></div>` +
                    tagsLine +
                    `<a href="${href}" aria-label="${escapeHtml(entry.title)}"></a></li>`
            }

            resList.innerHTML = resultSet;
            resultsAvailable = true;
            first = resList.firstChild;
            last = resList.lastChild;
        } else {
            resultsAvailable = false;
            resList.innerHTML = '';
        }
    }
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
