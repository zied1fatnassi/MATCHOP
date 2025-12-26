
import fs from 'fs';

const report = JSON.parse(fs.readFileSync('lighthouse-report.json', 'utf8'));

let output = '';
const log = (msg) => { output += msg + '\n'; console.log(msg); };

log('--- COLOR CONTRAST FAILURES ---');
const contrastAudit = report.audits['color-contrast'];
if (contrastAudit && contrastAudit.details && contrastAudit.details.items) {
    contrastAudit.details.items.forEach(item => {
        log(`Element: ${item.node.snippet}`);
        log(`  Selector: ${item.node.selector}`);
        log(`  Reason: ${item.explanation || 'Low contrast'}`);
    });
} else {
    log('No details found for color-contrast');
}

log('\n--- LCP ELEMENT ---');
const lcpElement = report.audits['largest-contentful-paint-element'];
if (lcpElement && lcpElement.details && lcpElement.details.items) {
    lcpElement.details.items.forEach(item => {
        log(`Element: ${item.node.snippet}`);
        log(`  Selector: ${item.node.selector}`);
    });
}

log('\n--- RENDER BLOCKING RESOURCES ---');
const blocking = report.audits['render-blocking-resources'];
if (blocking && blocking.details && blocking.details.items) {
    blocking.details.items.forEach(item => {
        log(`URL: ${item.url}`);
        log(`  Wasted Ms: ${item.wastedMs}`);
    });
}

fs.writeFileSync('analysis_output.txt', output, 'utf8');
