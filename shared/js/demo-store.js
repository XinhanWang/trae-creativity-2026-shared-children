/**
 * shared/js/demo-store.js
 * 共享儿女 · 暖陪伴计划 — 统一演示数据层
 *
 * 集中维护：schema 版本迁移、订单/暖伴/认证种子、时间格式化、
 * 状态计算、附近暖伴选择器、安全读写方法。
 * 被 mini-program.html 和 web-admin.html 共同引用。
 */
(function (window) {
  'use strict';

  /* ===== Constants ===== */
  var SCHEMA_VERSION = 11;
  var D = 86400000; // 1 day in ms

  var KEYS = {
    orders: 'sc_orders',
    volunteers: 'sc_volunteers',
    auth: 'sc_auth_records',
    authNuanjia: 'sc_auth_nuanjia',
    authNuanban: 'sc_auth_nuanban',
    alarms: 'sc_alarms',
    contracts: 'sc_contracts',
    profile: 'sc_profile',
    health: 'sc_health_records',
    volunteerProfile: 'sc_volunteer_profile',
    adminSettings: 'sc_admin_settings'
  };

  // Wuhan demo center
  var MAP_CENTER = { lng: 114.3055, lat: 30.5928 };

  // Order statuses (canonical)
  var STATUSES = ['待接单', '待服务', '进行中', '待确认', '已完成', '已取消', '已过期'];

  /* ===== Safe Storage Helpers ===== */
  function get(key) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }
  function set(key, data) {
    try { localStorage.setItem(key, JSON.stringify(data)); } catch (e) { console.error('Storage error:', e); }
  }

  /* ===== HTML Escape ===== */
  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /* ===== Time Helpers ===== */
  function _p2(n) { return String(n).padStart(2, '0'); }
  function _ymd(ms) { var d = new Date(ms); return d.getFullYear() + '-' + _p2(d.getMonth() + 1) + '-' + _p2(d.getDate()); }
  function fmtDate(offset) {
    var d = new Date();
    d.setDate(d.getDate() + offset);
    return d.getFullYear() + '-' + _p2(d.getMonth() + 1) + '-' + _p2(d.getDate());
  }
  function fmtTime(ts, full) {
    if (!ts) return '-';
    var n = Number(ts), d;
    if (!isNaN(n) && n > 0) d = new Date(n);
    else if (typeof ts === 'string' && /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}/.test(ts)) d = new Date(ts.replace(/-/g, '/'));
    else return String(ts);
    if (!d || isNaN(d.getTime())) return String(ts);
    if (full) return d.getFullYear() + '-' + _p2(d.getMonth() + 1) + '-' + _p2(d.getDate()) + ' ' + _p2(d.getHours()) + ':' + _p2(d.getMinutes());
    return _p2(d.getMonth() + 1) + '-' + _p2(d.getDate()) + ' ' + _p2(d.getHours()) + ':' + _p2(d.getMinutes());
  }
  function fmtAlarmTime(a, full) {
    if (!a) return '-';
    var ts = (a.createdAt != null ? a.createdAt : a.time);
    return fmtTime(ts, full);
  }
  function fmtOrderId(offset, seq) {
    var d = new Date();
    d.setDate(d.getDate() + offset);
    return 'ORD' + d.getFullYear() + _p2(d.getMonth() + 1) + _p2(d.getDate()) + String(seq).padStart(4, '0');
  }

  /* ===== Volunteer Seed Data (with location, distance, certificationStatus) ===== */
  // Coordinates around Wuhan center, deterministic distances
  var _volSeed = [
    { id: 'V-001', name: '张小雨', phone: '138xxxx1234', rating: 4.9, completedOrders: 328, status: '在线', skills: ['日常陪伴', '数字辅导'], area: '武昌区梅苑小区', experience: '2年经验', praiseRate: 98, location: { lng: 114.3105, lat: 30.5958 }, distanceMeters: 520 },
    { id: 'V-002', name: '李芳姨', phone: '139xxxx5678', rating: 4.8, completedOrders: 512, status: '在线', skills: ['日常陪伴', '跑腿代办', '陪同就医'], area: '洪山区卓刀泉社区', experience: '3年经验', praiseRate: 97, location: { lng: 114.3185, lat: 30.5768 }, distanceMeters: 850 },
    { id: 'V-003', name: '王志强', phone: '137xxxx9012', rating: 4.7, completedOrders: 156, status: '在线', skills: ['数字辅导', '跑腿代办'], area: '江岸区同安里', experience: '1年经验', praiseRate: 96, location: { lng: 114.2985, lat: 30.6128 }, distanceMeters: 1200 },
    { id: 'V-004', name: '陈思雨', phone: '136xxxx3456', rating: 4.9, completedOrders: 89, status: '服务中', skills: ['陪同就医', '日常陪伴'], area: '汉阳区翠微街', experience: '1年经验', praiseRate: 99, location: { lng: 114.2645, lat: 30.5548 }, distanceMeters: 2100 },
    { id: 'V-005', name: '刘文博', phone: '135xxxx7890', rating: 4.6, completedOrders: 67, status: '在线', skills: ['日常陪伴', '跑腿代办'], area: '江汉区锦绣家园', experience: '半年经验', praiseRate: 95, location: { lng: 114.2855, lat: 30.6018 }, distanceMeters: 1500 },
    { id: 'V-006', name: '赵敏', phone: '133xxxx2345', rating: 4.8, completedOrders: 203, status: '待审核', skills: ['跑腿代办', '陪同就医'], area: '青山区金色港湾', experience: '2年经验', praiseRate: 97, location: { lng: 114.3415, lat: 30.6388 }, distanceMeters: 3500 },
    { id: 'V-007', name: '孙嘉懿', phone: '138xxxx6789', rating: 4.8, completedOrders: 45, status: '在线', skills: ['日常陪伴', '数字辅导'], area: '武昌区水果湖', experience: '1年经验', praiseRate: 96, location: { lng: 114.3535, lat: 30.5858 }, distanceMeters: 1800 },
    { id: 'V-008', name: '杨思琪', phone: '139xxxx1357', rating: 4.7, completedOrders: 78, status: '在线', skills: ['日常陪伴', '陪同就医'], area: '洪山区街道口', experience: '1年经验', praiseRate: 95, location: { lng: 114.3295, lat: 30.5688 }, distanceMeters: 1100 },
    { id: 'V-009', name: '马晓晨', phone: '136xxxx2468', rating: 4.9, completedOrders: 112, status: '服务中', skills: ['跑腿代办', '数字辅导'], area: '江岸区百步亭', experience: '2年经验', praiseRate: 98, location: { lng: 114.3125, lat: 30.6258 }, distanceMeters: 2400 },
    { id: 'V-010', name: '郭明轩', phone: '135xxxx8642', rating: 4.6, completedOrders: 34, status: '待审核', skills: ['日常陪伴', '跑腿代办'], area: '汉阳区王家湾', experience: '半年经验', praiseRate: 94, location: { lng: 114.2765, lat: 30.5488 }, distanceMeters: 3200 }
  ];

  /* ===== Auth Seed Data (20 cases: 10 nuanjia + 10 nuanban) ===== */
  // subjectId explicitly references canonical volunteer/nuanjia IDs
  var _authSeedNames = [
    // 暖家 U001-U010
    { display: '王奶奶', realName: '王秀兰', role: '暖家', subjectId: 'U001', area: '武昌区梅苑小区', phone: '138****8888' },
    { display: '李大爷', realName: '李建国', role: '暖家', subjectId: 'U002', area: '洪山区卓刀泉社区', phone: '139****0000' },
    { display: '赵奶奶', realName: '赵淑芬', role: '暖家', subjectId: 'U003', area: '江岸区同安里', phone: '137****2233' },
    { display: '孙爷爷', realName: '孙明德', role: '暖家', subjectId: 'U004', area: '汉阳区翠微街', phone: '135****4455' },
    { display: '周奶奶', realName: '周桂英', role: '暖家', subjectId: 'U005', area: '江汉区锦绣家园', phone: '136****6677' },
    { display: '吴叔叔', realName: '吴国强', role: '暖家', subjectId: 'U006', area: '青山区金色港湾', phone: '133****8899' },
    { display: '郑阿姨', realName: '郑美玲', role: '暖家', subjectId: 'U007', area: '武昌区中南路', phone: '138****1122' },
    { display: '冯爷爷', realName: '冯德海', role: '暖家', subjectId: 'U008', area: '洪山区光谷步行街', phone: '139****3344' },
    { display: '陈奶奶', realName: '陈玉兰', role: '暖家', subjectId: 'U009', area: '江汉区万松街', phone: '137****5566' },
    { display: '黄大爷', realName: '黄志远', role: '暖家', subjectId: 'U010', area: '汉阳区建桥街', phone: '135****7788' },
    // 暖伴 V-001 to V-010 (explicitly matching sc_volunteers IDs)
    { display: '张小雨', realName: '张小雨', role: '暖伴', subjectId: 'V-001', area: '武昌区梅苑小区', phone: '138****1234' },
    { display: '陈思雨', realName: '陈思雨', role: '暖伴', subjectId: 'V-004', area: '汉阳区翠微街', phone: '136****3456' },
    { display: '李芳姨', realName: '李芳姨', role: '暖伴', subjectId: 'V-002', area: '洪山区卓刀泉社区', phone: '139****5678' },
    { display: '王志强', realName: '王志强', role: '暖伴', subjectId: 'V-003', area: '江岸区同安里', phone: '137****9012' },
    { display: '刘文博', realName: '刘文博', role: '暖伴', subjectId: 'V-005', area: '江汉区锦绣家园', phone: '135****7890' },
    { display: '赵敏', realName: '赵敏', role: '暖伴', subjectId: 'V-006', area: '青山区金色港湾', phone: '133****2345' },
    { display: '孙嘉懿', realName: '孙嘉懿', role: '暖伴', subjectId: 'V-007', area: '武昌区水果湖', phone: '138****6789' },
    { display: '杨思琪', realName: '杨思琪', role: '暖伴', subjectId: 'V-008', area: '洪山区街道口', phone: '139****1357' },
    { display: '马晓晨', realName: '马晓晨', role: '暖伴', subjectId: 'V-009', area: '江岸区百步亭', phone: '136****2468' },
    { display: '郭明轩', realName: '郭明轩', role: '暖伴', subjectId: 'V-010', area: '汉阳区王家湾', phone: '135****8642' }
  ];
  var _authStatuses = ['已认证', '已认证', '已认证', '待审核', '待审核', '已认证', '已拒绝', '待审核', '已认证', '已认证',
                       '已认证', '待审核', '已认证', '已认证', '已认证', '已拒绝', '待审核', '已认证', '待审核', '已认证'];

  function _buildAuthSeed() {
    var recs = [];
    for (var i = 0; i < _authSeedNames.length; i++) {
      var a = _authSeedNames[i];
      var dayOffset = -(i % 10) - 1;
      var hour = 8 + (i % 10);
      var minute = (i * 7) % 60;
      var rec = {
        id: 'AUTH-' + String(i + 1).padStart(3, '0'),
        name: a.display,
        role: a.role,
        subjectId: a.subjectId, // explicitly canonical
        idCard: '4201**********' + String(1000 + i * 37).slice(-4),
        phone: a.phone,
        submitTime: fmtDate(dayOffset) + ' ' + _p2(hour) + ':' + _p2(minute),
        submitAt: Date.now() + dayOffset * D,
        status: _authStatuses[i],
        realName: a.realName,
        area: a.area,
        materials: 'demo-masked',
        materialNote: '已脱敏演示材料（非真实证件）'
      };
      if (rec.status === '已拒绝') {
        rec.rejectReason = i % 2 === 0 ? '身份证照片模糊，请重新上传' : '人脸识别不匹配，请重新提交';
        rec.reviewedAt = Date.now() + (dayOffset + 1) * D;
      }
      if (rec.status === '已认证') {
        rec.reviewedAt = Date.now() + (dayOffset + 1) * D;
      }
      recs.push(rec);
    }
    return recs;
  }

  /* ===== Order Seed Data (relative to now, logically self-consistent) ===== */
  function _buildOrderSeed() {
    var now = Date.now();
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var t = today.getTime();

    function ts(dayOffset, hours, mins) {
      var d = new Date(t);
      d.setDate(d.getDate() + dayOffset);
      d.setHours(hours || 0, mins || 0, 0, 0);
      return d.getTime();
    }

    return [
      // 1. 未来2小时的待接单
      { id: fmtOrderId(0, '0001'), type: '日常陪伴', status: '待接单', elderName: '王奶奶', address: '武汉市武昌区中南路街梅苑小区3栋', serviceStartAt: ts(0, Math.min(23, (new Date().getHours() + 2) % 24), 0), duration: '2小时', description: '陪老人散步聊天，读报纸', volunteer: null, volunteerId: null, price: 80, createdAt: now - 3600000, ownerId: 'U001' },
      // 2. 明天的待接单
      { id: fmtOrderId(1, '0001'), type: '跑腿代办', status: '待接单', elderName: '李大爷', address: '武汉市洪山区珞南街卓刀泉社区12栋', serviceStartAt: ts(1, 10, 15), duration: '1小时', description: '代购生活用品和常用药品', volunteer: null, volunteerId: null, price: 60, createdAt: now - 7200000, ownerId: null },
      // 3. 当前可开始的待服务（已接单/已指派，尚未开始）
      { id: fmtOrderId(0, '0002'), type: '陪同就医', status: '待服务', elderName: '王奶奶', address: '武汉市武昌区中南路街梅苑小区3栋', serviceStartAt: ts(0, new Date().getHours(), new Date().getMinutes()), duration: '3小时', description: '陪同前往武汉大学中南医院复查并取药', volunteer: '张小雨', volunteerId: 'V-001', price: 120, createdAt: now - 3 * 3600000, assignedAt: now - 2 * 3600000, ownerId: 'U001' },
      // 4. 服务时间窗内的进行中
      { id: fmtOrderId(0, '0003'), type: '数字辅导', status: '进行中', elderName: '赵阿姨', address: '武汉市江岸区大智街同安里7栋', serviceStartAt: ts(0, Math.max(0, new Date().getHours() - 1), 0), duration: '1.5小时', description: '教老人使用智能手机视频通话和微信', volunteer: '陈思雨', volunteerId: 'V-004', price: 70, createdAt: now - 5 * 3600000, assignedAt: now - 4 * 3600000, startedAt: now - 3600000, ownerId: null },
      // 5. 待确认（暖伴已完成，等待暖家确认）
      { id: fmtOrderId(-1, '0001'), type: '日常陪伴', status: '待确认', elderName: '王奶奶', address: '武汉市武昌区中南路街梅苑小区3栋', serviceStartAt: ts(-1, 14, 0), duration: '2小时', description: '陪伴聊天，协助整理家务', volunteer: '张小雨', volunteerId: 'V-001', price: 80, createdAt: now - 2 * D, assignedAt: now - 2 * D + 3600000, startedAt: now - D - 3600000, completedAt: now - 3600000, ownerId: 'U001' },
      // 6. 已完成
      { id: fmtOrderId(-2, '0001'), type: '数字辅导', status: '已完成', elderName: '赵阿姨', address: '武汉市江岸区大智街同安里7栋', serviceStartAt: ts(-2, 8, 0), duration: '1.5小时', description: '教老人使用智能手机视频通话和微信', volunteer: '王志强', volunteerId: 'V-003', price: 70, createdAt: now - 3 * D, assignedAt: now - 3 * D + 3600000, startedAt: now - 2 * D - 3600000, completedAt: now - 2 * D, confirmedAt: now - 2 * D + 3600000, ownerId: null },
      // 7. 已取消
      { id: fmtOrderId(-3, '0001'), type: '跑腿代办', status: '已取消', elderName: '吴叔叔', address: '武汉市青山区红钢城街金色港湾8栋', serviceStartAt: ts(-3, 11, 20), duration: '1小时', description: '代缴水电燃气费', volunteer: null, volunteerId: null, price: 60, createdAt: now - 4 * D, cancelledAt: now - 3 * D - 3600000, ownerId: null },
      // 8. 过去未接单的已过期
      { id: fmtOrderId(-1, '0002'), type: '日常陪伴', status: '已过期', elderName: '周奶奶', address: '武汉市江汉区锦绣家园5栋', serviceStartAt: ts(-1, 9, 0), duration: '2小时', description: '陪老人聊天读报', volunteer: null, volunteerId: null, price: 80, createdAt: now - 2 * D, expiredAt: ts(-1, 9, 0), expireReason: '超过预约服务时间仍未接单', ownerId: null }
    ];
  }

  /* ===== Upsert by stable ID ===== */
  function _upsertById(existing, seeds, idField) {
    if (!existing || !existing.length) return seeds.slice();
    var result = existing.slice();
    var indexMap = {};
    result.forEach(function (item, i) { if (item && item[idField]) indexMap[item[idField]] = i; });
    seeds.forEach(function (seed) {
      var id = seed[idField];
      if (id && indexMap[id] !== undefined) {
        // Merge: only fill missing fields, never overwrite user-modified data
        var existingItem = result[indexMap[id]];
        Object.keys(seed).forEach(function (k) {
          if (existingItem[k] === undefined || existingItem[k] === null) {
            existingItem[k] = seed[k];
          }
        });
      } else {
        // New seed record — append
        result.push(seed);
      }
    });
    return result;
  }

  /* ===== Migration: patch missing fields on existing data ===== */
  function _migrateOrders(orders) {
    if (!orders || !orders.length) return;
    var vols = get(KEYS.volunteers) || [];
    var nameToId = {};
    vols.forEach(function (v) { if (v && v.name) nameToId[v.name] = v.id; });
    var changed = false;
    orders.forEach(function (o) {
      // volunteerId
      if (o.volunteerId === undefined) {
        o.volunteerId = (o.volunteer && nameToId[o.volunteer]) ? nameToId[o.volunteer] : null;
        changed = true;
      }
      // createdAt: numeric timestamp
      if (o.createdAt === undefined || typeof o.createdAt !== 'number') {
        if (typeof o.time === 'string' && o.time) {
          var dd = new Date(o.time.replace(/-/g, '/'));
          o.createdAt = isNaN(dd.getTime()) ? Date.now() : dd.getTime();
        } else { o.createdAt = Date.now(); }
        changed = true;
      }
      // serviceStartAt: migrate from time string
      if (o.serviceStartAt === undefined) {
        if (typeof o.time === 'string' && o.time) {
          var sd = new Date(o.time.replace(/-/g, '/'));
          o.serviceStartAt = isNaN(sd.getTime()) ? o.createdAt : sd.getTime();
        } else { o.serviceStartAt = o.createdAt; }
        changed = true;
      }
      // Normalize status: 已通过 → 已认证 (for auth), map old order statuses
      if (o.status === '已指派') { o.status = '待服务'; changed = true; }
    });
    if (changed) set(KEYS.orders, orders);
  }

  function _migrateVolunteers(vols) {
    if (!vols || !vols.length) return;
    var changed = false;
    var seedMap = {};
    _volSeed.forEach(function (s) { seedMap[s.id] = s; });
    vols.forEach(function (v) {
      if (v.id === undefined) { v.id = 'V-' + String(vols.indexOf(v) + 1).padStart(3, '0'); changed = true; }
      if (v.completedOrders === undefined) { v.completedOrders = 0; changed = true; }
      // Fill location/distance from seed if missing
      var seed = seedMap[v.id];
      if (seed) {
        if (v.location === undefined) { v.location = seed.location; changed = true; }
        if (v.distanceMeters === undefined) { v.distanceMeters = seed.distanceMeters; changed = true; }
      }
    });
    if (changed) set(KEYS.volunteers, vols);
  }

  function _migrateAuth() {
    var recs = get(KEYS.auth);
    // If fewer than 20 records, upsert missing seeds
    var seeds = _buildAuthSeed();
    if (!recs || !recs.length) {
      set(KEYS.auth, seeds);
      return;
    }
    // Upsert by auth record id
    var upserted = _upsertById(recs, seeds, 'id');
    // Fix subjectId: if subjectId doesn't match the canonical mapping, fix it
    var seedMap = {};
    seeds.forEach(function (s) { seedMap[s.id] = s; });
    var changed = false;
    upserted.forEach(function (r) {
      var seed = seedMap[r.id];
      if (seed) {
        // Force-correct canonical fields that must match the seed
        if (r.subjectId !== seed.subjectId) { r.subjectId = seed.subjectId; changed = true; }
        if (r.role !== seed.role) { r.role = seed.role; changed = true; }
        if (r.name !== seed.name) { r.name = seed.name; changed = true; }
      }
      if (r.status === '已通过') { r.status = '已认证'; changed = true; }
      // Add materialNote for demo
      if (r.materialNote === undefined) { r.materialNote = '已脱敏演示材料（非真实证件）'; changed = true; }
    });
    if (changed || upserted.length !== recs.length) set(KEYS.auth, upserted);
  }

  function _migrateAlarms(alarms) {
    if (!alarms || !alarms.length) return;
    var changed = false;
    alarms.forEach(function (a) {
      if (a.createdAt === undefined) {
        if (typeof a.time === 'number') { a.createdAt = a.time; changed = true; }
        else if (typeof a.time === 'string' && a.time) {
          var m = a.time.match(/^(\d{1,2}):(\d{2})$/);
          if (m) { var d = new Date(); d.setHours(+m[1], +m[2], 0, 0); a.createdAt = d.getTime(); changed = true; }
          else { var dd = new Date(a.time.replace(/-/g, '/')); if (!isNaN(dd.getTime())) { a.createdAt = dd.getTime(); changed = true; } }
        } else { a.createdAt = Date.now(); changed = true; }
      }
    });
    if (changed) set(KEYS.alarms, alarms);
  }

  function _syncCurrentUserAuth() {
    // Ensure sc_auth_nuanjia / sc_auth_nuanban are consistent with sc_auth_records
    var recs = get(KEYS.auth) || [];

    // Nuanjia (U001)
    var jia = get(KEYS.authNuanjia);
    var jiaRec = null;
    for (var i = 0; i < recs.length; i++) {
      if (recs[i].role === '暖家' && recs[i].subjectId === 'U001') { jiaRec = recs[i]; break; }
    }
    if (jiaRec) {
      if (!jia || jia.status !== jiaRec.status) {
        set(KEYS.authNuanjia, {
          status: jiaRec.status,
          realname: jiaRec.realName || '',
          idcard: jiaRec.idCard || '',
          idfront: '', idback: '',
          submitAt: jiaRec.submitAt || null,
          subjectId: 'U001',
          rejectReason: jiaRec.rejectReason || ''
        });
      }
    } else if (!jia) {
      set(KEYS.authNuanjia, { status: '未认证', realname: '', idcard: '', idfront: '', idback: '', submitAt: null, subjectId: 'U001' });
    }

    // Nuanban (V-001)
    var ban = get(KEYS.authNuanban);
    var banRec = null;
    for (var j = 0; j < recs.length; j++) {
      if (recs[j].role === '暖伴' && recs[j].subjectId === 'V-001') { banRec = recs[j]; break; }
    }
    if (banRec) {
      if (!ban || ban.status !== banRec.status) {
        set(KEYS.authNuanban, {
          status: banRec.status,
          realname: banRec.realName || '',
          idcard: banRec.idCard || '',
          idfront: '', idback: '',
          submitAt: banRec.submitAt || null,
          subjectId: 'V-001',
          rejectReason: banRec.rejectReason || ''
        });
      }
    } else if (!ban) {
      set(KEYS.authNuanban, { status: '已认证', realname: '张小雨', idcard: '420106********1234', idfront: '', idback: '', submitAt: Date.now() - 30 * D, subjectId: 'V-001' });
    }
  }

  /* ===== Status Reconciliation ===== */
  function reconcileOrderStatuses(now) {
    var orders = get(KEYS.orders);
    if (!orders || !orders.length) return;
    now = now || Date.now();
    var changed = false;
    orders.forEach(function (o) {
      // Only pending (待接单) orders with serviceStartAt <= now become expired
      if (o.status === '待接单' && o.serviceStartAt && o.serviceStartAt <= now) {
        o.status = '已过期';
        o.expiredAt = o.expiredAt || now;
        o.expireReason = o.expireReason || '超过预约服务时间仍未接单';
        changed = true;
      }
      // 进行中 and 待确认 must NOT be expired
    });
    if (changed) set(KEYS.orders, orders);
  }

  /* ===== Nearby Volunteer View Model (single source of truth) ===== */
  function getNearbyVolunteerViewModel(limit) {
    var vols = get(KEYS.volunteers) || [];
    var recs = get(KEYS.auth) || [];
    // Build certification map
    var certMap = {};
    recs.forEach(function (r) {
      if (r.role === '暖伴') certMap[r.subjectId] = r.status;
    });
    // Filter: 在线 or 服务中 (exclude 待审核, offline)
    var suitable = vols.filter(function (v) {
      return v && v.id && v.name && (v.status === '在线' || v.status === '服务中');
    });
    // Enrich with certificationStatus
    suitable = suitable.map(function (v) {
      return Object.assign({}, v, {
        certificationStatus: certMap[v.id] || '未认证'
      });
    });
    // Sort by distance ascending (not by rating or render index)
    suitable.sort(function (a, b) {
      return (a.distanceMeters || 99999) - (b.distanceMeters || 99999);
    });
    if (limit) suitable = suitable.slice(0, limit);
    return suitable;
  }

  /* ===== Status Style Helper ===== */
  function orderStatusStyle(status) {
    var map = {
      '待接单': 'var(--state-info-bg)|var(--state-info)',
      '待服务': 'var(--color-primary-light)|var(--color-primary)',
      '进行中': 'var(--state-success-bg)|var(--state-success)',
      '待确认': 'var(--state-warning-bg)|var(--state-warning)',
      '已完成': 'var(--color-bg-muted)|var(--color-text-muted)',
      '已取消': 'var(--state-error-bg)|var(--state-error)',
      '已过期': 'var(--color-bg-muted)|var(--color-text-muted)'
    };
    return map[status] || 'var(--color-bg-muted)|var(--color-text-secondary)';
  }

  function volunteerStatusStyle(status) {
    var map = {
      '在线': 'var(--state-success-bg)|var(--state-success)',
      '服务中': 'var(--state-info-bg)|var(--state-info)',
      '待审核': 'var(--state-warning-bg)|var(--state-warning)'
    };
    return map[status] || 'var(--color-bg-muted)|var(--color-text-secondary)';
  }

  function isVolunteerCertified(volunteerId) {
    var recs = get(KEYS.auth) || [];
    for (var i = 0; i < recs.length; i++) {
      if (recs[i].role === '暖伴' && recs[i].subjectId === volunteerId && recs[i].status === '已认证') return true;
    }
    return false;
  }

  /* ===== Init: the one entry point ===== */
  function init() {
    var oldVersion = parseInt(localStorage.getItem('sc_schema_version') || '0', 10);

    // --- Orders: upsert seeds by ID, then migrate ---
    var orders = get(KEYS.orders);
    if (!orders || !orders.length) {
      set(KEYS.orders, _buildOrderSeed());
    } else {
      // For schema < 11, upsert missing seed orders by ID
      if (oldVersion < 11) {
        var seeds = _buildOrderSeed();
        var upserted = _upsertById(orders, seeds, 'id');
        set(KEYS.orders, upserted);
      }
    }
    _migrateOrders(get(KEYS.orders));

    // --- Volunteers: upsert seeds by ID, then migrate ---
    var vols = get(KEYS.volunteers);
    if (!vols || !vols.length) {
      set(KEYS.volunteers, _volSeed.map(function (v) { return Object.assign({}, v); }));
    } else {
      // Always upsert to fill missing fields (location, distance, etc.)
      var upsertedVols = _upsertById(vols, _volSeed, 'id');
      set(KEYS.volunteers, upsertedVols);
    }
    _migrateVolunteers(get(KEYS.volunteers));

    // --- Auth: upsert to 20 records, fix subjectId ---
    _migrateAuth();

    // --- Alarms ---
    var alarms = get(KEYS.alarms);
    if (!alarms) {
      function _almTs(hhmm) { var p = hhmm.split(':'); var d = new Date(); d.setHours(+p[0], +p[1], 0, 0); return d.getTime(); }
      set(KEYS.alarms, [
        { id: 'ALM-001', time: '14:32', createdAt: _almTs('14:32'), type: '超时预警', status: '已确认', detail: '订单#' + fmtOrderId(0, '0004') + ' 服务时长超过2小时', location: '汉阳区翠微街' },
        { id: 'ALM-002', time: '11:15', createdAt: _almTs('11:15'), type: '位置偏离', status: '已处理', detail: '暖伴李芳姨偏离服务区域500米', location: '洪山区卓刀泉社区' },
        { id: 'ALM-003', time: '09:40', createdAt: _almTs('09:40'), type: '紧急呼叫', status: '已响应', detail: '暖家孙爷爷触发SOS按钮', location: '汉阳区翠微街5栋' }
      ]);
    }
    _migrateAlarms(get(KEYS.alarms));

    // --- Contracts ---
    if (!get(KEYS.contracts)) {
      set(KEYS.contracts, [
        { id: 'HT-2026-001', client: '武汉光谷科技有限公司', type: '企业工会', amount: 180000, period: '2026.01 - 2026.12', status: '执行中', startDate: '2026-01-01' },
        { id: 'HT-2026-002', client: '中国人寿保险湖北分公司', type: '商业保险', amount: 120000, period: '2026.03 - 2027.02', status: '执行中', startDate: '2026-03-01' },
        { id: 'HT-2026-003', client: '武汉市中南路街道办事处', type: '街道/民政', amount: 96000, period: '2026.06 - 2027.05', status: '待签署', startDate: '2026-06-01' },
        { id: 'HT-2026-004', client: '东风汽车集团工会委员会', type: '企业工会', amount: 240000, period: '2026.07 - 2027.06', status: '待签署', startDate: '2026-07-01' }
      ]);
    }

    // --- Mini-program specific: profile, health, volunteer profile ---
    if (!get(KEYS.profile)) {
      set(KEYS.profile, { userId: 'U001', name: '王奶奶', phone: '13888888888', address: '武汉市武昌区中南路街梅苑小区3栋', emergency: '王小明 13900000000', role: 'nuanjia' });
    }
    if (!get(KEYS.health)) {
      set(KEYS.health, { bloodPressure: '130/85', bloodSugar: '5.6', medications: '降压药 每日1次', allergies: '青霉素', notes: '高血压病史3年', lastUpdate: Date.now() });
    }
    if (!get(KEYS.volunteerProfile)) {
      set(KEYS.volunteerProfile, { name: '张小雨', phone: '13777777777', rating: 4.8, totalService: 23, certified: true, volunteerId: 'V-001', area: '武汉市武昌区', bio: '热心公益，擅长陪伴老人和数字辅导' });
    }

    // --- Sync current user auth status ---
    _syncCurrentUserAuth();

    // --- Reconcile order statuses ---
    reconcileOrderStatuses(Date.now());

    // --- Write schema version ---
    localStorage.setItem('sc_schema_version', String(SCHEMA_VERSION));
    localStorage.removeItem('sc_data_version');
    localStorage.removeItem('sc_admin_version');
  }

  /* ===== Reset demo data ===== */
  function resetAll() {
    Object.keys(KEYS).forEach(function (k) {
      localStorage.removeItem(KEYS[k]);
    });
    localStorage.removeItem('sc_schema_version');
    localStorage.removeItem('sc_data_version');
    localStorage.removeItem('sc_admin_version');
    init();
  }

  /* ===== Distance formatter ===== */
  function fmtDistance(meters) {
    if (!meters && meters !== 0) return '-';
    if (meters < 1000) return meters + 'm';
    return (meters / 1000).toFixed(1) + 'km';
  }

  /* ===== Export ===== */
  window.ScStore = {
    KEYS: KEYS,
    SCHEMA_VERSION: SCHEMA_VERSION,
    MAP_CENTER: MAP_CENTER,
    STATUSES: STATUSES,
    init: init,
    resetAll: resetAll,
    get: get,
    set: set,
    escapeHtml: escapeHtml,
    fmtTime: fmtTime,
    fmtAlarmTime: fmtAlarmTime,
    fmtDate: fmtDate,
    fmtOrderId: fmtOrderId,
    fmtDistance: fmtDistance,
    reconcileOrderStatuses: reconcileOrderStatuses,
    getNearbyVolunteerViewModel: getNearbyVolunteerViewModel,
    orderStatusStyle: orderStatusStyle,
    volunteerStatusStyle: volunteerStatusStyle,
    isVolunteerCertified: isVolunteerCertified,
    _buildOrderSeed: _buildOrderSeed,
    _buildAuthSeed: _buildAuthSeed
  };

  // Compatibility shims so existing inline scripts work without changes
  window.scGet = get;
  window.scSet = set;
  window.getData = get;
  window.saveData = set;
  window.escapeHtml = escapeHtml;
  window.fmtAlarmTime = fmtAlarmTime;
})(window);
