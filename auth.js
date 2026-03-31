// auth.js — 로그인/회원가입/세션 관리
// ============================================================
// 세션 관리
// ============================================================
function isLoggedIn() { return sessionEnd && Date.now() < sessionEnd; }
function openLoginModal(target) {
  pendingPage = target;
  document.getElementById('loginNickname').value = '';
  document.getElementById('loginPassword').value = '';
  openModal('loginModal');
}
function openRegisterModal() {
  clearLoginError();
  closeModal('loginModal');
  ['regLicense','regNickname','regName','regClinic','regEmail','regContact','regPassword','regPasswordConfirm'].forEach(function(id){ document.getElementById(id).value=''; });
  document.getElementById('regPrivacyConsent').checked = false;
  clearRegError();
  openModal('registerModal');
}
function openPrivacyModal(e) {
  if (e) e.preventDefault();
  var html = getPrivacyHtml();
  document.getElementById('privacyContent').innerHTML = html;
  openModal('privacyModal');
}
function getPrivacyHtml() {
  var d = {
    en: {
      updated: 'Last updated: March 2026',
      s1t: '1. Data Controller',
      s1: 'BIOPLANT (Thailand) Co., Ltd. ("Dentalk") is the data controller for personal data collected through this application, in compliance with Thailand\'s Personal Data Protection Act B.E. 2562 (PDPA).',
      s2t: '2. Data We Collect',
      s2: ['Full name and dental license number', 'Clinic name and delivery address', 'Phone number, Line ID, and email address', 'Order history and product preferences'],
      s3t: '3. Purpose of Processing',
      s3: ['Account creation and identity verification', 'Processing and coordinating product orders', 'Sending order notifications via Line', 'Customer support and service improvement'],
      s4t: '4. Legal Basis',
      s4: 'Processing is based on your explicit consent given at registration. You may withdraw consent at any time by contacting us — this will not affect the lawfulness of prior processing.',
      s5t: '5. Data Retention',
      s5: 'Your data is retained while your account is active. Upon a valid deletion request, data will be removed within 30 days, unless retention is required by Thai law.',
      s6t: '6. Your Rights (Thailand PDPA)',
      s6: ['Right to access your personal data', 'Right to correct inaccurate data', 'Right to request erasure', 'Right to restrict processing', 'Right to data portability', 'Right to withdraw consent at any time', 'Right to object to processing'],
      s7t: '7. Contact',
      s7: 'To exercise your rights or for any privacy inquiries, contact us via Line: @bioplant_th or email: privacy@bioplant.co.th',
      s8t: '8. Right to Complain',
      s8: 'If you believe your rights have been violated, you may file a complaint with Thailand\'s Personal Data Protection Committee (PDPC) at pdpc.or.th.',
    },
    ko: {
      updated: '최종 업데이트: 2026년 3월',
      s1t: '1. 개인정보 처리자',
      s1: 'BIOPLANT (Thailand) Co., Ltd. ("Dentalk")은 태국 개인정보보호법 B.E. 2562 (PDPA)에 따라 본 앱을 통해 수집된 개인정보를 처리합니다.',
      s2t: '2. 수집 항목',
      s2: ['성명 및 의사 면허번호', '치과명 및 배송 주소', '전화번호, Line ID, 이메일 주소', '주문 내역 및 이용 기록'],
      s3t: '3. 수집 목적',
      s3: ['계정 생성 및 신원 확인', '제품 주문 처리 및 납품 조율', 'Line을 통한 주문 알림 발송', '고객 지원 및 서비스 개선'],
      s4t: '4. 법적 근거',
      s4: '개인정보 처리는 가입 시 제공한 명시적 동의를 근거로 합니다. 언제든지 동의를 철회할 수 있으며, 이는 철회 이전 처리의 적법성에 영향을 미치지 않습니다.',
      s5t: '5. 보유 기간',
      s5: '계정이 활성 상태인 동안 보유합니다. 유효한 삭제 요청 수령 후 30일 이내에 파기하며, 태국 법령에 의해 보존이 필요한 경우는 예외입니다.',
      s6t: '6. 이용자 권리 (태국 PDPA)',
      s6: ['개인정보 열람권', '부정확한 정보 정정권', '삭제 요청권', '처리 제한권', '데이터 이동권', '언제든지 동의 철회권', '처리 거부권'],
      s7t: '7. 연락처',
      s7: '권리 행사 및 개인정보 관련 문의: Line @bioplant_th | 이메일: privacy@bioplant.co.th',
      s8t: '8. 민원 제기',
      s8: '권리가 침해되었다고 판단되는 경우 태국 개인정보보호위원회(PDPC)에 민원을 제기할 수 있습니다. (pdpc.or.th)',
    },
    zh: {
      updated: '最后更新：2026年3月',
      s1t: '1. 数据控制者',
      s1: 'BIOPLANT（泰国）有限公司（"Dentalk"）依据泰国《个人数据保护法》B.E. 2562（PDPA）处理通过本应用收集的个人数据。',
      s2t: '2. 收集的数据',
      s2: ['姓名及牙科执照号码', '诊所名称及配送地址', '电话号码、Line ID、电子邮件', '订单记录及产品偏好'],
      s3t: '3. 处理目的',
      s3: ['账户创建及身份验证', '产品订单处理与配送协调', '通过Line发送订单通知', '客户支持及服务改进'],
      s4t: '4. 法律依据',
      s4: '数据处理基于您在注册时提供的明确同意。您可随时撤回同意，撤回不影响之前处理行为的合法性。',
      s5t: '5. 数据保留',
      s5: '您的数据将在账户有效期间保留。收到有效删除申请后30天内删除，泰国法律要求保留的数据除外。',
      s6t: '6. 您的权利（泰国PDPA）',
      s6: ['查阅个人数据的权利', '更正不准确数据的权利', '申请删除的权利', '限制处理的权利', '数据可携权', '随时撤回同意的权利', '反对数据处理的权利'],
      s7t: '7. 联系方式',
      s7: '行使权利或隐私相关咨询：Line: @bioplant_th | 邮件: privacy@bioplant.co.th',
      s8t: '8. 投诉权利',
      s8: '如您认为权益受损，可向泰国个人数据保护委员会（PDPC）投诉，网址：pdpc.or.th',
    },
    th: {
      updated: 'อัปเดตล่าสุด: มีนาคม 2026',
      s1t: '1. ผู้ควบคุมข้อมูลส่วนบุคคล',
      s1: 'บริษัท BIOPLANT (Thailand) Co., Ltd. ("Dentalk") เป็นผู้ควบคุมข้อมูลส่วนบุคคลที่เก็บรวบรวมผ่านแอปพลิเคชันนี้ ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA)',
      s2t: '2. ข้อมูลที่เก็บรวบรวม',
      s2: ['ชื่อ-นามสกุล และหมายเลขใบอนุญาตทันตแพทย์', 'ชื่อคลินิก และที่อยู่สำหรับจัดส่ง', 'หมายเลขโทรศัพท์ Line ID และอีเมล', 'ประวัติการสั่งซื้อและความชอบด้านผลิตภัณฑ์'],
      s3t: '3. วัตถุประสงค์ในการประมวลผล',
      s3: ['การสร้างบัญชีและการยืนยันตัวตน', 'การประมวลผลคำสั่งซื้อและการประสานงานจัดส่ง', 'การส่งการแจ้งเตือนคำสั่งซื้อผ่าน Line', 'การสนับสนุนลูกค้าและการปรับปรุงบริการ'],
      s4t: '4. ฐานทางกฎหมาย',
      s4: 'การประมวลผลข้อมูลอาศัยความยินยอมโดยชัดแจ้งที่ท่านให้ไว้ในขณะลงทะเบียน ท่านสามารถถอนความยินยอมได้ทุกเมื่อโดยการติดต่อเรา ซึ่งไม่กระทบต่อความชอบด้วยกฎหมายของการประมวลผลก่อนการถอน',
      s5t: '5. ระยะเวลาในการเก็บรักษาข้อมูล',
      s5: 'ข้อมูลของท่านจะถูกเก็บรักษาตลอดระยะเวลาที่บัญชียังใช้งานอยู่ เมื่อได้รับคำขอลบบัญชีที่ถูกต้อง ข้อมูลจะถูกลบภายใน 30 วัน ยกเว้นกรณีที่กฎหมายไทยกำหนดให้เก็บรักษา',
      s6t: '6. สิทธิของเจ้าของข้อมูล (PDPA ไทย)',
      s6: ['สิทธิในการเข้าถึงข้อมูลส่วนบุคคล', 'สิทธิในการแก้ไขข้อมูลที่ไม่ถูกต้อง', 'สิทธิในการขอลบข้อมูล', 'สิทธิในการจำกัดการประมวลผล', 'สิทธิในการโอนย้ายข้อมูล', 'สิทธิในการถอนความยินยอมได้ทุกเมื่อ', 'สิทธิในการคัดค้านการประมวลผล'],
      s7t: '7. ช่องทางติดต่อ',
      s7: 'สำหรับการใช้สิทธิหรือสอบถามเกี่ยวกับความเป็นส่วนตัว: Line: @bioplant_th | อีเมล: privacy@bioplant.co.th',
      s8t: '8. สิทธิในการร้องเรียน',
      s8: 'หากท่านเชื่อว่าสิทธิของท่านถูกละเมิด ท่านมีสิทธิ์ยื่นเรื่องร้องเรียนต่อสำนักงานคณะกรรมการคุ้มครองข้อมูลส่วนบุคคล (PDPC) ที่ pdpc.or.th',
    },
    vi: {
      updated: 'Cập nhật lần cuối: Tháng 3 năm 2026',
      s1t: '1. Đơn vị kiểm soát dữ liệu',
      s1: 'Công ty BIOPLANT (Thailand) Co., Ltd. ("Dentalk") là đơn vị kiểm soát dữ liệu cá nhân thu thập qua ứng dụng này, tuân thủ Luật Bảo vệ Dữ liệu Cá nhân Thái Lan B.E. 2562 (PDPA).',
      s2t: '2. Dữ liệu chúng tôi thu thập',
      s2: ['Họ tên đầy đủ và số giấy phép hành nghề nha khoa', 'Tên phòng khám và địa chỉ giao hàng', 'Số điện thoại, Line ID và địa chỉ email', 'Lịch sử đặt hàng và sở thích sản phẩm'],
      s3t: '3. Mục đích xử lý',
      s3: ['Tạo tài khoản và xác minh danh tính', 'Xử lý và phối hợp giao hàng đơn đặt hàng', 'Gửi thông báo đơn hàng qua Line', 'Hỗ trợ khách hàng và cải thiện dịch vụ'],
      s4t: '4. Cơ sở pháp lý',
      s4: 'Việc xử lý dựa trên sự đồng ý rõ ràng của bạn khi đăng ký. Bạn có thể rút lại sự đồng ý bất cứ lúc nào — điều này không ảnh hưởng đến tính hợp pháp của việc xử lý trước đó.',
      s5t: '5. Thời hạn lưu trữ dữ liệu',
      s5: 'Dữ liệu được lưu giữ trong thời gian tài khoản hoạt động. Sau khi nhận yêu cầu xóa hợp lệ, dữ liệu sẽ bị xóa trong 30 ngày, trừ khi pháp luật Thái Lan yêu cầu lưu giữ.',
      s6t: '6. Quyền của bạn (PDPA Thái Lan)',
      s6: ['Quyền truy cập dữ liệu cá nhân', 'Quyền sửa dữ liệu không chính xác', 'Quyền yêu cầu xóa dữ liệu', 'Quyền hạn chế xử lý', 'Quyền chuyển dữ liệu', 'Quyền rút lại sự đồng ý bất cứ lúc nào', 'Quyền phản đối việc xử lý'],
      s7t: '7. Liên hệ',
      s7: 'Để thực hiện quyền hoặc có thắc mắc về quyền riêng tư, liên hệ qua Line: @bioplant_th hoặc email: privacy@bioplant.co.th',
      s8t: '8. Quyền khiếu nại',
      s8: 'Nếu bạn cho rằng quyền của mình bị vi phạm, bạn có thể nộp khiếu nại lên Ủy ban Bảo vệ Dữ liệu Cá nhân Thái Lan (PDPC) tại pdpc.or.th.',
    },
    es: {
      updated: 'Última actualización: Marzo 2026',
      s1t: '1. Responsable del tratamiento',
      s1: 'BIOPLANT (Thailand) Co., Ltd. ("Dentalk") es el responsable del tratamiento de los datos personales recopilados a través de esta aplicación, de conformidad con la Ley de Protección de Datos Personales de Tailandia B.E. 2562 (PDPA).',
      s2t: '2. Datos que recopilamos',
      s2: ['Nombre completo y número de licencia dental', 'Nombre de la clínica y dirección de entrega', 'Número de teléfono, Line ID y correo electrónico', 'Historial de pedidos y preferencias de productos'],
      s3t: '3. Finalidad del tratamiento',
      s3: ['Creación de cuenta y verificación de identidad', 'Tramitación y coordinación de entrega de pedidos', 'Envío de notificaciones de pedidos por Line', 'Atención al cliente y mejora del servicio'],
      s4t: '4. Base legal',
      s4: 'El tratamiento se basa en tu consentimiento explícito proporcionado al registrarte. Puedes retirar el consentimiento en cualquier momento contactándonos — esto no afecta la licitud del tratamiento anterior.',
      s5t: '5. Conservación de datos',
      s5: 'Tus datos se conservan mientras tu cuenta esté activa. Ante una solicitud válida de eliminación, los datos se borrarán en 30 días, salvo que la ley tailandesa exija su conservación.',
      s6t: '6. Tus derechos (PDPA Tailandia)',
      s6: ['Derecho de acceso a tus datos personales', 'Derecho de rectificación de datos inexactos', 'Derecho de supresión', 'Derecho a la limitación del tratamiento', 'Derecho a la portabilidad de datos', 'Derecho a retirar el consentimiento en cualquier momento', 'Derecho de oposición al tratamiento'],
      s7t: '7. Contacto',
      s7: 'Para ejercer tus derechos o cualquier consulta de privacidad, contáctanos por Line: @bioplant_th o email: privacy@bioplant.co.th',
      s8t: '8. Derecho de reclamación',
      s8: 'Si consideras que se han vulnerado tus derechos, puedes presentar una reclamación ante el Comité de Protección de Datos Personales de Tailandia (PDPC) en pdpc.or.th.',
    },
  };
  var x = d[currentLang] || d.en;
  var listHtml = function(items) {
    return '<ul class="space-y-1 list-disc list-inside">' + items.map(function(i){ return '<li>' + i + '</li>'; }).join('') + '</ul>';
  };
  return '<div class="space-y-4 text-xs text-slate-600">'
    + '<p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">' + x.updated + '</p>'
    + '<div><p class="font-black text-slate-800 text-sm mb-1">' + x.s1t + '</p><p>' + x.s1 + '</p></div>'
    + '<div><p class="font-black text-slate-800 text-sm mb-1">' + x.s2t + '</p>' + listHtml(x.s2) + '</div>'
    + '<div><p class="font-black text-slate-800 text-sm mb-1">' + x.s3t + '</p>' + listHtml(x.s3) + '</div>'
    + '<div><p class="font-black text-slate-800 text-sm mb-1">' + x.s4t + '</p><p>' + x.s4 + '</p></div>'
    + '<div><p class="font-black text-slate-800 text-sm mb-1">' + x.s5t + '</p><p>' + x.s5 + '</p></div>'
    + '<div><p class="font-black text-slate-800 text-sm mb-1">' + x.s6t + '</p>' + listHtml(x.s6) + '</div>'
    + '<div><p class="font-black text-slate-800 text-sm mb-1">' + x.s7t + '</p><p>' + x.s7 + '</p></div>'
    + '<div class="bg-blue-50 rounded-xl p-3"><p class="font-black text-slate-800 text-sm mb-1">' + x.s8t + '</p><p class="text-blue-700">' + x.s8 + '</p></div>'
    + '</div>';
}
function showRegError(msg) {
  var el = document.getElementById('regError');
  if (!el) return;
  el.textContent = msg;
  el.classList.remove('hidden');
  el.scrollIntoView({ behavior:'smooth', block:'nearest' });
}
function clearRegError() {
  var el = document.getElementById('regError');
  if (el) el.classList.add('hidden');
}
async function submitRegistration() {
  clearRegError();
  var lic      = document.getElementById('regLicense').value.trim();
  var nickname = document.getElementById('regNickname').value.trim();
  var name     = document.getElementById('regName').value.trim();
  var clinic   = document.getElementById('regClinic').value.trim();
  var email    = document.getElementById('regEmail').value.trim();
  var contact  = document.getElementById('regContact').value.trim();
  var taxId    = (document.getElementById('regTaxId') || {}).value ? document.getElementById('regTaxId').value.trim() : '';
  var password = document.getElementById('regPassword').value.trim();
  var passwordConfirm = document.getElementById('regPasswordConfirm').value.trim();
  if (!lic || !nickname || !name || !clinic || !email || !contact || !password || !passwordConfirm) {
    showRegError(t('reg_error')); return;
  }
  if (password !== passwordConfirm) {
    showRegError(t('reg_pwd_mismatch')); return;
  }
  if (!document.getElementById('regPrivacyConsent').checked) {
    showRegError(t('reg_privacy_error')); return;
  }
  var btn = document.getElementById('regSubmitBtn');
  btn.disabled = true;
  btn.textContent = t('reg_submitting');
  try {
    var res = await authRegister({ licenseNumber:lic, doctorName:name, clinicName:clinic, contact:contact, nickname:nickname, email:email, password:password, taxId:taxId });
    btn.disabled = false;
    btn.textContent = t('reg_submit');
    if (res.status === 409) { showRegError(t('reg_duplicate')); return; }
    if (!res.ok) { showRegError(t('reg_network_error')); return; }
    showToast(t('reg_success'), 'success');
    // GA4 sign_up tracking
    if (typeof gtag === 'function') gtag('event', 'sign_up', { method: 'license' });
    closeModal('registerModal');
  } catch(e) {
    btn.disabled = false;
    btn.textContent = t('reg_submit');
    showRegError(t('reg_network_error'));
  }
}
// ── Supabase 사용자 검증 — supabase.js의 authLogin() 사용 ────────
async function verifyUser(nickname, password) {
  return authLogin(nickname, password);
}
function showLoginError(msg) {
  var el = document.getElementById('loginError');
  if (!el) return;
  el.textContent = msg;
  el.classList.remove('hidden');
}
function clearLoginError() {
  var el = document.getElementById('loginError');
  if (el) el.classList.add('hidden');
}
async function handleLogin() {
  clearLoginError();
  const nick = document.getElementById('loginNickname').value.trim();
  const pwd  = document.getElementById('loginPassword').value.trim();
  if (!nick || !pwd) { showLoginError(t('login_error')); return; }
  // 로딩 상태
  const btn = document.getElementById('loginBtn');
  btn.disabled = true;
  btn.textContent = t('login_verifying');
  const result = await verifyUser(nick, pwd);
  btn.disabled = false;
  btn.textContent = t('login_btn');
  if (!result.ok) {
    var errMsg = result.reason === 'network'    ? t('login_network_error')
               : result.reason === 'not_active' ? t('login_not_found')
               : t('login_not_found');
    showLoginError(errMsg);
    return;
  }
  // 로그인 성공 — Supabase 데이터 우선, localStorage 폴백
  var lic = result.licenseNum;
  var profileStr = localStorage.getItem('dentalk_profile_' + lic);
  var local      = profileStr ? JSON.parse(profileStr) : {};
  currentUser = {
    licenseNum: lic,
    nickname:   result.nickname   || local.nickname   || nick,
    email:      result.email      || local.email      || '',
    phone:      result.phone      || local.phone      || '',
    address:    result.address    || local.address    || '',
    clinicName: result.clinicName || local.clinicName || '',
    doctorName: result.doctorName || '',
    role:          result.role          || 'user',
    leaderRegion:  result.leaderRegion  || '',
    leaderTitle:   result.leaderTitle   || '',
  };
  // Supabase에서 받은 최신 데이터를 localStorage에도 동기화
  var sync = { nickname:currentUser.nickname, email:currentUser.email, phone:currentUser.phone, address:currentUser.address, clinicName:currentUser.clinicName, doctorName:currentUser.doctorName };
  localStorage.setItem('dentalk_profile_' + lic, JSON.stringify(sync));
  sessionEnd = Date.now() + 365*24*60*60*1000;
  extShown   = false;
  sessionStorage.setItem('dentalk_session', JSON.stringify({ user: currentUser, sessionEnd: sessionEnd }));
  var licDisp = document.getElementById('licenseDisplay');
  if (licDisp) licDisp.textContent = currentUser.nickname;
  var sideNick = document.getElementById('sideNickname');
  if (sideNick) sideNick.textContent = currentUser.nickname;
  document.getElementById('sideLoginArea').classList.add('hidden');
  document.getElementById('sideLoggedArea').classList.remove('hidden');
  // 헤더 닉네임 배지
  var hNick = document.getElementById('headerNickBadge');
  var hNickTxt = document.getElementById('headerNickText');
  if (hNick && hNickTxt) { hNickTxt.textContent = currentUser.nickname; hNick.classList.add('show'); }
  var hLoginBtn = document.getElementById('headerLoginBtn');
  if (hLoginBtn) hLoginBtn.classList.add('hide');
  var hLogoutBtn = document.getElementById('headerLogoutBtn');
  if (hLogoutBtn) { hLogoutBtn.classList.remove('hidden'); hLogoutBtn.classList.add('show'); }
  updateNavLocks();
  updateNicknameDisplays();
  closeModal('loginModal');
  // 알림 배지 업데이트
  updateNotifBadge();
  updateMsgBadge();
  // 로그인 직후 CNC 주문 로드 → 설정 페이지 요약에 반영
  loadOrdersFromSupabase().then(function() { renderProfileSettings(); });
  renderProfileSettings(); // 로딩 전 빈 화면 방지용 즉시 렌더
  if (isAdmin()) {
    document.body.classList.add('is-admin');
    goPage('factory');
    renderAdminPanel();
    pendingPage = null;
    return;
  }
  if (pendingPage) { goPage(pendingPage); pendingPage = null; }
}
function tickSession() {
  if (!sessionEnd) return;
  const rem = Math.max(0, Math.floor((sessionEnd - Date.now()) / 1000));
  const m = Math.floor(rem/60), s = rem%60;
  const txt = m + ':' + String(s).padStart(2,'0');
  const el  = document.getElementById('timerText');
  const bdg = document.getElementById('timerBadge');
  const sd  = document.getElementById('sideTimer');
  if (el)  el.textContent  = txt;
  if (sd)  sd.textContent  = t('side_remain') + ' ' + txt;
  if (el)  el.className    = rem<=300 ? 'text-[11px] font-black text-red-400 font-mono' : 'text-[11px] font-black text-green-300 font-mono';
  if (bdg) bdg.className   = rem<=300 ? 'flex items-center gap-1 bg-red-500/20 rounded-xl px-2 py-1.5 animate-pulse' : 'flex items-center gap-1 bg-white/10 rounded-xl px-2 py-1.5';
  if (rem<=300 && rem>0 && !extShown) {
    extShown = true;
    document.getElementById('extendRemain').textContent = m + ':' + String(s).padStart(2,'0');
    openModal('extendModal');
  }
  if (rem<=0) forceLogout();
}
function extendSession() {
  sessionEnd = Date.now() + 30*60*1000;
  extShown   = false;
  sessionStorage.setItem('dentalk_session', JSON.stringify({ user: currentUser, sessionEnd: sessionEnd }));
  closeModal('extendModal');
}
function forceLogout() {
  clearInterval(sessionTimer); sessionTimer=null; sessionEnd=null; extShown=false;
  sessionStorage.removeItem('dentalk_session');
  document.body.classList.remove('is-admin');
  currentUser = { licenseNum:'', nickname:'', email:'', phone:'', address:'', clinicName:'', doctorName:'', role:'' };
  document.getElementById('sideLoginArea').classList.remove('hidden');
  document.getElementById('sideLoggedArea').classList.add('hidden');
  document.getElementById('timerWrap').classList.add('hidden');
  var hNick = document.getElementById('headerNickBadge');
  if (hNick) hNick.classList.remove('show');
  var hLoginBtn = document.getElementById('headerLoginBtn');
  if (hLoginBtn) hLoginBtn.classList.remove('hide');
  var hLogoutBtn = document.getElementById('headerLogoutBtn');
  if (hLogoutBtn) { hLogoutBtn.classList.add('hidden'); hLogoutBtn.classList.remove('show'); }
  updateNavLocks();
  renderProfileSettings();
  updateNicknameDisplays();
  if (LOCKED.includes(currentPage)) goPage('home');
  showToast(t('session_expired'), 'warning');
}
function doLogout() {
  clearInterval(sessionTimer); sessionTimer=null; sessionEnd=null; extShown=false;
  sessionStorage.removeItem('dentalk_session');
  currentUser = { licenseNum:'', nickname:'', email:'', phone:'', address:'', clinicName:'', doctorName:'', role:'' };
  cart=[]; updateBadge();
  document.getElementById('sideLoginArea').classList.remove('hidden');
  document.getElementById('sideLoggedArea').classList.add('hidden');
  document.getElementById('timerWrap').classList.add('hidden');
  var licDisp = document.getElementById('licenseDisplay');
  if (licDisp) licDisp.textContent = '-';
  var hNick = document.getElementById('headerNickBadge');
  if (hNick) hNick.classList.remove('show');
  var hLoginBtn = document.getElementById('headerLoginBtn');
  if (hLoginBtn) hLoginBtn.classList.remove('hide');
  var hLogoutBtn = document.getElementById('headerLogoutBtn');
  if (hLogoutBtn) { hLogoutBtn.classList.add('hidden'); hLogoutBtn.classList.remove('show'); }
  updateNavLocks();
  renderProfileSettings();
  updateNicknameDisplays();
  if (LOCKED.includes(currentPage) || currentPage === 'factory') goPage('home');
  closeMenu();
}

