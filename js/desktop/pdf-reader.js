// ========== VISTA PDF READER ==========
// Renders PDFs inside a Vista window using PDF.js
// CSS is linked statically via css/desktop/pdf-reader.css (not injected).

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
