
import fs from 'fs';

const report = JSON.parse(fs.readFileSync('lighthouse-report-v2.json', 'utf8'));

let output = '';
const log = (msg) => { output += msg + '\n'; console.log(msg); };

log('--- LIGHTHOUSE SCORES (V2) ---');
for (const [id, category] of Object.entries(report.categories)) {
    log(`${category.title}: ${Math.round(category.score * 100)}`);
}

log('\n--- ACCESSIBILITY ISSUES ---');
const a11y = report.categories.accessibility;
const a11yAudits = a11y.auditRefs.map(ref => report.audits[ref.id]).filter(a => a.score === 0 || a.score === null && a.displayValue);

if (a11yAudits.length === 0) {
    log('No accessibility issues found! (Perfect Score likely)');
} else {
    a11yAudits.forEach(audit => {
        if (audit.score !== 1) {
            log(`[${audit.id}] ${audit.title}`);
            log(`  Description: ${audit.description}`);
        }
    });
}

log('\n--- PERFORMANCE ISSUES (Top 5) ---');
const perf = report.categories.performance;
const perfAudits = perf.auditRefs.map(ref => report.audits[ref.id]).filter(a => a.score !== 1 && a.score !== null).sort((a, b) => (a.score || 0) - (b.score || 0)).slice(0, 5);

perfAudits.forEach(audit => {
    log(`[${audit.id}] Score: ${audit.score} - ${audit.title}`);
    log(`  Display Value: ${audit.displayValue}`);
});

fs.writeFileSync('audit_summary_v2.txt', output, 'utf8');
