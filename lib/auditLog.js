import db from '../db';

export function logAction(adminId, action, targetTable, targetId, details = null) {
  try {
    db.prepare(`
      INSERT INTO audit_logs (admin_id, action, target_table, target_id, details)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      adminId || null,
      action,
      targetTable || null,
      targetId || null,
      details ? JSON.stringify(details) : null
    );
  } catch (error) {
    console.error('Failed to write audit log:', error);
  }
}

export default logAction;
