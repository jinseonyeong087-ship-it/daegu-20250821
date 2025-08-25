document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const submitBtn = document.getElementById("submit");

  // 👉 버튼 hover 효과
  submitBtn.addEventListener("mouseover", () => {
    submitBtn.querySelector(".btn-text").textContent = "👉 로그인";
  });
  submitBtn.addEventListener("mouseout", () => {
    submitBtn.querySelector(".btn-text").textContent = "로그인";
  });

  // ✅ 토스트 함수
  function showToast(message, type = "error") {
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.className = `toast ${type}`;
    document.body.appendChild(toast);

    // 중앙 상단 고정
    toast.style.position = "fixed";
    toast.style.top = "20px";
    toast.style.left = "50%";
    toast.style.transform = "translateX(-50%)";
    toast.style.padding = "12px 20px";
    toast.style.borderRadius = "8px";
    toast.style.color = "#fff";
    toast.style.fontWeight = "bold";
    toast.style.background =
      type === "error" ? "rgba(220,38,38,0.9)" : "rgba(34,197,94,0.9)";
    toast.style.zIndex = "9999";
    toast.style.opacity = "1";
    toast.style.transition = "opacity 0.5s ease";

    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 500);
    }, 2000);
  }

  // ✅ 입력 검증 + 버튼 활성화
  function validateInputs() {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    submitBtn.disabled = !(email && password.length >= 8);
  }

  emailInput.addEventListener("input", validateInputs);
  passwordInput.addEventListener("input", validateInputs);

  // ✅ 폼 제출 처리
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email) {
      showToast("이메일을 입력하세요 📧", "error");
      return;
    }
    if (password.length < 8) {
      showToast("비밀번호는 8자 이상 입력하세요 🔑", "error");
      return;
    }

    try {
      // (실제 서버 없으면 임시 실패 처리)
      const result = { success: false, message: "테스트 중" };

      if (result.success) {
        showToast("✅ 로그인 성공!", "success");
      } else {
        showToast(result.message || "로그인 실패 ❌", "error");
      }
    } catch (err) {
      showToast("네트워크 오류 발생 🚨", "error");
    }
  });
});

// form.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");

  form.innerHTML = `
    <div>
      <label for="email">이메일</label>
      <input id="email" name="email" type="email" placeholder="you@example.com"
             autocomplete="username" required />
      <p id="email-error" class="error" role="alert" aria-live="polite"></p>
    </div>

    <div>
      <label for="password">비밀번호</label>
      <input id="password" name="password" type="password"
             placeholder="영문, 숫자 포함 8자 이상"
             autocomplete="current-password" required minlength="8" />
      <p id="password-error" class="error" role="alert" aria-live="polite"></p>
    </div>

    <div class="row">
      <label class="checkbox">
        <input id="remember" type="checkbox" />
        로그인 상태 유지
      </label>
      <a href="#" class="link" id="forgot">비밀번호 찾기</a>
    </div>

    <div class="actions">
      <button id="submit" type="submit" disabled>
        <span class="spinner" aria-hidden="true"></span>
        <span class="btn-text">로그인</span>
      </button>
    </div>

    <p id="form-msg" class="success" aria-live="polite"></p>
  `;
});
