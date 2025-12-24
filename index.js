const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("fileInput");
const previewList = document.getElementById("previewList");
const uploadBtn = document.getElementById("uploadBtn");

let files = [];

dropZone.onclick = () => fileInput.click();

dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("dragover");
});
dropZone.addEventListener("dragleave", () =>
  dropZone.classList.remove("dragover")
);
dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("dragover");
  addFiles(e.dataTransfer.files);
});

fileInput.onchange = () => addFiles(fileInput.files);

function addFiles(selected) {
  [...selected].forEach((file) => {
    if (!file.type.startsWith("image/") && file.type !== "application/pdf")
      return;

    files.push(file);
    createPreview(file);
  });

  updateUploadButton();
}

function createPreview(file) {
  const item = document.createElement("div");
  item.className = "preview-item";

  const remove = document.createElement("button");
  remove.className = "remove-btn";
  remove.textContent = "×";
  remove.onclick = () => {
    files = files.filter((f) => f !== file);
    item.remove();
    updateUploadButton();
  };

  let media;
  if (file.type.startsWith("image/")) {
    media = document.createElement("img");
    media.src = URL.createObjectURL(file);
  } else {
    media = document.createElement("iframe");
    media.src = URL.createObjectURL(file);
  }

  const progressBg = document.createElement("div");
  progressBg.className = "progress-bg";

  const progress = document.createElement("div");
  progress.className = "progress-bar";
  progressBg.appendChild(progress);

  const status = document.createElement("div");
  status.className = "status ready";
  status.textContent = "Sẵn sàng";

  item.append(remove, media, progressBg, status);
  previewList.appendChild(item);

  file._ui = { progress, status, item };
}

uploadBtn.onclick = () => {
  files.forEach((file) => fakeUpload(file));
};
function fakeUpload(file) {
  const { progress, status, item } = file._ui;

  progress.style.width = "0%";
  progress.className = "progress-bar";

  status.textContent = "Đang tải lên...";
  status.className = "status uploading";

  let percentage = 0;

  const interval = setInterval(() => {
    percentage += Math.random() * 20;
    if (percentage >= 100) percentage = 100;
    progress.style.width = percentage + "%";

    if (percentage === 100) {
      clearInterval(interval);
      status.textContent = "Tải lên thành công";
      status.className = "status success";
      progress.classList.add("success");
      item.classList.add("fade-out");
      setTimeout(() => {
        files = files.filter((f) => f !== file);
        item.remove();
        updateUploadButton();
      }, 500); 
    }
  }, 300);
}

function updateUploadButton() {
  if (files.length === 0) {
    uploadBtn.disabled = true;
    uploadBtn.textContent = "Chưa có tệp để tải lên";
  } else {
    uploadBtn.disabled = false;
    uploadBtn.textContent = "Tải tệp lên";
  }
}
updateUploadButton();