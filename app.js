// ============================================================
// 상수 & 데이터
// ============================================================
const LOCKED = ['shop','forum','custom'];
const IMPLANT_BRANDS = ['BIOTEM N','BIOTEM R','Osstem US','Osstem TS','Straumann BL','Straumann TL','Nobel Active','Nobel Replace','Zimmer TSV','Dentium SuperLine','기타'];
const TOOTH_COLORS   = ['A1','A2','A3','A3.5','A4','B1','B2','B3','C1','C2','C3','D2','D3','BL (Bleach)'];
const ORDER_STAGES   = [
  {key:'submitted',   icon:'①'},
  {key:'confirmed',   icon:'②'},
  {key:'design_ready',icon:'③'},
  {key:'approved',    icon:'④'},
  {key:'milling',     icon:'⑤'},
  {key:'shipped',     icon:'⑥'},
  {key:'done',        icon:'⑦'},
];
const ADMIN_NICKNAMES = ['Admin', '관리자', 'admin'];
const LINE_PROXY_URL = 'https://dentalk-line.gungungu.workers.dev';
const LINE_USER_ID   = 'U6265c5810e5592b820c224588433c247';
// ── Supabase 면허 검증 ──────────────────────────────────────────
// Supabase 프로젝트 생성 후 아래 두 값을 교체하세요.
const SUPABASE_URL      = 'https://ikdlgnpjcmwbsrxvoxvd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlrZGxnbnBqY213YnNyeHZveHZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwMTA0MDYsImV4cCI6MjA4NzU4NjQwNn0.amIky4WslMDFBv30n9hcdJx-CWFBOdRvLR9rqwET-_o';
// ============================================================
// 상태
// ============================================================
let currentPage  = 'home';
let prevPage     = 'home';
let currentLang  = 'en';
let pendingLang  = null; // 저장 전 선택된 언어
let currentUser  = { licenseNum:'', nickname:'', email:'', phone:'', address:'', clinicName:'', doctorName:'' };
let cart         = [];
let currentProd  = null;
let tableQtys    = {};
let usedItems    = [
  {id:1,name:'Scan Body HSAM4007S',code:'HSAM4007S',price:1500,cond:'good',desc:'Used 2 times.',contact:'Line: dental_th',seller:'Dr. Kim',date:'2026-02-10',views:0,image:null},
  {id:2,name:'Q-Base QBAM4401S',code:'QBAM4401S',price:2000,cond:'new',desc:'Opened but never used.',contact:'Tel: 089-123-4567',seller:'Dr. Lee',date:'2026-02-18',views:0,image:null},
];
let posts        = [
  {id:1,category:'implant',title:'BIOPLANT Manufacturing Info',body:'Manufactured in Thailand with high precision.',author:'Admin',images:[],comments:[],views:0,date:'2026-02-10'},
  {id:2,category:'prosthetic',title:'보철 케이스 공유',body:'보철 제작 시 참고할 만한 케이스입니다.',author:'Dr. Lee',images:[],comments:[],views:0,date:'2026-02-20'},
];
let forumCategory     = 'implant';
let forumPhotos       = [];
let currentForumPostId = null;
let events_      = [{id:1,date:'2026-03-15',event:'BIOPLANT Factory Tour',loc:'Bangkok'}];
let customOrders = [];
let messages     = []; // {id,from,to,subject,body,date,read}
let caseCount    = 0;
let caseTeeth    = {};
// Session
let sessionEnd   = null;
let sessionTimer = null;
let extShown     = false;
let pendingPage  = null;
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
  closeModal('loginModal');
  ['regLicense','regNickname','regName','regClinic','regEmail','regContact','regPassword','regPasswordConfirm'].forEach(function(id){ document.getElementById(id).value=''; });
  document.getElementById('regPrivacyConsent').checked = false;
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
async function submitRegistration() {
  var lic      = document.getElementById('regLicense').value.trim();
  var nickname = document.getElementById('regNickname').value.trim();
  var name     = document.getElementById('regName').value.trim();
  var clinic   = document.getElementById('regClinic').value.trim();
  var email    = document.getElementById('regEmail').value.trim();
  var contact  = document.getElementById('regContact').value.trim();
  var password = document.getElementById('regPassword').value.trim();
  var passwordConfirm = document.getElementById('regPasswordConfirm').value.trim();
  if (!lic || !nickname || !name || !clinic || !email || !contact || !password || !passwordConfirm) {
    alert(t('reg_error')); return;
  }
  if (password !== passwordConfirm) {
    alert(t('reg_pwd_mismatch')); return;
  }
  if (!document.getElementById('regPrivacyConsent').checked) {
    alert(t('reg_privacy_error')); return;
  }
  var btn = document.getElementById('regSubmitBtn');
  btn.disabled = true;
  btn.textContent = t('reg_submitting');
  try {
    var res = await fetch(SUPABASE_URL + '/rest/v1/licenses', {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({ license_number:lic, doctor_name:name, clinic_name:clinic, contact:contact, nickname:nickname, email:email, password:password, is_active:false }),
    });
    btn.disabled = false;
    btn.textContent = t('reg_submit');
    if (res.status === 409) { alert(t('reg_duplicate')); return; }
    if (!res.ok) { alert(t('reg_network_error')); return; }
    alert(t('reg_success'));
    closeModal('registerModal');
  } catch(e) {
    btn.disabled = false;
    btn.textContent = t('reg_submit');
    alert(t('reg_network_error'));
  }
}
// ── Supabase 사용자 검증 (닉네임 + 비밀번호) ─────────────────────
async function verifyUser(nickname, password) {
  try {
    const url = SUPABASE_URL + '/rest/v1/licenses'
      + '?nickname=eq.' + encodeURIComponent(nickname)
      + '&password=eq.' + encodeURIComponent(password)
      + '&is_active=eq.true'
      + '&select=license_number,doctor_name,clinic_name,nickname,email,phone,address';
    const res = await fetch(url, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
      }
    });
    if (!res.ok) return { ok: false, reason: 'network' };
    const data = await res.json();
    if (!data.length) return { ok: false, reason: 'not_found' };
    return {
      ok: true,
      licenseNum: data[0].license_number || '',
      doctorName: data[0].doctor_name    || '',
      clinicName: data[0].clinic_name    || '',
      nickname:   data[0].nickname       || '',
      email:      data[0].email          || '',
      phone:      data[0].phone          || '',
      address:    data[0].address        || '',
    };
  } catch (e) {
    return { ok: false, reason: 'network' };
  }
}
async function handleLogin() {
  const nick = document.getElementById('loginNickname').value.trim();
  const pwd  = document.getElementById('loginPassword').value.trim();
  if (!nick || !pwd) { alert(t('login_error')); return; }
  // 로딩 상태
  const btn = document.getElementById('loginBtn');
  btn.disabled = true;
  btn.textContent = t('login_verifying');
  const result = await verifyUser(nick, pwd);
  btn.disabled = false;
  btn.textContent = t('login_btn');
  if (!result.ok) {
    alert(result.reason === 'network' ? t('login_network_error') : t('login_not_found'));
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
  };
  // Supabase에서 받은 최신 데이터를 localStorage에도 동기화
  var sync = { nickname:currentUser.nickname, email:currentUser.email, phone:currentUser.phone, address:currentUser.address, clinicName:currentUser.clinicName, doctorName:currentUser.doctorName };
  localStorage.setItem('dentalk_profile_' + lic, JSON.stringify(sync));
  sessionEnd = Date.now() + 30*60*1000;
  extShown   = false;
  document.getElementById('licenseDisplay').textContent = currentUser.nickname;
  var sideNick = document.getElementById('sideNickname');
  if (sideNick) sideNick.textContent = currentUser.nickname;
  document.getElementById('sideLoginArea').classList.add('hidden');
  document.getElementById('sideLoggedArea').classList.remove('hidden');
  document.getElementById('timerWrap').classList.remove('hidden');
  // 헤더 닉네임 배지
  var hNick = document.getElementById('headerNickBadge');
  var hNickTxt = document.getElementById('headerNickText');
  if (hNick && hNickTxt) { hNickTxt.textContent = currentUser.nickname; hNick.classList.add('show'); }
  updateNavLocks();
  // 게시판 닉네임 표시 업데이트
  updateNicknameDisplays();
  // 프로필 정보 렌더링
  renderProfileSettings();
  if (sessionTimer) clearInterval(sessionTimer);
  sessionTimer = setInterval(tickSession, 1000);
  tickSession();
  closeModal('loginModal');
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
  closeModal('extendModal');
}
function forceLogout() {
  clearInterval(sessionTimer); sessionTimer=null; sessionEnd=null; extShown=false;
  currentUser = { licenseNum:'', nickname:'', email:'', phone:'', address:'', clinicName:'', doctorName:'' };
  document.getElementById('sideLoginArea').classList.remove('hidden');
  document.getElementById('sideLoggedArea').classList.add('hidden');
  document.getElementById('timerWrap').classList.add('hidden');
  var hNick = document.getElementById('headerNickBadge');
  if (hNick) hNick.classList.remove('show');
  updateNavLocks();
  renderProfileSettings();
  updateNicknameDisplays();
  if (LOCKED.includes(currentPage)) goPage('home');
  alert(t('session_expired'));
}
function doLogout() {
  clearInterval(sessionTimer); sessionTimer=null; sessionEnd=null; extShown=false;
  currentUser = { licenseNum:'', nickname:'', email:'', phone:'', address:'', clinicName:'', doctorName:'' };
  cart=[]; updateBadge();
  document.getElementById('sideLoginArea').classList.remove('hidden');
  document.getElementById('sideLoggedArea').classList.add('hidden');
  document.getElementById('timerWrap').classList.add('hidden');
  document.getElementById('licenseDisplay').textContent = '-';
  var hNick = document.getElementById('headerNickBadge');
  if (hNick) hNick.classList.remove('show');
  updateNavLocks();
  renderProfileSettings();
  updateNicknameDisplays();
  if (LOCKED.includes(currentPage)) goPage('home');
  closeMenu();
}
// ============================================================
// 메뉴 & 페이지 전환
// ============================================================
let menuOpen = false;
function toggleMenu() { menuOpen ? closeMenu() : openMenu(); }
function openMenu() {
  menuOpen = true;
  document.getElementById('sideMenu').classList.add('open');
  document.getElementById('sideOverlay').classList.add('open');
  document.getElementById('hb1').style.cssText = 'transform:translateY(8px) rotate(45deg)';
  document.getElementById('hb2').style.cssText = 'opacity:0';
  document.getElementById('hb3').style.cssText = 'transform:translateY(-8px) rotate(-45deg)';
}
function closeMenu() {
  menuOpen = false;
  document.getElementById('sideMenu').classList.remove('open');
  document.getElementById('sideOverlay').classList.remove('open');
  document.getElementById('hb1').style.cssText = '';
  document.getElementById('hb2').style.cssText = '';
  document.getElementById('hb3').style.cssText = '';
}
// ── 전역 네비 드롭다운 (position:fixed — overflow 클리핑 없음) ──────
function openNavDropdown(type, event) {
  event.stopPropagation();
  // 잠긴 페이지는 로그인 먼저
  if (LOCKED.includes(type) && !isLoggedIn()) {
    openLoginModal(type);
    return;
  }
  var drop  = document.getElementById('navDropdown');
  var inner = document.getElementById('navDropdownInner');
  if (!drop || !inner) return;
  // 같은 탭 재클릭 시 토글
  if (drop.style.display === 'block' && drop.dataset.type === type) {
    closeNavDropdown(); return;
  }
  drop.dataset.type = type;
  if (type === 'custom') {
    // 로그인 된 경우만 여기 도달 — 바로 페이지 이동
    closeNavDropdown();
    goPage('custom');
    return;
  } else if (type === 'forum') {
    inner.innerHTML =
      '<button class="nav-drop-item" onclick="goForumSub(\'implant\')">' +
        '<span>🦷</span><span data-i18n="forum_tab_implant">Implant</span>' +
      '</button>' +
      '<button class="nav-drop-item" onclick="goForumSub(\'prosthetic\')">' +
        '<span>💎</span><span data-i18n="forum_tab_prosthetic">Prosthetic</span>' +
      '</button>';
  } else if (type === 'shop') {
    inner.innerHTML = SHOP_CATEGORIES.map(function(cat) {
      return '<button class="nav-drop-item" onclick="goShopSub(\'' + cat.id + '\')">' +
        '<span>' + cat.name + '</span>' +
        '<span class="sub-desc">' + cat.desc + '</span>' +
      '</button>';
    }).join('');
  }
  applyLang();
  var btn  = event.currentTarget;
  var rect = btn.getBoundingClientRect();
  drop.style.left = Math.max(4, rect.left) + 'px';
  drop.style.top  = (rect.bottom + 4) + 'px';
  drop.style.display = 'block';
  requestAnimationFrame(function() {
    var dw = drop.offsetWidth;
    if (rect.left + dw > window.innerWidth - 4) {
      drop.style.left = Math.max(4, window.innerWidth - dw - 4) + 'px';
    }
  });
}
function closeNavDropdown() {
  var drop = document.getElementById('navDropdown');
  if (drop) { drop.style.display = 'none'; drop.dataset.type = ''; }
}
function goForumSub(cat) {
  closeNavDropdown();
  forumCategory = cat;
  goPage('forum');
}
function goShopSub(catId) {
  closeNavDropdown();
  if (LOCKED.includes('shop') && !isLoggedIn()) { openLoginModal('shop'); return; }
  var cat = SHOP_CATEGORIES.find(function(c){ return c.id === catId; });
  renderShopItems(catId);
  goDetailPage('shop-items', cat ? cat.name : catId, 'shop');
}
function updateNavLocks() {
  var loggedIn = isLoggedIn();
  ['shop','custom','forum'].forEach(function(id) {
    var lock = document.getElementById('ntab-lock-' + id);
    if (lock) lock.classList.toggle('hidden', loggedIn);
  });
}
document.addEventListener('click', function() { closeNavDropdown(); });

