// 공개 갤러리 UI 예시입니다. 관리자 운영 데이터(portfolio.json)는 portfolio.js가 별도로 표시합니다.
// React 18.3.1의 createElement를 사용하므로 JSX 변환이나 빌드 도구가 필요하지 않습니다.
(() => {
  "use strict";
  const root = document.getElementById("lookbookGallery");
  if (!root) return;
  if (!window.React || !window.ReactDOM) {
    root.textContent = "컬렉션을 표시하지 못했습니다. 페이지를 새로고침해 주세요.";
    return;
  }

  const { createElement: h, useState, useRef, useEffect } = React;
  const examples = [
    {
      id: "morning", number: "01", category: "2025 S/S Lookbook",
      title: "이른 아침의 색을 담은 첫 로리타 드레스 컬렉션",
      image: "images/main-bg.png", alt: "백조와 아기 양, 파스텔 핑크 리본 일러스트",
      caption: "A soft beginning", tags: ["PASTEL ROMANCE", "LOOKBOOK"],
      description: "이른 아침의 은은한 빛과 부드러운 파스텔 컬러를 모티프로 한 드레스 컬렉션 콘셉트입니다. 백조와 리본의 섬세한 분위기를 통해 일상 속 로맨스 판타지를 표현합니다."
    },
    {
      id: "special", number: "02", category: "Special Edition",
      title: "아이돌 멤버 컬러 커스텀 드레스 대여 라이프",
      image: "images/ribbon.png", alt: "로맨틱한 핑크 레이스 리본 일러스트",
      caption: "Made for your moment", tags: ["MEMBER COLOR", "SPECIAL EDITION"],
      description: "좋아하는 멤버의 색과 나만의 취향을 함께 담는 커스텀 드레스 콘셉트입니다. 특별한 날의 설렘을 리본과 로맨틱한 컬러로 풀어냅니다. 대여 및 제작 가능 여부는 문의를 통해 확인해 주세요."
    },
    {
      id: "goods", number: "03", category: "Goods & Accessory",
      title: "일상을 포근하게 채우는 오뜨 꾸뛰르 굿즈",
      image: "images/key.png", alt: "백조 장식이 있는 빈티지 핑크 열쇠 일러스트",
      caption: "Little things, much love", tags: ["ROMANTIC OBJECT", "ACCESSORY"],
      description: "일상에 작은 판타지를 더하는 굿즈와 액세서리 콘셉트입니다. 빈티지 장식과 사랑스러운 디테일을 통해 오래 곁에 두고 싶은 소품의 분위기를 제안합니다."
    }
  ];

  function Gallery() {
    // 선택된 카드가 없으면 null, 있으면 해당 카드의 상세 모달을 엽니다.
    const [selected, setSelected] = useState(null);
    const dialogRef = useRef(null);
    const triggerRef = useRef(null);

    useEffect(() => {
      const dialog = dialogRef.current;
      if (selected) {
        dialog.showModal();
        document.documentElement.classList.add("lookbook-modal-open");
        dialog.querySelector("button").focus();
      } else {
        if (dialog.open) dialog.close();
        document.documentElement.classList.remove("lookbook-modal-open");
        triggerRef.current?.focus({ preventScroll: true });
      }
    }, [selected]);

    useEffect(() => () => {
      document.documentElement.classList.remove("lookbook-modal-open");
    }, []);

    const close = () => setSelected(null);
    function image(item, detail = false) {
      return h("div", { className: "lookbook-image lookbook-image--" + item.id + (detail ? " is-detail" : "") },
        h("img", { src: item.image, alt: item.alt, loading: detail ? "eager" : "lazy", decoding: "async" }),
        !detail && h("span", { className: "lookbook-image-number", "aria-hidden": true }, item.number),
        !detail && h("span", { className: "lookbook-image-caption", "aria-hidden": true }, item.caption)
      );
    }

    return h(React.Fragment, null,
      h("div", { className: "lookbook-grid" }, examples.map(item =>
        h("article", { className: "lookbook-card", key: item.id },
          h("button", {
            type: "button", className: "lookbook-card-button", "aria-haspopup": "dialog",
            "aria-label": item.category + ": " + item.title + " 상세 보기",
            onClick: event => { triggerRef.current = event.currentTarget; setSelected(item); }
          }, image(item),
          h("div", { className: "lookbook-card-copy" },
            h("p", { className: "lookbook-category" }, item.category),
            h("h3", null, item.title),
            h("div", { className: "lookbook-card-bottom" },
              h("span", null, "컬렉션 살펴보기"), h("span", { className: "lookbook-arrow", "aria-hidden": true }, "↗")
            )
          ))
        )
      )),
      // 네이티브 dialog로 포커스 가두기, 배경 비활성화, Escape 키를 지원합니다.
      h("dialog", {
        ref: dialogRef, className: "lookbook-dialog", "aria-labelledby": "lookbook-detail-title",
        "aria-describedby": "lookbook-detail-description", onClose: close,
        onCancel: event => { event.preventDefault(); close(); },
        onClick: event => {
          if (event.target !== event.currentTarget) return;
          const rect = event.currentTarget.getBoundingClientRect();
          if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close();
        }
      }, selected && h(React.Fragment, null,
        h("button", { type: "button", className: "lookbook-close", onClick: close, "aria-label": "상세 보기 닫기" }, "×"),
        h("div", { className: "lookbook-detail-layout" }, image(selected, true),
          h("div", { className: "lookbook-detail-copy" },
            h("p", { className: "lookbook-category" }, selected.category),
            h("h2", { id: "lookbook-detail-title" }, selected.title),
            h("p", { id: "lookbook-detail-description" }, selected.description),
            h("ul", { className: "lookbook-tags", "aria-label": "컬렉션 키워드" }, selected.tags.map(tag => h("li", { key: tag }, tag))),
            h("p", { className: "lookbook-preview-note" }, "콘셉트 예시 · 이미지는 실제 제품 사진이 아닌 분위기 참고용 일러스트입니다."),
            h("a", { className: "lookbook-detail-link", href: "contact.html" }, "컬렉션 문의하기 ↗")
          )
        )
      ))
    );
  }

  ReactDOM.createRoot(root).render(h(Gallery));
})();