// ============================================================
// 아이디 / 비밀번호 찾기
// ============================================================
function showFindId() {
  document.getElementById('findIdPanel').classList.remove('hidden');
  document.getElementById('findPwPanel').classList.add('hidden');
  document.getElementById('findIdResult').classList.add('hidden');
  document.getElementById('findIdInput').value = '';
}
function showFindPw() {
  document.getElementById('findPwPanel').classList.remove('hidden');
  document.getElementById('findIdPanel').classList.add('hidden');
  document.getElementById('findPwResult').classList.add('hidden');
  document.getElementById('findPwInput').value = '';
}
function hideFindPanels() {
  document.getElementById('findIdPanel').classList.add('hidden');
  document.getElementById('findPwPanel').classList.add('hidden');
}

function _maskEmail(email) {
  if (!email || email.indexOf('@') === -1) return '***';
  var parts = email.split('@');
  var name = parts[0];
  var domain = parts[1];
  if (name.length <= 2) return name[0] + '***@' + domain;
  return name.substring(0, 2) + '***@' + domain;
}

async function findMyId() {
  var input = document.getElementById('findIdInput').value.trim();
  var resultEl = document.getElementById('findIdResult');
  if (!input) { return; }
  resultEl.classList.remove('hidden');
  resultEl.textContent = '...';
  try {
    // phone으로 검색
    var rows = await sbGet('licenses', 'phone=eq.' + encodeURIComponent(input) + '&select=email,nickname');
    if (!rows || !rows.length) {
      // nickname으로 검색
      rows = await sbGet('licenses', 'nickname=eq.' + encodeURIComponent(input) + '&select=email,nickname');
    }
    if (rows && rows.length > 0) {
      var masked = _maskEmail(rows[0].email || '');
      resultEl.style.background = 'rgba(212,175,55,0.15)';
      resultEl.style.color = '#D4AF37';
      resultEl.textContent = t('find_id_result') + masked;
    } else {
      resultEl.style.background = 'rgba(239,68,68,0.15)';
      resultEl.style.color = '#fca5a5';
      resultEl.textContent = t('find_not_found');
    }
  } catch(e) {
    resultEl.style.background = 'rgba(239,68,68,0.15)';
    resultEl.style.color = '#fca5a5';
    resultEl.textContent = t('find_not_found');
  }
}