function updateNavTabs(activeId) {
  document.querySelectorAll('.nav-tab').forEach(function(t){ t.classList.remove('active'); });
  var nt = document.getElementById('ntab-' + activeId);
  if (nt) nt.classList.add('active');
  var navBar = document.getElementById('navTabBar');
  if (navBar) {
    navBar.style.display = '';
  }
}
function goPage(id) {
  if (LOCKED.includes(id) && !isLoggedIn()) { closeMenu(); openLoginModal(id); return; }
  document.querySelectorAll('.page').forEach(function(p){ p.classList.remove('active'); });
  document.querySelectorAll('.menu-btn').forEach(function(b){ b.classList.remove('active'); });
  document.getElementById('page-' + id).classList.add('active');
  var mb = document.getElementById('mb-' + id);
  if (mb) mb.classList.add('active');
  document.getElementById('pageTitle') && (document.getElementById('pageTitle').textContent = t('pt_' + id));
  updateNavTabs(id);
  currentPage = id;
  var btnBack = document.getElementById('btnBack');
  var btnMenu = document.getElementById('btnMenu');
  if (btnBack) { btnBack.classList.add('hidden'); btnBack.classList.remove('flex'); }
  if (btnMenu) btnMenu.classList.remove('hidden');
  closeMenu();
  window.scrollTo(0, 0);
  if (id === 'shop')     renderShop();
  if (id === 'used')     renderUsed();
  if (id === 'forum')  { renderForum(); updateNicknameDisplays(); }
  if (id === 'events')   renderEvents();
  if (id === 'custom')   { customTab('form'); resetCustomForm(); }
  if (id === 'factory')  renderAdminPanel();
  if (id === 'settings') renderProfileSettings();
}
function goDetailPage(pageId, title, fromPage) {
  prevPage = fromPage || currentPage;
  document.querySelectorAll('.page').forEach(function(p){ p.classList.remove('active'); });
  document.querySelectorAll('.menu-btn').forEach(function(b){ b.classList.remove('active'); });
  document.getElementById('page-' + pageId).classList.add('active');
  document.getElementById('pageTitle') && (document.getElementById('pageTitle').textContent = title);
  document.querySelectorAll('.nav-tab').forEach(function(t){ t.classList.remove('active'); });
  currentPage = pageId;
  var btnBack = document.getElementById('btnBack');
  var btnMenu = document.getElementById('btnMenu');
  if (btnMenu) btnMenu.classList.add('hidden');
  if (btnBack) { btnBack.classList.remove('hidden'); btnBack.classList.add('flex'); }
  closeMenu();
  window.scrollTo(0, 0);
}
function goBack() {
  goPage(prevPage || 'home');
}
// ============================================================
// 제품 DB
// ============================================================
const PRODUCTS = [
  {id:'ScanBodyIntraOral',category:'scan-body',title:'Scan Body (Intra-Oral)',subtitle:'Healing type · Special coating',price:3500,tableType:'dh',connections:[{label:'Ø4.0',type:'N'},{label:'Ø4.0',type:'R'},{label:'Ø5.0',type:'R'},{label:'Ø6.0',type:'R'}],heights:['5','7','9'],codes:[['HSAM4005S','HSAM4007S','HSAM4009S'],['HSAR4005S','HSAR4007S','HSAR4009S'],['HSAR5005S','HSAR5007S','HSAR5009S'],['HSAR6005S','HSAR6007S','HSAR6009S']]},
  {id:'ScanBodyModel',category:'scan-body',title:'Scan Body (Model)',subtitle:'Stone model scanbody',price:3500,tableType:'dh',connections:[{label:'Ø4.0',type:'N'},{label:'Ø4.0',type:'R'},{label:'Ø5.0',type:'R'},{label:'Ø6.0',type:'R'}],heights:['5','7','9'],codes:[['SMAM4005S','SMAM4007S','SMAM4009S'],['SMAR4005S','SMAR4007S','SMAR4009S'],['SMAR5005S','SMAR5007S','SMAR5009S'],['SMAR6005S','SMAR6007S','SMAR6009S']]},
  {id:'GeoMediIntraOral',category:'scan-body',title:'Scan Body (GeoMedi Intra-Oral)',subtitle:'Ti-6Al-4V ELI · Short 7.5mm / Long 11.5mm',price:4000,tableType:'simple',rows:[{label:'N',type:'N',items:[{code:'GMS-ASRS',size:'Short 7.5mm'},{code:'GMS-ASRL',size:'Long 11.5mm'}]},{label:'R',type:'R',items:[{code:'GMS-SUROS',size:'Short 7.5mm'},{code:'GMS-SUROL',size:'Long 11.5mm'}]}]},
  {id:'GeoMediModel',category:'scan-body',title:'Scan Body (GeoMedi Model)',subtitle:'Teflon-coating · Semipermanent',price:4000,tableType:'simple',rows:[{label:'N',type:'N',items:[{code:'SC-ASR',size:'Standard'}]},{label:'R',type:'R',items:[{code:'SC-SURO',size:'Standard'}]}]},
  {id:'QBase',category:'q-base',title:'Q-Base (Zirconia Abutment)',subtitle:'H=7mm · 3° taper',price:4500,tableType:'dh',connections:[{label:'Ø4.4',type:'N'},{label:'Ø5.5',type:'R'}],heights:['C1','C3','C5'],codes:[['QBAM4401S','QBAM4403S','QBAM4405S'],['QBAR5501S','QBAR5503S','QBAR5505S']]},
  {id:'ReadyMade30',category:'ready-made',title:'Ready Made Abutment (Ø3.0 N)',subtitle:'Dual purpose · Torque 20N',price:5000,tableType2:'hxc',colLabels:['C1','C2','C3','C4'],rowLabels:['H 4.0','H 5.5','H 7.0'],codeMatrix:[['SAAT 30514 MSA','SAAT 30524 MSA','SAAT 30534 MSA','SAAT 30544 MSA'],['SAAT 30515 MSA','SAAT 30525 MSA','SAAT 30535 MSA','SAAT 30545 MSA'],['SAAT 30517 MSA','SAAT 30527 MSA','SAAT 30537 MSA','SAAT 30547 MSA']]},
  {id:'ReadyMade45',category:'ready-made',title:'Ready Made Abutment (Ø4.5 R)',subtitle:'Dual purpose · Torque 30N',price:5000,tableType2:'hxc',colLabels:['C1','C2','C3','C4','C5','C6'],rowLabels:['H 4.0','H 5.5','H 7.0'],codeMatrix:[['SAAT 45514 SA','SAAT 45524 SA','SAAT 45534 SA','SAAT 45544 SA','',''],['SAAT 45515 SA','SAAT 45525 SA','SAAT 45535 SA','SAAT 45545 SA','SAAT 45555 SA','SAAT 45565 SA'],['SAAT 45517 SA','SAAT 45527 SA','SAAT 45537 SA','SAAT 45547 SA','SAAT 45557 SA','SAAT 45567 SA']]},
  {id:'ReadyMade55',category:'ready-made',title:'Ready Made Abutment (Ø5.5 R)',subtitle:'Dual purpose · Torque 30N',price:5000,tableType2:'hxc',colLabels:['C1','C2','C3','C4','C5','C6'],rowLabels:['H 4.0','H 5.5','H 7.0'],codeMatrix:[['SAAT 55614 SA','SAAT 55624 SA','SAAT 55634 SA','SAAT 55644 SA','',''],['SAAT 55615 SA','SAAT 55625 SA','SAAT 55635 SA','SAAT 55645 SA','SAAT 55655 SA','SAAT 55665 SA'],['SAAT 55617 SA','SAAT 55627 SA','SAAT 55637 SA','SAAT 55647 SA','SAAT 55657 SA','SAAT 55667 SA']]},
  {id:'ReadyMade65',category:'ready-made',title:'Ready Made Abutment (Ø6.5 R)',subtitle:'Dual purpose · Torque 30N',price:5000,tableType2:'hxc',colLabels:['C1','C2','C3','C4','C5','C6'],rowLabels:['H 4.0','H 5.5','H 7.0'],codeMatrix:[['SAAT 65714 SA','SAAT 65724 SA','SAAT 65734 SA','SAAT 65744 SA','',''],['SAAT 65715 SA','SAAT 65725 SA','SAAT 65735 SA','SAAT 65745 SA','SAAT 65755 SA','SAAT 65765 SA'],['SAAT 65717 SA','SAAT 65727 SA','SAAT 65737 SA','SAAT 65747 SA','SAAT 65757 SA','SAAT 65767 SA']]},
  {id:'TiBase',category:'ti-base',title:'Ti-base Abutment',subtitle:'Ti+Zr CAD/CAM · H=4mm',price:3800,tableType:'simple',rows:[{label:'Ø4.0',type:'N',items:[{code:'Tibs-011 MSA',size:'H=4mm'}]},{label:'Ø4.5',type:'R',items:[{code:'Tibs-012 SA',size:'H=4mm'}]}]},
  {id:'PreMilledN10',category:'pre-milled',title:'Pre-Milled Abutment (N · H10)',subtitle:'Milling compatible · Torque 20N',price:6000,tableType:'simple',rows:[{label:'AM',type:'N',items:[{code:'PLAM10H AM',size:'Hex'},{code:'PLAM10N AM',size:'NonHex'}]},{label:'VH',type:'N',items:[{code:'PLAM10H VH',size:'Hex'},{code:'PLAM10N VH',size:'NonHex'}]},{label:'RD',type:'N',items:[{code:'PLAM10H RD',size:'Hex'},{code:'PLAM10N RD',size:'NonHex'}]},{label:'II',type:'N',items:[{code:'PLAM10H II',size:'Hex'},{code:'PLAM10N II',size:'NonHex'}]}]},
  {id:'PreMilledR10',category:'pre-milled',title:'Pre-Milled Abutment (R · H10)',subtitle:'Milling compatible · Torque 30N',price:6000,tableType:'simple',rows:[{label:'AM',type:'R',items:[{code:'PLAR10H AM',size:'Hex'},{code:'PLAR10N AM',size:'NonHex'}]},{label:'VH',type:'R',items:[{code:'PLAR10H VH',size:'Hex'},{code:'PLAR10N VH',size:'NonHex'}]},{label:'RD',type:'R',items:[{code:'PLAR10H RD',size:'Hex'},{code:'PLAR10N RD',size:'NonHex'}]},{label:'II',type:'R',items:[{code:'PLAR10H II',size:'Hex'},{code:'PLAR10N II',size:'NonHex'}]}]},
  {id:'MultiUnit',category:'multi-unit',title:'Multi Unit (All-on-X)',subtitle:'Multi Abutment / Scan-Body / Ti-base',price:5500,tableType:'simple',rows:[{label:'Multi Abutment',type:'N',items:[{code:'DBTS MUA',size:'D Ø4.8'}]},{label:'Multi Scan-Body',type:'N',items:[{code:'AMSB48',size:'N+R'}]},{label:'3D LAB Analog N',type:'N',items:[{code:'DLAAF3415S',size:'Narrow'}]},{label:'3D LAB Analog R',type:'R',items:[{code:'DLAAF4015S',size:'Regular'}]}]},
  {id:'GeoMedi3DAnalog',category:'3d-analog',title:'3D-Analog (GeoMedi)',subtitle:'Stone & 3D printed model',price:3200,tableType:'simple',rows:[{label:'N',type:'N',items:[{code:'3D-ASR',size:'Standard'}]},{label:'R',type:'R',items:[{code:'3D-SURO',size:'Standard'}]}]},
];
// ============================================================
// SHOP
// ============================================================
const SHOP_CATEGORIES = [
  { id:'scan-body',   name:'Scan Body',   desc:'Intra-Oral / Model / GeoMedi', color:'from-blue-500 to-blue-800',
    svg:'<svg viewBox="0 0 52 72" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="26" cy="13" rx="20" ry="8" fill="white" opacity=".9"/><path d="M6 13 L14 54 L38 54 L46 13 Z" fill="white" opacity=".82"/><rect x="18" y="53" width="16" height="7" rx="2" fill="white" opacity=".7"/><rect x="16" y="59" width="20" height="7" rx="2.5" fill="white" opacity=".5"/></svg>' },
  { id:'q-base',      name:'Q-Base',      desc:'Zirconia Abutment',            color:'from-amber-400 to-amber-700',
    svg:'<svg viewBox="0 0 52 72" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="21" y="6" width="10" height="20" rx="2" fill="white" opacity=".85"/><rect x="18" y="11" width="16" height="1.5" rx="1" fill="white" opacity=".4"/><rect x="18" y="15" width="16" height="1.5" rx="1" fill="white" opacity=".4"/><rect x="18" y="19" width="16" height="1.5" rx="1" fill="white" opacity=".4"/><rect x="16" y="26" width="20" height="14" rx="2" fill="white" opacity=".82"/><rect x="12" y="39" width="28" height="8" rx="2" fill="white" opacity=".78"/><ellipse cx="26" cy="47" rx="19" ry="7" fill="white" opacity=".92"/><rect x="17" y="47" width="18" height="8" rx="1" fill="white" opacity=".65"/><ellipse cx="26" cy="55" rx="13" ry="5" fill="white" opacity=".5"/></svg>' },
  { id:'ready-made',  name:'Ready Made',  desc:'Ø3.0 · Ø4.5 · Ø5.5 · Ø6.5',  color:'from-slate-500 to-slate-800',
    svg:'<svg viewBox="0 0 44 70" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 4 L13 22 L31 22 Z" fill="white" opacity=".9"/><rect x="13" y="21" width="18" height="27" rx="2" fill="white" opacity=".85"/><rect x="11" y="47" width="22" height="7" rx="2" fill="white" opacity=".7"/><rect x="9" y="53" width="26" height="8" rx="2.5" fill="white" opacity=".5"/></svg>' },
  { id:'ti-base',     name:'Ti-Base',     desc:'CAD/CAM · Ti+Zr',             color:'from-cyan-500 to-cyan-800',
    svg:'<svg viewBox="0 0 50 60" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="25" cy="13" rx="15" ry="7" fill="white" opacity=".8"/><rect x="10" y="13" width="30" height="18" rx="2" fill="white" opacity=".85"/><rect x="13" y="30" width="24" height="8" rx="2" fill="white" opacity=".7"/><rect x="11" y="37" width="28" height="8" rx="2.5" fill="white" opacity=".5"/></svg>' },
  { id:'pre-milled',  name:'Pre-Milled',  desc:'N · H10 / R · H10',           color:'from-indigo-600 to-indigo-900',
    svg:'<svg viewBox="0 0 58 62" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="29" cy="14" rx="23" ry="11" fill="white" opacity=".9"/><rect x="21" y="14" width="16" height="20" rx="2" fill="white" opacity=".82"/><rect x="17" y="33" width="24" height="8" rx="2" fill="white" opacity=".7"/><rect x="15" y="40" width="28" height="8" rx="2.5" fill="white" opacity=".5"/></svg>' },
  { id:'multi-unit',  name:'Multi Unit',  desc:'All-on-X',                    color:'from-violet-600 to-violet-900',
    svg:'<svg viewBox="0 0 62 64" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="26" y="3" width="10" height="16" rx="2" fill="white" opacity=".9"/><rect x="14" y="17" width="34" height="10" rx="3" fill="white" opacity=".78"/><rect x="7" y="25" width="10" height="22" rx="2" fill="white" opacity=".72"/><rect x="22" y="25" width="18" height="22" rx="2" fill="white" opacity=".72"/><rect x="45" y="25" width="10" height="22" rx="2" fill="white" opacity=".72"/></svg>' },
  { id:'3d-analog',   name:'3D Analog',   desc:'GeoMedi',                     color:'from-teal-500 to-teal-800',
    svg:'<svg viewBox="0 0 44 70" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="16" y="5" width="12" height="12" rx="2" fill="white" opacity=".9"/><rect x="12" y="16" width="20" height="30" rx="2" fill="white" opacity=".82"/><rect x="15" y="20" width="5" height="22" rx="1" fill="white" opacity=".4"/><rect x="24" y="20" width="5" height="22" rx="1" fill="white" opacity=".4"/><rect x="13" y="45" width="18" height="7" rx="2" fill="white" opacity=".7"/><rect x="11" y="51" width="22" height="8" rx="2.5" fill="white" opacity=".5"/></svg>' },
];
function renderShop() {
  document.getElementById('shopCategoryList').innerHTML = SHOP_CATEGORIES.map(function(cat) {
    var count = PRODUCTS.filter(function(p){ return p.category === cat.id; }).length;
    return '<div onclick="openShopCategory(\'' + cat.id + '\')" class="bg-white rounded-xl overflow-hidden shadow-sm cursor-pointer active:scale-95 transition flex flex-col">' +
      '<div class="aspect-square bg-gradient-to-br ' + cat.color + ' flex items-center justify-center p-3">' + cat.svg + '</div>' +
      '<div class="p-1.5 flex flex-col gap-0.5">' +
        '<span class="inline-block text-[7px] font-bold px-1 py-0.5 rounded-full bg-blue-100 text-blue-700 self-start">' + count + ' ' + t('shop_items') + '</span>' +
        '<p class="font-bold text-slate-800 text-[11px] leading-snug">' + cat.name + '</p>' +
        '<p class="text-[9px] text-slate-400 leading-tight">' + cat.desc + '</p>' +
      '</div>' +
    '</div>';
  }).join('');
}
function openShopCategory(catId) {
  var cat = SHOP_CATEGORIES.find(function(c){ return c.id === catId; });
  if (!cat) return;
  renderShopItems(catId);
  goDetailPage('shop-items', cat.name, 'shop');
}
function renderShopItems(catId) {
  var items = PRODUCTS.filter(function(p){ return p.category === catId; });
  document.getElementById('shopItemsList').innerHTML = items.map(function(p) {
    return '<div onclick="openOrder(\'' + p.id + '\')" class="bg-white rounded-2xl shadow-sm p-5 flex justify-between items-center cursor-pointer border border-transparent active:border-blue-200 active:scale-[.98] transition">' +
      '<div class="flex-1 pr-3"><h3 class="font-black text-slate-800 text-sm leading-tight">' + p.title + '</h3><p class="text-[9px] text-slate-400 font-bold uppercase mt-1 leading-tight">' + p.subtitle + '</p></div>' +
      '<div class="text-right shrink-0"><p class="font-black text-blue-700 text-xs font-mono">' + p.price.toLocaleString() + ' THB</p><p class="text-[10px] text-blue-500 font-black mt-1">' + t('shop_select') + '</p></div>' +
    '</div>';
  }).join('');
}
function openOrder(pid) {
  currentProd = PRODUCTS.find(function(p){ return p.id === pid; });
  if (!currentProd) return;
  tableQtys   = {};
  document.getElementById('orderModalTitle').textContent = currentProd.title;
  document.getElementById('orderModalDesc').textContent  = currentProd.subtitle;
  document.getElementById('orderError').classList.add('hidden');
  renderOrderTable();
  openModal('orderModal');
}
function renderOrderTable() {
  var p = currentProd;
  var html = '';
  if (p.tableType2 === 'hxc') {
    html = '<div class="overflow-x-auto"><table class="w-full text-xs"><thead><tr><th class="text-left pb-2 text-slate-400 font-bold text-[10px] pr-2">H / C</th>';
    p.colLabels.forEach(function(c){ html += '<th class="text-center pb-2 text-slate-500 font-black text-[10px] px-1">' + c + '</th>'; });
    html += '</tr></thead><tbody>';
    p.rowLabels.forEach(function(row, ri) {
      html += '<tr class="border-t border-slate-100"><td class="py-3 pr-2 font-black text-xs text-slate-700 whitespace-nowrap">' + row + '</td>';
      p.colLabels.forEach(function(col, ci) {
        var code = p.codeMatrix[ri][ci];
        html += code
          ? '<td class="py-3 px-1"><div class="flex flex-col items-center gap-1"><span class="text-[8px] text-slate-400 font-mono text-center leading-tight">' + code + '</span><input type="number" min="0" value="0" class="qty-input" oninput="tableQtys[\'' + code + '\']=parseInt(this.value)||0"></div></td>'
          : '<td class="py-3 px-1 text-center text-slate-200">-</td>';
      });
      html += '</tr>';
    });
    html += '</tbody></table></div>';
  } else if (p.tableType === 'dh') {
    html = '<div class="overflow-x-auto"><table class="w-full text-xs"><thead><tr><th class="text-left pb-2 text-slate-400 font-bold text-[10px] pr-2">D / H</th>';
    p.heights.forEach(function(h){ html += '<th class="text-center pb-2 text-slate-500 font-black px-1">' + h + '</th>'; });
    html += '</tr></thead><tbody>';
    p.connections.forEach(function(conn, ci) {
      html += '<tr class="border-t border-slate-100"><td class="py-3 pr-2 whitespace-nowrap"><div class="flex items-center gap-1.5"><span class="text-[9px] font-black px-1.5 py-0.5 rounded-md tag-' + conn.type + '">' + conn.type + '</span><span class="font-black text-xs text-slate-700">' + conn.label + '</span></div></td>';
      p.heights.forEach(function(h, hi) {
        var code = p.codes[ci][hi];
        html += '<td class="py-3 px-1"><div class="flex flex-col items-center gap-1"><span class="text-[8px] text-slate-400 font-mono text-center">' + code + '</span><input type="number" min="0" value="0" class="qty-input" oninput="tableQtys[\'' + code + '\']=parseInt(this.value)||0"></div></td>';
      });
      html += '</tr>';
    });
    html += '</tbody></table></div>';
  } else {
    html = '<div class="space-y-2">';
    p.rows.forEach(function(row) {
      row.items.forEach(function(item) {
        html += '<div class="bg-slate-50 rounded-2xl p-4 flex justify-between items-center">' +
          '<div class="flex-1"><div class="flex items-center gap-2 mb-1"><span class="text-[9px] font-black px-1.5 py-0.5 rounded-md tag-' + row.type + '">' + row.type + '</span><span class="font-black text-xs text-slate-700">' + row.label + '</span><span class="text-[9px] text-slate-400 font-bold">' + item.size + '</span></div><p class="text-[9px] text-slate-500 font-mono font-bold">' + item.code + '</p></div>' +
          '<div class="flex items-center gap-2 ml-3">' +
            '<button onclick="stepQ(\'' + item.code + '\',-1)" class="w-7 h-7 rounded-full bg-slate-200 font-black text-sm flex items-center justify-center">−</button>' +
            '<input type="number" min="0" value="0" class="qty-input" id="qi-' + item.code.replace(/\s/g,'_') + '" oninput="tableQtys[\'' + item.code + '\']=parseInt(this.value)||0">' +
            '<button onclick="stepQ(\'' + item.code + '\',1)" class="w-7 h-7 rounded-full bg-blue-100 text-blue-600 font-black text-sm flex items-center justify-center">+</button>' +
          '</div></div>';
      });
    });
    html += '</div>';
  }
  html += '<p class="text-[9px] text-slate-400 mt-3 text-center font-bold">' + p.price.toLocaleString() + ' THB / ' + t('shop_each') + '</p>';
  document.getElementById('orderTable').innerHTML = html;
}
function stepQ(code, d) {
  var el = document.getElementById('qi-' + code.replace(/\s/g,'_'));
  if (!el) return;
  var v = Math.max(0, (parseInt(el.value)||0) + d);
  el.value = v; tableQtys[code] = v;
}
function addTableToCart() {
  var items = Object.entries(tableQtys).filter(function(e){ return e[1]>0; });
  if (!items.length) { document.getElementById('orderError').classList.remove('hidden'); return; }
  items.forEach(function(e) {
    var code=e[0], qty=e[1];
    var ex = cart.find(function(c){ return c.code===code; });
    if (ex) ex.qty += qty;
    else cart.push({name:currentProd.title, code:code, price:currentProd.price, qty:qty});
  });
  updateBadge();
  closeModal('orderModal');
}
// ============================================================
// 장바구니
// ============================================================
function updateBadge() {
  var tot = cart.reduce(function(s,c){ return s+c.qty; }, 0);
  var b = document.getElementById('cartBadge');
  b.textContent = tot;
  b.classList.toggle('hidden', tot===0);
}
function openCart() {
  if (!cart.length) { alert(t('cart_empty')); return; }
  renderCart(); openModal('cartModal');
}
function renderCart() {
  var total = 0;
  document.getElementById('cartItems').innerHTML = cart.map(function(item, i) {
    var sub = item.price * item.qty; total += sub;
    return '<div class="bg-slate-50 p-4 rounded-2xl">' +
      '<div class="flex justify-between items-start"><div class="flex-1 pr-2"><p class="font-black text-xs text-slate-800">' + item.name + '</p><p class="text-[9px] text-slate-400 font-mono uppercase font-bold mt-0.5">' + item.code + '</p></div>' +
      '<button onclick="removeCart(' + i + ')" class="text-red-400 font-bold text-xs">✕</button></div>' +
      '<div class="flex items-center justify-between mt-3">' +
        '<div class="flex items-center gap-2">' +
          '<button onclick="cartQty(' + i + ',-1)" class="w-7 h-7 rounded-full bg-slate-200 font-black text-sm flex items-center justify-center">−</button>' +
          '<span class="font-black text-sm w-5 text-center">' + item.qty + '</span>' +
          '<button onclick="cartQty(' + i + ',1)" class="w-7 h-7 rounded-full bg-blue-100 text-blue-600 font-black text-sm flex items-center justify-center">+</button>' +
        '</div>' +
        '<span class="font-black text-sm text-blue-900 font-mono">' + sub.toLocaleString() + ' THB</span>' +
      '</div></div>';
  }).join('');
  document.getElementById('totalPrice').textContent = total.toLocaleString() + ' THB';
}
function removeCart(i) { cart.splice(i,1); updateBadge(); if(!cart.length) closeModal('cartModal'); else renderCart(); }
function cartQty(i,n)  { cart[i].qty = Math.max(1, cart[i].qty+n); updateBadge(); renderCart(); }
function openAddressForm() { closeModal('cartModal'); openModal('addressModal'); }
async function requestPay() {
  var clinic=document.getElementById('clinicName').value.trim();
  var phone=document.getElementById('clinicPhone').value.trim();
  var addr=document.getElementById('fullAddress').value.trim();
  if (!clinic||!phone||!addr) { alert(t('addr_fill_error')); return; }
  var amt = cart.reduce(function(s,c){ return s+c.price*c.qty; },0);
  var qrUrl;
  try {
    var res = await fetch('http://localhost:3000/pay',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({cart,address:clinic,phone,detailAddress:addr})});
    qrUrl = (await res.json()).qr_image;
  } catch(e) {
    qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=DENTALK_' + Date.now() + '_' + amt + 'THB';
  }
  document.getElementById('qrSummary').innerHTML =
    '<p class="font-black text-slate-500 uppercase text-[9px] mb-2">' + t('qr_summary_title') + '</p>' +
    cart.map(function(c){ return '<div class="flex justify-between gap-2 text-[10px]"><span class="flex-1">' + c.name + '</span><span class="font-mono text-slate-500">' + c.code + '</span><span class="font-black ml-1">×' + c.qty + '</span><span class="font-mono font-black ml-1">' + (c.price*c.qty).toLocaleString() + '</span></div>'; }).join('') +
    '<div class="border-t mt-2 pt-2 flex justify-between font-black text-slate-800"><span>' + t('qr_total') + '</span><span class="font-mono">' + amt.toLocaleString() + ' THB</span></div>';
  document.getElementById('qrImg').src = qrUrl;
  closeModal('addressModal'); openModal('qrModal');
}
function completePayment() { cart=[]; updateBadge(); closeModal('qrModal'); goPage('shop'); }
// ============================================================
// CUSTOM ABUTMENT
// ============================================================
function customTab(tab) {
  var isForm = tab==='form';
  document.getElementById('custom-form').classList.toggle('hidden', !isForm);
  document.getElementById('custom-list').classList.toggle('hidden', isForm);
  var fCls = isForm ? 'flex-1 py-3 rounded-2xl font-black text-sm bg-[#001d4a] text-white shadow' : 'flex-1 py-3 rounded-2xl font-black text-sm bg-slate-200 text-slate-500';
  var lCls = !isForm ? 'flex-1 py-3 rounded-2xl font-black text-sm bg-[#001d4a] text-white shadow' : 'flex-1 py-3 rounded-2xl font-black text-sm bg-slate-200 text-slate-500';
  var fBtn = document.getElementById('ctab-form');
  var lBtn = document.getElementById('ctab-list');
  fBtn.className = fCls; fBtn.textContent = t('custom_tab_new');
  lBtn.className = lCls; lBtn.textContent = t('custom_tab_list');
  if (!isForm) renderCustomOrders();
}
function resetCustomForm() {
  caseCount = 0;
  caseTeeth = {};
  document.getElementById('caseList').innerHTML = '';
  addCase();
  document.getElementById('cust-clinic').value = currentUser.clinicName || '';
  document.getElementById('cust-addr').value   = currentUser.address   || '';
  document.getElementById('cust-phone').value  = currentUser.phone     || '';
  document.getElementById('cust-line').value   = '';
}
function addCase() {
  caseCount++;
  var id  = caseCount;
  caseTeeth[id] = new Set();
  var div = document.createElement('div');
  div.id  = 'case-' + id;
  div.className = 'bg-slate-50 rounded-2xl p-4 mb-3';
  var delBtn = id > 1 ? '<button onclick="removeCase(' + id + ')" class="text-red-400 font-black text-xs">' + t('case_remove') + '</button>' : '';
  div.innerHTML =
    '<div class="flex justify-between items-center mb-3">' +
      '<span class="font-black text-xs text-slate-600">' + t('case_label') + id + '</span>' + delBtn +
    '</div>' +
    '<input type="text" id="cp-' + id + '" placeholder="' + t('case_patient_ph') + '" class="w-full p-3 bg-white rounded-xl text-sm font-bold outline-none mb-3 border-2 border-slate-200 focus:border-blue-400">' +
    '<div class="mb-1"><p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">' + t('case_tooth_hint') + '</p>' + buildToothChart(id) + '</div>' +
    '<div id="teeth-details-' + id + '" class="space-y-2 mt-3 mb-3"></div>' +
    '<p class="text-sm font-black text-slate-600 mb-2 mt-3">' + t('case_deadline_label') + '</p>' +
    '<input type="date" id="cd-' + id + '" class="w-full p-4 bg-white rounded-xl text-base font-black outline-none border-2 border-blue-200 mb-3 text-slate-700 focus:border-blue-500 cursor-pointer" style="min-height:52px;color-scheme:light;">' +
    '<div id="stl-drop-' + id + '" onclick="document.getElementById(\'stl-' + id + '\').click()" class="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center mb-2 cursor-pointer bg-white">' +
      '<p class="text-2xl mb-1">📁</p><p class="text-xs font-black text-slate-500">' + t('stl_label') + '</p><p class="text-[9px] text-slate-400 mt-0.5">' + t('stl_hint') + '</p>' +
    '</div>' +
    '<input type="file" id="stl-' + id + '" accept=".stl,.STL" class="hidden" onchange="onStl(' + id + ',this)">' +
    '<textarea id="cm-' + id + '" rows="2" placeholder="' + t('memo_ph') + '" class="w-full p-3 bg-white rounded-xl text-sm outline-none resize-none border-2 border-slate-200"></textarea>';
  document.getElementById('caseList').appendChild(div);
}
function removeCase(id) {
  var el = document.getElementById('case-'+id);
  if (el) el.remove();
  if (caseTeeth[id]) delete caseTeeth[id];
}
function buildToothChart(caseId) {
  var upper = [17,16,15,14,13,12,11,21,22,23,24,25,26,27];
  var lower = [47,46,45,44,43,42,41,31,32,33,34,35,36,37];
  function btn(num) {
    return '<button type="button" id="tooth-' + caseId + '-' + num + '" onclick="toggleTooth(' + caseId + ',' + num + ')" ' +
      'class="w-8 h-8 rounded-lg text-[9px] font-black border-2 border-slate-200 bg-white text-slate-500 transition active:scale-90 leading-none">' + num + '</button>';
  }
  var html = '<div class="bg-white rounded-2xl p-3 border border-slate-100">';
  html += '<p class="text-center text-[8px] font-black text-blue-400 uppercase tracking-widest mb-2">' + t('upper_jaw') + '</p>';
  html += '<div class="flex justify-center gap-1 mb-2 flex-wrap">';
  upper.forEach(function(n){ html += btn(n); });
  html += '</div>';
  html += '<div class="border-t border-dashed border-slate-200 my-2 relative"><span class="absolute left-1/2 -translate-x-1/2 -top-2 bg-white px-2 text-[8px] text-slate-300 font-bold">' + t('jaw_border') + '</span></div>';
  html += '<div class="flex justify-center gap-1 mt-2 flex-wrap">';
  lower.forEach(function(n){ html += btn(n); });
  html += '</div>';
  html += '<p class="text-center text-[8px] font-black text-amber-400 uppercase tracking-widest mt-2">' + t('lower_jaw') + '</p>';
  html += '</div>';
  return html;
}
function toggleTooth(caseId, toothNum) {
  if (!caseTeeth[caseId]) caseTeeth[caseId] = new Set();
  var btn = document.getElementById('tooth-' + caseId + '-' + toothNum);
  if (caseTeeth[caseId].has(toothNum)) {
    caseTeeth[caseId].delete(toothNum);
    if (btn) btn.className = 'w-8 h-8 rounded-lg text-[9px] font-black border-2 border-slate-200 bg-white text-slate-500 transition active:scale-90 leading-none';
  } else {
    caseTeeth[caseId].add(toothNum);
    if (btn) btn.className = 'w-8 h-8 rounded-lg text-[9px] font-black border-2 border-blue-500 bg-blue-500 text-white transition active:scale-90 leading-none';
  }
  renderToothDetails(caseId);
}
function renderToothDetails(caseId) {
  var container = document.getElementById('teeth-details-' + caseId);
  if (!container) return;
  var teeth = Array.from(caseTeeth[caseId]).sort(function(a,b){ return a-b; });
  if (!teeth.length) { container.innerHTML = ''; return; }
  var brandOpts = '<option value="">' + t('brand_ph') + '</option>' +
    IMPLANT_BRANDS.map(function(b){ return '<option value="' + b + '">' + b + '</option>'; }).join('');
  var colorOpts = '<option value="">' + t('color_ph') + '</option>' +
    TOOTH_COLORS.map(function(c){ return '<option value="' + c + '">' + c + '</option>'; }).join('');
  var saved = {};
  teeth.forEach(function(tn) {
    var bEl = document.getElementById('tb-'+caseId+'-'+tn);
    var sEl = document.getElementById('ts-'+caseId+'-'+tn);
    var cEl = document.getElementById('tc-'+caseId+'-'+tn);
    if (bEl||sEl||cEl) saved[tn] = { brand: bEl?bEl.value:'', size: sEl?sEl.value:'', color: cEl?cEl.value:'' };
  });
  container.innerHTML =
    '<p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">' + t('selected_teeth') + ' ' + teeth.length + (t('sel_count_suffix')||'') + '</p>' +
    teeth.map(function(tn) {
      var sv = saved[tn] || {};
      var jaw = (tn>=11&&tn<=28)
        ? '<span class="text-blue-400 text-[8px] font-bold">' + t('upper') + '</span>'
        : '<span class="text-amber-400 text-[8px] font-bold">' + t('lower') + '</span>';
      return '<div class="bg-white rounded-xl p-3 border border-slate-100">' +
        '<div class="flex items-center gap-2 mb-2">' +
          '<span class="w-8 h-8 rounded-lg bg-blue-500 text-white text-[10px] font-black flex items-center justify-center shrink-0">' + tn + '</span>' +
          '<div><p class="text-[10px] font-black text-slate-700">' + getToothName(tn) + '</p>' + jaw + '</div>' +
        '</div>' +
        '<select id="tb-' + caseId + '-' + tn + '" class="w-full p-2.5 bg-slate-50 rounded-xl text-xs font-bold outline-none mb-2 border border-slate-100">' + brandOpts + '</select>' +
        '<input type="text" id="ts-' + caseId + '-' + tn + '" placeholder="' + t('size_ph') + '" value="' + (sv.size||'') + '" class="w-full p-2.5 bg-slate-50 rounded-xl text-xs font-bold outline-none mb-2 border border-slate-100">' +
        '<select id="tc-' + caseId + '-' + tn + '" class="w-full p-2.5 bg-slate-50 rounded-xl text-xs font-bold outline-none border border-slate-100">' + colorOpts + '</select>' +
      '</div>';
    }).join('');
  teeth.forEach(function(tn) {
    var sv = saved[tn];
    if (!sv) return;
    var bEl = document.getElementById('tb-'+caseId+'-'+tn);
    var cEl = document.getElementById('tc-'+caseId+'-'+tn);
    if (bEl && sv.brand) bEl.value = sv.brand;
    if (cEl && sv.color) cEl.value = sv.color;
  });
}
function getToothName(num) {
  var n = num % 10;
  var keyMap = {1:'tooth_11',2:'tooth_12',3:'tooth_13',4:'tooth_14',5:'tooth_15',6:'tooth_16',7:'tooth_17'};
  return '#' + num + ' ' + (t(keyMap[n]) || '');
}
function onStl(id, input) {
  var f = input.files[0]; if(!f) return;
  var d = document.getElementById('stl-drop-'+id);
  d.innerHTML = '<p class="text-2xl mb-1">✅</p><p class="text-xs font-black text-green-600">' + f.name + '</p><p class="text-[9px] text-slate-400">' + (f.size/1024).toFixed(1) + ' KB</p>';
  d.className = 'border-2 border-green-200 rounded-xl p-4 text-center mb-2 bg-green-50';
}
function submitCustom() {
  var clinic = document.getElementById('cust-clinic').value.trim();
  var addr   = document.getElementById('cust-addr').value.trim();
  var phone  = document.getElementById('cust-phone').value.trim();
  var lineId = document.getElementById('cust-line').value.trim();
  if (!clinic||!addr||!phone) { alert(t('err_fill_delivery')); return; }
  var cases = [];
  for (var i=1; i<=caseCount; i++) {
    if (!document.getElementById('case-'+i)) continue;
    var selectedTeeth = caseTeeth[i] ? Array.from(caseTeeth[i]).sort(function(a,b){return a-b;}) : [];
    if (!selectedTeeth.length) { alert(tf('err_select_tooth', i)); return; }
    var teethData = [];
    var valid = true;
    for (var ti=0; ti<selectedTeeth.length; ti++) {
      var tn = selectedTeeth[ti];
      var brand = (document.getElementById('tb-'+i+'-'+tn)||{}).value || '';
      var size  = ((document.getElementById('ts-'+i+'-'+tn)||{}).value || '').trim();
      if (!brand||!size) { alert(tf('err_fill_tooth', i, tn)); valid=false; break; }
      teethData.push({
        tooth:     tn,
        toothName: getToothName(tn),
        brand:     brand,
        size:      size,
        color:     (document.getElementById('tc-'+i+'-'+tn)||{}).value || '',
      });
    }
    if (!valid) return;
    var stlFile = document.getElementById('stl-'+i).files[0];
    cases.push({
      patient:  document.getElementById('cp-'+i).value.trim() || t('anon_patient'),
      teeth:    teethData,
      deadline: document.getElementById('cd-'+i).value,
      memo:     document.getElementById('cm-'+i).value.trim(),
      stl:      stlFile ? stlFile.name : null,
    });
  }
  if (!cases.length) { alert(t('err_add_case')); return; }
  var totalTeeth = cases.reduce(function(s,c){ return s+c.teeth.length; },0);
  var _now = new Date();
  var _month = String.fromCharCode(64 + _now.getMonth() + 1);
  var _day   = String(_now.getDate()).padStart(2,'0');
  var _hhmm  = String(_now.getHours()).padStart(2,'0') + String(_now.getMinutes()).padStart(2,'0');
  var oid = 'CA' + _now.getFullYear() + _month + _day + _hhmm;
  var order = { id:oid, clinic:clinic, addr:addr, phone:phone, lineId:lineId, cases:cases, stage:'submitted', designVersions:[], reviewHistory:[], date:new Date().toLocaleDateString() };
  customOrders.unshift(order);
  // Notify admin of new order (customer gets LINE notification when admin confirms)
  sendLineRaw(LINE_USER_ID, '🆕 새 CNC Custom 주문\n━━━━━━━━━━━━━━━━━━━━\n🆔 ' + oid + '\n🏥 ' + clinic + '\n📅 ' + order.date + '\n📞 ' + phone + '\n💬 Line: ' + (lineId || '없음') + '\n🦷 ' + totalTeeth + '치아 / ' + cases.length + '케이스\n━━━━━━━━━━━━━━━━━━━━\n관리자 패널에서 접수 확인해 주세요.');
  var msg = tf('order_success_msg', oid, cases.length, totalTeeth);
  if (lineId) msg += t('order_success_line');
  alert(msg);
  customTab('list');
}
function renderCustomOrders() {
  var c = document.getElementById('customOrdersContainer');
  if (!customOrders.length) { c.innerHTML = '<div class="text-center text-slate-400 font-bold text-sm py-10">' + t('custom_empty') + '</div>'; return; }
  c.innerHTML = customOrders.map(function(o) {
    // design_revision maps to design_ready position in progress bar
    var barKey = (o.stage === 'design_revision') ? 'design_ready' : o.stage;
    var si = ORDER_STAGES.findIndex(function(s){ return s.key === barKey; });
    if (si < 0) si = 0;
    var st = ORDER_STAGES[si];
    var bars = ORDER_STAGES.map(function(s,i){
      var cls = i<si ? 'stage-done' : i===si ? 'stage-current' : 'stage-todo';
      return '<div class="flex-1 flex flex-col items-center gap-1"><div class="w-full h-1.5 rounded-full ' + cls + '"></div><span class="text-[7px] font-bold text-center leading-tight">' + s.icon + '</span></div>';
    }).join('');
    var stageLabel = t('stage_' + o.stage) || o.stage;
    var totalTeeth = o.cases.reduce(function(s,cs){ return s+(cs.teeth?cs.teeth.length:0); },0);
    // ── Design review section ──────────────────────────────
    var designHtml = '';
    if (o.stage === 'design_ready' && o.designVersions && o.designVersions.length) {
      var latest = o.designVersions[o.designVersions.length - 1];
      designHtml =
        '<div class="mt-3 pt-3 border-t border-slate-100">' +
          '<p class="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-2">📐 디자인 확인 (ver.' + o.designVersions.length + ')</p>' +
          '<img src="' + latest.url + '" class="w-full rounded-xl mb-2 max-h-52 object-contain bg-slate-50">' +
          '<p class="text-[8px] text-slate-400 mb-3">' + latest.name + ' · ' + latest.date + '</p>' +
          '<div class="flex gap-2 mb-2">' +
            '<button onclick="customerApproveDesign(\'' + o.id + '\')" class="flex-1 py-2.5 bg-green-600 text-white rounded-xl font-black text-xs active:scale-95 transition">✅ 만족</button>' +
            '<button onclick="showRejectPanel(\'' + o.id + '\')" class="flex-1 py-2.5 bg-red-100 text-red-600 rounded-xl font-black text-xs active:scale-95 transition">❌ 불만족</button>' +
          '</div>' +
          '<div id="reject-panel-' + o.id + '" class="hidden mt-2">' +
            '<textarea id="reject-note-' + o.id + '" rows="3" placeholder="수정 요청사항을 입력해주세요..." class="w-full p-2.5 bg-slate-50 rounded-xl text-xs outline-none resize-none mb-2 border border-slate-200"></textarea>' +
            '<button onclick="customerRejectDesign(\'' + o.id + '\')" class="w-full py-2 bg-red-500 text-white rounded-xl font-black text-xs active:scale-95 transition">불만족 제출</button>' +
          '</div>' +
        '</div>';
    } else if (o.stage === 'design_revision') {
      var lastRev = (o.reviewHistory && o.reviewHistory.length) ? o.reviewHistory[o.reviewHistory.length-1] : null;
      designHtml =
        '<div class="mt-3 pt-3 border-t border-slate-100">' +
          '<p class="text-[9px] font-black text-amber-500 uppercase tracking-widest mb-2">⏳ 디자인 수정 요청됨</p>' +
          (lastRev ? '<div class="bg-amber-50 rounded-xl p-2.5"><p class="text-[9px] text-slate-600 leading-relaxed">"' + lastRev.note + '"</p></div>' : '') +
        '</div>';
    } else if (o.stage === 'confirmed') {
      designHtml = '<div class="mt-3 pt-3 border-t border-slate-100"><p class="text-[9px] text-slate-400 font-bold">📐 디자인 업로드 대기 중...</p></div>';
    }
    // ── Review history ─────────────────────────────────────
    var histHtml = '';
    if (o.reviewHistory && o.reviewHistory.length) {
      histHtml =
        '<div class="mt-2 pt-2 border-t border-slate-100">' +
          '<p class="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">검토 이력 (' + o.reviewHistory.length + '회)</p>' +
          o.reviewHistory.map(function(r){
            return '<div class="flex gap-1 items-start text-[8px] text-slate-400 mb-0.5">' +
              '<span>' + (r.action==='approved'?'✅':'❌') + '</span>' +
              '<span>' + r.date + (r.note?' · '+r.note:'') + '</span>' +
            '</div>';
          }).join('') +
        '</div>';
    }
    // ── Case details ───────────────────────────────────────
    var caseRows = o.cases.map(function(cs, ci) {
      var toothRows = (cs.teeth||[]).map(function(td) {
        var isUpper = td.tooth>=11&&td.tooth<=28;
        var jawDot = isUpper
          ? '<span class="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block mr-1"></span>'
          : '<span class="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block mr-1"></span>';
        return '<div class="flex items-center gap-2 py-1.5 border-b border-slate-50 last:border-0">' +
          '<span class="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 text-[9px] font-black flex items-center justify-center shrink-0">' + td.tooth + '</span>' +
          '<div class="flex-1 min-w-0">' + jawDot + '<span class="text-[10px] font-black text-slate-700">' + td.brand + '</span><span class="text-[9px] text-slate-400 ml-1">' + td.size + '</span></div>' +
          (td.color ? '<span class="text-[9px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded-md shrink-0">' + td.color + '</span>' : '') +
        '</div>';
      }).join('');
      var nTeeth = cs.teeth ? cs.teeth.length : 0;
      return '<div class="mb-3 last:mb-0">' +
        '<div class="flex justify-between items-center mb-1">' +
          '<p class="text-[10px] font-black text-slate-600">' + t('case_nr') + (ci+1) + ' · ' + t('patient_label') + cs.patient + '</p>' +
          '<span class="text-[9px] bg-blue-50 text-blue-600 font-black px-2 py-0.5 rounded-lg">' + nTeeth + t('teeth_count') + '</span>' +
        '</div>' +
        (toothRows || '<p class="text-[9px] text-slate-300 font-bold">' + t('no_tooth_info') + '</p>') +
        (cs.stl ? '<p class="text-[9px] text-green-500 font-bold mt-1">📎 ' + cs.stl + '</p>' : '') +
        (cs.deadline ? '<p class="text-[9px] text-slate-400 font-bold mt-1">📅 ' + cs.deadline + '</p>' : '') +
      '</div>';
    }).join('');
    var detailHeader = t('case_detail') + ' (' + o.cases.length + t('cases_unit') + ' · ' + t('teeth_total_prefix') + totalTeeth + t('teeth_count') + ')';
    return '<div class="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">' +
      '<div class="bg-[#001d4a] px-5 py-4 flex justify-between items-center">' +
        '<div><p class="font-black text-white text-sm">' + o.clinic + '</p><p class="text-blue-300 text-[9px] font-bold font-mono mt-0.5">' + o.id + ' · ' + o.date + '</p></div>' +
        '<div class="text-right"><span class="text-xl">' + st.icon + '</span><p class="text-blue-300 text-[9px] font-bold mt-0.5">' + totalTeeth + t('teeth_count') + '</p></div>' +
      '</div>' +
      '<div class="px-5 py-4">' +
        '<p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">' + t('status_label') + '</p>' +
        '<div class="flex gap-1 mb-2">' + bars + '</div>' +
        '<p class="text-center font-black text-sm text-blue-700">' + st.icon + ' ' + stageLabel + '</p>' +
        designHtml +
        histHtml +
      '</div>' +
      '<div class="px-5 pb-5 border-t border-slate-50 pt-4">' +
        '<p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">' + detailHeader + '</p>' +
        caseRows +
      '</div>' +
      '<div class="px-5 pb-4 text-[9px] text-slate-400 font-bold space-y-0.5 border-t border-slate-50 pt-3">' +
        '<p>📍 ' + o.addr + '</p><p>📞 ' + o.phone + '</p>' +
      '</div>' +
    '</div>';
  }).join('');
}
async function sendLine(order, stageKey) {
  if (!LINE_PROXY_URL || LINE_PROXY_URL === 'YOUR_CLOUDFLARE_WORKER_URL') return;
  var st = ORDER_STAGES.find(function(s){ return s.key===stageKey; });
  var totalTeeth = order.cases.reduce(function(s,cs){ return s+(cs.teeth?cs.teeth.length:0); },0);
  var lines = [
    '━━━━━━━━━━━━━━━━━━━━',
    st.icon + ' ' + t('stage_' + st.key),
    '━━━━━━━━━━━━━━━━━━━━',
    '🆔 ' + order.id,
    '📅 ' + order.date,
    '🏥 ' + order.clinic,
    '📍 ' + order.addr,
    '📞 ' + order.phone,
  ];
  order.cases.forEach(function(cs, i) {
    lines.push('');
    lines.push('[ ' + t('case_label') + (i+1) + '/' + order.cases.length + ' ] ' + cs.patient);
    if (cs.deadline) lines.push('  ' + t('line_deadline') + ': ' + cs.deadline);
    if (cs.teeth && cs.teeth.length) {
      cs.teeth.forEach(function(th) {
        lines.push('  ' + th.toothName + ' | ' + th.brand + ' ' + th.size + (th.color ? ' / ' + th.color : ''));
      });
    }
    if (cs.memo) lines.push('  ' + t('line_memo') + ': ' + cs.memo);
    if (cs.stl)  lines.push('  STL: ' + cs.stl);
  });
  lines.push('');
  lines.push(t('line_total_cases', order.cases.length, totalTeeth));
  lines.push('━━━━━━━━━━━━━━━━━━━━');
  var msg = lines.join('\n');
  try {
    var res = await fetch(LINE_PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: LINE_USER_ID, messages: [{ type: 'text', text: msg }] })
    });
    var data = await res.json();
    if (!res.ok) {
      console.error('[LINE] status:', res.status, data);
      alert('[LINE 오류] status: ' + res.status + '\n' + JSON.stringify(data));
    }
    if (order.lineId) {
      var res2 = await fetch(LINE_PROXY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: order.lineId, messages: [{ type: 'text', text: msg }] })
      });
      if (!res2.ok) {
        var data2 = await res2.json();
        console.error('[LINE 고객] status:', res2.status, data2);
      }
    }
  } catch(e) {
    console.error('[LINE] fetch error:', e);
    alert('[LINE 연결 오류] Worker URL 또는 네트워크를 확인하세요.\n' + e.message);
  }
}
// ============================================================
// CNC CUSTOM — 관리자 & 고객 워크플로우
// ============================================================
function isAdmin() {
  return isLoggedIn() && ADMIN_NICKNAMES.includes(currentUser.nickname);
}
async function sendLineRaw(to, text) {
  if (!LINE_PROXY_URL || !to) return;
  try {
    await fetch(LINE_PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: to, messages: [{ type: 'text', text: text }] })
    });
  } catch(e) { console.error('[LINE]', e); }
}
function adminConfirmOrder(orderId) {
  var ord = customOrders.find(function(o){ return o.id===orderId; });
  if (!ord) return;
  ord.stage = 'confirmed';
  renderAdminPanel();
  renderCustomOrders();
  sendLineRaw(ord.lineId, '━━━━━━━━━━━━━━━━━━━━\n✅ 주문 접수\n━━━━━━━━━━━━━━━━━━━━\n🆔 ' + ord.id + '\n🏥 ' + ord.clinic + '\n\n주문이 접수되었습니다.\n디자인 완료 후 앱에서 확인하실 수 있습니다.');
}
function adminUploadDesign(orderId, input) {
  var file = input.files[0]; if (!file) return;
  var ord = customOrders.find(function(o){ return o.id===orderId; });
  if (!ord) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    if (!ord.designVersions) ord.designVersions = [];
    ord.designVersions.push({ url: e.target.result, date: new Date().toLocaleDateString(), name: file.name });
    ord.stage = 'design_ready';
    renderAdminPanel();
    renderCustomOrders();
  };
  reader.readAsDataURL(file);
}
function customerApproveDesign(orderId) {
  var ord = customOrders.find(function(o){ return o.id===orderId; });
  if (!ord) return;
  ord.stage = 'approved';
  if (!ord.reviewHistory) ord.reviewHistory = [];
  ord.reviewHistory.push({ action:'approved', note:'만족', date:new Date().toLocaleDateString() });
  renderCustomOrders();
  sendLineRaw(LINE_USER_ID, '━━━━━━━━━━━━━━━━━━━━\n✅ 고객 만족 (디자인 승인)\n━━━━━━━━━━━━━━━━━━━━\n🆔 ' + ord.id + '\n🏥 ' + ord.clinic + '\n\n고객이 디자인을 승인하였습니다.\n밀링을 시작해 주세요.');
}
function showRejectPanel(orderId) {
  var panel = document.getElementById('reject-panel-' + orderId);
  if (panel) panel.classList.toggle('hidden');
}
function customerRejectDesign(orderId) {
  var ord = customOrders.find(function(o){ return o.id===orderId; });
  if (!ord) return;
  var noteEl = document.getElementById('reject-note-' + orderId);
  var note = noteEl ? noteEl.value.trim() : '';
  if (!note) { alert('수정 요청사항을 입력해주세요.'); return; }
  ord.stage = 'design_revision';
  if (!ord.reviewHistory) ord.reviewHistory = [];
  ord.reviewHistory.push({ action:'rejected', note:note, date:new Date().toLocaleDateString() });
  renderCustomOrders();
  sendLineRaw(LINE_USER_ID, '━━━━━━━━━━━━━━━━━━━━\n❌ 고객 불만족 (수정 요청)\n━━━━━━━━━━━━━━━━━━━━\n🆔 ' + ord.id + '\n🏥 ' + ord.clinic + '\n\n수정 요청사항:\n' + note);
}
function adminStartMilling(orderId) {
  var ord = customOrders.find(function(o){ return o.id===orderId; });
  if (!ord) return;
  if (!confirm('밀링을 시작하시겠습니까?')) return;
  ord.stage = 'milling';
  renderAdminPanel();
  renderCustomOrders();
  sendLineRaw(ord.lineId, '━━━━━━━━━━━━━━━━━━━━\n⚙️ CNC 밀링 중\n━━━━━━━━━━━━━━━━━━━━\n🆔 ' + ord.id + '\n🏥 ' + ord.clinic + '\n\nCNC 밀링 작업이 시작되었습니다.\n완료 후 배송해 드리겠습니다.');
}
function adminShipOrder(orderId) {
  var ord = customOrders.find(function(o){ return o.id===orderId; });
  if (!ord) return;
  if (!confirm('배송 처리하시겠습니까?')) return;
  ord.stage = 'shipped';
  renderAdminPanel();
  renderCustomOrders();
  sendLineRaw(ord.lineId, '━━━━━━━━━━━━━━━━━━━━\n🚚 배송 시작\n━━━━━━━━━━━━━━━━━━━━\n🆔 ' + ord.id + '\n🏥 ' + ord.clinic + '\n\n배송이 시작되었습니다.\n곧 받아보실 수 있습니다.');
}
function renderAdminPanel() {
  var panel = document.getElementById('adminPanel');
  var list  = document.getElementById('adminOrderList');
  if (!panel || !list) return;
  if (!isAdmin()) { panel.classList.add('hidden'); return; }
  panel.classList.remove('hidden');
  if (!customOrders.length) {
    list.innerHTML = '<p class="text-center text-slate-400 text-sm py-8 font-bold">주문이 없습니다.</p>';
    return;
  }
  list.innerHTML = customOrders.map(function(o) {
    var stageLabel = t('stage_' + o.stage) || o.stage;
    var totalTeeth = o.cases.reduce(function(s,cs){ return s+(cs.teeth?cs.teeth.length:0); },0);
    var actionHtml = '';
    if (o.stage === 'submitted') {
      actionHtml = '<button onclick="adminConfirmOrder(\'' + o.id + '\')" class="w-full py-2.5 bg-blue-600 text-white rounded-xl font-black text-xs mt-3 active:scale-95 transition">✅ 접수 확인 → LINE 발송</button>';
    } else if (o.stage === 'confirmed' || o.stage === 'design_revision') {
      var vNote = (o.designVersions && o.designVersions.length) ? ' (ver.'+(o.designVersions.length+1)+')' : '';
      actionHtml = '<div class="mt-3"><label class="block cursor-pointer">' +
        '<div class="w-full py-2.5 bg-amber-500 text-white rounded-xl font-black text-xs text-center active:scale-95 transition">📐 디자인 업로드' + vNote + '</div>' +
        '<input type="file" accept="image/*,.pdf" class="hidden" onchange="adminUploadDesign(\'' + o.id + '\',this)"></label></div>';
    } else if (o.stage === 'design_ready') {
      var latest = (o.designVersions && o.designVersions.length) ? o.designVersions[o.designVersions.length-1] : null;
      actionHtml = '<div class="mt-3 bg-blue-50 rounded-xl p-3">' +
        '<p class="text-[9px] font-black text-blue-600 mb-2">📐 고객 검토 대기 중 (ver.' + (o.designVersions?o.designVersions.length:1) + ')</p>' +
        (latest ? '<img src="' + latest.url + '" class="w-full rounded-lg max-h-28 object-contain bg-white mb-1">' : '') +
        '<p class="text-[8px] text-slate-400">고객이 만족/불만족을 선택할 때까지 대기합니다.</p></div>';
    } else if (o.stage === 'approved') {
      actionHtml = '<button onclick="adminStartMilling(\'' + o.id + '\')" class="w-full py-2.5 bg-purple-600 text-white rounded-xl font-black text-xs mt-3 active:scale-95 transition">⚙️ 밀링 시작 → LINE 발송</button>';
    } else if (o.stage === 'milling') {
      actionHtml = '<button onclick="adminShipOrder(\'' + o.id + '\')" class="w-full py-2.5 bg-green-600 text-white rounded-xl font-black text-xs mt-3 active:scale-95 transition">🚚 배송 처리 → LINE 발송</button>';
    } else if (o.stage === 'shipped' || o.stage === 'done') {
      actionHtml = '<div class="mt-3 bg-green-50 rounded-xl p-2 text-center"><p class="text-[9px] font-black text-green-600">🚚 배송 완료</p></div>';
    }
    var histHtml = '';
    if (o.reviewHistory && o.reviewHistory.length) {
      histHtml = '<div class="mt-2 border-t border-slate-100 pt-2">' +
        '<p class="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">검토 이력 (' + o.reviewHistory.length + '회)</p>' +
        o.reviewHistory.map(function(r){
          return '<div class="flex gap-1 items-start text-[8px] text-slate-400 mb-0.5">' +
            '<span>' + (r.action==='approved'?'✅':'❌') + '</span>' +
            '<span class="flex-1">' + r.date + (r.note?' · '+r.note:'') + '</span></div>';
        }).join('') +
      '</div>';
    }
    return '<div class="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">' +
      '<div class="bg-[#001d4a] px-4 py-3 flex justify-between items-center">' +
        '<div><p class="font-black text-white text-sm">' + o.clinic + '</p>' +
             '<p class="text-blue-300 text-[9px] font-bold font-mono mt-0.5">' + o.id + ' · ' + o.date + '</p></div>' +
        '<span class="text-[10px] font-black px-2 py-1 rounded-lg bg-white/10 text-white">' + stageLabel + '</span>' +
      '</div>' +
      '<div class="px-4 py-3">' +
        '<p class="text-[10px] text-slate-500 font-bold mb-1">' + o.cases.length + '케이스 · ' + totalTeeth + '치아</p>' +
        '<p class="text-[9px] text-slate-400">📍 ' + o.addr + '</p>' +
        '<p class="text-[9px] text-slate-400">📞 ' + o.phone + '</p>' +
        (o.lineId ? '<p class="text-[9px] text-green-500 font-bold">💬 Line: ' + o.lineId + '</p>' : '<p class="text-[9px] text-red-300">⚠️ Line ID 없음</p>') +
        actionHtml +
        histHtml +
      '</div>' +
    '</div>';
  }).join('');
}
// ============================================================
// USED MARKET
// ============================================================
function renderUsed() {
  var list = document.getElementById('usedList');
  if (!usedItems.length) { list.innerHTML='<div class="text-center text-slate-400 font-bold text-sm py-10">' + t('used_empty') + '</div>'; return; }
  var condMap   = {new:'bg-green-100 text-green-700',good:'bg-blue-100 text-blue-700',fair:'bg-yellow-100 text-yellow-700'};
  var condLabel = {new:t('cond_new'),good:t('cond_good'),fair:t('cond_fair')};
  list.innerHTML = usedItems.map(function(item,i){
    var thumb = item.image
      ? '<img src="' + item.image + '" class="w-full h-full object-contain">'
      : '<div class="w-full h-full flex items-center justify-center"><span class="text-slate-300 text-xl">📷</span></div>';
    var badge = '<span class="inline-block text-[7px] font-bold px-1 py-0.5 rounded-full ' + condMap[item.cond] + '">' + condLabel[item.cond] + '</span>';
    return '<div class="bg-white rounded-md overflow-hidden shadow-sm cursor-pointer active:scale-95 transition flex flex-col" onclick="openUsedDetail(' + item.id + ')">' +
      '<div class="aspect-square bg-slate-50 overflow-hidden">' + thumb + '</div>' +
      '<div class="p-0.5 flex flex-col gap-0">' +
        badge +
        '<p class="font-bold text-slate-800 text-[7px] leading-snug line-clamp-2">' + item.name + '</p>' +
        '<p class="font-black text-blue-700 text-[7px]">' + item.price.toLocaleString() + '</p>' +
      '</div>' +
    '</div>';
  }).join('');
}
function previewPhoto() {
  var file = document.getElementById('u-photo').files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    var prev = document.getElementById('u-photo-preview');
    prev.innerHTML = '<img src="' + e.target.result + '" class="w-full h-full object-cover">';
  };
  reader.readAsDataURL(file);
}
function submitUsed() {
  var name    = document.getElementById('u-name').value.trim();
  var price   = parseInt(document.getElementById('u-price').value,10)||0;
  var contact = document.getElementById('u-contact').value.trim();
  if (!name||!price||!contact) { alert(t('used_fill_error')); return; }
  function addItem(imgData) {
    usedItems.unshift({id:Date.now(),name:name,code:document.getElementById('u-code').value.trim()||'-',price:price,cond:document.getElementById('u-cond').value,desc:document.getElementById('u-desc').value.trim()||'-',contact:contact,seller:'Me',date:new Date().toISOString().slice(0,10),views:0,image:imgData||null});
    ['u-name','u-code','u-price','u-desc','u-contact'].forEach(function(id){ document.getElementById(id).value=''; });
    document.getElementById('u-photo').value = '';
    document.getElementById('u-photo-preview').innerHTML = '<span class="text-3xl mb-1">📷</span><span class="text-xs font-bold">' + t('used_photo_add') + '</span>';
    renderUsed();
  }
  var file = document.getElementById('u-photo').files[0];
  if (file) {
    var reader = new FileReader();
    reader.onload = function(e){ addItem(e.target.result); };
    reader.readAsDataURL(file);
  } else {
    addItem(null);
  }
}
function deleteUsed(i) { usedItems.splice(i,1); renderUsed(); }
function showContact(c) { document.getElementById('usedContactText').textContent=c; openModal('usedContactModal'); }
function openUsedDetail(id) {
  var item = usedItems.find(function(x){ return x.id===id; });
  if (!item) return;
  item.views = (item.views||0) + 1;
  renderUsed();
  var condLabel = {new:t('cond_new'),good:t('cond_good'),fair:t('cond_fair')};
  var condColor = {new:'bg-green-100 text-green-700',good:'bg-blue-100 text-blue-700',fair:'bg-yellow-100 text-yellow-700'};
  document.getElementById('udp-name').textContent   = item.name;
  document.getElementById('udp-code').textContent   = item.code;
  document.getElementById('udp-price').textContent  = item.price.toLocaleString() + ' THB';
  document.getElementById('udp-cond').textContent   = condLabel[item.cond];
  document.getElementById('udp-cond').className     = 'text-xs font-black px-2 py-1 rounded-lg ' + condColor[item.cond];
  document.getElementById('udp-desc').textContent   = item.desc;
  document.getElementById('udp-meta').textContent   = item.seller + ' · ' + item.date;
  document.getElementById('udp-views').textContent  = item.views;
  document.getElementById('udp-contactBtn').onclick = function(){ showContact(item.contact); };
  document.getElementById('udp-deleteBtn').onclick  = function(){
    var idx = usedItems.findIndex(function(x){ return x.id===id; });
    if (idx !== -1) usedItems.splice(idx, 1);
    goBack();
  };
  var imgWrap = document.getElementById('udp-imageWrap');
  var imgEl   = document.getElementById('udp-image');
  if (item.image) { imgEl.src = item.image; imgWrap.classList.remove('hidden'); }
  else { imgWrap.classList.add('hidden'); imgEl.src = ''; }
  goDetailPage('used-detail', item.name, 'used');
}
function openForumDetail(id) {
  var post = posts.find(function(x){ return x.id===id; });
  if (!post) return;
  post.views = (post.views||0) + 1;
  currentForumPostId = id;
  renderForum();
  // 카테고리 뱃지
  document.getElementById('fdp-catBadge').textContent = post.category === 'implant' ? '🦷 임플란트' : '💎 보철';
  document.getElementById('fdp-title').textContent  = post.title;
  document.getElementById('fdp-body').textContent   = post.body;
  document.getElementById('fdp-author').textContent = post.author + ' · ' + (post.date||'');
  document.getElementById('fdp-views').textContent  = post.views;
  // 사진 갤러리
  var photosWrap = document.getElementById('fdp-photos');
  if (post.images && post.images.length) {
    photosWrap.classList.remove('hidden');
    photosWrap.innerHTML = post.images.map(function(src){
      return '<img src="' + src + '" style="display:inline-block;height:180px;border-radius:12px;object-fit:contain;flex-shrink:0">';
    }).join('');
  } else {
    photosWrap.classList.add('hidden');
    photosWrap.innerHTML = '';
  }
  // 댓글
  renderComments(post);
  goDetailPage('forum-detail', post.title, 'forum');
}
// ============================================================
// FORUM
// ============================================================
function forumTab(cat) {
  forumCategory = cat;
  renderForum();
}
function renderForum() {
  var implantBtn    = document.getElementById('ftab-implant');
  var prostheticBtn = document.getElementById('ftab-prosthetic');
  if (implantBtn && prostheticBtn) {
    implantBtn.className    = 'flex-1 py-3 rounded-2xl font-black text-sm shadow ' + (forumCategory === 'implant'    ? 'bg-[#001d4a] text-white' : 'bg-slate-200 text-slate-500');
    prostheticBtn.className = 'flex-1 py-3 rounded-2xl font-black text-sm shadow ' + (forumCategory === 'prosthetic' ? 'bg-[#001d4a] text-white' : 'bg-slate-200 text-slate-500');
  }
  var filtered = posts.filter(function(p){ return p.category === forumCategory; });
  document.getElementById('postList').innerHTML = filtered.length ? filtered.map(function(p){
    var thumb = (p.images && p.images.length) ? '<img src="' + p.images[0] + '" class="w-14 h-14 rounded-xl object-cover shrink-0">' : '';
    return '<div class="bg-white p-4 rounded-2xl border shadow-sm cursor-pointer active:bg-slate-50 flex gap-3 items-start" onclick="openForumDetail(' + p.id + ')">' +
      thumb +
      '<div class="flex-1 min-w-0">' +
        '<p class="font-black text-slate-800 text-sm mb-0.5 leading-snug">' + p.title + '</p>' +
        '<p class="text-xs text-slate-500 leading-relaxed line-clamp-2">' + p.body + '</p>' +
        '<p class="text-[9px] text-slate-300 font-bold mt-2">' + p.author + ' · ' + (p.date||'') + ' · 👁 ' + (p.views||0) + ' · 💬 ' + (p.comments?p.comments.length:0) + '</p>' +
      '</div>' +
    '</div>';
  }).join('') : '<p class="text-center text-slate-400 text-sm py-10">' + t('forum_empty') + '</p>';
}
function previewForumPhotos() {
  var input = document.getElementById('forumPhotos');
  var files = Array.from(input.files).slice(0, 5);
  forumPhotos = [];
  var preview = document.getElementById('forumPhotoPreview');
  preview.innerHTML = '';
  if (!files.length) { preview.classList.add('hidden'); return; }
  preview.classList.remove('hidden');
  var loaded = 0;
  files.forEach(function(file, i) {
    var reader = new FileReader();
    reader.onload = function(e) {
      forumPhotos[i] = e.target.result;
      loaded++;
      if (loaded === files.length) {
        preview.innerHTML = forumPhotos.filter(Boolean).map(function(src){
          return '<img src="' + src + '" class="w-16 h-16 rounded-xl object-cover">';
        }).join('');
      }
    };
    reader.readAsDataURL(file);
  });
}
function submitPost() {
  var tt = document.getElementById('postTitle').value.trim();
  var b  = document.getElementById('postBody').value.trim();
  if (!tt || !b) return;
  var auth  = currentUser.nickname || '익명';
  var today = new Date().toISOString().slice(0,10);
  posts.unshift({id:Date.now(), category:forumCategory, title:tt, body:b, author:auth, images:forumPhotos.filter(Boolean).slice(), comments:[], views:0, date:today});
  document.getElementById('postTitle').value  = '';
  document.getElementById('postBody').value   = '';
  document.getElementById('forumPhotoPreview').innerHTML = '';
  document.getElementById('forumPhotoPreview').classList.add('hidden');
  document.getElementById('forumPhotos').value = '';
  forumPhotos = [];
  renderForum();
}
function renderComments(post) {
  var el = document.getElementById('fdp-comments');
  if (!post.comments || !post.comments.length) {
    el.innerHTML = '<p class="text-xs text-slate-300 font-bold">아직 댓글이 없습니다.</p>';
    return;
  }
  el.innerHTML = post.comments.map(function(c){
    return '<div class="bg-slate-50 rounded-2xl p-3">' +
      '<p class="text-xs font-black text-slate-700 mb-1">' + c.author + ' <span class="text-slate-300 font-normal text-[10px]">' + c.date + '</span></p>' +
      '<p class="text-sm text-slate-600">' + c.text + '</p>' +
    '</div>';
  }).join('');
}
function submitComment() {
  var text = document.getElementById('commentInput').value.trim();
  if (!text) return;
  var post = posts.find(function(x){ return x.id===currentForumPostId; });
  if (!post) return;
  if (!post.comments) post.comments = [];
  var auth  = currentUser.nickname || '익명';
  var today = new Date().toISOString().slice(0,10);
  post.comments.push({author: auth, text: text, date: today});
  document.getElementById('commentInput').value = '';
  renderComments(post);
  renderForum();
}
// ============================================================
// 닉네임 표시 & 프로필
// ============================================================
function updateNicknameDisplays() {
  var nick = currentUser.nickname || '';
  var pnd  = document.getElementById('postNicknameDisplay');
  var cnd  = document.getElementById('commentNicknameDisplay');
  var sn   = document.getElementById('sideNickname');
  if (pnd) pnd.textContent = nick;
  if (cnd) cnd.textContent = nick;
  if (sn)  sn.textContent  = nick;
}
function renderProfileSettings() {
  var el = document.getElementById('profileInfo');
  if (!el) return;
  if (!isLoggedIn() || !currentUser.nickname) {
    el.innerHTML = '<p class="text-sm text-slate-400 font-bold">' + t('profile_login_msg') + '</p>';
    return;
  }
  var rows = [
    [t('prof_nickname'), currentUser.nickname,   true],
    [t('prof_doctor'),   currentUser.doctorName, true],
    [t('pe_email'),      currentUser.email,      false],
    [t('pe_phone'),      currentUser.phone,      false],
    [t('pe_address'),    currentUser.address,    false],
    [t('pe_clinic'),     currentUser.clinicName, false],
  ];
  el.innerHTML = '<div class="space-y-2">' +
    rows.map(function(r){
      var val = r[1] || '-';
      var readonly = r[2] ? ' <span class="text-[9px] text-slate-300 font-bold">' + t('profile_no_change') + '</span>' : '';
      return '<div class="flex justify-between items-center py-1 border-b border-slate-50 last:border-0">' +
        '<span class="text-xs text-slate-400 font-bold shrink-0 w-20">' + r[0] + readonly + '</span>' +
        '<span class="text-sm font-black text-slate-800 text-right ml-2 break-all">' + val + '</span>' +
      '</div>';
    }).join('') +
  '</div>';
}
function openProfileEdit() {
  if (!isLoggedIn()) { alert(t('login_required')); return; }
  document.getElementById('pe-email').value   = currentUser.email   || '';
  document.getElementById('pe-phone').value   = currentUser.phone   || '';
  document.getElementById('pe-address').value = currentUser.address || '';
  document.getElementById('pe-clinic').value  = currentUser.clinicName || '';
  openModal('profileEditModal');
}
async function saveProfile() {
  currentUser.email     = document.getElementById('pe-email').value.trim();
  currentUser.phone     = document.getElementById('pe-phone').value.trim();
  currentUser.address   = document.getElementById('pe-address').value.trim();
  currentUser.clinicName= document.getElementById('pe-clinic').value.trim();
  // localStorage에 반영
  var saved = localStorage.getItem('dentalk_profile_' + currentUser.licenseNum);
  var profile = saved ? JSON.parse(saved) : {};
  profile.email     = currentUser.email;
  profile.phone     = currentUser.phone;
  profile.address   = currentUser.address;
  profile.clinicName= currentUser.clinicName;
  localStorage.setItem('dentalk_profile_' + currentUser.licenseNum, JSON.stringify(profile));
  // Supabase에 PATCH
  try {
    await fetch(SUPABASE_URL + '/rest/v1/licenses?license_number=eq.' + encodeURIComponent(currentUser.licenseNum), {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        email:       currentUser.email,
        phone:       currentUser.phone,
        address:     currentUser.address,
        clinic_name: currentUser.clinicName
      })
    });
  } catch(e) { console.warn('Supabase PATCH 실패 (로컬에는 저장됨):', e); }
  closeModal('profileEditModal');
  renderProfileSettings();
  var msg = document.getElementById('profileSavedMsg');
  if (msg) { msg.classList.remove('hidden'); setTimeout(function(){ msg.classList.add('hidden'); }, 2500); }
}
// ============================================================
// 쪽지 & 내 활동 모달
// ============================================================
function openMyActivity() {
  if (!isLoggedIn()) { openLoginModal(); return; }
  messages.forEach(function(m){ if (m.to===currentUser.nickname) m.read=true; });
  activityTab('msg');
  openModal('myActivityModal');
}
function activityTab(name) {
  ['msg','posts'].forEach(function(tab){
    var btn  = document.getElementById('atab-'+tab);
    var pane = document.getElementById('activity-'+tab);
    if (btn)  btn.className  = 'flex-1 py-2 rounded-xl font-black text-xs ' + (tab===name?'bg-[#001d4a] text-white':'bg-slate-100 text-slate-500');
    if (pane) pane.classList.toggle('hidden', tab!==name);
  });
  if (name==='msg')   renderMyMsgs();
  if (name==='posts') renderMyPosts();
}
function renderMyMsgs() {
  var el = document.getElementById('activity-msg');
  if (!el) return;
  var nick  = currentUser.nickname;
  var inbox = messages.filter(function(m){ return m.to===nick; });
  var sent  = messages.filter(function(m){ return m.from===nick; });
  var html = '<button onclick="openCompose()" class="w-full py-2.5 bg-[#001d4a] text-white rounded-xl font-black text-xs mb-4 active:scale-95 transition">✉️ 새 쪽지 보내기</button>';
  html += '<p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">받은 쪽지 (' + inbox.length + ')</p>';
  if (inbox.length) {
    html += inbox.slice().reverse().map(function(m){
      return '<div class="bg-white rounded-xl p-3 mb-2 shadow-sm border-l-4 ' + (m.read?'border-slate-100':'border-blue-500') + '">' +
        '<div class="flex justify-between items-center mb-1">' +
          '<span class="text-xs font-black text-slate-700">' + m.from + '</span>' +
          '<span class="text-[9px] text-slate-400">' + m.date + '</span>' +
        '</div>' +
        '<p class="text-xs font-bold text-slate-600 mb-1">' + m.subject + '</p>' +
        '<p class="text-[10px] text-slate-500 leading-relaxed">' + m.body + '</p>' +
        '<button onclick="openCompose(\'' + m.from + '\')" class="mt-2 text-[9px] text-blue-500 font-black">← 답장</button>' +
      '</div>';
    }).join('');
  } else {
    html += '<p class="text-[10px] text-slate-300 font-bold py-3 text-center">받은 쪽지가 없습니다.</p>';
  }
  html += '<p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 mt-4">보낸 쪽지 (' + sent.length + ')</p>';
  if (sent.length) {
    html += sent.slice().reverse().map(function(m){
      return '<div class="bg-slate-50 rounded-xl p-3 mb-2">' +
        '<div class="flex justify-between items-center mb-1">' +
          '<span class="text-xs font-bold text-slate-600">→ ' + m.to + '</span>' +
          '<span class="text-[9px] text-slate-400">' + m.date + '</span>' +
        '</div>' +
        '<p class="text-xs font-bold text-slate-500">' + m.subject + '</p>' +
        '<p class="text-[10px] text-slate-400">' + m.body + '</p>' +
      '</div>';
    }).join('');
  } else {
    html += '<p class="text-[10px] text-slate-300 font-bold py-3 text-center">보낸 쪽지가 없습니다.</p>';
  }
  el.innerHTML = html;
}
function renderMyPosts() {
  var el = document.getElementById('activity-posts');
  if (!el) return;
  var nick = currentUser.nickname;
  var items = [];
  usedItems.filter(function(x){ return x.seller===nick||x.seller==='Me'; }).forEach(function(x){
    items.push({ type:'중고마켓', icon:'♻️', title:x.name, sub:x.price.toLocaleString()+' THB', date:x.date });
  });
  posts.filter(function(p){ return p.author===nick; }).forEach(function(p){
    items.push({ type:'임상토론방', icon:'💬', title:p.title, sub:p.category==='implant'?'🦷 임플란트':'💎 보철', date:p.date||'' });
  });
  customOrders.forEach(function(o){
    items.push({ type:'CNC Custom', icon:'⚙️', title:o.clinic+' · '+o.id, sub:t('stage_'+o.stage)||o.stage, date:o.date });
  });
  items.sort(function(a,b){ return b.date>a.date?1:b.date<a.date?-1:0; });
  if (!items.length) { el.innerHTML='<p class="text-sm text-slate-300 font-bold text-center py-10">게시물이 없습니다.</p>'; return; }
  el.innerHTML = items.map(function(item){
    return '<div class="bg-white rounded-xl p-3 mb-2 shadow-sm">' +
      '<div class="flex justify-between items-start mb-1">' +
        '<span class="text-[9px] font-black px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">' + item.icon + ' ' + item.type + '</span>' +
        '<span class="text-[9px] text-slate-400">' + item.date + '</span>' +
      '</div>' +
      '<p class="text-xs font-black text-slate-700 leading-snug mt-1">' + item.title + '</p>' +
      '<p class="text-[9px] text-slate-400 mt-0.5">' + item.sub + '</p>' +
    '</div>';
  }).join('');
}
function openCompose(toNick) {
  if (!isLoggedIn()) return;
  document.getElementById('compose-to').value   = toNick || '';
  document.getElementById('compose-subj').value = '';
  document.getElementById('compose-body').value = '';
  openModal('composeModal');
}
function sendMsg() {
  var to      = document.getElementById('compose-to').value.trim();
  var subject = document.getElementById('compose-subj').value.trim();
  var body    = document.getElementById('compose-body').value.trim();
  if (!to||!subject||!body) { alert('받는 사람, 제목, 내용을 모두 입력해주세요.'); return; }
  messages.push({ id:Date.now(), from:currentUser.nickname, to:to, subject:subject, body:body, date:new Date().toLocaleDateString(), read:false });
  closeModal('composeModal');
  renderMyMsgs();
  alert('쪽지를 보냈습니다!');
}
// ============================================================
// EVENTS
// ============================================================
function renderEvents() {
  document.getElementById('eventList').innerHTML = events_.map(function(e){
    return '<div class="bg-white p-5 rounded-2xl border-l-8 border-blue-900 shadow-sm"><p class="text-xs font-black text-slate-400 font-mono uppercase">' + e.date + '</p><p class="font-black text-sm mt-1 text-slate-800">' + e.event + '</p><p class="text-xs text-slate-400 mt-1">📍 ' + e.loc + '</p></div>';
  }).join('');
}
// ============================================================
// SETTINGS - 언어 선택 (저장 전까지 pendingLang에 보관)
// ============================================================
function selectLang(lang) {
  pendingLang = lang;
  ['en','ko','zh','th','vi','es'].forEach(function(l){
    var b = document.getElementById('lang-'+l);
    if (!b) return;
    b.className = l===lang
      ? 'p-4 rounded-2xl font-black text-sm border-2 border-amber-500 bg-amber-50 text-amber-700'
      : 'p-4 rounded-2xl font-black text-sm border-2 border-transparent bg-slate-50 text-slate-600';
  });
  // 현재 저장된 언어 버튼은 파란색으로 유지
  var saved = document.getElementById('lang-'+currentLang);
  if (saved && lang !== currentLang) {
    // pending 선택은 amber, 저장된 언어는 일반 표시
  }
  var pendingNote = document.getElementById('langPendingNote');
  if (pendingNote) pendingNote.classList.remove('hidden');
  var savedMsg = document.getElementById('savedMsg');
  if (savedMsg) savedMsg.classList.add('hidden');
}
function saveLang() {
  if (!pendingLang) return;
  currentLang = pendingLang;
  pendingLang = null;
  localStorage.setItem('dentalk_lang', currentLang);
  // 저장된 언어 버튼 스타일 업데이트
  ['en','ko','zh','th','vi','es'].forEach(function(l){
    var b = document.getElementById('lang-'+l);
    if (!b) return;
    b.className = l===currentLang
      ? 'p-4 rounded-2xl font-black text-sm border-2 border-blue-600 bg-blue-50 text-blue-700'
      : 'p-4 rounded-2xl font-black text-sm border-2 border-transparent bg-slate-50 text-slate-600';
  });
  var pendingNote = document.getElementById('langPendingNote');
  if (pendingNote) pendingNote.classList.add('hidden');
  applyLang();
  var savedMsg = document.getElementById('savedMsg');
  if (savedMsg) {
    savedMsg.classList.remove('hidden');
    setTimeout(function(){ savedMsg.classList.add('hidden'); }, 2000);
  }
}
// ============================================================
// applyLang - 모든 UI 텍스트 업데이트
// ============================================================
function applyLang() {
  // data-i18n 속성 요소 업데이트
  document.querySelectorAll('[data-i18n]').forEach(function(el) {
    el.textContent = t(el.dataset.i18n);
  });
  // data-i18n-ph 속성 요소 (placeholder) 업데이트
  document.querySelectorAll('[data-i18n-ph]').forEach(function(el) {
    el.placeholder = t(el.dataset.i18nPh);
  });
  // 중고마켓 상태 셀렉트 옵션 업데이트
  var condSel = document.getElementById('u-cond');
  if (condSel && condSel.options.length >= 3) {
    condSel.options[0].text = t('cond_new');
    condSel.options[1].text = t('cond_good');
    condSel.options[2].text = t('cond_fair');
  }
  // 페이지 타이틀 업데이트
  var ptEl = document.getElementById('pageTitle');
  if (ptEl) ptEl.textContent = t('pt_' + currentPage);
  // 커스텀 탭 버튼 텍스트 업데이트
  var fBtn = document.getElementById('ctab-form');
  var lBtn = document.getElementById('ctab-list');
  if (fBtn) fBtn.textContent = t('custom_tab_new');
  if (lBtn) lBtn.textContent = t('custom_tab_list');
  // 사이드 로그인 버튼
  var sideLoginTxt = document.getElementById('sideLoginTxt');
  if (sideLoginTxt) sideLoginTxt.textContent = t('side_login_btn');
  // 모든 페이지 동적 콘텐츠 재렌더링 (언어 변경 시 전체 반영)
  renderShop();
  renderUsed();
  renderForum();
  renderEvents();
  renderCustomOrders();
  renderProfileSettings();
  // 설정 저장 버튼 텍스트
  var saveBtn = document.getElementById('saveLangBtn');
  if (saveBtn) saveBtn.textContent = t('settings_save_btn');
  // 저장된 언어 버튼 스타일 반영
  ['en','ko','zh','th','vi','es'].forEach(function(l){
    var b = document.getElementById('lang-'+l);
    if (!b) return;
    b.className = l===currentLang
      ? 'p-4 rounded-2xl font-black text-sm border-2 border-blue-600 bg-blue-50 text-blue-700'
      : 'p-4 rounded-2xl font-black text-sm border-2 border-transparent bg-slate-50 text-slate-600';
  });
}
// ============================================================
// 모달 유틸
// ============================================================
function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
// ============================================================
// 초기화
// ============================================================
window.addEventListener('DOMContentLoaded', function() {
  var saved = localStorage.getItem('dentalk_lang') || 'en';
  currentLang = saved;
  pendingLang = null;
  document.getElementById('mb-home').classList.add('active');
  updateNavTabs('home');
  updateNavLocks();
  applyLang();
  renderUsed();
  renderForum();
  renderEvents();
});
