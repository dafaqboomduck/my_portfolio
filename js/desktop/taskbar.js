// ========== TASKBAR ==========
function addToTaskbar(id, content) {
  const taskbarWindows = document.getElementById('taskbarWindows');
  const item = document.createElement('div');
  item.className = 'taskbar-item active';
  item.id = 'taskbar-' + id;
  item.onclick = () => {
    if (windows[id].minimized) {
      windows[id].minimized = false;
      windows[id].element.classList.remove('minimized');
    }
    focusWindow(id);
  };
  item.innerHTML = `
        <div class="taskbar-preview">
            <img src="${content.icon}" alt="" style="width:32px; height:32px; display:block; margin:0 auto 5px auto;">
            <strong>${content.title}</strong>
        </div>
        <img src="${content.icon}" alt=""><span>${content.title}</span>`;
  taskbarWindows.appendChild(item);
}
