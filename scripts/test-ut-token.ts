
import "dotenv/config";

async function testToken() {
  const token = process.env.UPLOADTHING_TOKEN;
  if (!token) {
    console.error("UPLOADTHING_TOKEN is not defined in .env");
    return;
  }

  console.log("Token found, checking validity...");
  try {
    const decoded = Buffer.from(token, 'base64').toString();
    console.log("Decoded token snippet:", decoded.substring(0, 50) + "...");
    
    // Test if we can fetch something from UploadThing API (optional)
    // For now, let's just check the structure.
    const tokenObj = JSON.parse(decoded);
    console.log("Token structure looks valid.");
    console.log("App ID:", tokenObj.appId);
    console.log("Region:", tokenObj.regions);
  } catch (e: any) {
    console.error("Invalid token format:", e.message);
  }
}

testToken();
