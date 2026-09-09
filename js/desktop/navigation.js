// ========== NAVIGATION ==========
function buildHistoryStack(fromWindow) {
    if (!fromWindow) return [];
    const parentStack = navigationHistory[fromWindow] || [];
    return [...parentStack, fromWindow];
}

// Compound drill action: close parent, open target, carry the stack — counts as ONE history entry.
function navigateTo(fromWindowId, targetWindowId, openFn) {
    if (windows[fromWindowId]) {
        const content = windows[fromWindowId].element.querySelector('.window-content');
        if (content) scrollPositions[fromWindowId] = content.scrollTop;
    }
    const stack = buildHistoryStack(fromWindowId);

    suppressPush = true;
    closeWindow(fromWindowId);
    if (openFn) openFn(stack);
    else openWindow(targetWindowId, null, stack);
    suppressPush = false;

    pushNav();
}

function navigateFromProjects(projectKey) { navigateTo('projects', null, (stack) => openProjectDetail(projectKey, stack)); }
function navigateFromDocuments(projectKey) { navigateTo('documents', null, (stack) => openProjectDetail(projectKey, stack)); }
function navigateFromGames(targetWindow) { navigateTo('games', targetWindow); }
function navigateFromControlPanel(targetWindow) { navigateTo('controlpanel', targetWindow); }
function navigateFromHelp(targetWindow) { navigateTo('help', targetWindow); }

// ========== PROJECT DETAIL ==========
function openProjectDetail(projectKey, historyStack) {
    const project = projectData[projectKey];
    if (!project) return;

    const detailId = 'project-' + projectKey;
    if (windows[detailId]) { focusWindow(detailId); return; }

    let stack;
    if (Array.isArray(historyStack)) stack = historyStack;
    else if (typeof historyStack === 'string') stack = buildHistoryStack(historyStack);
    else stack = [];

    const content = {
        title: project.title,
        icon: 'images/projects.png',
        path: `C:\\Users\\Razvan\\Documents\\Projects\\${project.title.replace(/[^a-zA-Z0-9]/g, '_')}`,
        content: generateProjectDetailContent(project)
    };
    createWindow(detailId, content, stack);
}
