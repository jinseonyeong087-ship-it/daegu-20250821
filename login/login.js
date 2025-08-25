    /**
     * Vanilla JS Login Module
     * - Form validation (email & password)
     * - Async authenticate (switch between mock + real fetch)
     * - Graceful UI states (loading, errors)
     * - Accessible announcements via aria-live
     *
     * Integration guide:
     * 1) 바꿀 부분: LoginModule.authenticate()에서 실제 API 엔드포인트로 fetch 하세요.
     * 2) 서버는 가능하면 세션 쿠키(HTTP-only, SameSite=Strict/Lax)로 토큰을 내려주세요.
     *    - 로컬스토리지에 액세스 토큰 저장은 피하는 것이 안전합니다.
     * 3) CSRF: 폼 제출 시 서버가 CSRF 토큰을 Set-Cookie로 주고,
     *    이후 요청 헤더(X-CSRF-Token 등)로 함께 전송하는 패턴을 권장합니다.
     */

    export class LoginModule {
      /**
       * @param {HTMLFormElement} formEl
       * @param {{endpoint?: string, onSuccess?: Function, onError?: Function, useMock?: boolean}} options
       */
      constructor(formEl, options = {}) {
        if (!formEl) throw new Error('form element is required');
        this.form = formEl;
        this.email = formEl.querySelector('#email');
        this.password = formEl.querySelector('#password');
        this.remember = formEl.querySelector('#remember');
        this.submitBtn = formEl.querySelector('#submit');
        this.btnText = formEl.querySelector('.btn-text');
        this.spinner = formEl.querySelector('.spinner');
        this.emailError = formEl.querySelector('#email-error');
        this.passwordError = formEl.querySelector('#password-error');
        this.formMsg = formEl.querySelector('#form-msg');

        this.endpoint = options.endpoint || '/api/login';
        this.onSuccess = options.onSuccess || (() => {});
        this.onError = options.onError || (() => {});
        this.useMock = options.useMock ?? true; // 데모 기본값: mock 활성화

        this.bind();
        this.updateSubmitState();
      }

      bind() {
        this.form.addEventListener('input', () => this.updateSubmitState());
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
      }

      updateSubmitState() {
        const valid = this.validateEmail() & this.validatePassword(); // bitwise OK for boolean to 0/1
        this.submitBtn.disabled = !Boolean(valid);
      }

      validateEmail() {
        const value = this.email.value.trim();
        let msg = '';
        if (!value) msg = '이메일을 입력하세요.';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) msg = '올바른 이메일 형식이 아닙니다.';
        this.emailError.textContent = msg;
        return msg === '';
      }

      validatePassword() {
        const value = this.password.value;
        let msg = '';
        if (!value) msg = '비밀번호를 입력하세요.';
        else if (value.length < 8) msg = '8자 이상 입력하세요.';
        else if (!/[a-zA-Z]/.test(value) || !/\d/.test(value)) msg = '영문과 숫자를 포함해야 합니다.';
        this.passwordError.textContent = msg;
        return msg === '';
      }

      setLoading(loading) {
        this.form.classList.toggle('loading', loading);
        this.submitBtn.disabled = loading || !this.validateEmail() || !this.validatePassword();
        this.btnText.textContent = loading ? '로그인 중…' : '로그인';
      }

      announce(message, type = 'success') {
        this.formMsg.textContent = message;
        this.formMsg.className = type === 'success' ? 'success' : 'error';
      }

      async handleSubmit(e) {
        e.preventDefault();
        this.announce('');
        if (!this.validateEmail() || !this.validatePassword()) return;
        this.setLoading(true);
        try {
          const res = await this.authenticate({
            email: this.email.value.trim(),
            password: this.password.value,
            remember: this.remember.checked,
          });
          this.announce('로그인 성공! 곧 이동합니다.');
          this.onSuccess(res);
        } catch (err) {
          const message = err?.message || '로그인에 실패했습니다. 다시 시도하세요.';
          this.announce(message, 'error');
          this.onError(err);
        } finally {
          this.setLoading(false);
        }
      }

      /**
       * 실제 서비스에서는 이 메서드를 fetch로 교체하세요.
       * 서버는 200 OK에 세션 쿠키(HTTP-only)를 설정하고, 본문에는 최소한의 사용자 정보만 반환하도록 권장합니다.
       */
      async authenticate({ email, password, remember }) {
        if (this.useMock) {
          await new Promise(r => setTimeout(r, 800));
          if (email === 'demo@example.com' && password === 'Passw0rd!') {
            return { user: { id: 1, email, name: '데모 사용자' }, session: 'mock-session-id', remember };
          }
          throw new Error('이메일 또는 비밀번호가 올바르지 않습니다. (데모)');
        }
        // ▶ 실제 API 예시
        const resp = await fetch(this.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // 'X-CSRF-Token': getCsrfTokenFromCookie(), // 필요시 사용
          },
          credentials: 'include', // 세션 쿠키 전달
          body: JSON.stringify({ email, password, remember })
        });
        if (!resp.ok) {
          const data = await safeJson(resp);
          throw new Error(data?.message || `로그인 실패 (${resp.status})`);
        }
        return await resp.json();
      }
    }

    // 안전한 JSON 파싱
    async function safeJson(resp) {
      try { return await resp.json(); } catch { return null; }
    }

    // ---- Init ----
    const form = document.querySelector('#login-form');
    const login = new LoginModule(form, {
      endpoint: '/api/login',
      useMock: true, // 데모 체험용. 실제 연동 시 false 로 변경
      onSuccess: (data) => {
        // 실제 서비스: 라우터 이동 또는 대시보드로 리다이렉트
        console.log('로그인 성공:', data);
      },
      onError: (err) => console.warn('로그인 에러:', err)
    });

    // 외부에서 사용할 수 있도록 전역 노출(옵션)
    window.LoginModule = LoginModule;