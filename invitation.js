// 홈 전용 초대장 상태: 열림 → 닫는 중 → 닫힘
(() => {
  const invitation = document.getElementById("invitation");
  if (!invitation || typeof invitation.showModal !== "function") return;

  const buttons = invitation.querySelectorAll("button");
  let state = "open";
  let closeTimer;

  function finishClosing() {
    if (state === "closed") return;
    state = "closed";
    window.clearTimeout(closeTimer);
    invitation.close();
  }

  function openInvitation() {
    if (state !== "open") return;
    state = "closing";
    invitation.classList.add("is-closing");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finishClosing();
      return;
    }
    // 전환 이벤트가 발생하지 않아도 화면 잠금이 남지 않도록 보장합니다.
    closeTimer = window.setTimeout(finishClosing, 850);
  }

  buttons.forEach((button) => button.addEventListener("click", openInvitation));
  invitation.addEventListener("cancel", (event) => {
    event.preventDefault();
    openInvitation();
  });
  invitation.addEventListener("transitionend", (event) => {
    if (event.target === invitation && event.propertyName === "opacity" && state === "closing") {
      finishClosing();
    }
  });
  invitation.addEventListener("close", () => {
    state = "closed";
    window.clearTimeout(closeTimer);
    document.documentElement.classList.remove("invitation-open");
    // 메인 콘텐츠가 파싱된 뒤 닫힌 경우 첫 링크로 초점을 옮깁니다.
    document.querySelector(".nav .logo")?.focus({ preventScroll: true });
  });

  // 네이티브 모달이 배경 클릭과 Tab 이동을 차단합니다.
  invitation.showModal();
  document.documentElement.classList.add("invitation-open");
})();