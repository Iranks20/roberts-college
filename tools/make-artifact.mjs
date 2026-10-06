// Turns the single-file demo build into a page body for the hosted test link
// (the host adds its own <html>/<head>/<body> wrapper).
import { readFileSync, writeFileSync } from 'node:fs'
const html = readFileSync('dist-demo/index.html', 'utf8')
const title = html.match(/<title>[\s\S]*?<\/title>/)[0]
const styles = [...html.matchAll(/<style[^>]*>[\s\S]*?<\/style>/g)].map((m) => m[0]).join('\n')
const scripts = [...html.matchAll(/<script[^>]*>[\s\S]*?<\/script>/g)].map((m) => m[0]).join('\n')
writeFileSync('dist-demo/roberts-college.html', `${title}\n${styles}\n<div id="root"></div>\n${scripts}\n`)
console.log('wrote dist-demo/roberts-college.html', (styles.length + scripts.length) / 1024 | 0, 'KB')
