// ========== VISTA PDF READER ==========
// Renders PDFs inside a Vista window using PDF.js
// Depends on: pdf.js loaded from CDN (see index.html)

const PDF_WORKER_SRC = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
const PDF_LIB_SRC = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';

let pdfLibLoaded = false;
let pdfLibLoading = false;
let pdfLibCallbacks = [];

function loadPdfLib(callback) {
    if (pdfLibLoaded) { callback(); return; }
    pdfLibCallbacks.push(callback);
    if (pdfLibLoading) return;
    pdfLibLoading = true;

    const script = document.createElement('script');
    script.src = PDF_LIB_SRC;
    script.onload = () => {
        pdfjsLib.GlobalWorkerOptions.workerSrc = PDF_WORKER_SRC;
        pdfLibLoaded = true;
        pdfLibCallbacks.forEach(cb => cb());
        pdfLibCallbacks = [];
    };
    script.onerror = () => {
        console.error('Failed to load PDF.js');
        pdfLibLoading = false;
    };
    document.head.appendChild(script);
}

function generatePdfReaderContent(pdfUrl) {
    return `
        <div class="pdf-reader">
            <div class="pdf-toolbar">
                <div class="pdf-nav-group">
                    <button class="pdf-btn" onclick="pdfPagePrev(this)" title="Previous Page">
                        <i class="bi bi-chevron-left"></i>
                    </button>
                    <span class="pdf-page-info">
                        Page <span class="pdf-page-current">1</span> of <span class="pdf-page-total">-</span>
                    </span>
                    <button class="pdf-btn" onclick="pdfPageNext(this)" title="Next Page">
                        <i class="bi bi-chevron-right"></i>
                    </button>
                </div>
                <div class="pdf-zoom-group">
                    <button class="pdf-btn" onclick="pdfZoom(this, -0.25)" title="Zoom Out">
                        <i class="bi bi-zoom-out"></i>
                    </button>
                    <span class="pdf-zoom-level">100%</span>
                    <button class="pdf-btn" onclick="pdfZoom(this, 0.25)" title="Zoom In">
                        <i class="bi bi-zoom-in"></i>
                    </button>
                    <button class="pdf-btn" onclick="pdfFitWidth(this)" title="Fit Width">
                        <i class="bi bi-arrows-expand"></i>
                    </button>
                </div>
                <div class="pdf-action-group">
                    <a href="${pdfUrl}" target="_blank" class="pdf-btn" title="Open in New Tab">
                        <i class="bi bi-box-arrow-up-right"></i>
                    </a>
                    <a href="${pdfUrl}" download class="pdf-btn" title="Download">
                        <i class="bi bi-download"></i>
                    </a>
                </div>
            </div>
            <div class="pdf-viewport" data-url="${pdfUrl}" data-page="1" data-scale="1" data-fit="true">
                <div class="pdf-loading">
                    <i class="bi bi-hourglass-split"></i>
                    <span>Loading PDF...</span>
                </div>
                <div class="pdf-canvas-wrapper">
                    <canvas class="pdf-canvas"></canvas>
                </div>
            </div>
        </div>
    `;
}

function initPdfReader(container) {
    const viewport = container.querySelector('.pdf-viewport');
    if (!viewport) return;

    const url = viewport.dataset.url;

    loadPdfLib(() => {
        pdfjsLib.getDocument(url).promise.then(pdf => {
            viewport._pdfDoc = pdf;
            container.querySelector('.pdf-page-total').textContent = pdf.numPages;
            viewport.dataset.page = '1';

            // Default: fit width
            pdfRenderPage(container);
        }).catch(err => {
            viewport.querySelector('.pdf-loading').innerHTML =
                `<i class="bi bi-exclamation-triangle"></i><span>Failed to load PDF</span>`;
            console.error('PDF load error:', err);
        });
    });
}

function pdfRenderPage(container) {
    const viewport = container.querySelector('.pdf-viewport');
    const pdf = viewport._pdfDoc;
    if (!pdf) return;

    const pageNum = parseInt(viewport.dataset.page) || 1;
    const canvas = container.querySelector('.pdf-canvas');
    const ctx = canvas.getContext('2d');

    pdf.getPage(pageNum).then(page => {
        let scale = parseFloat(viewport.dataset.scale) || 1;

        // Auto fit-width
        if (viewport.dataset.fit === 'true') {
            const unscaledViewport = page.getViewport({ scale: 1 });
            const availableWidth = viewport.clientWidth - 40; // padding
            scale = availableWidth / unscaledViewport.width;
            viewport.dataset.scale = scale.toString();
            container.querySelector('.pdf-zoom-level').textContent =
                Math.round(scale * 100) + '%';
        }

        const pdfViewport = page.getViewport({ scale });
        const dpr = window.devicePixelRatio || 1;

        canvas.width = pdfViewport.width * dpr;
        canvas.height = pdfViewport.height * dpr;
        canvas.style.width = pdfViewport.width + 'px';
        canvas.style.height = pdfViewport.height + 'px';

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        page.render({ canvasContext: ctx, viewport: pdfViewport }).promise.then(() => {
            viewport.querySelector('.pdf-loading').style.display = 'none';
            container.querySelector('.pdf-page-current').textContent = pageNum;
        });
    });
}

