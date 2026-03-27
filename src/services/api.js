import AsyncStorage from '@react-native-async-storage/async-storage';

// ── Change this IP to your PC's IP ──────────────────────────────
const BASE_URL = 'http://192.168.1.11:5000/api';

let _user = null;

export const Api = {

  // ── Auth ──────────────────────────────────────────────────────
  async login(username, password) {
    const res = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (data.success) {
      _user = data.user;
      await AsyncStorage.setItem('user', JSON.stringify(_user));
    }
    return data;
  },

  async loadSaved() {
    const saved = await AsyncStorage.getItem('user');
    if (saved) _user = JSON.parse(saved);
    return _user;
  },

  async logout() {
    _user = null;
    await AsyncStorage.removeItem('user');
  },

  getUser: () => _user,
  isDirector: () => _user?.role === 'Director' || _user?.role === 'Admin',
  isGroupHead: () => !!_user?.groupHeadOf,
  getGroupId: () => _user?.groupHeadOf?.GroupID,
  getGroupName: () => _user?.groupHeadOf?.GroupName || 'My Group',

  // ── Groups ────────────────────────────────────────────────────
  async getAllGroups() {
    const res = await fetch(`${BASE_URL}/groups`);
    const data = await res.json();
    return data.groups || [];
  },

  async getGroupDashboard(gid) {
    const res = await fetch(`${BASE_URL}/group/${gid}/dashboard`);
    return res.json();
  },

  async getGroupMembers(gid) {
    const res = await fetch(`${BASE_URL}/group/${gid}/members`);
    const data = await res.json();
    return data.members || [];
  },

  async getGroupDeposits(gid, month) {
    const m = month || new Date().toISOString().slice(0, 7);
    const res = await fetch(`${BASE_URL}/group/${gid}/deposits?month=${m}`);
    return res.json();
  },

  // ── Member ────────────────────────────────────────────────────
  async getMember(mid) {
    const res = await fetch(`${BASE_URL}/member/${mid}`);
    return res.json();
  },

  // ── Loans ─────────────────────────────────────────────────────
  async applyLoan(payload) {
    const res = await fetch(`${BASE_URL}/loan/apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async getPendingLoans() {
    const res = await fetch(`${BASE_URL}/loans/pending`);
    const data = await res.json();
    return data.applications || [];
  },

  async castVote(appId, decision, remarks) {
    const res = await fetch(`${BASE_URL}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        applicationID: appId,
        directorMemberID: _user?.memberID,
        decision,
        remarks,
      }),
    });
    return res.json();
  },

  async changePassword(oldPass, newPass) {
    const res = await fetch(`${BASE_URL}/change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userID: _user?.userID,
        oldPassword: oldPass,
        newPassword: newPass,
      }),
    });
    return res.json();
  },

  // ── Helpers ───────────────────────────────────────────────────
  fmtCurrency(v) {
    const n = parseFloat(v) || 0;
    return `Rs. ${n.toFixed(2)}`;
  },

  fmtDate(s) {
    if (!s) return '--';
    try {
      const d = new Date(s);
      return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
    } catch { return s; }
  },

  currentMonth() {
    return new Date().toISOString().slice(0, 7);
  },

  monthLabel(ym) {
    if (!ym) return '';
    const [y, m] = ym.split('-');
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${months[parseInt(m)-1]} ${y}`;
  },
};
