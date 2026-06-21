const fs = require('fs');
const path = require('path');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    const isSection = (text) => {
        const t = text.toUpperCase();
        if (t.includes('---') || t.includes('===')) return true;
        if (t.includes('SECTION')) return true;
        if (t.includes('TAB 1') || t.includes('TAB 2') || t.includes('TAB 3') || t.includes('TAB 4')) return true;
        if (t.match(/^\s*(LOGIN|REGISTER|PAGES|AUTH|CART)\s*$/)) return true;
        if (t.includes('HERO') || t.includes('OUR MENU') || t.includes('BROWSE') || t.includes('SERVICES') || t.includes('DELIVERY') || t.includes('TESTIMONIALS') || t.includes('BLOG') || t.includes('CONTACT') || t.includes('FOOTER')) {
            // Keep section headers like " 2. BROWSE OUR MENU "
            if (t.match(/[0-9]+\./)) return true;
        }
        return false;
    };

    // Remove single line comments (that are not part of URLs)
    // Matches // at start of line or after spaces
    content = content.replace(/^(\s*)\/\/(.*)$/gm, (match, spaces, comment) => {
        if (isSection(comment)) return match;
        return ''; // remove
    });

    // Remove end of line comments like: "code; // comment"
    // Be careful with http:// URLs.
    content = content.replace(/([^'"\n]+)\/\/([^\n]*)/g, (match, code, comment) => {
        if (code.includes('http:') || code.includes('https:')) return match; // it's a URL
        if (isSection(comment)) return match;
        return code.trimRight(); // remove comment
    });

    // Remove JSX comments
    content = content.replace(/\{\/\*([\s\S]*?)\*\/\}/g, (match, comment) => {
        if (isSection(comment)) return match;
        return '';
    });

    fs.writeFileSync(filePath, content, 'utf8');
}

function walk(dir) {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            walk(fullPath);
        } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
            processFile(fullPath);
        }
    });
}

walk('c:/xampp/htdocs/adham/COURSE/Final project/resturant-design/src');
console.log('Comments removed successfully!');
