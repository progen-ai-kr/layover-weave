// Contact Us 폼: 서버 전송 없이 문의 접수 상태를 안내하는 공개 UI입니다.
(() => {
  "use strict";
  const root = document.getElementById("contactFormRoot");
  if (!root || !window.React || !window.ReactDOM) return;
  const { createElement: h, useState, useEffect, useRef } = React;

  function ContactForm() {
    const [form, setForm] = useState({ name: "", email: "", type: "드레스 대여 문의", message: "" });
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState({});
    const toastTimer = useRef(null);
    useEffect(() => () => window.clearTimeout(toastTimer.current), []);
    const update = event => setForm(prev => ({ ...prev, [event.target.name]: event.target.value }));
    const submit = event => {
      event.preventDefault();
      const next = {};
      if (!form.name.trim()) next.name = "성함 또는 닉네임을 알려 주세요.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = "이메일 주소를 확인해 주세요.";
      if (!form.message.trim()) next.message = "문의 내용을 한 줄 이상 적어 주세요.";
      setErrors(next);
      if (Object.keys(next).length) return;
      setSubmitted(true);
      window.clearTimeout(toastTimer.current);
      toastTimer.current = window.setTimeout(() => setSubmitted(false), 5200);
      setForm({ name: "", email: "", type: "드레스 대여 문의", message: "" });
    };
    const field = (label, name, input) => h("label", { className: "contact-field" }, h("span", null, label), input, errors[name] && h("small", { className: "contact-error" }, errors[name]));
    return h(React.Fragment, null,
      h("div", { className: "contact-bubble contact-bubble--hello" }, h("span", { className: "contact-avatar", "aria-hidden": true }, "L"), h("p", null, "안녕하세요, 레이오버예요.\n무엇이 궁금하신가요?"), h("time", null, "10:00")),
      h("form", { className: "contact-form", onSubmit: submit, noValidate: true },
        h("div", { className: "contact-form-row" },
          field("성함 / 닉네임", "name", h("input", { name: "name", type: "text", value: form.name, onChange: update, placeholder: "불리고 싶은 이름을 적어 주세요", autoComplete: "name", required: true })),
          field("이메일 주소", "email", h("input", { name: "email", type: "email", value: form.email, onChange: update, placeholder: "reply@example.com", autoComplete: "email", required: true }))
        ),
        field("문의 유형", "type", h("select", { name: "type", value: form.type, onChange: update }, h("option", null, "드레스 대여 문의"), h("option", null, "굿즈 구매 문의"), h("option", null, "기타 브랜드 제휴"))),
        field("문의 내용", "message", h("textarea", { name: "message", value: form.message, onChange: update, placeholder: "레이오버에게 전하고 싶은 이야기를 적어 주세요", rows: 5, required: true })),
        h("div", { className: "contact-form-bottom" }, h("p", null, "보내주신 내용은 답변을 위해서만 사용됩니다."), h("button", { type: "submit", className: "contact-submit" }, "문의 보내기", h("span", { "aria-hidden": true }, "↗")))
      ),
      submitted && h("div", { className: "contact-toast", role: "status", "aria-live": "polite" }, h("span", { "aria-hidden": true }, "♡"), "eugenekseoul@gmail.com 주소로 문의가 정상 접수되었습니다.")
    );
  }
  ReactDOM.createRoot(root).render(h(ContactForm));
})();
