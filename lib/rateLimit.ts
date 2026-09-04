import connectToDatabase from '@/lib/db/mongodb';
import { RateLimit } from '@/lib/models/RateLimit';

export async function checkRateLimit(ip: string, action: string, maxAttempts: number, windowMinutes: number) {
  try {
    await connectToDatabase();
    
    let record = await RateLimit.findOne({ ip, action });
    
    const now = new Date();
    
    if (!record) {
      await RateLimit.create({ ip, action, attempts: 1, lastAttempt: now });
      return true;
    }
    
    const windowStart = new Date(now.getTime() - windowMinutes * 60000);
    
    if (record.lastAttempt < windowStart) {
      // Reset attempts if outside the window
      record.attempts = 1;
      record.lastAttempt = now;
      await record.save();
      return true;
    }
    
    if (record.attempts >= maxAttempts) {
      return false; // Rate limited
    }
    
    record.attempts += 1;
    record.lastAttempt = now;
    await record.save();
    
    return true;
  } catch (error) {
    // On DB failure, allow the request
    return true; 
  }
}

export async function clearRateLimit(ip: string, action: string) {
  try {
    await connectToDatabase();
    await RateLimit.deleteOne({ ip, action });
  } catch (error) {
    console.error('Error clearing rate limit:', error);
  }
}