// Find the closest .pdf-reader container from a button
function pdfContainer(btn) {
    return btn.closest('.pdf-reader');
}

function pdfPagePrev(btn) {
    const container = pdfContainer(btn);
    const viewport = container.querySelector('.pdf-viewport');
    let page = parseInt(viewport.dataset.page) || 1;
    if (page <= 1) return;
    viewport.dataset.page = (page - 1).toString();
    pdfRenderPage(container);
}

function pdfPageNext(btn) {
    const container = pdfContainer(btn);
    const viewport = container.querySelector('.pdf-viewport');
    const pdf = viewport._pdfDoc;
    let page = parseInt(viewport.dataset.page) || 1;
    if (!pdf || page >= pdf.numPages) return;
    viewport.dataset.page = (page + 1).toString();
    pdfRenderPage(container);
}

function pdfZoom(btn, delta) {
    const container = pdfContainer(btn);
    const viewport = container.querySelector('.pdf-viewport');
    let scale = parseFloat(viewport.dataset.scale) || 1;
    scale = Math.max(0.25, Math.min(4, scale + delta));
    viewport.dataset.scale = scale.toString();
    viewport.dataset.fit = 'false';
    container.querySelector('.pdf-zoom-level').textContent =
        Math.round(scale * 100) + '%';
    pdfRenderPage(container);
}

function pdfFitWidth(btn) {
    const container = pdfContainer(btn);
    const viewport = container.querySelector('.pdf-viewport');
    viewport.dataset.fit = 'true';
    pdfRenderPage(container);
}

// Inject PDF reader styles
function injectPdfReaderStyles() {
    if (document.getElementById('pdf-reader-styles')) return;
    const style = document.createElement('style');
    style.id = 'pdf-reader-styles';
    style.textContent = `
        .pdf-reader {
            display: flex;
            flex-direction: column;
            height: 100%;
            margin: -20px;
        }

        .pdf-toolbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 6px 12px;
            background: linear-gradient(180deg, #545454 0%, #3a3a3a 100%);
            border-bottom: 1px solid #222;
            flex-shrink: 0;
            gap: 10px;
            flex-wrap: wrap;
        }

        .pdf-nav-group,
        .pdf-zoom-group,
        .pdf-action-group {
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .pdf-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 30px;
            height: 28px;
            border: 1px solid #555;
            border-radius: 3px;
            background: linear-gradient(180deg, #666 0%, #4a4a4a 100%);
            color: #e0e0e0;
            cursor: pointer;
            font-size: 14px;
            text-decoration: none;
            transition: all 0.15s;
        }

        .pdf-btn:hover {
            background: linear-gradient(180deg, #777 0%, #5a5a5a 100%);
            color: #fff;
            border-color: #888;
        }

        .pdf-btn:active {
            background: #333;
        }

        .pdf-page-info {
            color: #ccc;
            font-size: 12px;
            white-space: nowrap;
        }

        .pdf-zoom-level {
            color: #ccc;
            font-size: 12px;
            min-width: 40px;
            text-align: center;
        }

        .pdf-viewport {
            flex: 1;
            overflow: auto;
            background: #525659;
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;
        }

        .pdf-loading {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #aaa;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
            font-size: 14px;
        }

        .pdf-loading i {
            font-size: 32px;
            animation: spin 1.5s linear infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .pdf-canvas-wrapper {
            padding: 20px;
            display: flex;
            justify-content: center;
        }

        .pdf-canvas {
            box-shadow: 0 2px 12px rgba(0,0,0,0.5);
            background: #fff;
        }

        /* Scrollbar inside pdf viewport */
        .pdf-viewport::-webkit-scrollbar {
            width: 14px;
            height: 14px;
        }

        .pdf-viewport::-webkit-scrollbar-track {
            background: #3a3a3a;
        }

        .pdf-viewport::-webkit-scrollbar-thumb {
            background: #666;
            border: 1px solid #555;
        }

        .pdf-viewport::-webkit-scrollbar-thumb:hover {
            background: #777;
        }
    `;
    document.head.appendChild(style);
}