async function findMyPw() {
  var email = document.getElementById('findPwInput').value.trim();
  var resultEl = document.getElementById('findPwResult');
  if (!email) { return; }
  resultEl.classList.remove('hidden');
  resultEl.textContent = '...';
  try {
    // 이메일로 사용자 존재 확인
    var rows = await sbGet('licenses', 'email=eq.' + encodeURIComponent(email) + '&select=nickname,line_user_id');
    if (rows && rows.length > 0) {
      var user = rows[0];
      // LINE으로 관리자에게 비밀번호 재설정 요청 전송
      if (typeof sendLineAdminMsg === 'function') {
        sendLineAdminMsg('line_feedback_admin', {
          category: 'password_reset',
          title: 'Password reset request: ' + (user.nickname || email),
          nickname: email
        });
      }
      resultEl.style.background = 'rgba(212,175,55,0.15)';
      resultEl.style.color = '#D4AF37';
      resultEl.textContent = t('find_pw_sent');
    } else {
      resultEl.style.background = 'rgba(239,68,68,0.15)';
      resultEl.style.color = '#fca5a5';
      resultEl.textContent = t('find_not_found');
    }
  } catch(e) {
    resultEl.style.background = 'rgba(239,68,68,0.15)';
    resultEl.style.color = '#fca5a5';
    resultEl.textContent = t('find_not_found');
  }
}
