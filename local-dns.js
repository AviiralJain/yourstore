const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
console.log('🌍 [Local Dev] DNS resolver forced to 8.8.8.8 to fix local network issues.');
