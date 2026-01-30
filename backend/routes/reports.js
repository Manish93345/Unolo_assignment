const express = require('express');
const pool = require('../config/database');
const { authenticateToken, requireManager } = require('../middleware/auth');

const router = express.Router();

/*
GET /api/reports/daily-summary
Query:
?date=YYYY-MM-DD (required)
?employee_id=ID (optional)
*/

router.get('/daily-summary', authenticateToken, requireManager, async (req, res) => {
    try {
        const { date, employee_id } = req.query;

        // Validate date
        if (!date) {
            return res.status(400).json({
                success: false,
                message: "Date is required (YYYY-MM-DD)"
            });
        }

        // Validate date format
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return res.status(400).json({
                success: false,
                message: "Invalid date format. Use YYYY-MM-DD"
            });
        }

        // Base employee stats query
        let employeeQuery = `
        SELECT 
            u.id as employee_id,
            u.name as employee_name,
            COUNT(ch.id) as total_checkins,
            COUNT(DISTINCT ch.client_id) as unique_clients,
            SUM(
                CASE 
                    WHEN ch.checkout_time IS NOT NULL 
                    THEN (julianday(ch.checkout_time) - julianday(ch.checkin_time)) * 24
                    ELSE 0
                END
            ) as total_hours
        FROM users u
        LEFT JOIN checkins ch 
            ON u.id = ch.employee_id 
            AND DATE(ch.checkin_time) = ?
        WHERE u.manager_id = ?
        `;

        const params = [date, req.user.id];

        // Optional employee filter
        if (employee_id) {
            employeeQuery += ` AND u.id = ?`;
            params.push(employee_id);
        }

        employeeQuery += ` GROUP BY u.id`;

        const [employeeStats] = await pool.execute(employeeQuery, params);

        // Team summary query
        const [teamStats] = await pool.execute(`
        SELECT 
            COUNT(id) as total_team_checkins,
            COUNT(DISTINCT employee_id) as active_employees
        FROM checkins
        WHERE DATE(checkin_time) = ?
        AND employee_id IN (
            SELECT id FROM users WHERE manager_id = ?
        )
        `, [date, req.user.id]);

        res.json({
            success: true,
            data: {
                date,
                team_summary: teamStats[0],
                employee_summary: employeeStats
            }
        });

    } catch (error) {
        console.error("Daily summary error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch daily summary"
        });
    }
});

module.exports = router;
